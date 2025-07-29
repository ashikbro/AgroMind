const express = require('express');
const router = express.Router();
const {
  analyzeCropDisease,
  getDiagnosis,
  getDiagnosisHistory,
  addFollowUp,
  getAnalyticsData
} = require('../controllers/aiController');
const { auth } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// Disease analysis routes
router.post('/analyze-disease', 
  auth, 
  upload.array('images', 5), 
  handleMulterError,
  analyzeCropDisease
);

router.get('/diagnosis/:id', auth, getDiagnosis);
router.get('/diagnosis-history', auth, getDiagnosisHistory);

router.post('/diagnosis/:id/follow-up', 
  auth, 
  upload.array('images', 3), 
  handleMulterError,
  addFollowUp
);

router.get('/analytics', auth, getAnalyticsData);

module.exports = router;
