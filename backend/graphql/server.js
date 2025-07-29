const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const jwt = require('jsonwebtoken');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const pubsub = require('../pubsub');

class GraphQLServer {
  constructor() {
    this.app = express();
    this.server = null;
    this.httpServer = null;
    this.subscriptionServer = null;
    
    this.setupMiddleware();
    this.setupApolloServer();
  }

  // Setup Express middleware
  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "ws:", "wss:"]
        }
      }
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight']
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // Limit each IP to 1000 requests per windowMs
      message: 'Too many requests from this IP',
      standardHeaders: true,
      legacyHeaders: false
    });
    this.app.use('/graphql', limiter);

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0'
      });
    });

    // Metrics endpoint
    this.app.get('/metrics', (req, res) => {
      res.json({
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      });
    });
  }

  // Setup Apollo Server
  async setupApolloServer() {
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    });

    this.server = new ApolloServer({
      schema,
      context: async ({ req, connection }) => {
        // Handle WebSocket connections (subscriptions)
        if (connection) {
          return {
            ...connection.context,
            pubsub
          };
        }

        // Handle HTTP requests
        const token = req.headers.authorization?.replace('Bearer ', '');
        let user = null;

        if (token) {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            user = await this.getUserById(decoded.userId);
          } catch (error) {
            console.warn('Invalid token:', error.message);
          }
        }

        return {
          user,
          req,
          pubsub
        };
      },
      
      // Error formatting
      formatError: (error) => {
        console.error('GraphQL Error:', error);
        
        // Don't expose internal errors in production
        if (process.env.NODE_ENV === 'production') {
          return new Error('Internal server error');
        }
        
        return error;
      },

      // Response formatting
      formatResponse: (response, { request, context }) => {
        // Add request timing
        if (context.startTime) {
          response.extensions = {
            ...response.extensions,
            timing: Date.now() - context.startTime
          };
        }
        
        return response;
      },

      // Plugin configuration
      plugins: [
        {
          requestDidStart() {
            return {
              didResolveOperation(requestContext) {
                requestContext.context.startTime = Date.now();
              },
              didEncounterErrors(requestContext) {
                console.error('GraphQL errors:', requestContext.errors);
              }
            };
          }
        }
      ],

      // Subscription configuration
      subscriptions: {
        path: '/subscriptions',
        onConnect: async (connectionParams, webSocket, context) => {
          console.log('WebSocket connected');
          
          // Authenticate subscription connection
          const token = connectionParams.authToken || connectionParams.Authorization;
          let user = null;

          if (token) {
            try {
              const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'fallback_secret');
              user = await this.getUserById(decoded.userId);
            } catch (error) {
              console.warn('Subscription auth failed:', error.message);
              throw new Error('Authentication failed');
            }
          }

          return {
            user,
            pubsub
          };
        },
        onDisconnect: (webSocket, context) => {
          console.log('WebSocket disconnected');
        }
      },

      // Enable GraphQL Playground in development
      introspection: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production' ? {
        settings: {
          'request.credentials': 'include'
        },
        subscriptionEndpoint: '/subscriptions'
      } : false
    });
  }

  // Start the server
  async start(port = process.env.PORT || 4000) {
    try {
      // Create HTTP server
      this.httpServer = createServer(this.app);

      // Apply Apollo GraphQL middleware
      await this.server.start();
      this.server.applyMiddleware({ 
        app: this.app, 
        path: '/graphql',
        cors: false // We handle CORS above
      });

      // Setup subscription server
      this.subscriptionServer = SubscriptionServer.create(
        {
          schema: makeExecutableSchema({ typeDefs, resolvers }),
          execute,
          subscribe,
          onConnect: async (connectionParams, webSocket) => {
            console.log('Subscription client connected');
            
            const token = connectionParams.authToken || connectionParams.Authorization;
            let user = null;

            if (token) {
              try {
                const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'fallback_secret');
                user = await this.getUserById(decoded.userId);
              } catch (error) {
                console.warn('Subscription auth failed:', error.message);
                throw new Error('Authentication failed');
              }
            }

            return { user, pubsub };
          },
          onDisconnect: () => {
            console.log('Subscription client disconnected');
          }
        },
        {
          server: this.httpServer,
          path: '/subscriptions'
        }
      );

      // Start HTTP server
      this.httpServer.listen(port, () => {
        console.log(`🚀 Server ready at http://localhost:${port}${this.server.graphqlPath}`);
        console.log(`🔗 Subscriptions ready at ws://localhost:${port}/subscriptions`);
        console.log(`📊 Health check at http://localhost:${port}/health`);
        console.log(`📈 Metrics at http://localhost:${port}/metrics`);
      });

      // Graceful shutdown
      this.setupGracefulShutdown();

      return this.httpServer;
    } catch (error) {
      console.error('Failed to start server:', error);
      throw error;
    }
  }

  // Stop the server
  async stop() {
    try {
      if (this.subscriptionServer) {
        this.subscriptionServer.close();
      }
      
      if (this.server) {
        await this.server.stop();
      }
      
      if (this.httpServer) {
        this.httpServer.close();
      }
      
      console.log('Server stopped gracefully');
    } catch (error) {
      console.error('Error stopping server:', error);
      throw error;
    }
  }

  // Setup graceful shutdown
  setupGracefulShutdown() {
    const gracefulShutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
      
      try {
        await this.stop();
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // nodemon restart

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });
  }

  // Mock user lookup (replace with actual database query)
  async getUserById(userId) {
    // Mock user data - replace with actual database lookup
    const mockUsers = {
      'user_1': {
        id: 'user_1',
        name: 'John Farmer',
        email: 'john@example.com',
        role: 'FARMER'
      },
      'user_2': {
        id: 'user_2',
        name: 'Expert Smith',
        email: 'expert@example.com',
        role: 'EXPERT'
      }
    };

    return mockUsers[userId] || null;
  }

  // WebSocket connection management
  getActiveConnections() {
    return this.subscriptionServer ? 
      this.subscriptionServer.wsServer.clients.size : 0;
  }

  // Send message to specific user
  sendToUser(userId, message) {
    if (!this.subscriptionServer) return;

    this.subscriptionServer.wsServer.clients.forEach(client => {
      if (client.context && client.context.user && client.context.user.id === userId) {
        client.send(JSON.stringify(message));
      }
    });
  }

  // Broadcast message to all connected clients
  broadcast(message) {
    if (!this.subscriptionServer) return;

    this.subscriptionServer.wsServer.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  // Get server statistics
  getStats() {
    return {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      activeConnections: this.getActiveConnections(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = GraphQLServer;
