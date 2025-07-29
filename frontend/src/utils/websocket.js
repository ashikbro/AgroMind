/**
 * Real-time WebSocket Manager for Farm Data
 * Handles live sensor data, market prices, and system alerts
 */

class WebSocketManager {
  constructor() {
    this.connections = new Map();
    this.reconnectAttempts = new Map();
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.messageQueue = new Map();
    this.subscribers = new Map();
  }

  // Create WebSocket connection
  connect(endpoint, options = {}) {
    const {
      protocols = [],
      reconnect = true,
      heartbeat = true,
      heartbeatInterval = 30000
    } = options;

    if (this.connections.has(endpoint)) {
      console.warn(`WebSocket connection to ${endpoint} already exists`);
      return this.connections.get(endpoint);
    }

    const ws = new WebSocket(endpoint, protocols);
    const connectionData = {
      socket: ws,
      endpoint,
      reconnect,
      heartbeat,
      heartbeatInterval,
      heartbeatTimer: null,
      lastHeartbeat: Date.now(),
      status: 'connecting'
    };

    this.connections.set(endpoint, connectionData);
    this.reconnectAttempts.set(endpoint, 0);
    this.messageQueue.set(endpoint, []);

    this.setupEventHandlers(connectionData);

    if (heartbeat) {
      this.startHeartbeat(endpoint);
    }

    return ws;
  }

  // Setup WebSocket event handlers
  setupEventHandlers(connectionData) {
    const { socket, endpoint, reconnect } = connectionData;

    socket.onopen = (event) => {
      console.log(`WebSocket connected to ${endpoint}`);
      connectionData.status = 'connected';
      this.reconnectAttempts.set(endpoint, 0);
      
      // Send queued messages
      const queue = this.messageQueue.get(endpoint) || [];
      queue.forEach(message => {
        socket.send(JSON.stringify(message));
      });
      this.messageQueue.set(endpoint, []);

      this.notifySubscribers(endpoint, 'open', event);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        connectionData.lastHeartbeat = Date.now();
        this.handleMessage(endpoint, data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = (event) => {
      console.log(`WebSocket closed for ${endpoint}:`, event.code, event.reason);
      connectionData.status = 'closed';
      
      if (connectionData.heartbeatTimer) {
        clearInterval(connectionData.heartbeatTimer);
      }

      if (reconnect && !event.wasClean) {
        this.scheduleReconnect(endpoint);
      }

      this.notifySubscribers(endpoint, 'close', event);
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error for ${endpoint}:`, error);
      connectionData.status = 'error';
      this.notifySubscribers(endpoint, 'error', error);
    };
  }

  // Handle incoming messages
  handleMessage(endpoint, data) {
    const { type, payload, timestamp } = data;

    switch (type) {
      case 'sensor_data':
        this.handleSensorData(payload);
        break;
      case 'market_update':
        this.handleMarketUpdate(payload);
        break;
      case 'system_alert':
        this.handleSystemAlert(payload);
        break;
      case 'automation_status':
        this.handleAutomationStatus(payload);
        break;
      case 'pong':
        // Heartbeat response
        break;
      default:
        console.log('Unknown message type:', type);
    }

    this.notifySubscribers(endpoint, 'message', data);
  }

  // Handle sensor data updates
  handleSensorData(data) {
    const { farmId, sensors } = data;
    
    // Store in local cache
    const cacheKey = `sensor_data_${farmId}`;
    const existingData = JSON.parse(localStorage.getItem(cacheKey) || '[]');
    existingData.push({
      ...sensors,
      timestamp: Date.now()
    });
    
    // Keep only last 100 readings
    if (existingData.length > 100) {
      existingData.splice(0, existingData.length - 100);
    }
    
    localStorage.setItem(cacheKey, JSON.stringify(existingData));

    // Trigger custom event
    window.dispatchEvent(new CustomEvent('sensorDataUpdate', {
      detail: { farmId, sensors }
    }));
  }

  // Handle market price updates
  handleMarketUpdate(data) {
    const { crop, price, change, exchange } = data;
    
    // Store in local cache
    const cacheKey = `market_data_${crop}`;
    const marketData = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    marketData[exchange] = {
      price,
      change,
      timestamp: Date.now()
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(marketData));

    // Trigger custom event
    window.dispatchEvent(new CustomEvent('marketPriceUpdate', {
      detail: { crop, price, change, exchange }
    }));
  }

  // Handle system alerts
  handleSystemAlert(data) {
    const { alertId, type, message, severity, farmId } = data;
    
    // Store alert
    const cacheKey = `alerts_${farmId}`;
    const alerts = JSON.parse(localStorage.getItem(cacheKey) || '[]');
    alerts.unshift({
      alertId,
      type,
      message,
      severity,
      timestamp: Date.now(),
      read: false
    });
    
    // Keep only last 50 alerts
    if (alerts.length > 50) {
      alerts.splice(50);
    }
    
    localStorage.setItem(cacheKey, JSON.stringify(alerts));

    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Farm Alert: ${type}`, {
        body: message,
        icon: '/favicon.ico',
        tag: alertId
      });
    }

    // Trigger custom event
    window.dispatchEvent(new CustomEvent('systemAlert', {
      detail: data
    }));
  }

  // Handle automation status updates
  handleAutomationStatus(data) {
    const { farmId, system, status, action } = data;
    
    // Store automation status
    const cacheKey = `automation_${farmId}`;
    const automationData = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    automationData[system] = {
      status,
      action,
      timestamp: Date.now()
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(automationData));

    // Trigger custom event
    window.dispatchEvent(new CustomEvent('automationStatusUpdate', {
      detail: data
    }));
  }

  // Send message through WebSocket
  send(endpoint, message) {
    const connectionData = this.connections.get(endpoint);
    
    if (!connectionData) {
      console.error(`No WebSocket connection found for ${endpoint}`);
      return false;
    }

    const { socket } = connectionData;
    
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      return true;
    } else {
      // Queue message for later
      const queue = this.messageQueue.get(endpoint) || [];
      queue.push(message);
      this.messageQueue.set(endpoint, queue);
      return false;
    }
  }

  // Subscribe to WebSocket events
  subscribe(endpoint, eventType, callback) {
    const key = `${endpoint}:${eventType}`;
    
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    
    this.subscribers.get(key).add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(key);
      if (subscribers) {
        subscribers.delete(callback);
      }
    };
  }

  // Notify subscribers of events
  notifySubscribers(endpoint, eventType, data) {
    const key = `${endpoint}:${eventType}`;
    const subscribers = this.subscribers.get(key);
    
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket subscriber callback:', error);
        }
      });
    }
  }

  // Start heartbeat
  startHeartbeat(endpoint) {
    const connectionData = this.connections.get(endpoint);
    if (!connectionData) return;

    connectionData.heartbeatTimer = setInterval(() => {
      if (connectionData.socket.readyState === WebSocket.OPEN) {
        this.send(endpoint, { type: 'ping', timestamp: Date.now() });
      }
    }, connectionData.heartbeatInterval);
  }

  // Schedule reconnection
  scheduleReconnect(endpoint) {
    const attempts = this.reconnectAttempts.get(endpoint) || 0;
    
    if (attempts >= this.maxReconnectAttempts) {
      console.error(`Max reconnection attempts reached for ${endpoint}`);
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, attempts); // Exponential backoff
    console.log(`Scheduling reconnection to ${endpoint} in ${delay}ms (attempt ${attempts + 1})`);
    
    setTimeout(() => {
      console.log(`Attempting to reconnect to ${endpoint}`);
      this.reconnectAttempts.set(endpoint, attempts + 1);
      
      const connectionData = this.connections.get(endpoint);
      if (connectionData) {
        this.connections.delete(endpoint);
        this.connect(endpoint, {
          reconnect: connectionData.reconnect,
          heartbeat: connectionData.heartbeat,
          heartbeatInterval: connectionData.heartbeatInterval
        });
      }
    }, delay);
  }

  // Disconnect WebSocket
  disconnect(endpoint) {
    const connectionData = this.connections.get(endpoint);
    
    if (connectionData) {
      if (connectionData.heartbeatTimer) {
        clearInterval(connectionData.heartbeatTimer);
      }
      
      connectionData.socket.close(1000, 'Client disconnect');
      this.connections.delete(endpoint);
      this.messageQueue.delete(endpoint);
      this.reconnectAttempts.delete(endpoint);
    }
  }

  // Get connection status
  getConnectionStatus(endpoint) {
    const connectionData = this.connections.get(endpoint);
    return connectionData ? connectionData.status : 'disconnected';
  }

  // Disconnect all connections
  disconnectAll() {
    this.connections.forEach((_, endpoint) => {
      this.disconnect(endpoint);
    });
  }
}

// Singleton instance
const wsManager = new WebSocketManager();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  wsManager.disconnectAll();
});

export default wsManager;
