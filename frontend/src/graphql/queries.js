import { gql } from '@apollo/client';

// Farm Analytics Queries
export const GET_FARM_ANALYTICS = gql`
  query GetFarmAnalytics($timeframe: String!, $farmId: ID!) {
    farmAnalytics(timeframe: $timeframe, farmId: $farmId) {
      financial {
        totalRevenue
        totalExpenses
        netProfit
        profitMargin
        roi
        revenueGrowth
        costReduction
        breakEvenPoint
        cashFlow {
          month
          revenue
          expenses
          profit
        }
      }
      production {
        totalYield
        yieldPerHectare
        qualityGrade
        wastePercentage
        yieldImprovement
        crops {
          name
          yield
          revenue
          area
          grade
        }
      }
      efficiency {
        laborProductivity
        equipmentUtilization
        energyEfficiency
        waterUsageEfficiency
        fertilityOptimization
      }
      market {
        priceVolatility
        marketShare
        customerSatisfaction
        supplychainReliability
      }
      sustainability {
        carbonFootprint
        waterConservation
        soilHealth
        biodiversityIndex
        organicPercentage
      }
      predictions {
        nextQuarterRevenue
        expectedYield
        optimalHarvestDate
        marketPriceTrend
        weatherRisk
        diseaseRisk
      }
    }
  }
`;

export const GET_REAL_TIME_METRICS = gql`
  query GetRealTimeMetrics($farmId: ID!) {
    realTimeMetrics(farmId: $farmId) {
      timestamp
      sensors {
        soilMoisture
        temperature
        humidity
        phLevel
        lightIntensity
      }
      automation {
        irrigation
        ventilation
        lighting
        fertilizer
      }
      alerts {
        id
        type
        message
        severity
        timestamp
      }
    }
  }
`;

export const GET_MARKET_PREDICTIONS = gql`
  query GetMarketPredictions($crops: [String!]!, $region: String!) {
    marketPredictions(crops: $crops, region: $region) {
      crop
      currentPrice
      predictedPrice
      priceChange
      confidence
      factors {
        weather
        demand
        supply
        seasonal
      }
      recommendations
    }
  }
`;

// Mutations
export const UPDATE_FARM_SETTINGS = gql`
  mutation UpdateFarmSettings($farmId: ID!, $settings: FarmSettingsInput!) {
    updateFarmSettings(farmId: $farmId, settings: $settings) {
      id
      automationEnabled
      alertThresholds {
        soilMoisture
        temperature
        humidity
      }
      preferences {
        units
        currency
        language
      }
    }
  }
`;

export const CREATE_ANALYTICS_REPORT = gql`
  mutation CreateAnalyticsReport($farmId: ID!, $reportType: String!, $timeframe: String!) {
    createAnalyticsReport(farmId: $farmId, reportType: $reportType, timeframe: $timeframe) {
      id
      url
      status
      createdAt
    }
  }
`;

export const TRIGGER_AI_PREDICTION = gql`
  mutation TriggerAIPrediction($farmId: ID!, $predictionType: String!, $data: JSON!) {
    triggerAIPrediction(farmId: $farmId, predictionType: $predictionType, data: $data) {
      id
      type
      confidence
      result
      factors
      recommendations
      createdAt
    }
  }
`;

// Subscriptions for real-time updates
export const SENSOR_DATA_SUBSCRIPTION = gql`
  subscription SensorDataUpdates($farmId: ID!) {
    sensorDataUpdated(farmId: $farmId) {
      sensorId
      type
      value
      unit
      timestamp
      alert
    }
  }
`;

export const MARKET_PRICE_SUBSCRIPTION = gql`
  subscription MarketPriceUpdates($crops: [String!]!) {
    marketPriceUpdated(crops: $crops) {
      crop
      price
      change
      timestamp
      exchange
    }
  }
`;

export const AUTOMATION_STATUS_SUBSCRIPTION = gql`
  subscription AutomationStatusUpdates($farmId: ID!) {
    automationStatusUpdated(farmId: $farmId) {
      systemId
      status
      action
      timestamp
      triggeredBy
    }
  }
`;
