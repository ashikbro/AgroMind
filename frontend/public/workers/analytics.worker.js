/**
 * Analytics Web Worker
 * Performs heavy computational tasks in background
 */

// Import analytics utilities
importScripts('/utils/analytics.js');

class AnalyticsWorker {
  constructor() {
    this.models = new Map();
    this.processingQueue = [];
    this.isProcessing = false;
  }

  // Handle messages from main thread
  handleMessage(event) {
    const { type, data, id } = event.data;

    switch (type) {
      case 'TRAIN_YIELD_MODEL':
        this.trainYieldPredictionModel(data, id);
        break;
      case 'PREDICT_YIELD':
        this.predictYield(data, id);
        break;
      case 'ANALYZE_SENSOR_DATA':
        this.analyzeSensorData(data, id);
        break;
      case 'CALCULATE_ROI':
        this.calculateROI(data, id);
        break;
      case 'DETECT_ANOMALIES':
        this.detectAnomalies(data, id);
        break;
      case 'CLUSTER_CROPS':
        this.clusterCrops(data, id);
        break;
      case 'FORECAST_PRICES':
        this.forecastPrices(data, id);
        break;
      case 'ANALYZE_TRENDS':
        this.analyzeTrends(data, id);
        break;
      case 'CALCULATE_FINANCIAL_METRICS':
        this.calculateFinancialMetrics(data, id);
        break;
      case 'OPTIMIZE_RESOURCES':
        this.optimizeResources(data, id);
        break;
      default:
        this.postMessage({
          id,
          type: 'ERROR',
          error: `Unknown message type: ${type}`
        });
    }
  }

  // Train yield prediction model
  async trainYieldPredictionModel(data, id) {
    try {
      const { historicalData, features } = data;
      
      // Prepare training data
      const xData = historicalData.map(item => features.reduce((sum, feature) => sum + item[feature], 0));
      const yData = historicalData.map(item => item.yield);
      
      // Create and train linear regression model
      const model = new LinearRegression();
      model.train(xData, yData);
      
      // Calculate model performance
      const r2Score = model.getR2Score(xData, yData);
      
      // Store model
      this.models.set('yield_prediction', model);
      
      this.postMessage({
        id,
        type: 'MODEL_TRAINED',
        result: {
          modelType: 'yield_prediction',
          r2Score,
          slope: model.slope,
          intercept: model.intercept
        }
      });
    } catch (error) {
      this.postMessage({
        id,
        type: 'ERROR',
        error: error.message
      });
    }
  }

  // Predict yield
  async predictYield(data, id) {
    try {
      const { features } = data;
      const model = this.models.get('yield_prediction');
      
      if (!model) {
        throw new Error('Yield prediction model not trained');
      }
      
      const inputValue = features.reduce((sum, value) => sum + value, 0);
      const prediction = model.predict(inputValue);
      
      this.postMessage({
        id,
        type: 'PREDICTION_RESULT',
        result: {
          predictedYield: prediction,
          confidence: 0.85, // Simulated confidence
          factors: features
        }
      });
    } catch (error) {
      this.postMessage({
        id,
        type: 'ERROR',
        error: error.message
      });
    }
  }

  // Analyze sensor data for patterns
  async analyzeSensorData(data, id) {
    try {
      const { sensorData, farmId } = data;
      
      const analysis = {
        farmId,
        timestamp: new Date().toISOString(),
        metrics: {}
      };
      
      // Analyze each sensor type
      const sensorTypes = ['soilMoisture', 'temperature', 'humidity', 'phLevel'];
      
      for (const sensorType of sensorTypes) {
        const values = sensorData.map(reading => reading[sensorType]).filter(val => val !== undefined);
        
        if (values.length === 0) continue;
        
        // Calculate basic statistics
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        const min = Math.min(...values);
        const max = Math.max(...values);
        
        // Detect anomalies
        const anomalyDetector = new AnomalyDetector(2.0);
        const anomalies = anomalyDetector.detectAnomalies(values);
        
        // Calculate trend
        const movingAvg = new MovingAverage(7);
        values.forEach(val => movingAvg.addDataPoint(val));
        const trend = movingAvg.getTrend();
        
        analysis.metrics[sensorType] = {
          mean: parseFloat(mean.toFixed(2)),
          stdDev: parseFloat(stdDev.toFixed(2)),
          min,
          max,
          anomalies: anomalies.length,
          trend,
          stability: stdDev / mean < 0.1 ? 'stable' : 'variable'
        };
      }
      
      // Overall health score
      analysis.overallHealth = this.calculateHealthScore(analysis.metrics);
      
      this.postMessage({
        id,
        type: 'SENSOR_ANALYSIS_RESULT',
        result: analysis
      });
    } catch (error) {
      this.postMessage({
        id,
        type: 'ERROR',
        error: error.message
      });
    }
  }

  // Calculate ROI and financial metrics
  async calculateROI(data, id) {
    try {
      const { investments, revenues, timeframe } = data;
      
      const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
      const totalRevenue = revenues.reduce((sum, rev) => sum + rev.amount, 0);
      
      const roi = ((totalRevenue - totalInvestment) / totalInvestment) * 100;
      
      // Calculate NPV if discount rate provided
      let npv = null;
      if (data.discountRate) {
        const cashFlows = [-totalInvestment, ...revenues.map(rev => rev.amount)];
        npv = FinancialMetrics.calculateNPV(cashFlows, data.discountRate);
      }
      
      // Calculate payback period
      const cashFlows = [-totalInvestment, ...revenues.map(rev => rev.amount)];
      const paybackPeriod = FinancialMetrics.calculatePaybackPeriod(cashFlows);
      
      this.postMessage({
        id,
        type: 'ROI_CALCULATION_RESULT',
        result: {
          roi: parseFloat(roi.toFixed(2)),
          npv: npv ? parseFloat(npv.toFixed(2)) : null,
          paybackPeriod,
          totalInvestment,
          totalRevenue,
          netProfit: totalRevenue - totalInvestment,
          timeframe
        }
      });
    } catch (error) {
      this.postMessage({
        id,
        type: 'ERROR',
        error: error.message
      });
    }
  }

  // Detect anomalies in farm data
  async detectAnomalies(data, id) {
    try {
      const { dataset, threshold } = data;
      
      const anomalyDetector = new AnomalyDetector(threshold || 2.5);
      const anomalies = anomalyDetector.detectAnomalies(dataset);
      
      this.postMessage({
        id,
        type: 'ANOMALY_DETECTION_RESULT',
        result: {
          anomalies,
          totalPoints: dataset.length,
          anomalyPercentage: (anomalies.length / dataset.length) * 100
        }
      });
    } catch (error) {
      this.postMessage({
        id,
        type: 'ERROR',
        error: error.message
      });
    }
  }

  // Cluster crops based on performance metrics
  async clusterCrops(data, id) {
    try {
      const { crops, features, k } = data;
      
      // Prepare data for clustering
      const clusterData = crops.map(crop => 
        features.map(feature => crop[feature] || 0)
      );
      
      const kmeans = new KMeans(k || 3);
      const clusters = kmeans.fit(clusterData);
      
      // Add crop names to cluster results
      const clustersWithNames = clusters.map((cluster, clusterIndex) => ({
        clusterIndex,
        crops: cluster.map(item => ({
          ...crops[item.index],
          clusterIndex
        })),
        centroid: kmeans.centroids[clusterIndex]
      }));
      
      this.postMessage({
        id,
        type: 'CLUSTERING_RESULT',
        result: {
          clusters: clustersWithNames,
          totalCrops: crops.length,
          features
        }
      });
    } catch (error) {
      this.postMessage({
        id,
        type: 'ERROR',
        error: error.message
      });
    }
  }

  // Forecast prices using exponential smoothing
  async forecastPrices(data, id) {
    try {
      const { priceHistory, forecastPeriods } = data;
      
      const exponentialSmoothing = new ExponentialSmoothing(0.3);
      const forecasts = exponentialSmoothing.predict(priceHistory);
      
      // Generate future predictions
      const futurePredictions = [];
      let lastForecast = forecasts[forecasts.length - 1];
      
      for (let i = 0; i < forecastPeriods; i++) {
        futurePredictions.push(lastForecast);
        // Slight random variation for more realistic forecasts
        lastForecast *= (0.98 + Math.random() * 0.04);
      }
      
      this.postMessage({
        id,
        type: 'PRICE_FORECAST_RESULT',
        result: {
          historicalForecasts: forecasts,
          futurePredictions,
          confidence: 0.75,
          method: 'exponential_smoothing'
        }
      });
    } catch (error) {
      this.postMessage({
        id,
        type: 'ERROR',
        error: error.message
      });
    }
  }

  // Analyze trends in time series data
  async analyzeTrends(data, id) {
    try {
      const { timeSeries } = data;
      
      const decomposition = TimeSeriesAnalysis.decompose(timeSeries);
      
      // Calculate trend strength
      const trendVariance = this.calculateVariance(decomposition.trend);
      const residualVariance = this.calculateVariance(decomposition.residual);
      const trendStrength = 1 - (residualVariance / (trendVariance + residualVariance));
      
      // Detect seasonality
      const seasonalityDetected = this.detectSeasonality(decomposition.seasonal);
      
      this.postMessage({
        id,
        type: 'TREND_ANALYSIS_RESULT',
        result: {
          decomposition,
          trendStrength: parseFloat(trendStrength.toFixed(3)),
          seasonalityDetected,
          trendDirection: this.getTrendDirection(decomposition.trend)
        }
      });
    } catch (error) {
      this.postMessage({
        id,
        type: 'ERROR',
        error: error.message
      });
    }
  }

  // Calculate comprehensive financial metrics
  async calculateFinancialMetrics(data, id) {
    try {
      const { cashFlows, marketReturns, riskFreeRate } = data;
      
      const metrics = {};
      
      // Calculate various financial ratios
      if (cashFlows && cashFlows.length > 0) {
        metrics.npv = FinancialMetrics.calculateNPV(cashFlows, riskFreeRate || 0.05);
        metrics.irr = FinancialMetrics.calculateIRR(cashFlows);
        metrics.paybackPeriod = FinancialMetrics.calculatePaybackPeriod(cashFlows);
      }
      
      // Calculate risk metrics if market data available
      if (marketReturns && marketReturns.length > 0) {
        const returns = cashFlows.slice(1).map((cf, i) => (cf - cashFlows[i]) / cashFlows[i]);
        
        metrics.sharpeRatio = RiskAssessment.calculateSharpeRatio(returns, riskFreeRate || 0.02);
        metrics.var95 = RiskAssessment.calculateVaR(returns, 0.95);
        
        if (marketReturns.length === returns.length) {
          metrics.beta = RiskAssessment.calculateBeta(returns, marketReturns);
        }
      }
      
      this.postMessage({
        id,
        type: 'FINANCIAL_METRICS_RESULT',
        result: metrics
      });
    } catch (error) {
      this.postMessage({
        id,
        type: 'ERROR',
        error: error.message
      });
    }
  }

  // Optimize resource allocation
  async optimizeResources(data, id) {
    try {
      const { resources, constraints, objectives } = data;
      
      // Simple optimization using greedy approach
      const optimization = this.greedyOptimization(resources, constraints, objectives);
      
      this.postMessage({
        id,
        type: 'OPTIMIZATION_RESULT',
        result: optimization
      });
    } catch (error) {
      this.postMessage({
        id,
        type: 'ERROR',
        error: error.message
      });
    }
  }

  // Helper methods
  calculateHealthScore(metrics) {
    const scores = [];
    
    Object.values(metrics).forEach(metric => {
      let score = 100;
      
      // Penalize high anomalies
      if (metric.anomalies > 0) {
        score -= metric.anomalies * 10;
      }
      
      // Penalize high variability
      if (metric.stability === 'variable') {
        score -= 20;
      }
      
      // Consider trends
      if (metric.trend === 'decreasing') {
        score -= 15;
      } else if (metric.trend === 'increasing') {
        score += 5;
      }
      
      scores.push(Math.max(0, score));
    });
    
    return scores.length > 0 ? 
      Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  }

  calculateVariance(data) {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  }

  detectSeasonality(seasonal) {
    const threshold = 0.1;
    const maxValue = Math.max(...seasonal.map(Math.abs));
    return maxValue > threshold;
  }

  getTrendDirection(trend) {
    const start = trend.slice(0, Math.floor(trend.length / 3));
    const end = trend.slice(-Math.floor(trend.length / 3));
    
    const startAvg = start.reduce((sum, val) => sum + val, 0) / start.length;
    const endAvg = end.reduce((sum, val) => sum + val, 0) / end.length;
    
    const change = (endAvg - startAvg) / startAvg;
    
    if (change > 0.05) return 'upward';
    if (change < -0.05) return 'downward';
    return 'stable';
  }

  greedyOptimization(resources, constraints, objectives) {
    // Simple greedy optimization implementation
    const solution = {};
    let totalCost = 0;
    let totalBenefit = 0;
    
    // Sort resources by benefit-to-cost ratio
    const sortedResources = Object.entries(resources)
      .map(([name, resource]) => ({
        name,
        ...resource,
        ratio: resource.benefit / resource.cost
      }))
      .sort((a, b) => b.ratio - a.ratio);
    
    // Allocate resources greedily
    for (const resource of sortedResources) {
      if (totalCost + resource.cost <= constraints.budget) {
        solution[resource.name] = resource.quantity || 1;
        totalCost += resource.cost;
        totalBenefit += resource.benefit;
      }
    }
    
    return {
      allocation: solution,
      totalCost,
      totalBenefit,
      efficiency: totalBenefit / totalCost
    };
  }

  postMessage(message) {
    self.postMessage(message);
  }
}

// Initialize worker
const worker = new AnalyticsWorker();

// Listen for messages
self.addEventListener('message', (event) => {
  worker.handleMessage(event);
});

// Handle errors
self.addEventListener('error', (error) => {
  self.postMessage({
    type: 'ERROR',
    error: error.message
  });
});
