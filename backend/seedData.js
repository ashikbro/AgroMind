const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Crop = require('./models/Crop');
const Disease = require('./models/Disease');
const User = require('./models/User');

dotenv.config();

const sampleCrops = [
  {
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    category: 'vegetables',
    varieties: [
      {
        name: 'Cherry Tomato',
        characteristics: 'Small, sweet fruits',
        growthPeriod: 75,
        yield: { min: 3, max: 5, unit: 'kg per plant' }
      },
      {
        name: 'Beefsteak Tomato',
        characteristics: 'Large, meaty fruits',
        growthPeriod: 85,
        yield: { min: 4, max: 7, unit: 'kg per plant' }
      }
    ],
    growthStages: [
      {
        stage: 'seedling',
        duration: 14,
        description: 'Initial growth with first true leaves',
        careInstructions: ['Keep soil moist', 'Provide adequate light', 'Maintain temperature 20-25°C']
      },
      {
        stage: 'vegetative',
        duration: 35,
        description: 'Rapid growth and leaf development',
        careInstructions: ['Regular watering', 'Apply nitrogen fertilizer', 'Support with stakes']
      },
      {
        stage: 'flowering',
        duration: 14,
        description: 'Flower formation and pollination',
        careInstructions: ['Reduce nitrogen', 'Ensure good pollination', 'Monitor for pests']
      },
      {
        stage: 'fruiting',
        duration: 30,
        description: 'Fruit development and growth',
        careInstructions: ['Consistent watering', 'Support heavy branches', 'Monitor ripening']
      },
      {
        stage: 'maturity',
        duration: 7,
        description: 'Harvest ready fruits',
        careInstructions: ['Harvest regularly', 'Store properly', 'Continue care for ongoing production']
      }
    ],
    season: {
      sowing: { kharif: true, rabi: true, zaid: false },
      months: ['March', 'April', 'May', 'September', 'October']
    },
    climate: {
      temperature: { min: 15, max: 30, optimal: 25 },
      humidity: { min: 60, max: 80 },
      rainfall: { min: 500, max: 800 }
    },
    soil: {
      types: ['loamy', 'sandy'],
      ph: { min: 6.0, max: 7.0 },
      drainage: 'well-drained'
    },
    irrigation: {
      requirement: 'moderate',
      frequency: 'Every 2-3 days',
      methods: ['drip', 'furrow']
    },
    fertilization: {
      organic: ['Compost', 'Farm yard manure', 'Vermicompost'],
      chemical: [
        { name: 'NPK 19:19:19', quantity: '2-3 kg/acre', timing: 'At planting' },
        { name: 'Urea', quantity: '50 kg/acre', timing: 'Vegetative stage' }
      ]
    },
    commonPests: [
      {
        name: 'Tomato Hornworm',
        symptoms: ['Large green caterpillars', 'Defoliation', 'Fruit damage'],
        treatment: ['Hand picking', 'Bt spray', 'Beneficial insects']
      }
    ],
    harvestInfo: {
      indicators: ['Color change to red/pink', 'Slight softness', 'Easy separation from vine'],
      storage: ['Cool, dry place', 'Avoid refrigeration for best taste', '7-10 days shelf life'],
      processing: ['Fresh consumption', 'Sauce making', 'Dehydration']
    },
    marketInfo: {
      price: { min: 20, max: 60, currency: 'INR' },
      demand: 'high',
      season: 'Year round'
    },
    nutritionalValue: [
      { nutrient: 'Vitamin C', value: 28, unit: 'mg/100g' },
      { nutrient: 'Lycopene', value: 2573, unit: 'mcg/100g' },
      { nutrient: 'Potassium', value: 237, unit: 'mg/100g' }
    ],
    images: ['tomato1.jpg', 'tomato2.jpg']
  },
  {
    name: 'Rice',
    scientificName: 'Oryza sativa',
    category: 'cereals',
    varieties: [
      {
        name: 'Basmati',
        characteristics: 'Long grain, aromatic',
        growthPeriod: 120,
        yield: { min: 20, max: 25, unit: 'quintal per acre' }
      }
    ],
    season: {
      sowing: { kharif: true, rabi: true, zaid: false },
      months: ['June', 'July', 'November', 'December']
    },
    climate: {
      temperature: { min: 20, max: 35, optimal: 28 },
      humidity: { min: 70, max: 90 },
      rainfall: { min: 1000, max: 2000 }
    },
    soil: {
      types: ['clay', 'loamy'],
      ph: { min: 5.5, max: 7.0 },
      drainage: 'poor'
    },
    irrigation: {
      requirement: 'high',
      frequency: 'Continuous flooding',
      methods: ['flood']
    }
  },
  {
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    category: 'cereals',
    season: {
      sowing: { kharif: false, rabi: true, zaid: false },
      months: ['November', 'December']
    },
    climate: {
      temperature: { min: 10, max: 25, optimal: 20 },
      humidity: { min: 50, max: 70 },
      rainfall: { min: 300, max: 600 }
    }
  }
];

const sampleDiseases = [
  {
    name: 'Tomato Early Blight',
    scientificName: 'Alternaria solani',
    commonNames: ['Target spot', 'Collar rot'],
    type: 'fungal',
    causativeAgent: {
      name: 'Alternaria solani',
      type: 'Fungus'
    },
    symptoms: {
      early: ['Small dark spots on lower leaves', 'Yellow halos around spots'],
      advanced: ['Large brown lesions', 'Defoliation', 'Stem cankers', 'Fruit rot'],
      visual: [
        {
          description: 'Concentric rings in leaf spots',
          images: ['early_blight_leaf.jpg']
        }
      ]
    },
    conditions: {
      temperature: { min: 24, max: 29 },
      humidity: { min: 90, max: 100 },
      weather: ['High humidity', 'Warm temperatures', 'Wet conditions'],
      season: ['Monsoon', 'Post-monsoon']
    },
    transmission: {
      method: ['Wind', 'Water splash', 'Infected seeds'],
      vector: ['Air currents', 'Rain'],
      speed: 'moderate'
    },
    prevention: {
      cultural: [
        'Crop rotation',
        'Remove infected plant debris',
        'Proper spacing for air circulation',
        'Avoid overhead irrigation'
      ],
      biological: ['Trichoderma', 'Bacillus subtilis'],
      chemical: ['Copper fungicides', 'Mancozeb'],
      resistant_varieties: ['Mountain Fresh Plus', 'Celebrity']
    },
    treatment: {
      organic: [
        {
          method: 'Neem oil spray',
          ingredients: ['Neem oil', 'Water', 'Mild soap'],
          preparation: 'Mix 2 tbsp neem oil + 1 tsp soap in 1 liter water',
          application: 'Spray on affected areas',
          frequency: 'Every 7-10 days'
        }
      ],
      chemical: [
        {
          product: 'Mancozeb 75% WP',
          activeIngredient: 'Mancozeb',
          dosage: '2-3 g/liter',
          application: 'Foliar spray',
          frequency: 'Every 10-14 days',
          safety: ['Wear protective gear', 'Do not spray during flowering']
        }
      ],
      cultural: ['Remove infected leaves', 'Improve air circulation']
    },
    severity: 'moderate',
    economicImpact: {
      yieldLoss: { min: 10, max: 40 },
      qualityImpact: 'Reduces fruit quality and marketability'
    },
    distribution: {
      regions: ['Worldwide'],
      countries: ['India', 'USA', 'China', 'Brazil']
    }
  },
  {
    name: 'Rice Blast',
    scientificName: 'Magnaporthe oryzae',
    type: 'fungal',
    symptoms: {
      early: ['Small brown spots on leaves'],
      advanced: ['Large lesions', 'Neck rot', 'Panicle blast']
    },
    severity: 'high'
  },
  {
    name: 'Wheat Rust',
    scientificName: 'Puccinia graminis',
    type: 'fungal',
    symptoms: {
      early: ['Orange pustules on leaves'],
      advanced: ['Severe defoliation', 'Reduced grain filling']
    },
    severity: 'severe'
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agromind', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    await Crop.deleteMany({});
    await Disease.deleteMany({});
    console.log('📭 Cleared existing data');

    // Insert crops
    const insertedCrops = await Crop.insertMany(sampleCrops);
    console.log(`🌾 Inserted ${insertedCrops.length} crops`);

    // Update diseases with crop references
    const tomato = insertedCrops.find(crop => crop.name === 'Tomato');
    const rice = insertedCrops.find(crop => crop.name === 'Rice');
    const wheat = insertedCrops.find(crop => crop.name === 'Wheat');

    if (tomato) {
      sampleDiseases[0].affectedCrops = [{ crop: tomato._id, severity: 'moderate' }];
    }
    if (rice) {
      sampleDiseases[1].affectedCrops = [{ crop: rice._id, severity: 'high' }];
    }
    if (wheat) {
      sampleDiseases[2].affectedCrops = [{ crop: wheat._id, severity: 'severe' }];
    }

    // Insert diseases
    const insertedDiseases = await Disease.insertMany(sampleDiseases);
    console.log(`🦠 Inserted ${insertedDiseases.length} diseases`);

    // Update crops with disease references
    if (tomato && insertedDiseases[0]) {
      await Crop.findByIdAndUpdate(tomato._id, {
        $push: { commonDiseases: insertedDiseases[0]._id }
      });
    }
    if (rice && insertedDiseases[1]) {
      await Crop.findByIdAndUpdate(rice._id, {
        $push: { commonDiseases: insertedDiseases[1]._id }
      });
    }
    if (wheat && insertedDiseases[2]) {
      await Crop.findByIdAndUpdate(wheat._id, {
        $push: { commonDiseases: insertedDiseases[2]._id }
      });
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@agromind.com',
      password: 'admin123',
      phone: '+919876543210',
      role: 'admin',
      isVerified: true,
      preferences: {
        language: 'en',
        units: 'metric'
      }
    });
    await adminUser.save();
    console.log('👤 Created admin user');

    // Create sample farmer
    const farmerUser = new User({
      name: 'Rajesh Kumar',
      email: 'farmer@agromind.com',
      password: 'farmer123',
      phone: '+919876543211',
      role: 'farmer',
      isVerified: true,
      farmDetails: {
        farmName: 'Kumar Farms',
        location: {
          state: 'Bihar',
          district: 'Patna',
          village: 'Kumhrar',
          coordinates: {
            latitude: 25.5941,
            longitude: 85.1376
          }
        },
        farmSize: { value: 5, unit: 'acres' },
        soilType: 'loamy',
        irrigationType: 'drip'
      },
      preferences: {
        language: 'hi',
        units: 'metric'
      }
    });
    await farmerUser.save();
    console.log('👨‍🌾 Created sample farmer');

    console.log('✅ Data seeding completed successfully!');
    console.log('\n📋 Sample Credentials:');
    console.log('Admin: admin@agromind.com / admin123');
    console.log('Farmer: farmer@agromind.com / farmer123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeeder = async () => {
  await connectDB();
  await seedData();
};

// Run seeder if called directly
if (require.main === module) {
  runSeeder();
}

module.exports = { seedData };
