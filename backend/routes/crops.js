const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const { auth, optionalAuth } = require('../middleware/auth');

// Get all crops
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, season, search, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (season) {
      query['season.months'] = { $in: [season] };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { scientificName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * parseInt(limit);

    const crops = await Crop.find(query)
      .select('name scientificName category season climate images')
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Crop.countDocuments(query);

    res.json({
      success: true,
      data: {
        crops,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get crops',
      error: error.message
    });
  }
});

// Get crop by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id)
      .populate('commonDiseases', 'name type symptoms prevention treatment');

    if (!crop || !crop.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.json({
      success: true,
      data: { crop }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get crop',
      error: error.message
    });
  }
});

// Get crop categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Crop.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: { categories }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error.message
    });
  }
});

// Get seasonal crops
router.get('/seasonal/:season', async (req, res) => {
  try {
    const { season } = req.params;
    
    const crops = await Crop.find({
      'season.months': { $in: [season] },
      isActive: true
    })
    .select('name category climate season images')
    .sort({ name: 1 });

    res.json({
      success: true,
      data: { crops }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get seasonal crops',
      error: error.message
    });
  }
});

// Add new crop (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can add crops'
      });
    }

    const crop = new Crop(req.body);
    await crop.save();

    res.status(201).json({
      success: true,
      message: 'Crop added successfully',
      data: { crop }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add crop',
      error: error.message
    });
  }
});

module.exports = router;
