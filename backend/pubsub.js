const { PubSub } = require('graphql-subscriptions');
const Redis = require('ioredis');

class GraphQLPubSub {
  constructor() {
    // Use Redis for distributed subscriptions in production
    if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL);
      this.pubsub = new RedisPubSub({
        publisher: new Redis(process.env.REDIS_URL),
        subscriber: new Redis(process.env.REDIS_URL)
      });
    } else {
      // In-memory PubSub for development
      this.pubsub = new PubSub();
    }
  }

  // Publish sensor data updates
  publishSensorUpdate(farmId, sensorData) {
    this.pubsub.publish('SENSOR_DATA_UPDATED', {
      sensorDataUpdated: sensorData,
      farmId
    });
  }

  // Publish alert notifications
  publishAlert(farmId, alert) {
    this.pubsub.publish('ALERT_CREATED', {
      alertCreated: alert,
      farmId
    });
  }

  // Publish automation events
  publishAutomationEvent(farmId, event) {
    this.pubsub.publish('AUTOMATION_TRIGGERED', {
      automationTriggered: event,
      farmId
    });
  }

  // Publish market price updates
  publishMarketUpdate(crop, price) {
    this.pubsub.publish('MARKET_PRICE_UPDATED', {
      marketPriceUpdated: { crop, ...price }
    });
  }

  // Publish weather updates
  publishWeatherUpdate(farmId, weather) {
    this.pubsub.publish('WEATHER_UPDATED', {
      weatherUpdated: weather,
      farmId
    });
  }

  // Publish consultation status changes
  publishConsultationUpdate(consultation) {
    this.pubsub.publish('CONSULTATION_STATUS_CHANGED', {
      consultationStatusChanged: consultation
    });
  }

  // Generic publish method
  publish(trigger, payload) {
    return this.pubsub.publish(trigger, payload);
  }

  // Subscribe to events
  asyncIterator(triggers) {
    return this.pubsub.asyncIterator(triggers);
  }
}

// Create singleton instance
const pubsubInstance = new GraphQLPubSub();

module.exports = pubsubInstance;
