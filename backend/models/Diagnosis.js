const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
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
  images: [{
    url: String,
    filename: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
    address: String
  },
  symptoms: {
    user_described: [String],
    ai_detected: [String]
  },
  aiAnalysis: {
    predictions: [{
      disease: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disease'
      },
      confidence: Number,
      severity: {
        type: String,
        enum: ['low', 'moderate', 'high', 'severe']
      }
    }],
    primaryDiagnosis: {
      disease: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disease'
      },
      confidence: Number
    },
    modelVersion: String,
    processingTime: Number, // in milliseconds
    analysisDate: { type: Date, default: Date.now }
  },
  expertReview: {
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    diagnosis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disease'
    },
    confidence: Number,
    notes: String,
    reviewDate: Date,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'needs-more-info'],
      default: 'pending'
    }
  },
  treatment: {
    recommended: [{
      method: String,
      products: [String],
      instructions: String,
      timeline: String
    }],
    applied: [{
      method: String,
      products: [String],
      appliedDate: Date,
      notes: String
    }]
  },
  followUp: [{
    date: Date,
    status: {
      type: String,
      enum: ['improved', 'same', 'worse', 'resolved']
    },
    images: [String],
    notes: String
  }],
  status: {
    type: String,
    enum: ['pending', 'diagnosed', 'treatment-applied', 'resolved', 'escalated'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Geospatial index for location
diagnosisSchema.index({ location: '2dsphere' });
diagnosisSchema.index({ farmer: 1, createdAt: -1 });
diagnosisSchema.index({ 'aiAnalysis.primaryDiagnosis.disease': 1 });

module.exports = mongoose.model('Diagnosis', diagnosisSchema);
