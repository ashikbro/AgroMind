// Push Notification Service for AgroMind Platform
// Handles all notification types including push, in-app, and email notifications

class NotificationService {
  constructor() {
    this.serviceWorkerRegistration = null;
    this.pushSubscription = null;
    this.notificationQueue = [];
    this.settings = this.loadSettings();
    this.vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
    
    this.notificationTypes = {
      WEATHER_ALERT: 'weather_alert',
      MARKET_UPDATE: 'market_update',
      IOT_SENSOR: 'iot_sensor',
      CHAT_MESSAGE: 'chat_message',
      COMMUNITY_ACTIVITY: 'community_activity',
      EXPERT_CONSULTATION: 'expert_consultation',
      CROP_REMINDER: 'crop_reminder',
      SYSTEM_UPDATE: 'system_update',
      FARM_AUTOMATION: 'farm_automation',
      DISEASE_ALERT: 'disease_alert'
    };

    this.priorities = {
      LOW: 'low',
      NORMAL: 'normal',
      HIGH: 'high',
      CRITICAL: 'critical'
    };

    this.initialize();
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  async initialize() {
    try {
      await this.registerServiceWorker();
      await this.requestPermissions();
      await this.subscribeToPushNotifications();
      this.setupEventListeners();
      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('Service Worker registered:', this.serviceWorkerRegistration);

        // Listen for service worker updates
        this.serviceWorkerRegistration.addEventListener('updatefound', () => {
          const newWorker = this.serviceWorkerRegistration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showNotification('App Update Available', 'A new version is ready. Refresh to update.', {
                actions: [
                  { action: 'refresh', title: 'Refresh Now' },
                  { action: 'dismiss', title: 'Later' }
                ]
              });
            }
          });
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async requestPermissions() {
    // Request notification permission
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return false;
      }
    }

    // Request other permissions as needed
    await this.requestLocationPermission();
    await this.requestCameraPermission();
    
    return true;
  }

  async requestLocationPermission() {
    if ('geolocation' in navigator) {
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        console.log('Location permission granted');
      } catch (error) {
        console.log('Location permission denied or unavailable');
      }
    }
  }

  async requestCameraPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop immediately
      console.log('Camera permission granted');
    } catch (error) {
      console.log('Camera permission denied or unavailable');
    }
  }

  // =============================================================================
  // PUSH NOTIFICATION SETUP
  // =============================================================================

  async subscribeToPushNotifications() {
    if (!this.serviceWorkerRegistration || !this.vapidPublicKey) {
      console.warn('Cannot subscribe to push notifications: missing service worker or VAPID key');
      return;
    }

    try {
      this.pushSubscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      console.log('Push subscription successful:', this.pushSubscription);
      
      // Send subscription to server
      await this.sendSubscriptionToServer(this.pushSubscription);
      
    } catch (error) {
      console.error('Push subscription failed:', error);
    }
  }

  async sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          subscription,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }

      console.log('Subscription sent to server successfully');
    } catch (error) {
      console.error('Error sending subscription to server:', error);
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
  // NOTIFICATION CREATION & DISPLAY
  // =============================================================================

  async showNotification(title, message, options = {}) {
    const notificationData = {
      title,
      message,
      options: {
        body: message,
        icon: options.icon || '/icons/icon-192x192.png',
        badge: options.badge || '/icons/badge-72x72.png',
        image: options.image,
        tag: options.tag || 'agromind-notification',
        data: options.data || {},
        actions: options.actions || [],
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        renotify: options.renotify || true,
        timestamp: Date.now(),
        ...options
      }
    };

    // Check if notifications are allowed for this type
    if (!this.isNotificationAllowed(options.type)) {
      console.log('Notification blocked by user settings:', options.type);
      return;
    }

    // Show notification based on priority and user focus
    if (document.hidden || options.priority === this.priorities.HIGH || options.priority === this.priorities.CRITICAL) {
      await this.showPushNotification(notificationData);
    } else {
      this.showInAppNotification(notificationData);
    }

    // Store notification in history
    this.storeNotification(notificationData);
  }

  async showPushNotification(notificationData) {
    if (this.serviceWorkerRegistration) {
      try {
        await this.serviceWorkerRegistration.showNotification(
          notificationData.title,
          notificationData.options
        );
      } catch (error) {
        console.error('Error showing push notification:', error);
        // Fallback to browser notification
        this.showBrowserNotification(notificationData);
      }
    } else {
      this.showBrowserNotification(notificationData);
    }
  }

  showBrowserNotification(notificationData) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(notificationData.title, notificationData.options);
      
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        notification.close();
        this.handleNotificationClick(notificationData);
      };

      // Auto-close if not requiring interaction
      if (!notificationData.options.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }
    }
  }

  showInAppNotification(notificationData) {
    // This would integrate with your app's toast/snackbar system
    const event = new CustomEvent('show-in-app-notification', {
      detail: notificationData
    });
    window.dispatchEvent(event);
  }

  // =============================================================================
  // NOTIFICATION TYPES & HANDLERS
  // =============================================================================

  async showWeatherAlert(alertData) {
    const { severity, location, message, expires } = alertData;
    
    const priority = severity === 'critical' ? this.priorities.CRITICAL : 
                    severity === 'high' ? this.priorities.HIGH : this.priorities.NORMAL;

    await this.showNotification(`Weather Alert - ${location}`, message, {
      type: this.notificationTypes.WEATHER_ALERT,
      priority,
      icon: this.getWeatherIcon(alertData.type),
      tag: `weather-${location}`,
      requireInteraction: priority === this.priorities.CRITICAL,
      data: { alertData },
      actions: [
        { action: 'view_details', title: 'View Details' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    });
  }

  async showMarketUpdate(marketData) {
    const { cropType, location, price, change } = marketData;
    const isSignificant = Math.abs(change) > 5;
    
    await this.showNotification(`Market Update - ${cropType}`, 
      `Price ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)}% in ${location}`, {
      type: this.notificationTypes.MARKET_UPDATE,
      priority: isSignificant ? this.priorities.HIGH : this.priorities.NORMAL,
      icon: '📈',
      tag: `market-${cropType}-${location}`,
      data: { marketData },
      actions: [
        { action: 'view_market', title: 'View Market' },
        { action: 'set_alert', title: 'Set Price Alert' }
      ]
    });
  }

  async showIoTAlert(sensorData) {
    const { deviceId, sensorType, value, threshold, severity } = sensorData;
    
    await this.showNotification(`IoT Alert - ${deviceId}`, 
      `${sensorType} reading: ${value} (threshold: ${threshold})`, {
      type: this.notificationTypes.IOT_SENSOR,
      priority: severity === 'critical' ? this.priorities.CRITICAL : this.priorities.HIGH,
      icon: '📡',
      tag: `iot-${deviceId}`,
      requireInteraction: severity === 'critical',
      data: { sensorData },
      actions: [
        { action: 'view_dashboard', title: 'View Dashboard' },
        { action: 'acknowledge', title: 'Acknowledge' }
      ]
    });
  }

  async showChatMessage(messageData) {
    const { senderId, senderName, message, conversationId } = messageData;
    
    await this.showNotification(`Message from ${senderName}`, message, {
      type: this.notificationTypes.CHAT_MESSAGE,
      priority: this.priorities.NORMAL,
      icon: '💬',
      tag: `chat-${conversationId}`,
      data: { messageData },
      actions: [
        { action: 'reply', title: 'Reply' },
        { action: 'view_chat', title: 'View Chat' }
      ]
    });
  }

  async showCommunityActivity(activityData) {
    const { type, userName, postTitle } = activityData;
    
    let message = '';
    switch (type) {
      case 'like':
        message = `${userName} liked your post: ${postTitle}`;
        break;
      case 'comment':
        message = `${userName} commented on your post: ${postTitle}`;
        break;
      case 'mention':
        message = `${userName} mentioned you in a post`;
        break;
      default:
        message = `New activity from ${userName}`;
    }

    await this.showNotification('Community Activity', message, {
      type: this.notificationTypes.COMMUNITY_ACTIVITY,
      priority: this.priorities.NORMAL,
      icon: '👥',
      tag: 'community-activity',
      data: { activityData },
      actions: [
        { action: 'view_post', title: 'View Post' },
        { action: 'visit_profile', title: 'Visit Profile' }
      ]
    });
  }

  async showExpertConsultation(consultationData) {
    const { expertName, type, scheduledTime } = consultationData;
    
    let message = '';
    switch (type) {
      case 'upcoming':
        message = `Consultation with ${expertName} in 15 minutes`;
        break;
      case 'request':
        message = `${expertName} has requested a consultation`;
        break;
      case 'completed':
        message = `Consultation with ${expertName} completed. Report available.`;
        break;
    }

    await this.showNotification('Expert Consultation', message, {
      type: this.notificationTypes.EXPERT_CONSULTATION,
      priority: type === 'upcoming' ? this.priorities.HIGH : this.priorities.NORMAL,
      icon: '👨‍🌾',
      tag: 'expert-consultation',
      requireInteraction: type === 'upcoming',
      data: { consultationData },
      actions: [
        { action: 'join_call', title: 'Join Call' },
        { action: 'reschedule', title: 'Reschedule' }
      ]
    });
  }

  async showCropReminder(reminderData) {
    const { cropName, task, dueDate } = reminderData;
    
    await this.showNotification(`Crop Reminder - ${cropName}`, 
      `${task} is due ${this.formatDate(dueDate)}`, {
      type: this.notificationTypes.CROP_REMINDER,
      priority: this.priorities.NORMAL,
      icon: '🌱',
      tag: `crop-reminder-${cropName}`,
      data: { reminderData },
      actions: [
        { action: 'mark_complete', title: 'Mark Complete' },
        { action: 'snooze', title: 'Remind Later' }
      ]
    });
  }

  async showDiseaseAlert(diseaseData) {
    const { cropName, disease, confidence, severity } = diseaseData;
    
    await this.showNotification(`Disease Alert - ${cropName}`, 
      `Potential ${disease} detected (${confidence}% confidence)`, {
      type: this.notificationTypes.DISEASE_ALERT,
      priority: severity === 'high' ? this.priorities.HIGH : this.priorities.NORMAL,
      icon: '🦠',
      tag: `disease-${cropName}`,
      requireInteraction: severity === 'high',
      data: { diseaseData },
      actions: [
        { action: 'view_diagnosis', title: 'View Diagnosis' },
        { action: 'consult_expert', title: 'Consult Expert' }
      ]
    });
  }

  // =============================================================================
  // NOTIFICATION SETTINGS & PREFERENCES
  // =============================================================================

  loadSettings() {
    const defaultSettings = {
      [this.notificationTypes.WEATHER_ALERT]: true,
      [this.notificationTypes.MARKET_UPDATE]: true,
      [this.notificationTypes.IOT_SENSOR]: true,
      [this.notificationTypes.CHAT_MESSAGE]: true,
      [this.notificationTypes.COMMUNITY_ACTIVITY]: true,
      [this.notificationTypes.EXPERT_CONSULTATION]: true,
      [this.notificationTypes.CROP_REMINDER]: true,
      [this.notificationTypes.SYSTEM_UPDATE]: true,
      [this.notificationTypes.FARM_AUTOMATION]: true,
      [this.notificationTypes.DISEASE_ALERT]: true,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '06:00'
      },
      location: true,
      sound: true,
      vibration: true
    };

    const saved = localStorage.getItem('notificationSettings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  }

  saveSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
  }

  isNotificationAllowed(type) {
    if (!type) return true;
    
    // Check if notification type is enabled
    if (!this.settings[type]) return false;
    
    // Check quiet hours
    if (this.settings.quietHours.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const startTime = this.parseTime(this.settings.quietHours.start);
      const endTime = this.parseTime(this.settings.quietHours.end);
      
      if (startTime > endTime) { // Overnight quiet hours
        if (currentTime >= startTime || currentTime <= endTime) {
          return false;
        }
      } else { // Same day quiet hours
        if (currentTime >= startTime && currentTime <= endTime) {
          return false;
        }
      }
    }
    
    return true;
  }

  parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // =============================================================================
  // NOTIFICATION HISTORY & MANAGEMENT
  // =============================================================================

  storeNotification(notificationData) {
    const notifications = this.getNotificationHistory();
    notifications.unshift({
      ...notificationData,
      id: this.generateNotificationId(),
      timestamp: Date.now(),
      read: false
    });

    // Keep only last 100 notifications
    const limited = notifications.slice(0, 100);
    localStorage.setItem('notificationHistory', JSON.stringify(limited));
  }

  getNotificationHistory() {
    const stored = localStorage.getItem('notificationHistory');
    return stored ? JSON.parse(stored) : [];
  }

  markAsRead(notificationId) {
    const notifications = this.getNotificationHistory();
    const updated = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    );
    localStorage.setItem('notificationHistory', JSON.stringify(updated));
  }

  clearNotificationHistory() {
    localStorage.removeItem('notificationHistory');
  }

  getUnreadCount() {
    return this.getNotificationHistory().filter(n => !n.read).length;
  }

  // =============================================================================
  // EVENT HANDLING
  // =============================================================================

  setupEventListeners() {
    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, data } = event.data;
        
        switch (type) {
          case 'notification-click':
            this.handleNotificationClick(data);
            break;
          case 'notification-close':
            this.handleNotificationClose(data);
            break;
          default:
            console.log('Unknown service worker message:', type);
        }
      });
    }

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // Page became visible, process queued notifications
        this.processNotificationQueue();
      }
    });
  }

  handleNotificationClick(notificationData) {
    const { action, data } = notificationData;
    
    switch (action) {
      case 'view_details':
      case 'view_dashboard':
      case 'view_market':
      case 'view_chat':
      case 'view_post':
      case 'view_diagnosis':
        this.navigateToView(action, data);
        break;
      case 'reply':
        this.openReplyInterface(data);
        break;
      case 'acknowledge':
        this.acknowledgeAlert(data);
        break;
      case 'mark_complete':
        this.markTaskComplete(data);
        break;
      case 'snooze':
        this.snoozeReminder(data);
        break;
      default:
        console.log('Unknown notification action:', action);
    }
  }

  handleNotificationClose(notificationData) {
    // Handle notification dismissal
    console.log('Notification closed:', notificationData);
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  generateNotificationId() {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  formatDate(date) {
    const now = new Date();
    const target = new Date(date);
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays === -1) return 'yesterday';
    if (diffDays > 0) return `in ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  }

  getWeatherIcon(weatherType) {
    const icons = {
      thunderstorm: '⛈️',
      rain: '🌧️',
      snow: '❄️',
      fog: '🌫️',
      wind: '💨',
      hail: '🧊',
      tornado: '🌪️',
      hurricane: '🌀'
    };
    return icons[weatherType] || '🌤️';
  }

  processNotificationQueue() {
    // Process any queued notifications when page becomes visible
    if (this.notificationQueue.length > 0) {
      this.notificationQueue.forEach(notification => {
        this.showInAppNotification(notification);
      });
      this.notificationQueue = [];
    }
  }

  // Navigation helpers (would integrate with your router)
  navigateToView(action, data) {
    // This would use your app's navigation system
    console.log('Navigate to:', action, data);
  }

  openReplyInterface(data) {
    // Open chat reply interface
    console.log('Open reply for:', data);
  }

  acknowledgeAlert(data) {
    // Acknowledge IoT or other alerts
    console.log('Acknowledge alert:', data);
  }

  markTaskComplete(data) {
    // Mark crop task as complete
    console.log('Mark task complete:', data);
  }

  snoozeReminder(data) {
    // Snooze reminder for later
    console.log('Snooze reminder:', data);
  }
}

// Singleton instance
const notificationService = new NotificationService();

export default notificationService;
