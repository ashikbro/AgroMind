// Mock Market Service - No TensorFlow required

class MarketService {
  constructor() {
    this.priceCache = new Map();
    this.cacheTTL = 1000 * 60 * 15; // 15 minutes
    console.log('💹 Market Service initialized (Mock Mode)');
  }

  async getPredictions(crops, region) {
    console.log(`📈 Getting market predictions for crops: ${crops.join(', ')} in ${region}`);
    
    return crops.map(crop => ({
      crop,
      region,
      predictions: [
        {
          timeframe: '1_week',
          predictedPrice: Math.floor(Math.random() * 200) + 100, // $100-300
          confidence: 0.8 + Math.random() * 0.15, // 80-95%
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
          factors: [
            'Weather conditions',
            'Supply chain dynamics',
            'Global demand',
            'Seasonal patterns'
          ]
        },
        {
          timeframe: '1_month',
          predictedPrice: Math.floor(Math.random() * 220) + 90, // $90-310
          confidence: 0.7 + Math.random() * 0.2, // 70-90%
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
          factors: [
            'Market sentiment',
            'Export demand',
            'Currency fluctuations'
          ]
        },
        {
          timeframe: '3_months',
          predictedPrice: Math.floor(Math.random() * 250) + 80, // $80-330
          confidence: 0.6 + Math.random() * 0.25, // 60-85%
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
          factors: [
            'Planting intentions',
            'Policy changes',
            'Global trade patterns'
          ]
        }
      ],
      riskFactors: [
        {
          factor: 'Weather volatility',
          impact: 'high',
          probability: 0.3
        },
        {
          factor: 'Supply chain disruption',
          impact: 'medium',
          probability: 0.2
        }
      ],
      opportunities: [
        'Premium pricing for organic varieties',
        'Direct-to-consumer sales',
        'Export market expansion'
      ]
    }));
  }

  async getCurrentPrices(crops, region) {
    console.log(`💰 Getting current prices for crops: ${crops.join(', ')} in ${region}`);
    
    return crops.map(crop => ({
      crop,
      region,
      currentPrice: Math.floor(Math.random() * 200) + 100, // $100-300
      currency: 'USD',
      unit: 'per_ton',
      marketTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
      changePercent: (Math.random() - 0.5) * 20, // -10% to +10%
      volume: Math.floor(Math.random() * 10000) + 5000, // 5000-15000 tons
      lastUpdated: new Date(),
      priceBreakdown: {
        farmGate: Math.floor(Math.random() * 150) + 80,
        wholesale: Math.floor(Math.random() * 180) + 120,
        retail: Math.floor(Math.random() * 220) + 160
      },
      qualityPremiums: {
        organic: 1.2 + Math.random() * 0.3, // 20-50% premium
        nonGMO: 1.1 + Math.random() * 0.2, // 10-30% premium
        premium: 1.05 + Math.random() * 0.15 // 5-20% premium
      }
    }));
  }

  async getPriceHistory(crop, days) {
    console.log(`📊 Getting price history for ${crop} (${days} days)`);
    
    const history = [];
    const basePrice = Math.floor(Math.random() * 200) + 100;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some realistic price variation
      const variation = (Math.random() - 0.5) * 20; // ±10% daily variation
      const price = Math.max(basePrice + variation, 50); // Minimum $50
      
      history.push({
        date,
        price: Math.round(price * 100) / 100, // Round to 2 decimal places
        volume: Math.floor(Math.random() * 5000) + 1000, // 1000-6000 tons
        high: price * (1 + Math.random() * 0.05), // Up to 5% higher
        low: price * (1 - Math.random() * 0.05), // Up to 5% lower
        open: price * (1 + (Math.random() - 0.5) * 0.02), // ±1% from close
        close: price
      });
    }
    
    return history;
  }

  async analyzeMarket(crops, region) {
    console.log(`🔍 Analyzing market for crops: ${crops.join(', ')} in ${region}`);
    
    return {
      region,
      crops,
      analysis: {
        marketSentiment: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)],
        overallTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
        volatility: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        liquidity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
      },
      supplyDemand: {
        supply: {
          level: ['deficit', 'balanced', 'surplus'][Math.floor(Math.random() * 3)],
          trend: ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)],
          factors: [
            'Seasonal harvest patterns',
            'Weather impact on yields',
            'Import/export volumes'
          ]
        },
        demand: {
          level: ['weak', 'moderate', 'strong'][Math.floor(Math.random() * 3)],
          trend: ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)],
          factors: [
            'Consumer preferences',
            'Industrial usage',
            'Export demand'
          ]
        }
      },
      keyFactors: [
        {
          factor: 'Weather conditions',
          impact: 'high',
          description: 'Seasonal weather patterns affecting crop yields'
        },
        {
          factor: 'Global trade policies',
          impact: 'medium',
          description: 'International trade agreements and tariffs'
        },
        {
          factor: 'Currency fluctuations',
          impact: 'medium',
          description: 'Exchange rate variations affecting export competitiveness'
        }
      ],
      recommendations: [
        {
          action: 'timing',
          suggestion: 'Consider selling during peak demand periods',
          timeframe: 'next_2_weeks'
        },
        {
          action: 'hedging',
          suggestion: 'Use forward contracts to lock in favorable prices',
          timeframe: 'next_month'
        },
        {
          action: 'diversification',
          suggestion: 'Explore alternative crop varieties with better margins',
          timeframe: 'next_season'
        }
      ],
      priceTargets: {
        conservative: Math.floor(Math.random() * 180) + 120,
        optimistic: Math.floor(Math.random() * 250) + 200,
        timeframe: '3_months'
      }
    };
  }

  async getMarketNews(region, limit = 10) {
    console.log(`📰 Getting market news for ${region}`);
    
    const newsItems = [];
    const topics = [
      'Weather forecast impacts crop prices',
      'Export demand drives market rally',
      'New trade agreement signed',
      'Harvest season begins in major producing regions',
      'Supply chain improvements boost efficiency'
    ];
    
    for (let i = 0; i < limit; i++) {
      newsItems.push({
        id: Math.random().toString(36).substr(2, 9),
        title: topics[Math.floor(Math.random() * topics.length)],
        summary: 'Market analysis and price impact assessment...',
        source: 'AgroMind Market Intelligence',
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        impact: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
        relevance: 0.7 + Math.random() * 0.3
      });
    }
    
    return newsItems;
  }

  async getSeasonalTrends(crop, years = 5) {
    console.log(`📅 Getting seasonal trends for ${crop} (${years} years)`);
    
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return months.map(month => ({
      month,
      averagePrice: Math.floor(Math.random() * 200) + 100,
      priceRange: {
        min: Math.floor(Math.random() * 150) + 80,
        max: Math.floor(Math.random() * 250) + 150
      },
      volume: Math.floor(Math.random() * 20000) + 10000,
      volatility: 0.1 + Math.random() * 0.3, // 10-40%
      seasonalIndex: 0.8 + Math.random() * 0.4 // 80-120% of annual average
    }));
  }
}

module.exports = new MarketService();
