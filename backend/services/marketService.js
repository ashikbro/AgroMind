const axios = require('axios');
const tf = require('@tensorflow/tfjs-node');
const { LinearRegression } = require('ml-regression');

class MarketService {
  constructor() {
    this.marketData = new Map();
    this.priceHistory = new Map();
    this.predictiveModels = new Map();
    this.marketAPIs = {
      commodities: process.env.COMMODITIES_API || 'https://api.commodities-api.com',
      agriculture: process.env.AGRICULTURE_API || 'https://api.agriculture.gov',
      weather: process.env.WEATHER_API || 'https://api.openweathermap.org'
    };
    
    this.initializeMarketData();
    this.startPriceTracking();
  }

  // Initialize market data collection
  async initializeMarketData() {
    const crops = ['wheat', 'corn', 'rice', 'soybeans', 'barley', 'oats'];
    
    for (const crop of crops) {
      await this.loadHistoricalPrices(crop);
      await this.trainPredictionModel(crop);
    }
  }

  // Get current market prices
  async getCurrentPrices(crops, region = 'US') {
    const prices = [];
    
    for (const crop of crops) {
      try {
        const priceData = await this.fetchCurrentPrice(crop, region);
        prices.push(priceData);
      } catch (error) {
        console.error(`Error fetching price for ${crop}:`, error);
        // Use cached data if available
        const cached = this.getCachedPrice(crop, region);
        if (cached) prices.push(cached);
      }
    }
    
    return prices;
  }

  // Fetch current price from external APIs
  async fetchCurrentPrice(crop, region) {
    // Try multiple data sources
    const sources = [
      () => this.fetchFromCommoditiesAPI(crop, region),
      () => this.fetchFromAgricultureAPI(crop, region),
      () => this.fetchFromMarketDataAPI(crop, region)
    ];
    
    for (const source of sources) {
      try {
        const price = await source();
        if (price) {
          this.cachePriceData(crop, region, price);
          return price;
        }
      } catch (error) {
        console.warn(`Price source failed for ${crop}:`, error.message);
      }
    }
    
    throw new Error(`Unable to fetch current price for ${crop}`);
  }

  // Fetch from Commodities API
  async fetchFromCommoditiesAPI(crop, region) {
    const response = await axios.get(`${this.marketAPIs.commodities}/v1/latest`, {
      params: {
        access_key: process.env.COMMODITIES_API_KEY,
        symbols: this.getCommoditySymbol(crop),
        base: 'USD'
      }
    });
    
    if (response.data && response.data.rates) {
      const symbol = this.getCommoditySymbol(crop);
      const rate = response.data.rates[symbol];
      
      return {
        crop,
        price: rate,
        currency: 'USD',
        unit: this.getCropUnit(crop),
        timestamp: new Date(response.data.timestamp * 1000),
        source: 'commodities-api',
        region
      };
    }
    
    return null;
  }

  // Fetch from Agriculture API
  async fetchFromAgricultureAPI(crop, region) {
    // Mock implementation - replace with actual agriculture API
    const mockPrices = {
      wheat: 7.5 + Math.random() * 2,
      corn: 6.2 + Math.random() * 1.5,
      rice: 14.8 + Math.random() * 3,
      soybeans: 15.2 + Math.random() * 2.5,
      barley: 5.8 + Math.random() * 1.2,
      oats: 4.9 + Math.random() * 1
    };
    
    return {
      crop,
      price: mockPrices[crop] || Math.random() * 10,
      currency: 'USD',
      unit: this.getCropUnit(crop),
      timestamp: new Date(),
      source: 'agriculture-gov',
      region
    };
  }

  // Fetch from Market Data API
  async fetchFromMarketDataAPI(crop, region) {
    // Mock implementation for additional market data
    const basePrice = this.getBasePriceForCrop(crop);
    const volatility = Math.random() * 0.2 - 0.1; // ±10% volatility
    
    return {
      crop,
      price: basePrice * (1 + volatility),
      currency: 'USD',
      unit: this.getCropUnit(crop),
      timestamp: new Date(),
      source: 'market-data-api',
      region,
      volatility: Math.abs(volatility)
    };
  }

  // Get price history
  async getPriceHistory(crop, days = 30) {
    const history = this.priceHistory.get(crop) || [];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return history
      .filter(entry => entry.timestamp >= cutoff)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  // Generate market predictions
  async getPredictions(crops, region) {
    const predictions = [];
    
    for (const crop of crops) {
      try {
        const prediction = await this.generatePrediction(crop, region);
        predictions.push(prediction);
      } catch (error) {
        console.error(`Error generating prediction for ${crop}:`, error);
      }
    }
    
    return predictions;
  }

  // Generate individual crop prediction
  async generatePrediction(crop, region) {
    const model = this.predictiveModels.get(crop);
    const currentPrice = await this.fetchCurrentPrice(crop, region);
    const historicalData = await this.getPriceHistory(crop, 90);
    
    if (!model || !historicalData.length) {
      throw new Error(`Insufficient data for ${crop} prediction`);
    }
    
    // Prepare features for prediction
    const features = await this.preparePredictionFeatures(crop, region);
    const prediction = await model.predict(features);
    
    // Calculate confidence based on historical accuracy
    const confidence = this.calculatePredictionConfidence(crop, historicalData);
    
    // Analyze factors affecting price
    const factors = await this.analyzePriceFactors(crop, region);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(currentPrice, prediction, factors);
    
    return {
      crop,
      currentPrice: currentPrice.price,
      predictedPrice: prediction,
      priceChange: ((prediction - currentPrice.price) / currentPrice.price) * 100,
      confidence,
      timeframe: '30_days',
      factors,
      recommendations,
      generatedAt: new Date()
    };
  }

  // Prepare features for ML prediction
  async preparePredictionFeatures(crop, region) {
    const features = [];
    
    // Historical price trends
    const history = await this.getPriceHistory(crop, 30);
    const priceMA7 = this.calculateMovingAverage(history, 7);
    const priceMA14 = this.calculateMovingAverage(history, 14);
    const priceMA30 = this.calculateMovingAverage(history, 30);
    
    features.push(priceMA7, priceMA14, priceMA30);
    
    // Seasonal factors
    const month = new Date().getMonth();
    const seasonalIndex = this.getSeasonalIndex(crop, month);
    features.push(seasonalIndex);
    
    // Weather data
    const weather = await this.getWeatherData(region);
    features.push(weather.temperature, weather.rainfall, weather.humidity);
    
    // Economic indicators
    const economic = await this.getEconomicIndicators();
    features.push(economic.inflation, economic.gdp, economic.unemployment);
    
    // Supply and demand indicators
    const supply = await this.getSupplyIndicators(crop);
    const demand = await this.getDemandIndicators(crop);
    features.push(supply.production, supply.inventory, demand.consumption, demand.exports);
    
    return features;
  }

  // Train prediction model using TensorFlow.js
  async trainPredictionModel(crop) {
    const historicalData = await this.loadHistoricalPrices(crop);
    
    if (historicalData.length < 100) {
      console.warn(`Insufficient data to train model for ${crop}`);
      return;
    }
    
    // Prepare training data
    const { xs, ys } = this.prepareTrainingData(historicalData);
    
    // Create neural network model
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [xs.shape[1]], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.1 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' })
      ]
    });
    
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });
    
    // Train the model
    await model.fit(xs, ys, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      verbose: 0
    });
    
    this.predictiveModels.set(crop, model);
    console.log(`Trained prediction model for ${crop}`);
  }

  // Prepare training data for ML model
  prepareTrainingData(data) {
    const features = [];
    const targets = [];
    const lookback = 14; // Use 14 days of history to predict next day
    
    for (let i = lookback; i < data.length; i++) {
      const featureWindow = data.slice(i - lookback, i);
      const targetPrice = data[i].price;
      
      const feature = [
        ...featureWindow.map(d => d.price),
        ...featureWindow.map(d => d.volume || 0),
        featureWindow[featureWindow.length - 1].seasonalIndex || 0
      ];
      
      features.push(feature);
      targets.push(targetPrice);
    }
    
    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(targets, [targets.length, 1]);
    
    return { xs, ys };
  }

  // Analyze factors affecting price
  async analyzePriceFactors(crop, region) {
    const weather = await this.getWeatherData(region);
    const demand = await this.getDemandForecast(crop);
    const supply = await this.getSupplyForecast(crop);
    const seasonal = this.getSeasonalTrend(crop);
    const economic = await this.getEconomicIndicators();
    
    return {
      weather: {
        impact: this.calculateWeatherImpact(crop, weather),
        description: this.getWeatherDescription(weather),
        risk: this.assessWeatherRisk(crop, weather)
      },
      demand: {
        forecast: demand.growth,
        drivers: demand.drivers,
        confidence: demand.confidence
      },
      supply: {
        forecast: supply.growth,
        factors: supply.factors,
        risks: supply.risks
      },
      seasonal: {
        trend: seasonal.trend,
        strength: seasonal.strength,
        peak: seasonal.peak
      },
      economic: {
        inflation: economic.inflation,
        gdp: economic.gdp,
        currency: economic.currency,
        impact: this.calculateEconomicImpact(economic)
      }
    };
  }

  // Generate trading recommendations
  generateRecommendations(currentPrice, predictedPrice, factors) {
    const recommendations = [];
    const priceChange = ((predictedPrice - currentPrice.price) / currentPrice.price) * 100;
    
    // Price trend recommendations
    if (priceChange > 5) {
      recommendations.push('Consider holding inventory for better prices');
      recommendations.push('Delay selling if possible');
    } else if (priceChange < -5) {
      recommendations.push('Consider selling current inventory');
      recommendations.push('Hedge against further price decline');
    } else {
      recommendations.push('Price expected to remain stable');
    }
    
    // Weather-based recommendations
    if (factors.weather.risk === 'HIGH') {
      recommendations.push('Monitor weather conditions closely');
      recommendations.push('Consider crop insurance');
    }
    
    // Seasonal recommendations
    if (factors.seasonal.trend === 'INCREASING') {
      recommendations.push('Take advantage of seasonal demand');
    }
    
    // Economic recommendations
    if (factors.economic.impact > 0.1) {
      recommendations.push('Monitor economic indicators');
      recommendations.push('Consider currency hedging');
    }
    
    return recommendations;
  }

  // Market Analysis
  async analyzeMarket(crops, region) {
    const analysis = {
      overview: await this.generateMarketOverview(crops, region),
      trends: await this.analyzeTrends(crops),
      opportunities: await this.identifyOpportunities(crops, region),
      risks: await this.assessMarketRisks(crops, region),
      recommendations: await this.generateMarketRecommendations(crops, region),
      generatedAt: new Date()
    };
    
    return analysis;
  }

  // Utility Methods
  getCommoditySymbol(crop) {
    const symbols = {
      wheat: 'WHEAT',
      corn: 'CORN',
      rice: 'RICE',
      soybeans: 'SOYBEANS',
      barley: 'BARLEY',
      oats: 'OATS'
    };
    return symbols[crop] || crop.toUpperCase();
  }

  getCropUnit(crop) {
    return 'bushel'; // Standard unit, could be customized per crop
  }

  getBasePriceForCrop(crop) {
    const basePrices = {
      wheat: 7.5,
      corn: 6.2,
      rice: 14.8,
      soybeans: 15.2,
      barley: 5.8,
      oats: 4.9
    };
    return basePrices[crop] || 8.0;
  }

  calculateMovingAverage(data, period) {
    if (data.length < period) return 0;
    
    const recent = data.slice(-period);
    const sum = recent.reduce((acc, item) => acc + item.price, 0);
    return sum / period;
  }

  getSeasonalIndex(crop, month) {
    // Simplified seasonal index based on typical crop cycles
    const seasonalPatterns = {
      wheat: [0.9, 0.85, 0.8, 0.75, 0.8, 0.9, 1.1, 1.2, 1.15, 1.0, 0.95, 0.9],
      corn: [0.95, 0.9, 0.85, 0.8, 0.85, 0.95, 1.1, 1.2, 1.25, 1.1, 1.0, 0.95],
      rice: [1.0, 0.95, 0.9, 0.85, 0.9, 1.0, 1.1, 1.15, 1.1, 1.05, 1.0, 1.0],
      soybeans: [0.9, 0.85, 0.8, 0.8, 0.85, 0.95, 1.1, 1.2, 1.25, 1.15, 1.0, 0.95]
    };
    
    return seasonalPatterns[crop]?.[month] || 1.0;
  }

  calculatePredictionConfidence(crop, historicalData) {
    if (historicalData.length < 10) return 0.5;
    
    // Calculate based on price volatility and data consistency
    const prices = historicalData.map(d => d.price);
    const mean = prices.reduce((a, b) => a + b) / prices.length;
    const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance) / mean;
    
    // Lower volatility = higher confidence
    return Math.max(0.1, Math.min(0.95, 1 - volatility));
  }

  cachePriceData(crop, region, priceData) {
    const key = `${crop}_${region}`;
    
    if (!this.marketData.has(key)) {
      this.marketData.set(key, []);
    }
    
    const data = this.marketData.get(key);
    data.push(priceData);
    
    // Keep only last 1000 entries
    if (data.length > 1000) {
      data.shift();
    }
    
    // Also update price history
    if (!this.priceHistory.has(crop)) {
      this.priceHistory.set(crop, []);
    }
    
    const history = this.priceHistory.get(crop);
    history.push({
      price: priceData.price,
      timestamp: priceData.timestamp,
      volume: priceData.volume || 0
    });
    
    if (history.length > 1000) {
      history.shift();
    }
  }

  getCachedPrice(crop, region) {
    const key = `${crop}_${region}`;
    const data = this.marketData.get(key);
    return data && data.length > 0 ? data[data.length - 1] : null;
  }

  async loadHistoricalPrices(crop) {
    // Mock historical data generation
    const data = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 2);
    
    const basePrice = this.getBasePriceForCrop(crop);
    
    for (let i = 0; i < 730; i++) { // 2 years of daily data
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const trend = Math.sin(i / 365 * 2 * Math.PI) * 0.2; // Yearly cycle
      const noise = (Math.random() - 0.5) * 0.1; // Random noise
      const price = basePrice * (1 + trend + noise);
      
      data.push({
        date,
        price,
        volume: Math.floor(Math.random() * 10000) + 1000,
        timestamp: date
      });
    }
    
    this.priceHistory.set(crop, data);
    return data;
  }

  // Mock data methods (replace with actual API calls)
  async getWeatherData(region) {
    return {
      temperature: 22 + Math.random() * 10,
      rainfall: Math.random() * 50,
      humidity: 50 + Math.random() * 30
    };
  }

  async getEconomicIndicators() {
    return {
      inflation: 2.5 + Math.random() * 2,
      gdp: 2.0 + Math.random() * 3,
      unemployment: 3.5 + Math.random() * 2,
      currency: 1.0 + (Math.random() - 0.5) * 0.1
    };
  }

  async getSupplyIndicators(crop) {
    return {
      production: 100 + Math.random() * 20,
      inventory: 80 + Math.random() * 40
    };
  }

  async getDemandIndicators(crop) {
    return {
      consumption: 95 + Math.random() * 10,
      exports: 20 + Math.random() * 10
    };
  }

  // Start periodic price tracking
  startPriceTracking() {
    setInterval(async () => {
      await this.updateMarketPrices();
    }, 300000); // Every 5 minutes
  }

  async updateMarketPrices() {
    const crops = ['wheat', 'corn', 'rice', 'soybeans'];
    
    for (const crop of crops) {
      try {
        const price = await this.fetchCurrentPrice(crop, 'US');
        // Broadcast price update via WebSocket/GraphQL subscription
        require('../pubsub').publishMarketUpdate(crop, price);
      } catch (error) {
        console.error(`Failed to update price for ${crop}:`, error);
      }
    }
  }
}

module.exports = new MarketService();
