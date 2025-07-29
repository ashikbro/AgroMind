// Analytics Service for AgroMind Platform
// Handles user analytics, farm analytics, and business intelligence

class AnalyticsService {
  constructor() {
    this.userId = null;
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.events = [];
    this.batchSize = 50;
    this.flushInterval = 30000; // 30 seconds
    this.isInitialized = false;
    
    // Analytics providers
    this.providers = {
      internal: true,
      googleAnalytics: false,
      mixpanel: false,
      amplitude: false,
      custom: []
    };
    
    this.initialize();
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  async initialize() {
    try {
      await this.setupProviders();
      this.setupEventListeners();
      this.startBatchFlush();
      
      // Track session start
      this.track('session_start', {
        session_id: this.sessionId,
        timestamp: this.sessionStartTime,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
      
      this.isInitialized = true;
      console.log('Analytics service initialized');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  async setupProviders() {
    // Initialize Google Analytics 4 if enabled
    if (this.providers.googleAnalytics && window.gtag) {
      window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
        custom_map: { custom_parameter_1: 'farm_id' }
      });
    }
    
    // Initialize Mixpanel if enabled
    if (this.providers.mixpanel && window.mixpanel) {
      window.mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN);
    }
    
    // Initialize Amplitude if enabled
    if (this.providers.amplitude && window.amplitude) {
      window.amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE_API_KEY);
    }
  }

  setupEventListeners() {
    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden', { timestamp: Date.now() });
        this.flush(); // Flush events before page becomes hidden
      } else {
        this.track('page_visible', { timestamp: Date.now() });
      }
    });

    // Before page unload
    window.addEventListener('beforeunload', () => {
      this.track('session_end', {
        session_duration: Date.now() - this.sessionStartTime
      });
      this.flush(true); // Synchronous flush
    });

    // Error tracking
    window.addEventListener('error', (event) => {
      this.trackError('javascript_error', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack
      });
    });

    // Promise rejection tracking
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('unhandled_promise_rejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });
  }

  startBatchFlush() {
    setInterval(() => {
      if (this.events.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  // =============================================================================
  // EVENT TRACKING
  // =============================================================================

  track(eventName, properties = {}, options = {}) {
    if (!this.isInitialized && eventName !== 'session_start') {
      console.warn('Analytics not initialized, queuing event:', eventName);
    }

    const event = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: Date.now(),
        session_id: this.sessionId,
        user_id: this.userId,
        page_url: window.location.href,
        page_title: document.title,
        referrer: document.referrer
      },
      options
    };

    // Add to internal queue
    this.events.push(event);

    // Send to external providers
    this.sendToProviders(event);

    // Auto-flush if batch size reached
    if (this.events.length >= this.batchSize) {
      this.flush();
    }

    return event;
  }

  identify(userId, traits = {}) {
    this.userId = userId;
    
    const event = {
      event: 'identify',
      properties: {
        user_id: userId,
        traits,
        timestamp: Date.now()
      }
    };

    this.events.push(event);
    this.sendToProviders(event);
  }

  trackError(errorType, errorData) {
    this.track('error_occurred', {
      error_type: errorType,
      ...errorData
    });
  }

  // =============================================================================
  // FARM ANALYTICS
  // =============================================================================

  trackFarmActivity(activityType, farmData) {
    this.track('farm_activity', {
      activity_type: activityType,
      farm_id: farmData.farmId,
      farm_size: farmData.size,
      crop_type: farmData.cropType,
      location: farmData.location,
      ...farmData
    });
  }

  trackCropManagement(action, cropData) {
    this.track('crop_management', {
      action,
      crop_id: cropData.cropId,
      crop_type: cropData.type,
      growth_stage: cropData.growthStage,
      field_id: cropData.fieldId,
      ...cropData
    });
  }

  trackIoTSensorData(sensorData) {
    this.track('iot_sensor_reading', {
      device_id: sensorData.deviceId,
      sensor_type: sensorData.sensorType,
      value: sensorData.value,
      unit: sensorData.unit,
      threshold_exceeded: sensorData.thresholdExceeded,
      location: sensorData.location
    });
  }

  trackWeatherData(weatherData) {
    this.track('weather_data', {
      location: weatherData.location,
      temperature: weatherData.temperature,
      humidity: weatherData.humidity,
      precipitation: weatherData.precipitation,
      wind_speed: weatherData.windSpeed,
      conditions: weatherData.conditions
    });
  }

  trackMarketActivity(activityType, marketData) {
    this.track('market_activity', {
      activity_type: activityType,
      crop_type: marketData.cropType,
      price: marketData.price,
      quantity: marketData.quantity,
      location: marketData.location,
      transaction_id: marketData.transactionId
    });
  }

  trackDiseaseDetection(detectionData) {
    this.track('disease_detection', {
      crop_type: detectionData.cropType,
      disease_type: detectionData.diseaseType,
      confidence: detectionData.confidence,
      detection_method: detectionData.method,
      image_quality: detectionData.imageQuality,
      treatment_recommended: detectionData.treatmentRecommended
    });
  }

  // =============================================================================
  // USER BEHAVIOR ANALYTICS
  // =============================================================================

  trackPageView(pageName, pageData = {}) {
    this.track('page_view', {
      page_name: pageName,
      ...pageData
    });
  }

  trackUserInteraction(interactionType, elementData) {
    this.track('user_interaction', {
      interaction_type: interactionType,
      element_type: elementData.type,
      element_id: elementData.id,
      element_text: elementData.text,
      position: elementData.position
    });
  }

  trackFeatureUsage(featureName, usageData = {}) {
    this.track('feature_usage', {
      feature_name: featureName,
      ...usageData
    });
  }

  trackSearchQuery(query, results) {
    this.track('search_performed', {
      query,
      results_count: results.length,
      has_results: results.length > 0
    });
  }

  trackFormSubmission(formName, formData) {
    this.track('form_submitted', {
      form_name: formName,
      form_data: formData,
      completion_time: formData.completionTime
    });
  }

  trackChatInteraction(interactionType, chatData) {
    this.track('chat_interaction', {
      interaction_type: interactionType,
      message_length: chatData.messageLength,
      response_time: chatData.responseTime,
      satisfaction_rating: chatData.satisfactionRating
    });
  }

  // =============================================================================
  // BUSINESS INTELLIGENCE
  // =============================================================================

  trackBusinessMetrics(metricType, metricData) {
    this.track('business_metric', {
      metric_type: metricType,
      ...metricData
    });
  }

  trackRevenue(revenueData) {
    this.track('revenue_generated', {
      amount: revenueData.amount,
      currency: revenueData.currency,
      source: revenueData.source,
      transaction_id: revenueData.transactionId,
      payment_method: revenueData.paymentMethod
    });
  }

  trackSubscription(action, subscriptionData) {
    this.track('subscription_event', {
      action,
      plan_type: subscriptionData.planType,
      plan_price: subscriptionData.price,
      billing_cycle: subscriptionData.billingCycle,
      trial_period: subscriptionData.trialPeriod
    });
  }

  trackRetention(retentionData) {
    this.track('user_retention', {
      days_since_signup: retentionData.daysSinceSignup,
      login_frequency: retentionData.loginFrequency,
      feature_adoption: retentionData.featureAdoption,
      engagement_score: retentionData.engagementScore
    });
  }

  trackConversion(conversionType, conversionData) {
    this.track('conversion_event', {
      conversion_type: conversionType,
      funnel_step: conversionData.funnelStep,
      source: conversionData.source,
      campaign: conversionData.campaign,
      conversion_value: conversionData.value
    });
  }

  // =============================================================================
  // PERFORMANCE ANALYTICS
  // =============================================================================

  trackPerformance(performanceData) {
    this.track('performance_metric', {
      metric_type: performanceData.metricType,
      value: performanceData.value,
      page: performanceData.page,
      device_type: this.getDeviceType(),
      connection_type: this.getConnectionType()
    });
  }

  trackLoadTime(loadTimeData) {
    this.track('page_load_time', {
      page: loadTimeData.page,
      load_time: loadTimeData.loadTime,
      dom_ready_time: loadTimeData.domReadyTime,
      first_paint: loadTimeData.firstPaint,
      largest_contentful_paint: loadTimeData.lcp
    });
  }

  trackAPIPerformance(apiData) {
    this.track('api_performance', {
      endpoint: apiData.endpoint,
      method: apiData.method,
      response_time: apiData.responseTime,
      status_code: apiData.statusCode,
      success: apiData.success
    });
  }

  // =============================================================================
  // A/B TESTING & EXPERIMENTS
  // =============================================================================

  trackExperiment(experimentName, variant, conversionData = {}) {
    this.track('experiment_exposure', {
      experiment_name: experimentName,
      variant,
      ...conversionData
    });
  }

  trackExperimentConversion(experimentName, variant, conversionType) {
    this.track('experiment_conversion', {
      experiment_name: experimentName,
      variant,
      conversion_type: conversionType
    });
  }

  // =============================================================================
  // CUSTOM EVENTS
  // =============================================================================

  trackCustomEvent(category, action, label, value) {
    this.track('custom_event', {
      category,
      action,
      label,
      value
    });
  }

  // =============================================================================
  // DATA COLLECTION & PRIVACY
  // =============================================================================

  setPrivacyMode(enabled) {
    this.privacyMode = enabled;
    if (enabled) {
      this.track('privacy_mode_enabled');
    }
  }

  setDataRetention(days) {
    this.dataRetentionDays = days;
    this.track('data_retention_set', { retention_days: days });
  }

  requestDataExport() {
    this.track('data_export_requested');
    // Implementation would trigger server-side data export
  }

  requestDataDeletion() {
    this.track('data_deletion_requested');
    // Implementation would trigger server-side data deletion
  }

  // =============================================================================
  // PROVIDER INTEGRATIONS
  // =============================================================================

  sendToProviders(event) {
    // Google Analytics 4
    if (this.providers.googleAnalytics && window.gtag) {
      window.gtag('event', event.event, {
        ...event.properties,
        custom_parameter_1: event.properties.farm_id
      });
    }

    // Mixpanel
    if (this.providers.mixpanel && window.mixpanel) {
      if (event.event === 'identify') {
        window.mixpanel.identify(event.properties.user_id);
        window.mixpanel.people.set(event.properties.traits);
      } else {
        window.mixpanel.track(event.event, event.properties);
      }
    }

    // Amplitude
    if (this.providers.amplitude && window.amplitude) {
      if (event.event === 'identify') {
        window.amplitude.getInstance().setUserId(event.properties.user_id);
        window.amplitude.getInstance().setUserProperties(event.properties.traits);
      } else {
        window.amplitude.getInstance().logEvent(event.event, event.properties);
      }
    }

    // Custom providers
    this.providers.custom.forEach(provider => {
      try {
        provider.track(event);
      } catch (error) {
        console.error('Custom provider error:', error);
      }
    });
  }

  // =============================================================================
  // BATCH PROCESSING
  // =============================================================================

  async flush(synchronous = false) {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    const payload = {
      events: eventsToSend,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: Date.now()
    };

    try {
      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(payload)
      };

      if (synchronous && navigator.sendBeacon) {
        // Use sendBeacon for synchronous requests (page unload)
        navigator.sendBeacon('/api/analytics/events', request.body);
      } else {
        await fetch('/api/analytics/events', request);
      }

      console.log(`Flushed ${eventsToSend.length} analytics events`);
    } catch (error) {
      console.error('Failed to flush analytics events:', error);
      // Re-add events to queue for retry
      this.events.unshift(...eventsToSend);
    }
  }

  // =============================================================================
  // ANALYTICS REPORTS
  // =============================================================================

  async generateReport(reportType, parameters = {}) {
    try {
      const response = await fetch('/api/analytics/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          report_type: reportType,
          parameters,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const reportData = await response.json();
      
      this.track('report_generated', {
        report_type: reportType,
        parameters
      });

      return reportData;
    } catch (error) {
      console.error('Report generation failed:', error);
      this.trackError('report_generation_failed', {
        report_type: reportType,
        error: error.message
      });
      throw error;
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  getConnectionType() {
    if (navigator.connection) {
      return navigator.connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  // =============================================================================
  // CONFIGURATION
  // =============================================================================

  configure(config) {
    this.providers = { ...this.providers, ...config.providers };
    this.batchSize = config.batchSize || this.batchSize;
    this.flushInterval = config.flushInterval || this.flushInterval;
    
    if (config.privacy) {
      this.setPrivacyMode(config.privacy.enabled);
      this.setDataRetention(config.privacy.retentionDays);
    }
  }

  addCustomProvider(provider) {
    this.providers.custom.push(provider);
  }

  removeCustomProvider(providerId) {
    this.providers.custom = this.providers.custom.filter(p => p.id !== providerId);
  }
}

// Singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;
