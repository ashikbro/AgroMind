const express = require('express');
const axios = require('axios');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Crop = require('../models/Crop');

// API Configuration for market data
const COMMODITY_API_KEY = process.env.COMMODITY_API_KEY || 'demo_key';
const AGRI_DATA_API_KEY = process.env.AGRI_DATA_API_KEY || 'demo_key';

// Market Price Schema (would typically be in models folder)
const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  previousPrice: {
    type: Number,
    default: 0
  },
  quality: {
    type: String,
    enum: ['Premium', 'Good', 'Standard', 'Below Standard'],
    default: 'Standard'
  },
  unit: {
    type: String,
    default: 'kg'
  },
  date: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'Market Survey'
  }
}, {
  timestamps: true
});

const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);

const priceAlertSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  targetPrice: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    enum: ['above', 'below'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  triggeredAt: Date
}, {
  timestamps: true
});

const PriceAlert = mongoose.model('PriceAlert', priceAlertSchema);

// Get current market prices
router.get('/prices', async (req, res) => {
  try {
    const { crop, location } = req.query;
    
    // Try to get real market data from agricultural commodity APIs
    let realPrices = [];
    
    if (COMMODITY_API_KEY && COMMODITY_API_KEY !== 'demo_key') {
      try {
        // Try multiple agricultural commodity data sources
        const commodityMapping = {
          'wheat': 'wheat',
          'rice': 'rice',
          'corn': 'corn',
          'soybeans': 'soybeans',
          'cotton': 'cotton',
          'tomato': 'tomatoes',
          'onion': 'onions',
          'potato': 'potatoes'
        };

        const requests = [];
        
        // Example API calls (you would replace with actual commodity API endpoints)
        if (crop && commodityMapping[crop.toLowerCase()]) {
          requests.push(
            axios.get(`https://api.marketstack.com/v1/eod/latest`, {
              params: {
                access_key: COMMODITY_API_KEY,
                symbols: `${commodityMapping[crop.toLowerCase()]}.COMM`,
                limit: 1
              }
            }).catch(() => null)
          );
        } else {
          // Get multiple commodity prices
          Object.keys(commodityMapping).forEach(cropType => {
            requests.push(
              axios.get(`https://api.marketstack.com/v1/eod/latest`, {
                params: {
                  access_key: COMMODITY_API_KEY,
                  symbols: `${commodityMapping[cropType]}.COMM`,
                  limit: 1
                }
              }).catch(() => null)
            );
          });
        }

        const responses = await Promise.all(requests);
        
        // Process real market data
        responses.forEach((response, index) => {
          if (response && response.data && response.data.data) {
            const marketData = response.data.data[0];
            if (marketData) {
              realPrices.push({
                cropName: Object.keys(commodityMapping)[index] || crop,
                location: location || 'Global Market',
                price: marketData.close || (Math.random() * 50 + 20),
                previousPrice: marketData.open || (Math.random() * 50 + 20),
                quality: 'Standard',
                updatedAt: new Date(),
                change: ((marketData.close - marketData.open) / marketData.open * 100).toFixed(2)
              });
            }
          }
        });

      } catch (apiError) {
        console.warn('Commodity API failed, falling back to database/mock data:', apiError.message);
      }
    }

    // If we have real data, use it; otherwise fall back to database or mock data
    if (realPrices.length > 0) {
      res.json({
        success: true,
        data: realPrices,
        source: 'live_market'
      });
      return;
    }

    // Fallback to database prices
    const query = {};
    if (crop) query.crop = crop;
    if (location) query.location = location;

    // Get the latest prices for each crop-location combination
    const prices = await MarketPrice.aggregate([
      { $match: query },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: { crop: '$crop', location: '$location' },
          price: { $first: '$price' },
          previousPrice: { $first: '$previousPrice' },
          quality: { $first: '$quality' },
          updatedAt: { $first: '$updatedAt' },
          cropId: { $first: '$crop' }
        }
      },
      {
        $lookup: {
          from: 'crops',
          localField: 'cropId',
          foreignField: '_id',
          as: 'cropInfo'
        }
      },
      {
        $project: {
          cropId: '$cropId',
          cropName: { $arrayElemAt: ['$cropInfo.name', 0] },
          location: '$_id.location',
          price: 1,
          previousPrice: 1,
          quality: 1,
          updatedAt: 1,
          change: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ['$price', '$previousPrice'] },
                      '$previousPrice'
                    ]
                  },
                  100
                ]
              },
              2
            ]
          }
        }
      }
    ]);

    // If no database prices, generate mock data
    if (prices.length === 0) {
      const mockCrops = ['Wheat', 'Rice', 'Corn', 'Tomato', 'Onion', 'Potato', 'Cotton', 'Soybeans'];
      const mockLocations = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'];
      
      const mockPrices = mockCrops.map(cropName => {
        const basePrice = Math.random() * 50 + 20;
        const previousPrice = basePrice + (Math.random() - 0.5) * 10;
        
        return {
          cropName,
          location: location || mockLocations[Math.floor(Math.random() * mockLocations.length)],
          price: Math.round(basePrice * 100) / 100,
          previousPrice: Math.round(previousPrice * 100) / 100,
          quality: ['Premium', 'Good', 'Standard'][Math.floor(Math.random() * 3)],
          updatedAt: new Date(),
          change: ((basePrice - previousPrice) / previousPrice * 100).toFixed(2)
        };
      });

      return res.json({
        success: true,
        data: mockPrices,
        source: 'mock_data'
      });
    }

    res.json({
      success: true,
      data: prices,
      source: 'database'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get market prices',
      error: error.message
    });
  }
});

// Get price history for a specific crop and location
router.get('/history', async (req, res) => {
  try {
    const { cropId, location, days = 30 } = req.query;
    
    if (!cropId || !location) {
      return res.status(400).json({
        success: false,
        message: 'Crop ID and location are required'
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const priceHistory = await MarketPrice.find({
      crop: cropId,
      location: location,
      date: { $gte: startDate }
    })
    .select('price date quality')
    .sort({ date: 1 });

    res.json({
      success: true,
      data: priceHistory
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get price history',
      error: error.message
    });
  }
});

// Get user's price alerts
router.get('/alerts', auth, async (req, res) => {
  try {
    const alerts = await PriceAlert.find({
      farmer: req.user._id,
      isActive: true
    })
    .populate('crop', 'name category')
    .sort({ createdAt: -1 });

    const alertsWithCropName = alerts.map(alert => ({
      ...alert.toObject(),
      cropName: alert.crop.name
    }));

    res.json({
      success: true,
      data: alertsWithCropName
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get price alerts',
      error: error.message
    });
  }
});

// Add new price alert
router.post('/alerts', auth, async (req, res) => {
  try {
    const alertData = {
      ...req.body,
      farmer: req.user._id,
      crop: req.body.cropId
    };

    const alert = new PriceAlert(alertData);
    await alert.save();
    
    await alert.populate('crop', 'name category');

    res.status(201).json({
      success: true,
      message: 'Price alert created successfully',
      data: alert
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create price alert',
      error: error.message
    });
  }
});

// Delete price alert
router.delete('/alerts/:id', auth, async (req, res) => {
  try {
    const alert = await PriceAlert.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user._id
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Price alert not found'
      });
    }

    res.json({
      success: true,
      message: 'Price alert deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete price alert',
      error: error.message
    });
  }
});

// Get market trends
router.get('/trends', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trends = await MarketPrice.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$crop',
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          priceChange: {
            $avg: {
              $subtract: ['$price', '$previousPrice']
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'crops',
          localField: '_id',
          foreignField: '_id',
          as: 'cropInfo'
        }
      },
      {
        $project: {
          cropName: { $arrayElemAt: ['$cropInfo.name', 0] },
          avgPrice: { $round: ['$avgPrice', 2] },
          minPrice: { $round: ['$minPrice', 2] },
          maxPrice: { $round: ['$maxPrice', 2] },
          priceChange: { $round: ['$priceChange', 2] },
          volatility: {
            $round: [
              { $divide: [{ $subtract: ['$maxPrice', '$minPrice'] }, '$avgPrice'] },
              3
            ]
          },
          dataPoints: '$count'
        }
      },
      {
        $sort: { avgPrice: -1 }
      }
    ]);

    res.json({
      success: true,
      data: trends
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get market trends',
      error: error.message
    });
  }
});

// Seed sample market data (for development)
router.post('/seed-data', async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Not allowed in production'
      });
    }

    const crops = await Crop.find().limit(10);
    const locations = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore'];
    
    const samplePrices = [];
    
    for (let crop of crops) {
      for (let location of locations) {
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          const basePrice = Math.floor(Math.random() * 50) + 20; // 20-70 per kg
          const price = basePrice + (Math.random() - 0.5) * 10; // Add some variation
          
          samplePrices.push({
            crop: crop._id,
            location: location,
            price: Math.max(price, 5), // Minimum 5 rupees
            previousPrice: Math.max(price - (Math.random() - 0.5) * 5, 5),
            quality: ['Premium', 'Good', 'Standard'][Math.floor(Math.random() * 3)],
            date: date
          });
        }
      }
    }
    
    await MarketPrice.deleteMany({}); // Clear existing data
    await MarketPrice.insertMany(samplePrices);

    res.json({
      success: true,
      message: `Inserted ${samplePrices.length} price records`,
      data: { count: samplePrices.length }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to seed market data',
      error: error.message
    });
  }
});

module.exports = router;
