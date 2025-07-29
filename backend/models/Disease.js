const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Disease name is required'],
    trim: true
  },
  scientificName: {
    type: String,
    trim: true
  },
  commonNames: [String],
  type: {
    type: String,
    required: [true, 'Disease type is required'],
    enum: ['fungal', 'bacterial', 'viral', 'nutritional', 'pest', 'environmental']
  },
  causativeAgent: {
    name: String,
    type: String
  },
  affectedCrops: [{
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'moderate', 'high', 'severe'],
      default: 'moderate'
    }
  }],
  symptoms: {
    early: [String],
    advanced: [String],
    visual: [{
      description: String,
      images: [String]
    }]
  },
  conditions: {
    temperature: {
      min: Number,
      max: Number
    },
    humidity: {
      min: Number,
      max: Number
    },
    weather: [String],
    season: [String]
  },
  transmission: {
    method: [String],
    vector: [String],
    speed: {
      type: String,
      enum: ['slow', 'moderate', 'fast', 'very-fast']
    }
  },
  prevention: {
    cultural: [String],
    biological: [String],
    chemical: [String],
    resistant_varieties: [String]
  },
  treatment: {
    organic: [{
      method: String,
      ingredients: [String],
      preparation: String,
      application: String,
      frequency: String
    }],
    chemical: [{
      product: String,
      activeIngredient: String,
      dosage: String,
      application: String,
      frequency: String,
      safety: [String]
    }],
    cultural: [String]
  },
  severity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'severe'],
    default: 'moderate'
  },
  economicImpact: {
    yieldLoss: {
      min: Number,
      max: Number
    },
    qualityImpact: String
  },
  distribution: {
    regions: [String],
    countries: [String]
  },
  images: [{
    url: String,
    description: String,
    stage: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
diseaseSchema.index({ name: 1 });
diseaseSchema.index({ type: 1 });
diseaseSchema.index({ 'affectedCrops.crop': 1 });

module.exports = mongoose.model('Disease', diseaseSchema);
