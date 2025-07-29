/**
 * Advanced Analytics Utils with ML Algorithms
 * Implements various machine learning techniques for farm analytics
 */

// Linear Regression for yield prediction
export class LinearRegression {
  constructor() {
    this.slope = 0;
    this.intercept = 0;
    this.trained = false;
  }

  train(xData, yData) {
    if (xData.length !== yData.length) {
      throw new Error('X and Y data must have the same length');
    }

    const n = xData.length;
    const sumX = xData.reduce((sum, x) => sum + x, 0);
    const sumY = yData.reduce((sum, y) => sum + y, 0);
    const sumXY = xData.reduce((sum, x, i) => sum + x * yData[i], 0);
    const sumXX = xData.reduce((sum, x) => sum + x * x, 0);

    this.slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    this.intercept = (sumY - this.slope * sumX) / n;
    this.trained = true;

    return this;
  }

  predict(x) {
    if (!this.trained) {
      throw new Error('Model must be trained before making predictions');
    }
    return this.slope * x + this.intercept;
  }

  getR2Score(xData, yData) {
    const predictions = xData.map(x => this.predict(x));
    const yMean = yData.reduce((sum, y) => sum + y, 0) / yData.length;
    
    const totalSumSquares = yData.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    const residualSumSquares = yData.reduce((sum, y, i) => sum + Math.pow(y - predictions[i], 2), 0);
    
    return 1 - (residualSumSquares / totalSumSquares);
  }
}

// Moving Average for trend analysis
export class MovingAverage {
  constructor(windowSize = 7) {
    this.windowSize = windowSize;
    this.data = [];
  }

  addDataPoint(value) {
    this.data.push(value);
    if (this.data.length > this.windowSize) {
      this.data.shift();
    }
  }

  getCurrentAverage() {
    if (this.data.length === 0) return 0;
    return this.data.reduce((sum, val) => sum + val, 0) / this.data.length;
  }

  getTrend() {
    if (this.data.length < 2) return 'insufficient_data';
    
    const recent = this.data.slice(-3);
    const older = this.data.slice(0, -3);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (change > 5) return 'increasing';
    if (change < -5) return 'decreasing';
    return 'stable';
  }
}

// Exponential Smoothing for forecasting
export class ExponentialSmoothing {
  constructor(alpha = 0.3) {
    this.alpha = alpha;
    this.forecast = null;
  }

  predict(data) {
    if (data.length === 0) return [];
    
    const forecasts = [data[0]];
    
    for (let i = 1; i < data.length; i++) {
      const forecast = this.alpha * data[i] + (1 - this.alpha) * forecasts[i - 1];
      forecasts.push(forecast);
    }
    
    this.forecast = forecasts[forecasts.length - 1];
    return forecasts;
  }

  nextPrediction() {
    return this.forecast;
  }
}

// K-Means Clustering for crop grouping
export class KMeans {
  constructor(k = 3, maxIterations = 100) {
    this.k = k;
    this.maxIterations = maxIterations;
    this.centroids = [];
    this.clusters = [];
  }

  euclideanDistance(point1, point2) {
    return Math.sqrt(
      point1.reduce((sum, val, i) => sum + Math.pow(val - point2[i], 2), 0)
    );
  }

  initializeCentroids(data) {
    this.centroids = [];
    for (let i = 0; i < this.k; i++) {
      const randomIndex = Math.floor(Math.random() * data.length);
      this.centroids.push([...data[randomIndex]]);
    }
  }

  assignPointsToClusters(data) {
    this.clusters = Array(this.k).fill().map(() => []);
    
    data.forEach((point, index) => {
      let minDistance = Infinity;
      let assignedCluster = 0;
      
      this.centroids.forEach((centroid, clusterIndex) => {
        const distance = this.euclideanDistance(point, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          assignedCluster = clusterIndex;
        }
      });
      
      this.clusters[assignedCluster].push({ point, index });
    });
  }

  updateCentroids() {
    this.centroids = this.clusters.map(cluster => {
      if (cluster.length === 0) return this.centroids[0]; // Keep existing centroid if cluster is empty
      
      const dimensions = cluster[0].point.length;
      const newCentroid = Array(dimensions).fill(0);
      
      cluster.forEach(({ point }) => {
        point.forEach((val, dim) => {
          newCentroid[dim] += val;
        });
      });
      
      return newCentroid.map(sum => sum / cluster.length);
    });
  }

  fit(data) {
    this.initializeCentroids(data);
    
    for (let iteration = 0; iteration < this.maxIterations; iteration++) {
      const oldCentroids = this.centroids.map(c => [...c]);
      
      this.assignPointsToClusters(data);
      this.updateCentroids();
      
      // Check for convergence
      const converged = oldCentroids.every((oldCentroid, i) =>
        oldCentroid.every((val, j) => Math.abs(val - this.centroids[i][j]) < 0.001)
      );
      
      if (converged) break;
    }
    
    return this.clusters;
  }
}

// Anomaly Detection using Z-Score
export class AnomalyDetector {
  constructor(threshold = 2.5) {
    this.threshold = threshold;
  }

  calculateZScore(value, mean, stdDev) {
    return Math.abs((value - mean) / stdDev);
  }

  detectAnomalies(data) {
    if (data.length < 3) return [];
    
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    
    return data.map((value, index) => ({
      index,
      value,
      zScore: this.calculateZScore(value, mean, stdDev),
      isAnomaly: this.calculateZScore(value, mean, stdDev) > this.threshold
    })).filter(item => item.isAnomaly);
  }
}

// Time Series Analysis
export class TimeSeriesAnalysis {
  static decompose(data) {
    const trend = this.calculateTrend(data);
    const seasonal = this.calculateSeasonal(data, trend);
    const residual = data.map((val, i) => val - trend[i] - seasonal[i]);
    
    return { trend, seasonal, residual };
  }

  static calculateTrend(data) {
    const windowSize = Math.min(12, Math.floor(data.length / 4));
    const trend = [];
    
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(data.length, i + Math.floor(windowSize / 2) + 1);
      const window = data.slice(start, end);
      const average = window.reduce((sum, val) => sum + val, 0) / window.length;
      trend.push(average);
    }
    
    return trend;
  }

  static calculateSeasonal(data, trend) {
    const detrended = data.map((val, i) => val - trend[i]);
    const period = 12; // Assume monthly seasonality
    const seasonal = [];
    
    for (let i = 0; i < data.length; i++) {
      const seasonalIndex = i % period;
      const seasonalValues = detrended.filter((_, index) => index % period === seasonalIndex);
      const seasonalAverage = seasonalValues.reduce((sum, val) => sum + val, 0) / seasonalValues.length;
      seasonal.push(seasonalAverage);
    }
    
    return seasonal;
  }
}

// Financial Metrics Calculator
export class FinancialMetrics {
  static calculateROI(initialInvestment, finalValue) {
    return ((finalValue - initialInvestment) / initialInvestment) * 100;
  }

  static calculateNPV(cashFlows, discountRate) {
    return cashFlows.reduce((npv, cashFlow, period) => {
      return npv + (cashFlow / Math.pow(1 + discountRate, period));
    }, 0);
  }

  static calculateIRR(cashFlows, precision = 0.001) {
    let rate = 0.1; // Initial guess
    let npv = this.calculateNPV(cashFlows, rate);
    
    while (Math.abs(npv) > precision) {
      const derivative = this.calculateNPVDerivative(cashFlows, rate);
      rate = rate - npv / derivative;
      npv = this.calculateNPV(cashFlows, rate);
    }
    
    return rate * 100;
  }

  static calculateNPVDerivative(cashFlows, rate) {
    return cashFlows.reduce((derivative, cashFlow, period) => {
      return derivative - (period * cashFlow) / Math.pow(1 + rate, period + 1);
    }, 0);
  }

  static calculatePaybackPeriod(cashFlows) {
    let cumulativeCashFlow = 0;
    
    for (let period = 0; period < cashFlows.length; period++) {
      cumulativeCashFlow += cashFlows[period];
      if (cumulativeCashFlow >= 0) {
        return period;
      }
    }
    
    return -1; // No payback within the given period
  }
}

// Risk Assessment
export class RiskAssessment {
  static calculateVaR(returns, confidenceLevel = 0.95) {
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const index = Math.floor((1 - confidenceLevel) * sortedReturns.length);
    return sortedReturns[index];
  }

  static calculateSharpeRatio(returns, riskFreeRate = 0.02) {
    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    return (mean - riskFreeRate) / stdDev;
  }

  static calculateBeta(assetReturns, marketReturns) {
    const assetMean = assetReturns.reduce((sum, ret) => sum + ret, 0) / assetReturns.length;
    const marketMean = marketReturns.reduce((sum, ret) => sum + ret, 0) / marketReturns.length;
    
    let covariance = 0;
    let marketVariance = 0;
    
    for (let i = 0; i < assetReturns.length; i++) {
      covariance += (assetReturns[i] - assetMean) * (marketReturns[i] - marketMean);
      marketVariance += Math.pow(marketReturns[i] - marketMean, 2);
    }
    
    return covariance / marketVariance;
  }
}

// Export all utilities
export {
  LinearRegression,
  MovingAverage,
  ExponentialSmoothing,
  KMeans,
  AnomalyDetector,
  TimeSeriesAnalysis,
  FinancialMetrics,
  RiskAssessment
};
