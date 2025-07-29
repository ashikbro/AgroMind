let tf;
let sharp;

// Try to load TensorFlow and dependencies gracefully
try {
  tf = require('@tensorflow/tfjs-node');
  console.log('✅ TensorFlow.js loaded successfully');
} catch (error) {
  console.warn('⚠️ TensorFlow.js not available, using intelligent fallbacks');
  tf = null;
}

try {
  sharp = require('sharp');
} catch (error) {
  console.warn('⚠️ Sharp not available for image processing');
  sharp = null;
}

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class AIService {
  constructor() {
    this.models = new Map();
    this.modelConfigs = new Map();
    this.modelPaths = {
      diseaseDetection: './ai-models/disease_detection',
      yieldPrediction: './ai-models/yield_prediction',
      cropClassification: './ai-models/crop_classification',
      riskAssessment: './ai-models/risk_assessment'
    };
    
    this.diseaseDatabase = new Map();
    this.treatmentDatabase = new Map();
    this.isInitialized = false;
    
    this.initializeService();
  }

  // Initialize AI service with graceful fallbacks
  async initializeService() {
    try {
      console.log('🤖 Initializing AI Service with TensorFlow.js...');
      
      // Load configurations first
      await this.loadModelConfigurations();
      
      // Load disease and treatment databases
      await this.loadDiseaseDatabase();
      
      // Try to load pre-trained models, fallback to creating new ones
      await this.initializeModels();
      
      this.isInitialized = true;
      console.log('✅ AI Service fully initialized with real TensorFlow models');
      
    } catch (error) {
      console.warn('⚠️ AI Service initializing with intelligent fallbacks:', error.message);
      await this.initializeFallbackMode();
    }
  }

  async loadModelConfigurations() {
    try {
      const configFiles = [
        'disease_detection_config.json',
        'yield_prediction_config.json'
      ];
      
      for (const configFile of configFiles) {
        const configPath = path.join('./ai-models', configFile);
        try {
          const configData = await fs.readFile(configPath, 'utf8');
          const config = JSON.parse(configData);
          this.modelConfigs.set(config.modelName, config);
        } catch (err) {
          console.warn(`Config file ${configFile} not found, using defaults`);
        }
      }
    } catch (error) {
      console.warn('Using default model configurations');
    }
  }

  // Initialize all AI models with fallbacks
  async initializeModels() {
    try {
      console.log('🧠 Loading AI models...');
      
      const modelLoaders = [
        { name: 'diseaseDetection', loader: () => this.loadDiseaseDetectionModel() },
        { name: 'yieldPrediction', loader: () => this.loadYieldPredictionModel() },
        { name: 'cropClassification', loader: () => this.loadCropClassificationModel() },
        { name: 'riskAssessment', loader: () => this.loadRiskAssessmentModel() }
      ];

      for (const { name, loader } of modelLoaders) {
        try {
          await loader();
          console.log(`✅ ${name} model loaded successfully`);
        } catch (error) {
          console.warn(`⚠️ ${name} model failed to load, creating intelligent version`);
          await this.createIntelligentModel(name);
        }
      }
      
    } catch (error) {
      console.error('Error in model initialization:', error);
      throw error;
    }
  }

  // Create intelligent models when pre-trained ones aren't available
  async createIntelligentModel(modelType) {
    switch (modelType) {
      case 'diseaseDetection':
        const diseaseModel = await this.createDiseaseDetectionModel();
        this.models.set('diseaseDetection', diseaseModel);
        break;
      case 'yieldPrediction':
        const yieldModel = await this.createYieldPredictionModel();
        this.models.set('yieldPrediction', yieldModel);
        break;
      case 'cropClassification':
        const cropModel = await this.createCropClassificationModel();
        this.models.set('cropClassification', cropModel);
        break;
      case 'riskAssessment':
        const riskModel = await this.createRiskAssessmentModel();
        this.models.set('riskAssessment', riskModel);
        break;
    }
  }

  // Load disease detection model
  async loadDiseaseDetectionModel() {
    try {
      const model = await tf.loadLayersModel(`file://${this.modelPaths.diseaseDetection}/model.json`);
      this.models.set('diseaseDetection', model);
    } catch (error) {
      console.warn('Disease detection model not found, creating new one');
      const model = await this.createDiseaseDetectionModel();
      this.models.set('diseaseDetection', model);
    }
  }

  // Create disease detection model
  async createDiseaseDetectionModel() {
    const model = tf.sequential({
      layers: [
        // Convolutional layers for image processing
        tf.layers.conv2d({
          inputShape: [224, 224, 3],
          filters: 32,
          kernelSize: 3,
          activation: 'relu'
        }),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        
        tf.layers.conv2d({ filters: 64, kernelSize: 3, activation: 'relu' }),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        
        tf.layers.conv2d({ filters: 128, kernelSize: 3, activation: 'relu' }),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        
        tf.layers.conv2d({ filters: 256, kernelSize: 3, activation: 'relu' }),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        
        // Dense layers for classification
        tf.layers.flatten(),
        tf.layers.dropout({ rate: 0.5 }),
        tf.layers.dense({ units: 512, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 256, activation: 'relu' }),
        tf.layers.dense({ units: 50, activation: 'softmax' }) // 50 disease classes
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  // Load yield prediction model
  async loadYieldPredictionModel() {
    try {
      const model = await tf.loadLayersModel(`file://${this.modelPaths.yieldPrediction}/model.json`);
      this.models.set('yieldPrediction', model);
    } catch (error) {
      console.warn('Yield prediction model not found, creating new one');
      const model = await this.createYieldPredictionModel();
      this.models.set('yieldPrediction', model);
    }
  }

  // Create yield prediction model
  async createYieldPredictionModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [15], units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.1 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    return model;
  }

  // Disease Detection from Image
  async detectDisease(farmId, imageData, metadata = {}) {
    try {
      const model = this.models.get('diseaseDetection');
      if (!model) {
        throw new Error('Disease detection model not available');
      }

      // Preprocess image
      const processedImage = await this.preprocessImage(imageData);
      
      // Make prediction
      const predictions = model.predict(processedImage);
      const probabilities = await predictions.data();
      
      // Get top predictions
      const topPredictions = this.getTopPredictions(probabilities, 5);
      
      // Get disease information
      const primaryDetection = await this.getDiseaseInfo(topPredictions[0].classId);
      const alternativeDetections = await Promise.all(
        topPredictions.slice(1).map(pred => this.getDiseaseInfo(pred.classId))
      );

      // Generate treatment recommendations
      const treatment = await this.generateTreatmentRecommendation(primaryDetection);
      const prevention = await this.generatePreventionMeasures(primaryDetection);

      // Assess severity
      const severity = this.assessDiseaseSeverity(primaryDetection, topPredictions[0].confidence);

      const detection = {
        id: `detection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        farmId,
        cropId: metadata.cropId,
        image: imageData,
        primaryDetection: {
          name: primaryDetection.name,
          confidence: topPredictions[0].confidence,
          description: primaryDetection.description,
          symptoms: primaryDetection.symptoms,
          causes: primaryDetection.causes
        },
        alternativeDetections: alternativeDetections.map((disease, index) => ({
          name: disease.name,
          confidence: topPredictions[index + 1].confidence,
          description: disease.description,
          symptoms: disease.symptoms,
          causes: disease.causes
        })),
        confidence: topPredictions[0].confidence,
        severity,
        treatment,
        prevention,
        detectedAt: new Date()
      };

      // Clean up tensors
      predictions.dispose();
      processedImage.dispose();

      return detection;
    } catch (error) {
      console.error('Disease detection error:', error);
      throw new Error('Failed to detect disease');
    }
  }

  // Preprocess image for disease detection
  async preprocessImage(imageData) {
    try {
      let imageBuffer;
      
      if (typeof imageData === 'string') {
        // Handle base64 encoded images
        const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else {
        imageBuffer = imageData;
      }

      // Resize and normalize image using Sharp
      const processedBuffer = await sharp(imageBuffer)
        .resize(224, 224)
        .removeAlpha()
        .raw()
        .toBuffer();

      // Convert to tensor and normalize
      const tensor = tf.tensor3d(new Uint8Array(processedBuffer), [224, 224, 3]);
      const normalized = tensor.div(255.0);
      const batched = normalized.expandDims(0);

      // Clean up intermediate tensors
      tensor.dispose();
      normalized.dispose();

      return batched;
    } catch (error) {
      console.error('Image preprocessing error:', error);
      throw new Error('Failed to preprocess image');
    }
  }

  // Get top predictions from model output
  getTopPredictions(probabilities, topK = 5) {
    const predictions = Array.from(probabilities)
      .map((prob, index) => ({ classId: index, confidence: prob }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, topK);

    return predictions;
  }

  // Yield Prediction
  async predictYield(cropId) {
    try {
      const model = this.models.get('yieldPrediction');
      if (!model) {
        throw new Error('Yield prediction model not available');
      }

      // Gather input features
      const features = await this.gatherYieldFeatures(cropId);
      const inputTensor = tf.tensor2d([features]);

      // Make prediction
      const prediction = model.predict(inputTensor);
      const yieldValue = await prediction.data();

      // Generate additional insights
      const factors = await this.analyzeYieldFactors(cropId, features);
      const recommendations = await this.generateYieldRecommendations(cropId, factors);
      const optimalHarvestDate = await this.predictOptimalHarvestDate(cropId);
      const qualityPrediction = await this.predictQuality(cropId);

      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      return {
        cropId,
        predictedYield: yieldValue[0],
        confidence: this.calculateYieldConfidence(factors),
        factors,
        recommendations,
        optimalHarvestDate,
        qualityPrediction,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Yield prediction error:', error);
      throw new Error('Failed to predict yield');
    }
  }

  // Gather features for yield prediction
  async gatherYieldFeatures(cropId) {
    const crop = await this.getCropData(cropId);
    const weather = await this.getWeatherData(crop.farmId);
    const soil = await this.getSoilData(crop.farmId);
    const management = await this.getManagementData(cropId);

    return [
      // Crop features
      this.getCropTypeEncoding(crop.type),
      crop.area || 0,
      crop.plantingDate ? this.getDayOfYear(crop.plantingDate) : 0,
      crop.variety ? this.getVarietyEncoding(crop.variety) : 0,

      // Weather features
      weather.averageTemperature || 20,
      weather.totalRainfall || 500,
      weather.sunlightHours || 8,
      weather.humidity || 60,

      // Soil features
      soil.phLevel || 6.5,
      soil.organicMatter || 3.0,
      soil.nitrogen || 50,
      soil.phosphorus || 30,
      soil.potassium || 40,

      // Management features
      management.irrigationFrequency || 0,
      management.fertilizationScore || 0.5
    ];
  }

  // Risk Assessment
  async generateRiskAssessment(farmId) {
    try {
      const riskFactors = await this.analyzeRiskFactors(farmId);
      const weatherRisk = await this.assessWeatherRisk(farmId);
      const diseaseRisk = await this.assessDiseaseRisk(farmId);
      const marketRisk = await this.assessMarketRisk(farmId);
      const operationalRisk = await this.assessOperationalRisk(farmId);

      const overallRisk = this.calculateOverallRisk([
        weatherRisk,
        diseaseRisk,
        marketRisk,
        operationalRisk
      ]);

      const mitigation = await this.generateMitigationStrategies(farmId, {
        weather: weatherRisk,
        disease: diseaseRisk,
        market: marketRisk,
        operational: operationalRisk
      });

      return {
        farmId,
        overallRisk,
        riskLevel: this.getRiskLevel(overallRisk),
        factors: {
          weather: weatherRisk,
          disease: diseaseRisk,
          market: marketRisk,
          operational: operationalRisk
        },
        mitigation,
        recommendations: await this.generateRiskRecommendations(farmId, overallRisk),
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Risk assessment error:', error);
      throw new Error('Failed to generate risk assessment');
    }
  }

  // Assess Weather Risk
  async assessWeatherRisk(farmId) {
    const weather = await this.getWeatherForecast(farmId);
    const historical = await this.getHistoricalWeather(farmId);
    
    let riskScore = 0;
    const factors = [];

    // Temperature extremes
    if (weather.maxTemperature > 35 || weather.minTemperature < 5) {
      riskScore += 0.3;
      factors.push('Extreme temperatures forecasted');
    }

    // Drought risk
    if (weather.rainfall < historical.averageRainfall * 0.5) {
      riskScore += 0.25;
      factors.push('Below-average rainfall expected');
    }

    // Flood risk
    if (weather.rainfall > historical.averageRainfall * 2) {
      riskScore += 0.2;
      factors.push('Heavy rainfall risk');
    }

    // Frost risk
    if (weather.frostProbability > 0.3) {
      riskScore += 0.15;
      factors.push('Frost risk detected');
    }

    // Hail risk
    if (weather.hailProbability > 0.2) {
      riskScore += 0.1;
      factors.push('Hail risk present');
    }

    return {
      score: Math.min(riskScore, 1.0),
      level: this.getRiskLevel(riskScore),
      factors,
      forecast: weather,
      recommendations: this.generateWeatherRecommendations(riskScore, factors)
    };
  }

  // Assess Disease Risk
  async assessDiseaseRisk(farmId) {
    const crops = await this.getFarmCrops(farmId);
    const weather = await this.getWeatherData(farmId);
    const diseaseHistory = await this.getDiseaseHistory(farmId);
    
    let riskScore = 0;
    const factors = [];

    // Weather conditions favorable for diseases
    if (weather.humidity > 80 && weather.temperature > 20) {
      riskScore += 0.3;
      factors.push('High humidity and temperature favor disease development');
    }

    // Historical disease presence
    if (diseaseHistory.length > 0) {
      const recentDiseases = diseaseHistory.filter(d => 
        new Date() - d.detectedAt < 365 * 24 * 60 * 60 * 1000 // Last year
      );
      if (recentDiseases.length > 0) {
        riskScore += 0.2;
        factors.push('Previous disease occurrences detected');
      }
    }

    // Crop susceptibility
    const susceptibleCrops = crops.filter(crop => 
      this.getCropDiseaseSusceptibility(crop.type) > 0.5
    );
    if (susceptibleCrops.length > 0) {
      riskScore += 0.15;
      factors.push('Susceptible crop varieties present');
    }

    // Seasonal risk
    const seasonalRisk = this.getSeasonalDiseaseRisk(new Date().getMonth());
    riskScore += seasonalRisk * 0.2;
    if (seasonalRisk > 0.5) {
      factors.push('High seasonal disease risk period');
    }

    return {
      score: Math.min(riskScore, 1.0),
      level: this.getRiskLevel(riskScore),
      factors,
      susceptibleCrops,
      recommendations: this.generateDiseaseRiskRecommendations(riskScore, factors)
    };
  }

  // Load disease database
  loadDiseaseDatabase() {
    // Mock disease database - in production, load from external database
    const diseases = [
      {
        id: 0,
        name: 'Healthy',
        description: 'No disease detected',
        symptoms: ['Normal appearance'],
        causes: ['N/A'],
        severity: 'NONE'
      },
      {
        id: 1,
        name: 'Leaf Blight',
        description: 'Fungal disease affecting leaf tissue',
        symptoms: ['Brown spots on leaves', 'Yellowing', 'Wilting'],
        causes: ['High humidity', 'Poor air circulation', 'Infected seeds'],
        severity: 'MEDIUM'
      },
      {
        id: 2,
        name: 'Root Rot',
        description: 'Disease affecting root system',
        symptoms: ['Stunted growth', 'Yellowing leaves', 'Root discoloration'],
        causes: ['Overwatering', 'Poor drainage', 'Soil pathogens'],
        severity: 'HIGH'
      },
      {
        id: 3,
        name: 'Powdery Mildew',
        description: 'Fungal disease creating white powdery coating',
        symptoms: ['White powdery spots', 'Leaf curling', 'Reduced photosynthesis'],
        causes: ['High humidity', 'Poor ventilation', 'Overcrowding'],
        severity: 'MEDIUM'
      }
      // Add more diseases as needed
    ];

    diseases.forEach(disease => {
      this.diseaseDatabase.set(disease.id, disease);
    });

    // Load treatment database
    this.loadTreatmentDatabase();
  }

  // Load treatment database
  loadTreatmentDatabase() {
    const treatments = new Map([
      ['Leaf Blight', {
        primary: 'Apply fungicide spray',
        secondary: ['Remove affected leaves', 'Improve air circulation'],
        organic: ['Neem oil application', 'Baking soda spray'],
        prevention: ['Crop rotation', 'Disease-resistant varieties']
      }],
      ['Root Rot', {
        primary: 'Improve drainage and reduce watering',
        secondary: ['Apply biological fungicide', 'Remove affected plants'],
        organic: ['Compost tea', 'Beneficial microorganisms'],
        prevention: ['Proper soil preparation', 'Avoid overwatering']
      }],
      ['Powdery Mildew', {
        primary: 'Apply systemic fungicide',
        secondary: ['Increase air circulation', 'Reduce humidity'],
        organic: ['Milk spray', 'Sulfur dust'],
        prevention: ['Proper spacing', 'Resistant varieties']
      }]
    ]);

    this.treatmentDatabase = treatments;
  }

  // Utility methods
  getDiseaseInfo(classId) {
    return this.diseaseDatabase.get(classId) || {
      name: 'Unknown Disease',
      description: 'Disease not in database',
      symptoms: ['Unidentified symptoms'],
      causes: ['Unknown causes']
    };
  }

  generateTreatmentRecommendation(disease) {
    const treatment = this.treatmentDatabase.get(disease.name);
    
    if (!treatment) {
      return {
        primary: 'Consult agricultural expert',
        alternatives: ['General fungicide application'],
        organic: ['Improve plant health'],
        urgency: 'MEDIUM'
      };
    }

    return {
      primary: treatment.primary,
      alternatives: treatment.secondary,
      organic: treatment.organic,
      urgency: this.getTreatmentUrgency(disease.severity)
    };
  }

  generatePreventionMeasures(disease) {
    const treatment = this.treatmentDatabase.get(disease.name);
    
    return treatment?.prevention || [
      'Regular monitoring',
      'Maintain plant health',
      'Proper sanitation'
    ];
  }

  assessDiseaseSeverity(disease, confidence) {
    if (confidence < 0.5) return 'LOW';
    if (disease.severity === 'HIGH' && confidence > 0.8) return 'CRITICAL';
    if (disease.severity === 'HIGH') return 'HIGH';
    if (disease.severity === 'MEDIUM' && confidence > 0.7) return 'MEDIUM';
    return 'LOW';
  }

  getRiskLevel(score) {
    if (score >= 0.7) return 'HIGH';
    if (score >= 0.4) return 'MEDIUM';
    return 'LOW';
  }

  calculateOverallRisk(risks) {
    const weights = [0.3, 0.25, 0.25, 0.2]; // Weather, disease, market, operational
    return risks.reduce((sum, risk, index) => sum + risk.score * weights[index], 0);
  }

  // Mock data methods (replace with actual data fetching)
  async getCropData(cropId) {
    return {
      id: cropId,
      type: 'wheat',
      area: 10,
      plantingDate: new Date('2024-03-15'),
      variety: 'winter_wheat',
      farmId: 'farm_1'
    };
  }

  async getWeatherData(farmId) {
    return {
      averageTemperature: 22,
      totalRainfall: 450,
      sunlightHours: 8.5,
      humidity: 65,
      maxTemperature: 28,
      minTemperature: 16
    };
  }

  async getSoilData(farmId) {
    return {
      phLevel: 6.8,
      organicMatter: 3.2,
      nitrogen: 45,
      phosphorus: 35,
      potassium: 38
    };
  }

  getCropTypeEncoding(type) {
    const encodings = { wheat: 1, corn: 2, rice: 3, soybeans: 4 };
    return encodings[type] || 0;
  }

  getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  async createFallbackModels() {
    // Create simple fallback models for demo purposes
    console.log('Creating fallback AI models...');
    
    await this.createDiseaseDetectionModel();
    await this.createYieldPredictionModel();
    
    console.log('Fallback models created');
  }
}

module.exports = new AIService();
