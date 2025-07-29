const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  scientificName: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Crop category is required'],
    enum: ['cereals', 'vegetables', 'fruits', 'legumes', 'cash-crops', 'spices', 'flowers']
  },
  varieties: [{
    name: String,
    characteristics: String,
    growthPeriod: Number, // in days
    yield: {
      min: Number,
      max: Number,
      unit: String
    }
  }],
  growthStages: [{
    stage: {
      type: String,
      enum: ['seedling', 'vegetative', 'flowering', 'fruiting', 'maturity']
    },
    duration: Number, // in days
    description: String,
    careInstructions: [String]
  }],
  season: {
    sowing: {
      kharif: Boolean,
      rabi: Boolean,
      zaid: Boolean
    },
    months: [String]
  },
  climate: {
    temperature: {
      min: Number,
      max: Number,
      optimal: Number
    },
    humidity: {
      min: Number,
      max: Number
    },
    rainfall: {
      min: Number,
      max: Number
    }
  },
  soil: {
    types: [{
      type: String,
      enum: ['clay', 'sandy', 'loamy', 'silt', 'peaty', 'chalky']
    }],
    ph: {
      min: Number,
      max: Number
    },
    drainage: {
      type: String,
      enum: ['well-drained', 'moderate', 'poor']
    }
  },
  irrigation: {
    requirement: {
      type: String,
      enum: ['high', 'moderate', 'low']
    },
    frequency: String,
    methods: [String]
  },
  fertilization: {
    organic: [String],
    chemical: [{
      name: String,
      quantity: String,
      timing: String
    }]
  },
  commonDiseases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disease'
  }],
  commonPests: [{
    name: String,
    symptoms: [String],
    treatment: [String]
  }],
  harvestInfo: {
    indicators: [String],
    storage: [String],
    processing: [String]
  },
  marketInfo: {
    price: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'INR' }
    },
    demand: {
      type: String,
      enum: ['high', 'moderate', 'low']
    },
    season: String
  },
  nutritionalValue: [{
    nutrient: String,
    value: Number,
    unit: String
  }],
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
cropSchema.index({ name: 1 });
cropSchema.index({ category: 1 });
cropSchema.index({ 'season.months': 1 });

module.exports = mongoose.model('Crop', cropSchema);
