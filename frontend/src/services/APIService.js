// API Integration Service for AgroMind Platform
// Comprehensive backend connectivity with real-time features

class APIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    this.wsURL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
    this.token = localStorage.getItem('authToken');
    this.websocket = null;
    this.eventListeners = new Map();
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    
    // Initialize WebSocket connection
    this.initializeWebSocket();
    
    // Initialize push notifications
    this.initializePushNotifications();
  }

  // =============================================================================
  // AUTHENTICATION & USER MANAGEMENT
  // =============================================================================

  async login(credentials) {
    try {
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      if (response.token) {
        this.token = response.token;
        localStorage.setItem('authToken', this.token);
        this.initializeWebSocket(); // Reconnect with auth
      }
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData) {
    try {
      return await this.makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      await this.makeRequest('/auth/logout', { method: 'POST' });
      this.token = null;
      localStorage.removeItem('authToken');
      this.closeWebSocket();
      return { success: true };
    } catch (error) {
      // Even if logout fails, clean up locally
      this.token = null;
      localStorage.removeItem('authToken');
      this.closeWebSocket();
      return { success: true };
    }
  }

  async refreshToken() {
    try {
      const response = await this.makeRequest('/auth/refresh', {
        method: 'POST'
      });
      
      if (response.token) {
        this.token = response.token;
        localStorage.setItem('authToken', this.token);
      }
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // =============================================================================
  // CROP MANAGEMENT
  // =============================================================================

  async getCrops(farmerId) {
    try {
      return await this.makeRequest(`/crops?farmerId=${farmerId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addCrop(cropData) {
    try {
      return await this.makeRequest('/crops', {
        method: 'POST',
        body: JSON.stringify(cropData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCrop(cropId, cropData) {
    try {
      return await this.makeRequest(`/crops/${cropId}`, {
        method: 'PUT',
        body: JSON.stringify(cropData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCrop(cropId) {
    try {
      return await this.makeRequest(`/crops/${cropId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // =============================================================================
  // DISEASE DETECTION & DIAGNOSIS
  // =============================================================================

  async analyzeCropImage(imageFile, metadata = {}) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('metadata', JSON.stringify(metadata));

      return await this.makeRequest('/diagnosis/analyze', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type for FormData
          'Authorization': `Bearer ${this.token}`
        }
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDiagnosisHistory(farmerId) {
    try {
      return await this.makeRequest(`/diagnosis/history?farmerId=${farmerId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async saveDiagnosisResult(diagnosisData) {
    try {
      return await this.makeRequest('/diagnosis/save', {
        method: 'POST',
        body: JSON.stringify(diagnosisData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // =============================================================================
  // WEATHER & ENVIRONMENTAL DATA
  // =============================================================================

  async getWeatherData(location) {
    try {
      return await this.makeRequest(`/weather?location=${encodeURIComponent(location)}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getWeatherForecast(location, days = 7) {
    try {
      return await this.makeRequest(`/weather/forecast?location=${encodeURIComponent(location)}&days=${days}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getWeatherAlerts(farmerId) {
    try {
      return await this.makeRequest(`/weather/alerts?farmerId=${farmerId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // =============================================================================
  // IOT & SENSOR DATA
  // =============================================================================

  async getIoTDevices(farmerId) {
    try {
      return await this.makeRequest(`/iot/devices?farmerId=${farmerId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSensorData(deviceId, timeRange = '24h') {
    try {
      return await this.makeRequest(`/iot/sensors/${deviceId}/data?range=${timeRange}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addIoTDevice(deviceData) {
    try {
      return await this.makeRequest('/iot/devices', {
        method: 'POST',
        body: JSON.stringify(deviceData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateDeviceSettings(deviceId, settings) {
    try {
      return await this.makeRequest(`/iot/devices/${deviceId}/settings`, {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // =============================================================================
  // MARKET ANALYTICS & PRICING
  // =============================================================================

  async getMarketPrices(cropType, location) {
    try {
      return await this.makeRequest(`/market/prices?crop=${cropType}&location=${encodeURIComponent(location)}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMarketTrends(cropType, period = '30d') {
    try {
      return await this.makeRequest(`/market/trends?crop=${cropType}&period=${period}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPriceAlerts(farmerId) {
    try {
      return await this.makeRequest(`/market/alerts?farmerId=${farmerId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createPriceAlert(alertData) {
    try {
      return await this.makeRequest('/market/alerts', {
        method: 'POST',
        body: JSON.stringify(alertData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // =============================================================================
  // FARM ANALYTICS & BUSINESS INTELLIGENCE
  // =============================================================================

  async getFarmAnalytics(farmerId, timeRange = '1y') {
    try {
      return await this.makeRequest(`/analytics/farm/${farmerId}?range=${timeRange}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getFinancialMetrics(farmerId, year) {
    try {
      return await this.makeRequest(`/analytics/financial/${farmerId}?year=${year}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getYieldPredictions(farmerId, cropType) {
    try {
      return await this.makeRequest(`/analytics/predictions/yield?farmerId=${farmerId}&crop=${cropType}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getROIAnalysis(farmerId, period = '1y') {
    try {
      return await this.makeRequest(`/analytics/roi/${farmerId}?period=${period}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // =============================================================================
  // SOCIAL FEATURES & COMMUNITY
  // =============================================================================

  // Community Posts
  async getCommunityPosts(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      return await this.makeRequest(`/community/posts?${queryParams}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createPost(postData) {
    try {
      return await this.makeRequest('/community/posts', {
        method: 'POST',
        body: JSON.stringify(postData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async likePost(postId) {
    try {
      return await this.makeRequest(`/community/posts/${postId}/like`, {
        method: 'POST'
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async commentOnPost(postId, commentData) {
    try {
      return await this.makeRequest(`/community/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify(commentData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Marketplace
  async getMarketplaceProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      return await this.makeRequest(`/marketplace/products?${queryParams}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addProduct(productData) {
    try {
      return await this.makeRequest('/marketplace/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProduct(productId, productData) {
    try {
      return await this.makeRequest(`/marketplace/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProduct(productId) {
    try {
      return await this.makeRequest(`/marketplace/products/${productId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Groups & Forums
  async getGroups(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      return await this.makeRequest(`/community/groups?${queryParams}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createGroup(groupData) {
    try {
      return await this.makeRequest('/community/groups', {
        method: 'POST',
        body: JSON.stringify(groupData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async joinGroup(groupId) {
    try {
      return await this.makeRequest(`/community/groups/${groupId}/join`, {
        method: 'POST'
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async leaveGroup(groupId) {
    try {
      return await this.makeRequest(`/community/groups/${groupId}/leave`, {
        method: 'POST'
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getGroupDiscussions(groupId) {
    try {
      return await this.makeRequest(`/community/groups/${groupId}/discussions`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createDiscussion(groupId, discussionData) {
    try {
      return await this.makeRequest(`/community/groups/${groupId}/discussions`, {
        method: 'POST',
        body: JSON.stringify(discussionData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Messaging & Chat
  async getConversations() {
    try {
      return await this.makeRequest('/messaging/conversations');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMessages(conversationId, page = 1, limit = 50) {
    try {
      return await this.makeRequest(`/messaging/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async sendMessage(conversationId, messageData) {
    try {
      return await this.makeRequest(`/messaging/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify(messageData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createConversation(participantIds) {
    try {
      return await this.makeRequest('/messaging/conversations', {
        method: 'POST',
        body: JSON.stringify({ participants: participantIds })
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // =============================================================================
  // EXPERT CONSULTATION
  // =============================================================================

  async getExperts(specialty, location) {
    try {
      return await this.makeRequest(`/experts?specialty=${specialty}&location=${encodeURIComponent(location)}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bookConsultation(expertId, consultationData) {
    try {
      return await this.makeRequest(`/experts/${expertId}/book`, {
        method: 'POST',
        body: JSON.stringify(consultationData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getConsultationHistory(farmerId) {
    try {
      return await this.makeRequest(`/consultations/history?farmerId=${farmerId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async initiateVideoCall(consultationId) {
    try {
      return await this.makeRequest(`/consultations/${consultationId}/video-call`, {
        method: 'POST'
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // =============================================================================
  // WEBSOCKET REAL-TIME FEATURES
  // =============================================================================

  initializeWebSocket() {
    if (this.websocket) {
      this.websocket.close();
    }

    try {
      const wsUrl = this.token 
        ? `${this.wsURL}?token=${this.token}`
        : this.wsURL;
        
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        console.log('WebSocket connected');
        this.emit('websocket:connected');
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.websocket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code);
        this.emit('websocket:disconnected');
        
        // Attempt to reconnect after a delay
        if (event.code !== 1000) { // Not a normal closure
          setTimeout(() => this.initializeWebSocket(), 5000);
        }
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('websocket:error', error);
      };

    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }

  closeWebSocket() {
    if (this.websocket) {
      this.websocket.close(1000, 'User logout');
      this.websocket = null;
    }
  }

  handleWebSocketMessage(data) {
    const { type, payload } = data;

    switch (type) {
      case 'sensor_data_update':
        this.emit('iot:sensor_update', payload);
        break;
      case 'weather_alert':
        this.emit('weather:alert', payload);
        break;
      case 'market_price_update':
        this.emit('market:price_update', payload);
        break;
      case 'new_message':
        this.emit('messaging:new_message', payload);
        break;
      case 'user_online':
        this.emit('user:online', payload);
        break;
      case 'user_offline':
        this.emit('user:offline', payload);
        break;
      case 'typing_indicator':
        this.emit('messaging:typing', payload);
        break;
      case 'consultation_request':
        this.emit('expert:consultation_request', payload);
        break;
      case 'community_activity':
        this.emit('community:activity', payload);
        break;
      default:
        console.log('Unknown WebSocket message type:', type);
    }
  }

  sendWebSocketMessage(type, payload) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket not connected. Message not sent:', { type, payload });
    }
  }

  // =============================================================================
  // PUSH NOTIFICATIONS
  // =============================================================================

  async initializePushNotifications() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);

        const subscription = await this.subscribeToPushNotifications(registration);
        if (subscription) {
          await this.savePushSubscription(subscription);
        }
      } catch (error) {
        console.error('Failed to initialize push notifications:', error);
      }
    }
  }

  async subscribeToPushNotifications(registration) {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Push notification permission denied');
        return null;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.REACT_APP_VAPID_PUBLIC_KEY || 'YOUR_VAPID_PUBLIC_KEY'
        )
      });

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  async savePushSubscription(subscription) {
    try {
      await this.makeRequest('/notifications/subscribe', {
        method: 'POST',
        body: JSON.stringify({ subscription })
      });
    } catch (error) {
      console.error('Failed to save push subscription:', error);
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
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
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };

    const config = {
      headers: { ...defaultHeaders, ...options.headers },
      ...options
    };

    let attempt = 0;
    while (attempt < this.retryAttempts) {
      try {
        const response = await fetch(url, config);

        if (response.status === 401) {
          // Token expired, try to refresh
          try {
            await this.refreshToken();
            config.headers.Authorization = `Bearer ${this.token}`;
            return await fetch(url, config).then(res => this.handleResponse(res));
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.emit('auth:token_expired');
            throw new Error('Authentication failed');
          }
        }

        return await this.handleResponse(response);
      } catch (error) {
        attempt++;
        if (attempt >= this.retryAttempts) {
          throw error;
        }
        await this.delay(this.retryDelay * attempt);
      }
    }
  }

  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response;
  }

  handleError(error) {
    console.error('API Error:', error);
    this.emit('api:error', error);
    return error;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // =============================================================================
  // THIRD-PARTY INTEGRATIONS
  // =============================================================================

  // Weather API Integration
  async getExternalWeatherData(location) {
    try {
      // Example: OpenWeatherMap integration
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
      );
      return await response.json();
    } catch (error) {
      console.error('External weather API error:', error);
      return null;
    }
  }

  // Satellite Imagery Integration
  async getSatelliteImagery(coordinates, date) {
    try {
      // Example: Sentinel Hub or Google Earth Engine integration
      return await this.makeRequest('/satellite/imagery', {
        method: 'POST',
        body: JSON.stringify({ coordinates, date })
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Payment Processing Integration
  async processPayment(paymentData) {
    try {
      // Example: Stripe or Razorpay integration
      return await this.makeRequest('/payments/process', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Insurance API Integration
  async getInsuranceOptions(farmData) {
    try {
      return await this.makeRequest('/insurance/options', {
        method: 'POST',
        body: JSON.stringify(farmData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Carbon Credits Integration
  async calculateCarbonCredits(farmData) {
    try {
      return await this.makeRequest('/carbon/calculate', {
        method: 'POST',
        body: JSON.stringify(farmData)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

// Singleton instance
const apiService = new APIService();

export default apiService;
