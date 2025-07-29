const express = require('express');
const router = express.Router();
const Diagnosis = require('../models/Diagnosis');
const User = require('../models/User');
const Crop = require('../models/Crop');
const Disease = require('../models/Disease');
const { auth, authorize } = require('../middleware/auth');

// Get user analytics
router.get('/user', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Total diagnoses
    const totalDiagnoses = await Diagnosis.countDocuments({ farmer: userId });

    // Diagnoses by status
    const diagnosisByStatus = await Diagnosis.aggregate([
      { $match: { farmer: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Most common diseases detected
    const commonDiseases = await Diagnosis.aggregate([
      { 
        $match: { 
          farmer: userId,
          'aiAnalysis.primaryDiagnosis.disease': { $exists: true }
        }
      },
      { 
        $group: { 
          _id: '$aiAnalysis.primaryDiagnosis.disease', 
          count: { $sum: 1 },
          avgConfidence: { $avg: '$aiAnalysis.primaryDiagnosis.confidence' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'diseases',
          localField: '_id',
          foreignField: '_id',
          as: 'disease'
        }
      },
      { $unwind: '$disease' },
      {
        $project: {
          name: '$disease.name',
          type: '$disease.type',
          count: 1,
          avgConfidence: 1
        }
      }
    ]);

    // Crops analyzed
    const cropsAnalyzed = await Diagnosis.aggregate([
      { $match: { farmer: userId } },
      { $group: { _id: '$crop', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'crops',
          localField: '_id',
          foreignField: '_id',
          as: 'crop'
        }
      },
      { $unwind: '$crop' },
      {
        $project: {
          name: '$crop.name',
          category: '$crop.category',
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Monthly analysis trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await Diagnosis.aggregate([
      { 
        $match: { 
          farmer: userId,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalDiagnoses,
        diagnosisByStatus,
        commonDiseases,
        cropsAnalyzed,
        monthlyTrends
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics',
      error: error.message
    });
  }
});

// Get admin analytics
router.get('/admin', auth, authorize('admin'), async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments({ isActive: true });

    // Users by role
    const usersByRole = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Total diagnoses
    const totalDiagnoses = await Diagnosis.countDocuments();

    // Diagnoses this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const diagnosesThisMonth = await Diagnosis.countDocuments({
      createdAt: { $gte: thisMonth }
    });

    // Most detected diseases
    const topDiseases = await Diagnosis.aggregate([
      { 
        $match: { 
          'aiAnalysis.primaryDiagnosis.disease': { $exists: true }
        }
      },
      { 
        $group: { 
          _id: '$aiAnalysis.primaryDiagnosis.disease', 
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'diseases',
          localField: '_id',
          foreignField: '_id',
          as: 'disease'
        }
      },
      { $unwind: '$disease' },
      {
        $project: {
          name: '$disease.name',
          type: '$disease.type',
          count: 1
        }
      }
    ]);

    // Most analyzed crops
    const topCrops = await Diagnosis.aggregate([
      { $group: { _id: '$crop', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'crops',
          localField: '_id',
          foreignField: '_id',
          as: 'crop'
        }
      },
      { $unwind: '$crop' },
      {
        $project: {
          name: '$crop.name',
          category: '$crop.category',
          count: 1
        }
      }
    ]);

    // Daily diagnosis trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyTrends = await Diagnosis.aggregate([
      { 
        $match: { 
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Geographic distribution
    const geographicData = await User.aggregate([
      { 
        $match: { 
          isActive: true,
          'farmDetails.location.state': { $exists: true }
        }
      },
      { 
        $group: { 
          _id: '$farmDetails.location.state', 
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        usersByRole,
        totalDiagnoses,
        diagnosesThisMonth,
        topDiseases,
        topCrops,
        dailyTrends,
        geographicData
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get admin analytics',
      error: error.message
    });
  }
});

// Get system health
router.get('/health', auth, authorize('admin'), async (req, res) => {
  try {
    const dbStats = {
      users: await User.countDocuments(),
      activeUsers: await User.countDocuments({ isActive: true }),
      crops: await Crop.countDocuments({ isActive: true }),
      diseases: await Disease.countDocuments({ isActive: true }),
      diagnoses: await Diagnosis.countDocuments(),
      pendingDiagnoses: await Diagnosis.countDocuments({ status: 'pending' })
    };

    // Recent activity
    const recentActivity = await Diagnosis.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('farmer', 'name email')
      .populate('crop', 'name category')
      .select('farmer crop status createdAt');

    res.json({
      success: true,
      data: {
        dbStats,
        recentActivity,
        serverUptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get system health',
      error: error.message
    });
  }
});

module.exports = router;
