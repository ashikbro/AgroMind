const Diagnosis = require('../models/Diagnosis');
const Disease = require('../models/Disease');
const Crop = require('../models/Crop');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * @typedef {Object} DiagnosisPrediction
 * @property {string} diseaseName
 * @property {number} confidence
 * @property {'low'|'moderate'|'high'} severity
 */

/**
 * Simulated AI model for disease detection.
 * In production, this would integrate with TensorFlow.js, PyTorch, or an external AI service.
 *
 * @param {string} imagePath
 * @param {string} [cropType]
 * @param {string} [symptoms]
 * @returns {Promise<{
 *   predictions: DiagnosisPrediction[],
 *   primaryDiagnosis: { disease: string, confidence: number },
 *   treatmentRecommendations: Record<string, unknown>,
 *   modelVersion: string,
 *   processingTime: number,
 *   analysisMetadata: Record<string, unknown>
 * }>}
 */
const simulateAIAnalysis = async (imagePath, cropType, symptoms) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Get diseases based on crop type if provided
  let diseaseQuery = { isActive: true };
  if (cropType) {
    const crop = await Crop.findOne({ name: new RegExp(cropType, 'i') });
    if (crop) {
      diseaseQuery['affectedCrops.crop'] = crop._id;
    }
  }
  
  const diseases = await Disease.find(diseaseQuery).limit(3);
  
  const predictions = diseases.map((disease, index) => ({
    disease: disease._id,
    diseaseName: disease.name,
    confidence: Math.random() * 0.4 + 0.6 - (index * 0.1), // Random confidence between 0.6-1.0
    severity: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)]
  }));
  
  // Sort by confidence
  predictions.sort((a, b) => b.confidence - a.confidence);
  
  // Generate treatment recommendations based on primary diagnosis
  const primaryDisease = await Disease.findById(predictions[0]?.disease);
  
  const treatmentRecommendations = primaryDisease ? {
    immediate: [
      'Remove affected leaves immediately',
      'Improve air circulation around plants',
      'Avoid overhead watering'
    ],
    treatment: primaryDisease.treatment || 'Apply appropriate fungicide or treatment as recommended',
    prevention: primaryDisease.prevention || [
      'Maintain proper plant spacing',
      'Water at soil level',
      'Remove crop debris',
      'Use disease-resistant varieties'
    ]
  } : {
    immediate: ['Isolate affected plants', 'Monitor for spread'],
    treatment: 'Consult with agricultural expert for specific treatment',
    prevention: ['Follow good agricultural practices']
  };
  
  return {
    predictions,
    primaryDiagnosis: {
      disease: predictions[0]?.diseaseName || 'Disease detected',
      confidence: Math.round((predictions[0]?.confidence || 0.85) * 100)
    },
    treatmentRecommendations,
    modelVersion: '1.0.0',
    processingTime: Math.random() * 3000 + 1000,
    analysisMetadata: {
      cropType: cropType || 'Unknown',
      symptomsProvided: !!symptoms,
      imageQuality: 'Good',
      analysisDate: new Date().toISOString()
    }
  };
};

/**
 * Process and optimize an uploaded crop image for diagnosis.
 *
 * @param {string} inputPath
 * @param {string} outputPath
 * @returns {Promise<string>}
 */
const processImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize(512, 512, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error('Failed to process image');
  }
};

/**
 * Analyze crop disease from uploaded images and return a diagnosis report.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
const analyzeCropDisease = async (req, res) => {
  try {
    const { cropType, symptoms } = req.body;
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized user'
      });
      return;
    }

    const userId = req.user._id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required for analysis'
      });
    }

    // Find crop if specified
    let crop = null;
    if (cropType) {
      crop = await Crop.findOne({ name: new RegExp(cropType, 'i') });
    }

    // Process uploaded images
    const processedImages = [];
    for (const file of req.files) {
      const processedPath = path.join(
        path.dirname(file.path),
        `processed_${file.filename}`
      );
      
      await processImage(file.path, processedPath);
      
      processedImages.push({
        url: `/uploads/${path.basename(processedPath)}`,
        filename: path.basename(processedPath),
        uploadedAt: new Date()
      });
    }

    // Create diagnosis record
    const diagnosis = new Diagnosis({
      farmer: userId,
      crop: crop?._id,
      images: processedImages,
      symptoms: {
        user_described: symptoms ? [symptoms] : []
      }
    });

    // Perform AI analysis with crop type and symptoms
    const aiAnalysis = await simulateAIAnalysis(req.files[0].path, cropType, symptoms);
    diagnosis.aiAnalysis = aiAnalysis;

    // Confidence is stored as an integer percentage (0-100).
    if (aiAnalysis.primaryDiagnosis.confidence > 85) {
      diagnosis.status = 'diagnosed';
    } else if (aiAnalysis.primaryDiagnosis.confidence > 60) {
      diagnosis.status = 'pending';
      diagnosis.priority = 'medium';
    } else {
      diagnosis.status = 'escalated';
      diagnosis.priority = 'high';
    }

    await diagnosis.save();

    // Populate the diagnosis with related data
    const populatedDiagnosis = await Diagnosis.findById(diagnosis._id)
      .populate('crop', 'name category')
      .populate('aiAnalysis.predictions.disease', 'name type symptoms treatment')
      .populate('aiAnalysis.primaryDiagnosis.disease', 'name type symptoms treatment prevention');

    res.status(201).json({
      success: true,
      message: 'Disease analysis completed',
      data: {
        diagnosis: populatedDiagnosis
      }
    });

  } catch (error) {
    console.error('Disease analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze crop disease',
      error: error.message
    });
  }
};

/**
 * Fetch a diagnosis by id for the authenticated farmer.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
const getDiagnosis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const diagnosis = await Diagnosis.findOne({
      _id: id,
      farmer: userId
    })
    .populate('crop', 'name category scientificName')
    .populate('aiAnalysis.predictions.disease', 'name type symptoms treatment prevention')
    .populate('aiAnalysis.primaryDiagnosis.disease', 'name type symptoms treatment prevention')
    .populate('expertReview.expert', 'name email role');

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        message: 'Diagnosis not found'
      });
    }

    res.json({
      success: true,
      data: {
        diagnosis
      }
    });

  } catch (error) {
    console.error('Get diagnosis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get diagnosis',
      error: error.message
    });
  }
};

/**
 * Get paginated diagnosis history for the authenticated farmer.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
const getDiagnosisHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status, crop } = req.query;

    const query = { farmer: userId };
    
    if (status) {
      query.status = status;
    }
    
    if (crop) {
      query.crop = crop;
    }

    // Guard against invalid pagination values from query parameters.
    const parsedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 10, 1), 100);
    const skip = (parsedPage - 1) * parsedLimit;

    const diagnoses = await Diagnosis.find(query)
      .populate('crop', 'name category')
      .populate('aiAnalysis.primaryDiagnosis.disease', 'name type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit);

    const total = await Diagnosis.countDocuments(query);

    res.json({
      success: true,
      data: {
        diagnoses,
        pagination: {
        currentPage: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
          totalItems: total,
        itemsPerPage: parsedLimit
        }
      }
    });

  } catch (error) {
    console.error('Get diagnosis history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get diagnosis history',
      error: error.message
    });
  }
};

/**
 * Add follow-up status and notes to an existing diagnosis.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
const addFollowUp = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user._id;

    const diagnosis = await Diagnosis.findOne({
      _id: id,
      farmer: userId
    });

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        message: 'Diagnosis not found'
      });
    }

    // Process follow-up images if provided
    const followUpImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const processedPath = path.join(
          path.dirname(file.path),
          `followup_${file.filename}`
        );
        
        await processImage(file.path, processedPath);
        followUpImages.push(`/uploads/${path.basename(processedPath)}`);
      }
    }

    // Add follow-up entry
    diagnosis.followUp.push({
      date: new Date(),
      status,
      images: followUpImages,
      notes
    });

    // Update overall diagnosis status if resolved
    if (status === 'resolved') {
      diagnosis.status = 'resolved';
    }

    await diagnosis.save();

    res.json({
      success: true,
      message: 'Follow-up added successfully',
      data: {
        diagnosis
      }
    });

  } catch (error) {
    console.error('Add follow-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add follow-up',
      error: error.message
    });
  }
};

/**
 * Return AI diagnosis analytics for the authenticated farmer.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
const getAnalyticsData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get diagnosis counts by status
    const statusCounts = await Diagnosis.aggregate([
      { $match: { farmer: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get most common diseases
    const commonDiseases = await Diagnosis.aggregate([
      { $match: { farmer: userId, 'aiAnalysis.primaryDiagnosis.disease': { $exists: true } } },
      { $group: { _id: '$aiAnalysis.primaryDiagnosis.disease', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'diseases', localField: '_id', foreignField: '_id', as: 'disease' } },
      { $unwind: '$disease' },
      { $project: { name: '$disease.name', count: 1 } }
    ]);

    // Get monthly diagnosis trends
    const monthlyTrends = await Diagnosis.aggregate([
      { $match: { farmer: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        statusCounts,
        commonDiseases,
        monthlyTrends
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics data',
      error: error.message
    });
  }
};

module.exports = {
  analyzeCropDisease,
  getDiagnosis,
  getDiagnosisHistory,
  addFollowUp,
  getAnalyticsData
};
