// WebSocket Manager for Real-time Features
// Handles all real-time communication in AgroMind platform

class WebSocketManager {
  constructor() {
    this.connections = new Map();
    this.eventListeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.heartbeatInterval = null;
    this.messageQueue = [];
    
    this.channels = {
      IOT_SENSORS: 'iot_sensors',
      WEATHER_ALERTS: 'weather_alerts',
      MARKET_UPDATES: 'market_updates',
      CHAT_MESSAGES: 'chat_messages',
      COMMUNITY_FEED: 'community_feed',
      EXPERT_CONSULTATION: 'expert_consultation',
      FARM_AUTOMATION: 'farm_automation',
      NOTIFICATIONS: 'notifications'
    };
  }

  // =============================================================================
  // CONNECTION MANAGEMENT
  // =============================================================================

  connect(url, options = {}) {
    const connectionId = options.connectionId || 'default';
    
    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log(`WebSocket connected: ${connectionId}`);
        this.reconnectAttempts = 0;
        this.startHeartbeat(connectionId);
        this.flushMessageQueue(connectionId);
        this.emit('connection:open', { connectionId });
      };

      ws.onmessage = (event) => {
        this.handleMessage(connectionId, event);
      };

      ws.onclose = (event) => {
        console.log(`WebSocket closed: ${connectionId}`, event.code);
        this.stopHeartbeat();
        this.emit('connection:close', { connectionId, code: event.code });
        
        if (event.code !== 1000) {
          this.attemptReconnect(url, options);
        }
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error: ${connectionId}`, error);
        this.emit('connection:error', { connectionId, error });
      };

      this.connections.set(connectionId, {
        websocket: ws,
        url,
        options,
        status: 'connecting'
      });

      return connectionId;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      return null;
    }
  }

  disconnect(connectionId = 'default') {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.websocket.close(1000, 'Manual disconnect');
      this.connections.delete(connectionId);
      this.stopHeartbeat();
    }
  }

  disconnectAll() {
    this.connections.forEach((connection, connectionId) => {
      this.disconnect(connectionId);
    });
  }

  attemptReconnect(url, options) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('connection:failed', { url, attempts: this.reconnectAttempts });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(url, options);
    }, delay);
  }

  // =============================================================================
  // MESSAGE HANDLING
  // =============================================================================

  handleMessage(connectionId, event) {
    try {
      const data = JSON.parse(event.data);
      const { type, channel, payload, timestamp } = data;

      // Handle system messages
      if (type === 'pong') {
        return; // Heartbeat response
      }

      // Route message based on channel
      switch (channel) {
        case this.channels.IOT_SENSORS:
          this.handleIoTMessage(payload);
          break;
        case this.channels.WEATHER_ALERTS:
          this.handleWeatherMessage(payload);
          break;
        case this.channels.MARKET_UPDATES:
          this.handleMarketMessage(payload);
          break;
        case this.channels.CHAT_MESSAGES:
          this.handleChatMessage(payload);
          break;
        case this.channels.COMMUNITY_FEED:
          this.handleCommunityMessage(payload);
          break;
        case this.channels.EXPERT_CONSULTATION:
          this.handleExpertMessage(payload);
          break;
        case this.channels.FARM_AUTOMATION:
          this.handleAutomationMessage(payload);
          break;
        case this.channels.NOTIFICATIONS:
          this.handleNotificationMessage(payload);
          break;
        default:
          console.log('Unknown message channel:', channel);
      }

      // Emit general message event
      this.emit('message', { connectionId, type, channel, payload, timestamp });

    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  // =============================================================================
  // CHANNEL-SPECIFIC HANDLERS
  // =============================================================================

  handleIoTMessage(payload) {
    const { deviceId, sensorType, value, unit, timestamp } = payload;
    
    // Process IoT sensor data
    this.emit('iot:sensor_update', {
      deviceId,
      sensorType,
      value,
      unit,
      timestamp: new Date(timestamp)
    });

    // Check for critical alerts
    if (payload.alert) {
      this.emit('iot:alert', payload);
      this.showNotification('IoT Alert', payload.alert.message);
    }
  }

  handleWeatherMessage(payload) {
    const { alertType, severity, location, message, expires } = payload;
    
    this.emit('weather:alert', {
      alertType,
      severity,
      location,
      message,
      expires: new Date(expires)
    });

    // Show high-severity weather alerts
    if (severity === 'high' || severity === 'critical') {
      this.showNotification('Weather Alert', message, {
        icon: '⚠️',
        requireInteraction: true
      });
    }
  }

  handleMarketMessage(payload) {
    const { cropType, location, price, change, trend } = payload;
    
    this.emit('market:price_update', {
      cropType,
      location,
      price,
      change,
      trend,
      timestamp: new Date()
    });

    // Notify about significant price changes
    if (Math.abs(change) > 5) {
      this.showNotification('Market Update', 
        `${cropType} price ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)}%`
      );
    }
  }

  handleChatMessage(payload) {
    const { conversationId, senderId, message, messageType, timestamp } = payload;
    
    this.emit('chat:new_message', {
      conversationId,
      senderId,
      message,
      messageType,
      timestamp: new Date(timestamp)
    });

    // Show message notification if not in active chat
    if (!this.isActiveConversation(conversationId)) {
      this.showNotification('New Message', message.content || 'New message received');
    }
  }

  handleCommunityMessage(payload) {
    const { activityType, userId, postId, data } = payload;
    
    this.emit('community:activity', {
      activityType,
      userId,
      postId,
      data,
      timestamp: new Date()
    });

    // Notify about relevant community activities
    if (activityType === 'mention' || activityType === 'comment_on_post') {
      this.showNotification('Community Activity', data.message);
    }
  }

  handleExpertMessage(payload) {
    const { consultationId, expertId, messageType, data } = payload;
    
    this.emit('expert:message', {
      consultationId,
      expertId,
      messageType,
      data,
      timestamp: new Date()
    });

    // Handle different expert message types
    switch (messageType) {
      case 'consultation_request':
        this.showNotification('Consultation Request', 'New consultation request received');
        break;
      case 'video_call_start':
        this.emit('expert:video_call_start', data);
        break;
      case 'diagnosis_result':
        this.showNotification('Diagnosis Result', 'Expert diagnosis completed');
        break;
    }
  }

  handleAutomationMessage(payload) {
    const { deviceId, action, status, result } = payload;
    
    this.emit('automation:update', {
      deviceId,
      action,
      status,
      result,
      timestamp: new Date()
    });

    // Notify about automation status changes
    if (status === 'error') {
      this.showNotification('Automation Error', `Error in ${deviceId}: ${result.message}`);
    }
  }

  handleNotificationMessage(payload) {
    const { title, message, type, priority, actions } = payload;
    
    this.emit('notification:received', payload);
    
    // Show system notification
    this.showNotification(title, message, {
      icon: this.getNotificationIcon(type),
      requireInteraction: priority === 'high',
      actions: actions || []
    });
  }

  // =============================================================================
  // MESSAGE SENDING
  // =============================================================================

  send(message, connectionId = 'default') {
    const connection = this.connections.get(connectionId);
    
    if (connection && connection.websocket.readyState === WebSocket.OPEN) {
      const messageData = {
        ...message,
        timestamp: new Date().toISOString(),
        id: this.generateMessageId()
      };
      
      connection.websocket.send(JSON.stringify(messageData));
      return messageData.id;
    } else {
      // Queue message for later sending
      this.messageQueue.push({ message, connectionId });
      console.warn('WebSocket not connected. Message queued.');
      return null;
    }
  }

  sendToChannel(channel, payload, connectionId = 'default') {
    return this.send({
      type: 'channel_message',
      channel,
      payload
    }, connectionId);
  }

  // =============================================================================
  // CHANNEL SUBSCRIPTIONS
  // =============================================================================

  subscribe(channel, connectionId = 'default') {
    return this.send({
      type: 'subscribe',
      channel
    }, connectionId);
  }

  unsubscribe(channel, connectionId = 'default') {
    return this.send({
      type: 'unsubscribe',
      channel
    }, connectionId);
  }

  // Subscribe to farmer-specific channels
  subscribeToFarmerChannels(farmerId, connectionId = 'default') {
    const channels = [
      `${this.channels.IOT_SENSORS}_${farmerId}`,
      `${this.channels.WEATHER_ALERTS}_${farmerId}`,
      `${this.channels.MARKET_UPDATES}_${farmerId}`,
      `${this.channels.NOTIFICATIONS}_${farmerId}`
    ];

    channels.forEach(channel => {
      this.subscribe(channel, connectionId);
    });
  }

  // =============================================================================
  // REAL-TIME FEATURES
  // =============================================================================

  // IoT Sensor Streaming
  startSensorStream(deviceId, connectionId = 'default') {
    return this.send({
      type: 'start_sensor_stream',
      deviceId
    }, connectionId);
  }

  stopSensorStream(deviceId, connectionId = 'default') {
    return this.send({
      type: 'stop_sensor_stream',
      deviceId
    }, connectionId);
  }

  // Live Chat Features
  sendChatMessage(conversationId, message, connectionId = 'default') {
    return this.sendToChannel(this.channels.CHAT_MESSAGES, {
      conversationId,
      message,
      action: 'send_message'
    }, connectionId);
  }

  sendTypingIndicator(conversationId, isTyping, connectionId = 'default') {
    return this.sendToChannel(this.channels.CHAT_MESSAGES, {
      conversationId,
      isTyping,
      action: 'typing_indicator'
    }, connectionId);
  }

  // Farm Automation
  executeAutomationCommand(deviceId, command, parameters = {}, connectionId = 'default') {
    return this.sendToChannel(this.channels.FARM_AUTOMATION, {
      deviceId,
      command,
      parameters,
      action: 'execute_command'
    }, connectionId);
  }

  // Expert Consultation
  initiateVideoCall(consultationId, connectionId = 'default') {
    return this.sendToChannel(this.channels.EXPERT_CONSULTATION, {
      consultationId,
      action: 'initiate_video_call'
    }, connectionId);
  }

  // =============================================================================
  // HEARTBEAT & CONNECTION HEALTH
  // =============================================================================

  startHeartbeat(connectionId = 'default') {
    this.stopHeartbeat(); // Clear any existing heartbeat
    
    this.heartbeatInterval = setInterval(() => {
      this.send({
        type: 'ping',
        timestamp: new Date().toISOString()
      }, connectionId);
    }, 30000); // Send ping every 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  flushMessageQueue(connectionId) {
    const queuedMessages = this.messageQueue.filter(item => item.connectionId === connectionId);
    
    queuedMessages.forEach(item => {
      this.send(item.message, connectionId);
    });
    
    this.messageQueue = this.messageQueue.filter(item => item.connectionId !== connectionId);
  }

  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getConnectionStatus(connectionId = 'default') {
    const connection = this.connections.get(connectionId);
    if (!connection) return 'disconnected';
    
    switch (connection.websocket.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }

  isActiveConversation(conversationId) {
    // This would be implemented based on your app's state management
    // For now, return false to show all notifications
    return false;
  }

  getNotificationIcon(type) {
    const icons = {
      weather: '🌤️',
      market: '📈',
      iot: '📡',
      chat: '💬',
      expert: '👨‍🌾',
      automation: '🤖',
      community: '👥'
    };
    return icons[type] || '🔔';
  }

  // =============================================================================
  // NOTIFICATIONS
  // =============================================================================

  async showNotification(title, message, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notification = new Notification(title, {
          body: message,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          tag: 'agromind-notification',
          renotify: true,
          ...options
        });

        notification.onclick = (event) => {
          event.preventDefault();
          window.focus();
          notification.close();
          
          // Handle notification click based on type
          this.emit('notification:click', { title, message, options });
        };

        // Auto-close after 5 seconds unless requireInteraction is true
        if (!options.requireInteraction) {
          setTimeout(() => notification.close(), 5000);
        }

      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  }

  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // =============================================================================
  // EVENT SYSTEM
  // =============================================================================

  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }
}

// Singleton instance
const webSocketManager = new WebSocketManager();

export default webSocketManager;
