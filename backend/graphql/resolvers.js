const { User, Crop, Diagnosis, Disease } = require('../models');
const aiService = require('../services/aiService-complete'); // Complete AI service with fallbacks
const analyticsService = require('../services/analyticsService-mock'); // Using mock version
const marketService = require('../services/marketService-mock'); // Using mock version
const iotService = require('../services/iotService');
const weatherService = require('../services/weatherService');
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { withFilter } = require('graphql-subscriptions');
const pubsub = require('../pubsub');

const resolvers = {
  Query: {
    // Farm Analytics
    farmAnalytics: async (_, { farmId, timeframe }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const analytics = await analyticsService.generateFarmAnalytics(farmId, timeframe);
        return analytics;
      } catch (error) {
        throw new UserInputError('Failed to generate farm analytics', { error: error.message });
      }
    },

    realTimeMetrics: async (_, { farmId }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const metrics = await iotService.getRealTimeMetrics(farmId);
        return metrics;
      } catch (error) {
        throw new UserInputError('Failed to fetch real-time metrics', { error: error.message });
      }
    },

    marketPredictions: async (_, { crops, region }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const predictions = await marketService.getPredictions(crops, region);
        return predictions;
      } catch (error) {
        throw new UserInputError('Failed to fetch market predictions', { error: error.message });
      }
    },

    weatherAnalytics: async (_, { farmId, days = 7 }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const weather = await weatherService.getAnalytics(farmId, days);
        return weather;
      } catch (error) {
        throw new UserInputError('Failed to fetch weather analytics', { error: error.message });
      }
    },

    // Sensor Data
    sensorData: async (_, { farmId, sensorType, timeRange }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const data = await iotService.getSensorData(farmId, sensorType, timeRange);
        return data;
      } catch (error) {
        throw new UserInputError('Failed to fetch sensor data', { error: error.message });
      }
    },

    sensorAlerts: async (_, { farmId, severity }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const alerts = await iotService.getAlerts(farmId, severity);
        return alerts;
      } catch (error) {
        throw new UserInputError('Failed to fetch sensor alerts', { error: error.message });
      }
    },

    // Crop Management
    crops: async (_, { farmId }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const crops = await Crop.find({ farmId, userId: user.id });
        return crops;
      } catch (error) {
        throw new UserInputError('Failed to fetch crops', { error: error.message });
      }
    },

    cropAnalytics: async (_, { cropId }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const analytics = await analyticsService.getCropAnalytics(cropId);
        return analytics;
      } catch (error) {
        throw new UserInputError('Failed to fetch crop analytics', { error: error.message });
      }
    },

    yieldPrediction: async (_, { cropId }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const prediction = await aiService.predictYield(cropId);
        return prediction;
      } catch (error) {
        throw new UserInputError('Failed to generate yield prediction', { error: error.message });
      }
    },

    // Financial Analytics
    financialReport: async (_, { farmId, timeframe }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const report = await analyticsService.generateFinancialReport(farmId, timeframe);
        return report;
      } catch (error) {
        throw new UserInputError('Failed to generate financial report', { error: error.message });
      }
    },

    roiAnalysis: async (_, { farmId, investmentType }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const analysis = await analyticsService.calculateROI(farmId, investmentType);
        return analysis;
      } catch (error) {
        throw new UserInputError('Failed to calculate ROI', { error: error.message });
      }
    },

    profitLossStatement: async (_, { farmId, period }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const statement = await analyticsService.generateProfitLossStatement(farmId, period);
        return statement;
      } catch (error) {
        throw new UserInputError('Failed to generate P&L statement', { error: error.message });
      }
    },

    // Market Data
    marketPrices: async (_, { crops, region }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const prices = await marketService.getCurrentPrices(crops, region);
        return prices;
      } catch (error) {
        throw new UserInputError('Failed to fetch market prices', { error: error.message });
      }
    },

    priceHistory: async (_, { crop, days = 30 }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const history = await marketService.getPriceHistory(crop, days);
        return history;
      } catch (error) {
        throw new UserInputError('Failed to fetch price history', { error: error.message });
      }
    },

    // Disease Detection
    diseaseHistory: async (_, { farmId }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const history = await Diagnosis.find({ farmId, userId: user.id })
          .populate('disease')
          .sort({ createdAt: -1 });
        return history;
      } catch (error) {
        throw new UserInputError('Failed to fetch disease history', { error: error.message });
      }
    },

    riskAssessment: async (_, { farmId }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const assessment = await aiService.generateRiskAssessment(farmId);
        return assessment;
      } catch (error) {
        throw new UserInputError('Failed to generate risk assessment', { error: error.message });
      }
    },

    // Expert Consultation
    experts: async (_, { specialty, availability }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const experts = await analyticsService.getExperts(specialty, availability);
        return experts;
      } catch (error) {
        throw new UserInputError('Failed to fetch experts', { error: error.message });
      }
    },

    consultations: async (_, { farmId }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const consultations = await analyticsService.getConsultations(farmId);
        return consultations;
      } catch (error) {
        throw new UserInputError('Failed to fetch consultations', { error: error.message });
      }
    },

    // IoT & Automation
    automationRules: async (_, { farmId }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const rules = await iotService.getAutomationRules(farmId);
        return rules;
      } catch (error) {
        throw new UserInputError('Failed to fetch automation rules', { error: error.message });
      }
    },

    systemStatus: async (_, { farmId }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const status = await iotService.getSystemStatus(farmId);
        return status;
      } catch (error) {
        throw new UserInputError('Failed to fetch system status', { error: error.message });
      }
    },

    // Reports
    generateReport: async (_, { farmId, reportType, timeframe }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const report = await analyticsService.generateReport(farmId, reportType, timeframe);
        return report;
      } catch (error) {
        throw new UserInputError('Failed to generate report', { error: error.message });
      }
    },

    reportHistory: async (_, { farmId }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const reports = await analyticsService.getReportHistory(farmId);
        return reports;
      } catch (error) {
        throw new UserInputError('Failed to fetch report history', { error: error.message });
      }
    }
  },

  Mutation: {
    // Farm Management
    createFarm: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const farm = await analyticsService.createFarm({ ...input, ownerId: user.id });
        return farm;
      } catch (error) {
        throw new UserInputError('Failed to create farm', { error: error.message });
      }
    },

    updateFarm: async (_, { farmId, input }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const farm = await analyticsService.updateFarm(farmId, input, user.id);
        return farm;
      } catch (error) {
        throw new UserInputError('Failed to update farm', { error: error.message });
      }
    },

    // Sensor Data
    recordSensorData: async (_, { farmId, data }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const reading = await iotService.recordSensorData(farmId, data);
        
        // Publish real-time update
        pubsub.publish('SENSOR_DATA_UPDATED', {
          sensorDataUpdated: reading,
          farmId
        });
        
        return reading;
      } catch (error) {
        throw new UserInputError('Failed to record sensor data', { error: error.message });
      }
    },

    calibrateSensor: async (_, { sensorId, calibrationData }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const sensor = await iotService.calibrateSensor(sensorId, calibrationData);
        return sensor;
      } catch (error) {
        throw new UserInputError('Failed to calibrate sensor', { error: error.message });
      }
    },

    // Automation
    createAutomationRule: async (_, { farmId, rule }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const automationRule = await iotService.createAutomationRule(farmId, rule);
        return automationRule;
      } catch (error) {
        throw new UserInputError('Failed to create automation rule', { error: error.message });
      }
    },

    updateAutomationRule: async (_, { ruleId, rule }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const automationRule = await iotService.updateAutomationRule(ruleId, rule);
        return automationRule;
      } catch (error) {
        throw new UserInputError('Failed to update automation rule', { error: error.message });
      }
    },

    triggerAutomation: async (_, { farmId, action, parameters }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const result = await iotService.triggerAutomation(farmId, action, parameters);
        
        // Publish automation event
        pubsub.publish('AUTOMATION_TRIGGERED', {
          automationTriggered: result,
          farmId
        });
        
        return result;
      } catch (error) {
        throw new UserInputError('Failed to trigger automation', { error: error.message });
      }
    },

    // AI Predictions
    triggerYieldPrediction: async (_, { cropId }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const prediction = await aiService.predictYield(cropId);
        return prediction;
      } catch (error) {
        throw new UserInputError('Failed to trigger yield prediction', { error: error.message });
      }
    },

    triggerMarketAnalysis: async (_, { crops, region }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const analysis = await marketService.analyzeMarket(crops, region);
        return analysis;
      } catch (error) {
        throw new UserInputError('Failed to trigger market analysis', { error: error.message });
      }
    },

    triggerRiskAssessment: async (_, { farmId }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const assessment = await aiService.generateRiskAssessment(farmId);
        return assessment;
      } catch (error) {
        throw new UserInputError('Failed to trigger risk assessment', { error: error.message });
      }
    },

    // Disease Detection
    submitDiseaseDetection: async (_, { farmId, image, metadata }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const detection = await aiService.detectDisease(farmId, image, metadata);
        return detection;
      } catch (error) {
        throw new UserInputError('Failed to submit disease detection', { error: error.message });
      }
    },

    // Expert Consultation
    bookConsultation: async (_, { expertId, farmId, topic, scheduledAt }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const consultation = await analyticsService.bookConsultation(expertId, farmId, topic, scheduledAt);
        return consultation;
      } catch (error) {
        throw new UserInputError('Failed to book consultation', { error: error.message });
      }
    },

    startVideoCall: async (_, { consultationId }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const session = await analyticsService.startVideoCall(consultationId);
        return session;
      } catch (error) {
        throw new UserInputError('Failed to start video call', { error: error.message });
      }
    },

    endVideoCall: async (_, { sessionId }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const session = await analyticsService.endVideoCall(sessionId);
        return session;
      } catch (error) {
        throw new UserInputError('Failed to end video call', { error: error.message });
      }
    },

    // Financial
    recordTransaction: async (_, { farmId, transaction }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const record = await analyticsService.recordTransaction(farmId, transaction);
        return record;
      } catch (error) {
        throw new UserInputError('Failed to record transaction', { error: error.message });
      }
    },

    createInvestment: async (_, { farmId, investment }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const record = await analyticsService.createInvestment(farmId, investment);
        return record;
      } catch (error) {
        throw new UserInputError('Failed to create investment', { error: error.message });
      }
    },

    // Reports
    generateCustomReport: async (_, { farmId, config }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const report = await analyticsService.generateCustomReport(farmId, config);
        return report;
      } catch (error) {
        throw new UserInputError('Failed to generate custom report', { error: error.message });
      }
    },

    scheduleReport: async (_, { farmId, config }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const scheduledReport = await analyticsService.scheduleReport(farmId, config);
        return scheduledReport;
      } catch (error) {
        throw new UserInputError('Failed to schedule report', { error: error.message });
      }
    },

    // Settings
    updateFarmSettings: async (_, { farmId, settings }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const updatedSettings = await analyticsService.updateFarmSettings(farmId, settings);
        return updatedSettings;
      } catch (error) {
        throw new UserInputError('Failed to update farm settings', { error: error.message });
      }
    },

    updateNotificationPreferences: async (_, { farmId, preferences }, { user }) => {
      if (!user) throw new AuthenticationError('Authentication required');
      
      try {
        const updated = await analyticsService.updateNotificationPreferences(farmId, preferences);
        return updated;
      } catch (error) {
        throw new UserInputError('Failed to update notification preferences', { error: error.message });
      }
    }
  },

  Subscription: {
    // Real-time sensor data updates
    sensorDataUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['SENSOR_DATA_UPDATED']),
        (payload, variables) => {
          return payload.farmId === variables.farmId;
        }
      )
    },

    // Alert notifications
    alertCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['ALERT_CREATED']),
        (payload, variables) => {
          return payload.farmId === variables.farmId;
        }
      )
    },

    // Automation events
    automationTriggered: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['AUTOMATION_TRIGGERED']),
        (payload, variables) => {
          return payload.farmId === variables.farmId;
        }
      )
    },

    // Market price updates
    marketPriceUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['MARKET_PRICE_UPDATED']),
        (payload, variables) => {
          return variables.crops.some(crop => 
            payload.marketPriceUpdated.crop === crop
          );
        }
      )
    },

    // Weather updates
    weatherUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['WEATHER_UPDATED']),
        (payload, variables) => {
          return payload.farmId === variables.farmId;
        }
      )
    },

    // Consultation status changes
    consultationStatusChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['CONSULTATION_STATUS_CHANGED']),
        (payload, variables) => {
          return payload.consultationStatusChanged.id === variables.consultationId;
        }
      )
    }
  },

  // Custom scalar resolvers
  Date: {
    serialize: (date) => date.toISOString(),
    parseValue: (value) => new Date(value),
    parseLiteral: (ast) => new Date(ast.value)
  },

  JSON: {
    serialize: (value) => value,
    parseValue: (value) => value,
    parseLiteral: (ast) => JSON.parse(ast.value)
  }
};

module.exports = { resolvers };
