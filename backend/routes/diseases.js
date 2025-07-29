const express = require('express');
const router = express.Router();
const Disease = require('../models/Disease');
const { auth, optionalAuth } = require('../middleware/auth');

// Get all diseases
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { type, crop, search, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };

    if (type) {
      query.type = type;
    }

    if (crop) {
      query['affectedCrops.crop'] = crop;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { scientificName: { $regex: search, $options: 'i' } },
        { commonNames: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * parseInt(limit);

    const diseases = await Disease.find(query)
      .select('name scientificName type severity symptoms prevention images')
      .populate('affectedCrops.crop', 'name category')
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Disease.countDocuments(query);

    res.json({
      success: true,
      data: {
        diseases,
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
      message: 'Failed to get diseases',
      error: error.message
    });
  }
});

// Get disease by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id)
      .populate('affectedCrops.crop', 'name category scientificName');

    if (!disease || !disease.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Disease not found'
      });
    }

    res.json({
      success: true,
      data: { disease }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get disease',
      error: error.message
    });
  }
});

// Get disease types
router.get('/types/list', async (req, res) => {
  try {
    const types = await Disease.distinct('type', { isActive: true });
    
    res.json({
      success: true,
      data: { types }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get disease types',
      error: error.message
    });
  }
});

// Get diseases by crop
router.get('/crop/:cropId', async (req, res) => {
  try {
    const { cropId } = req.params;
    
    const diseases = await Disease.find({
      'affectedCrops.crop': cropId,
      isActive: true
    })
    .select('name type severity symptoms prevention treatment images')
    .sort({ severity: -1, name: 1 });

    res.json({
      success: true,
      data: { diseases }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get diseases for crop',
      error: error.message
    });
  }
});

module.exports = router;
