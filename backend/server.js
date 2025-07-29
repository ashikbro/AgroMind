const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Redis = require('ioredis');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

// Import services
const GraphQLServer = require('./graphql/server');
const iotService = require('./services/iotService');
const marketService = require('./services/marketService-mock');
const aiService = require('./services/aiService-complete');
const analyticsService = require('./services/analyticsService-mock');

// Import routes
const authRoutes = require('./routes/auth');
const cropRoutes = require('./routes/crops');
const diseaseRoutes = require('./routes/diseases');
const aiRoutes = require('./routes/ai');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');

class AgroMindServer {
  constructor() {
    this.app = express();
    this.graphqlServer = new GraphQLServer();
    this.redis = null;
    
    this.setupDatabase();
    this.setupRedis();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupServices();
  }

  // Setup MongoDB connection
  async setupDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agromind', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferMaxEntries: 0 // Disable mongoose buffering
      });
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  // Setup Redis connection
  setupRedis() {
    if (process.env.REDIS_URL) {
      try {
        this.redis = new Redis(process.env.REDIS_URL, {
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
          lazyConnect: true
        });
        
        this.redis.on('connect', () => {
          console.log('✅ Connected to Redis');
        });
        
        this.redis.on('error', (error) => {
          console.warn('⚠️  Redis connection error:', error.message);
        });
      } catch (error) {
        console.warn('⚠️  Redis setup failed:', error.message);
      }
    }
  }

  // Setup Express middleware
  setupMiddleware() {
    // Basic middleware
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    
    // Static file serving
    this.app.use('/uploads', express.static('uploads'));
    this.app.use('/public', express.static('public'));
    
    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });

    // API documentation
    this.app.get('/api/docs', (req, res) => {
      res.json({
        name: 'AgroMind API',
        version: '2.0.0',
        description: 'Advanced Agricultural Intelligence Platform',
        endpoints: {
          graphql: '/graphql',
          subscriptions: '/subscriptions',
          rest: {
            auth: '/api/auth',
            crops: '/api/crops',
            diseases: '/api/diseases',
            ai: '/api/ai',
            users: '/api/users',
            analytics: '/api/analytics'
          },
          health: '/health',
          metrics: '/metrics'
        },
        features: [
          'GraphQL API with real-time subscriptions',
          'Advanced AI disease detection',
          'Yield prediction algorithms',
          'Market price analysis',
          'IoT sensor integration',
          'Farm analytics dashboard',
          'Expert consultation platform'
        ]
      });
    });
  }

  // Setup API routes
  setupRoutes() {
    // REST API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/crops', cropRoutes);
    this.app.use('/api/diseases', diseaseRoutes);
    this.app.use('/api/ai', aiRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/analytics', analyticsRoutes);

    // WebSocket proxy for IoT service
    if (process.env.IOT_WEBSOCKET_PORT) {
      this.app.use('/ws', createProxyMiddleware({
        target: `ws://localhost:${process.env.IOT_WEBSOCKET_PORT}`,
        ws: true,
        changeOrigin: true
      }));
    }

    // File upload endpoint
    const upload = multer({
      dest: 'uploads/',
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed'));
        }
      }
    });

    this.app.post('/api/upload', upload.single('file'), (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      res.json({
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: `/uploads/${req.file.filename}`
      });
    });

    // Error handling
    this.app.use((error, req, res, next) => {
      console.error('API Error:', error);
      
      if (error instanceof multer.MulterError) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message 
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Endpoint not found' });
    });
  }

  // Setup background services
  setupServices() {
    console.log('🔧 Initializing services...');
    
    // Services are auto-initialized when imported
    console.log('✅ IoT Service initialized');
    console.log('✅ Market Service initialized');
    console.log('✅ AI Service initialized');
    console.log('✅ Analytics Service initialized');
  }

  // Start the server
  async start(port = process.env.PORT || 5000) {
    try {
      // Start GraphQL server
      await this.graphqlServer.start(port);
      
      console.log('\n🌟 AgroMind Server Started Successfully!');
      console.log('📱 Features Available:');
      console.log('   • GraphQL API with Subscriptions');
      console.log('   • AI Disease Detection');
      console.log('   • Yield Prediction');
      console.log('   • Market Analysis');
      console.log('   • IoT Sensor Integration');
      console.log('   • Real-time Analytics');
      console.log('   • Expert Consultation');
      console.log('   • Farm Management');
      
      return this.graphqlServer.httpServer;
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      throw error;
    }
  }

  // Stop the server
  async stop() {
    try {
      if (this.graphqlServer) {
        await this.graphqlServer.stop();
      }
      
      if (this.redis) {
        await this.redis.disconnect();
      }
      
      await mongoose.disconnect();
      
      console.log('✅ Server stopped gracefully');
    } catch (error) {
      console.error('❌ Error stopping server:', error);
      throw error;
    }
  }

  // Get server statistics
  getStats() {
    return {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      graphql: this.graphqlServer.getStats(),
      database: {
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        redis: this.redis ? (this.redis.status === 'ready' ? 'connected' : 'disconnected') : 'not configured'
      },
      timestamp: new Date().toISOString()
    };
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new AgroMindServer();
  server.start().catch(error => {
    console.error('Failed to start AgroMind server:', error);
    process.exit(1);
  });
}

module.exports = AgroMindServer;
