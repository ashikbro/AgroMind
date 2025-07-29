const mongoose = require('mongoose');
const Crop = require('./models/Crop');
const Disease = require('./models/Disease');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agromind', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Comprehensive crops data
const cropsData = [
  // Cereals
  {
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    category: 'Cereal',
    growingRegions: ['North India', 'Central India', 'Western India'],
    plantingSeason: 'Winter',
    harvestingSeason: 'Spring',
    duration: '120-150 days',
    soilType: 'Loamy, well-drained',
    waterRequirement: 'Medium',
    temperatureRange: '15-25°C',
    description: 'Major staple grain crop grown widely across temperate regions.',
    uses: ['Food grain', 'Flour production', 'Animal feed'],
    nutritionalInfo: {
      protein: '12-15%',
      carbohydrates: '70-75%',
      fiber: '12-14%'
    }
  },
  {
    name: 'Rice',
    scientificName: 'Oryza sativa',
    category: 'Cereal',
    growingRegions: ['Eastern India', 'Southern India', 'Coastal areas'],
    plantingSeason: 'Monsoon',
    harvestingSeason: 'Post-monsoon',
    duration: '90-120 days',
    soilType: 'Clay, waterlogged',
    waterRequirement: 'High',
    temperatureRange: '22-32°C',
    description: 'Primary staple food for more than half of the world population.',
    uses: ['Staple food', 'Rice wine', 'Rice paper'],
    nutritionalInfo: {
      protein: '6-7%',
      carbohydrates: '78-80%',
      fiber: '0.2-0.5%'
    }
  },
  {
    name: 'Maize (Corn)',
    scientificName: 'Zea mays',
    category: 'Cereal',
    growingRegions: ['Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'Rajasthan'],
    plantingSeason: 'Kharif/Rabi',
    harvestingSeason: 'All seasons',
    duration: '80-120 days',
    soilType: 'Well-drained loamy',
    waterRequirement: 'Medium',
    temperatureRange: '18-35°C',
    description: 'Versatile crop used for food, feed, and industrial purposes.',
    uses: ['Food grain', 'Poultry feed', 'Ethanol production', 'Starch'],
    nutritionalInfo: {
      protein: '9-10%',
      carbohydrates: '74-76%',
      fiber: '2-3%'
    }
  },
  {
    name: 'Barley',
    scientificName: 'Hordeum vulgare',
    category: 'Cereal',
    growingRegions: ['Rajasthan', 'Uttar Pradesh', 'Haryana', 'Madhya Pradesh'],
    plantingSeason: 'Winter',
    harvestingSeason: 'Spring',
    duration: '90-120 days',
    soilType: 'Well-drained, slightly alkaline',
    waterRequirement: 'Low to medium',
    temperatureRange: '12-25°C',
    description: 'Hardy cereal crop used for malting, brewing, and animal feed.',
    uses: ['Malting', 'Animal feed', 'Food grain', 'Beer production'],
    nutritionalInfo: {
      protein: '10-12%',
      carbohydrates: '73-75%',
      fiber: '15-20%'
    }
  },

  // Pulses
  {
    name: 'Chickpea (Chana)',
    scientificName: 'Cicer arietinum',
    category: 'Pulse',
    growingRegions: ['Madhya Pradesh', 'Rajasthan', 'Maharashtra', 'Uttar Pradesh'],
    plantingSeason: 'Post-monsoon',
    harvestingSeason: 'Winter',
    duration: '90-120 days',
    soilType: 'Well-drained loamy',
    waterRequirement: 'Low',
    temperatureRange: '15-30°C',
    description: 'Important protein-rich pulse crop with nitrogen-fixing properties.',
    uses: ['Dal', 'Flour (besan)', 'Snacks', 'Animal feed'],
    nutritionalInfo: {
      protein: '20-25%',
      carbohydrates: '55-60%',
      fiber: '12-15%'
    }
  },
  {
    name: 'Lentil (Masoor)',
    scientificName: 'Lens culinaris',
    category: 'Pulse',
    growingRegions: ['Uttar Pradesh', 'Madhya Pradesh', 'Bihar', 'West Bengal'],
    plantingSeason: 'Post-monsoon',
    harvestingSeason: 'Winter',
    duration: '95-110 days',
    soilType: 'Loamy, well-drained',
    waterRequirement: 'Low',
    temperatureRange: '18-30°C',
    description: 'Fast-growing pulse crop with high protein content.',
    uses: ['Dal', 'Soup', 'Flour', 'Snacks'],
    nutritionalInfo: {
      protein: '24-26%',
      carbohydrates: '58-60%',
      fiber: '8-10%'
    }
  },
  {
    name: 'Pigeon Pea (Arhar)',
    scientificName: 'Cajanus cajan',
    category: 'Pulse',
    growingRegions: ['Maharashtra', 'Karnataka', 'Madhya Pradesh', 'Andhra Pradesh'],
    plantingSeason: 'Monsoon',
    harvestingSeason: 'Post-monsoon',
    duration: '150-200 days',
    soilType: 'Red loamy, well-drained',
    waterRequirement: 'Medium',
    temperatureRange: '20-35°C',
    description: 'Perennial pulse crop that can be intercropped with cereals.',
    uses: ['Dal', 'Green vegetable', 'Fodder', 'Fuel wood'],
    nutritionalInfo: {
      protein: '20-22%',
      carbohydrates: '55-57%',
      fiber: '15-17%'
    }
  },

  // Vegetables
  {
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetable',
    growingRegions: ['Karnataka', 'Andhra Pradesh', 'Maharashtra', 'Madhya Pradesh'],
    plantingSeason: 'All seasons',
    harvestingSeason: 'All seasons',
    duration: '60-90 days',
    soilType: 'Well-drained loamy',
    waterRequirement: 'Medium',
    temperatureRange: '18-27°C',
    description: 'Popular vegetable crop rich in vitamins and antioxidants.',
    uses: ['Fresh consumption', 'Processing', 'Sauce', 'Paste'],
    nutritionalInfo: {
      protein: '0.9%',
      carbohydrates: '3.9%',
      vitaminC: '14mg/100g'
    }
  },
  {
    name: 'Onion',
    scientificName: 'Allium cepa',
    category: 'Vegetable',
    growingRegions: ['Maharashtra', 'Karnataka', 'Gujarat', 'Madhya Pradesh'],
    plantingSeason: 'Post-monsoon',
    harvestingSeason: 'Winter/Summer',
    duration: '90-120 days',
    soilType: 'Well-drained sandy loam',
    waterRequirement: 'Medium',
    temperatureRange: '15-25°C',
    description: 'Essential vegetable crop used as flavoring agent in cooking.',
    uses: ['Culinary', 'Dehydration', 'Pickling', 'Medicine'],
    nutritionalInfo: {
      protein: '1.1%',
      carbohydrates: '9.3%',
      fiber: '1.7%'
    }
  },
  {
    name: 'Potato',
    scientificName: 'Solanum tuberosum',
    category: 'Vegetable',
    growingRegions: ['Uttar Pradesh', 'West Bengal', 'Bihar', 'Punjab'],
    plantingSeason: 'Winter',
    harvestingSeason: 'Spring',
    duration: '90-120 days',
    soilType: 'Well-drained sandy loam',
    waterRequirement: 'Medium',
    temperatureRange: '15-25°C',
    description: 'Starchy tuber crop and important food security crop.',
    uses: ['Food', 'Processing', 'Starch', 'Alcohol'],
    nutritionalInfo: {
      protein: '2%',
      carbohydrates: '17%',
      vitaminC: '20mg/100g'
    }
  },
  {
    name: 'Cabbage',
    scientificName: 'Brassica oleracea',
    category: 'Vegetable',
    growingRegions: ['Karnataka', 'Maharashtra', 'West Bengal', 'Odisha'],
    plantingSeason: 'Winter',
    harvestingSeason: 'Winter/Spring',
    duration: '60-90 days',
    soilType: 'Rich loamy, well-drained',
    waterRequirement: 'Medium',
    temperatureRange: '15-25°C',
    description: 'Leafy vegetable rich in vitamins and minerals.',
    uses: ['Fresh consumption', 'Salad', 'Cooked vegetable', 'Pickling'],
    nutritionalInfo: {
      protein: '1.3%',
      carbohydrates: '5.8%',
      vitaminC: '36.6mg/100g'
    }
  },
  {
    name: 'Cauliflower',
    scientificName: 'Brassica oleracea var. botrytis',
    category: 'Vegetable',
    growingRegions: ['Bihar', 'Uttar Pradesh', 'Odisha', 'West Bengal'],
    plantingSeason: 'Winter',
    harvestingSeason: 'Winter',
    duration: '60-80 days',
    soilType: 'Rich loamy, well-drained',
    waterRequirement: 'Medium',
    temperatureRange: '15-20°C',
    description: 'Nutritious vegetable crop requiring cool weather.',
    uses: ['Fresh consumption', 'Processing', 'Pickling', 'Dehydration'],
    nutritionalInfo: {
      protein: '1.9%',
      carbohydrates: '4.9%',
      vitaminC: '48.2mg/100g'
    }
  },

  // Cash Crops
  {
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    category: 'Cash Crop',
    growingRegions: ['Gujarat', 'Maharashtra', 'Andhra Pradesh', 'Karnataka'],
    plantingSeason: 'Monsoon',
    harvestingSeason: 'Post-monsoon',
    duration: '150-180 days',
    soilType: 'Black cotton soil',
    waterRequirement: 'Medium to high',
    temperatureRange: '21-35°C',
    description: 'Major fiber crop used in textile industry.',
    uses: ['Textile fiber', 'Cottonseed oil', 'Animal feed', 'Industrial uses'],
    nutritionalInfo: {
      fiberContent: '32-36%',
      oilContent: '18-20%'
    }
  },
  {
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    category: 'Cash Crop',
    growingRegions: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu'],
    plantingSeason: 'Spring/Monsoon',
    harvestingSeason: 'Winter',
    duration: '300-365 days',
    soilType: 'Rich loamy, well-drained',
    waterRequirement: 'High',
    temperatureRange: '20-35°C',
    description: 'Major sugar-producing crop with multiple industrial uses.',
    uses: ['Sugar production', 'Jaggery', 'Ethanol', 'Bagasse'],
    nutritionalInfo: {
      sucrose: '12-18%',
      fiber: '12-16%'
    }
  },
  {
    name: 'Mustard',
    scientificName: 'Brassica juncea',
    category: 'Oilseed',
    growingRegions: ['Rajasthan', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'],
    plantingSeason: 'Post-monsoon',
    harvestingSeason: 'Winter',
    duration: '90-110 days',
    soilType: 'Loamy, well-drained',
    waterRequirement: 'Low',
    temperatureRange: '15-25°C',
    description: 'Important oilseed crop with medicinal properties.',
    uses: ['Cooking oil', 'Condiment', 'Green vegetable', 'Medicine'],
    nutritionalInfo: {
      oilContent: '37-42%',
      protein: '20-25%'
    }
  },

  // Fruits
  {
    name: 'Mango',
    scientificName: 'Mangifera indica',
    category: 'Fruit',
    growingRegions: ['Uttar Pradesh', 'Andhra Pradesh', 'Karnataka', 'Bihar'],
    plantingSeason: 'Monsoon (planting)',
    harvestingSeason: 'Summer',
    duration: '3-5 years (bearing)',
    soilType: 'Well-drained loamy',
    waterRequirement: 'Medium',
    temperatureRange: '24-35°C',
    description: 'King of fruits, popular tropical fruit crop.',
    uses: ['Fresh fruit', 'Processing', 'Juice', 'Pickles'],
    nutritionalInfo: {
      vitaminC: '36.4mg/100g',
      vitaminA: '54µg/100g',
      carbohydrates: '15%'
    }
  },
  {
    name: 'Banana',
    scientificName: 'Musa acuminata',
    category: 'Fruit',
    growingRegions: ['Tamil Nadu', 'Maharashtra', 'Gujarat', 'Andhra Pradesh'],
    plantingSeason: 'All year',
    harvestingSeason: 'All year',
    duration: '10-15 months',
    soilType: 'Rich loamy, well-drained',
    waterRequirement: 'High',
    temperatureRange: '26-30°C',
    description: 'Popular fruit crop with year-round production.',
    uses: ['Fresh fruit', 'Chips', 'Flour', 'Fiber'],
    nutritionalInfo: {
      potassium: '358mg/100g',
      vitaminB6: '0.4mg/100g',
      carbohydrates: '22.8%'
    }
  },

  // Spices
  {
    name: 'Turmeric',
    scientificName: 'Curcuma longa',
    category: 'Spice',
    growingRegions: ['Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Odisha'],
    plantingSeason: 'Monsoon',
    harvestingSeason: 'Winter',
    duration: '180-240 days',
    soilType: 'Well-drained loamy',
    waterRequirement: 'Medium',
    temperatureRange: '20-35°C',
    description: 'Important spice crop with medicinal properties.',
    uses: ['Spice', 'Medicine', 'Cosmetics', 'Dye'],
    nutritionalInfo: {
      curcumin: '2-8%',
      protein: '6.3%'
    }
  },
  {
    name: 'Ginger',
    scientificName: 'Zingiber officinale',
    category: 'Spice',
    growingRegions: ['Kerala', 'Karnataka', 'Meghalaya', 'Odisha'],
    plantingSeason: 'Pre-monsoon',
    harvestingSeason: 'Post-monsoon',
    duration: '180-210 days',
    soilType: 'Well-drained loamy',
    waterRequirement: 'High',
    temperatureRange: '25-30°C',
    description: 'Aromatic rhizome crop used as spice and medicine.',
    uses: ['Spice', 'Medicine', 'Beverages', 'Essential oil'],
    nutritionalInfo: {
      gingerol: '1-3%',
      fiber: '2%'
    }
  }
];

// Comprehensive diseases data
const diseasesData = [
  // Wheat Diseases
  {
    name: 'Wheat Rust',
    scientificName: 'Puccinia graminis',
    affectedCrops: ['Wheat', 'Barley'],
    type: 'Fungal',
    symptoms: [
      'Orange-red pustules on leaves and stems',
      'Yellow to brown lesions',
      'Reduced grain filling',
      'Premature leaf death'
    ],
    causes: [
      'High humidity (70-90%)',
      'Temperature 15-25°C',
      'Wind-borne spores',
      'Dense crop canopy'
    ],
    prevention: [
      'Use resistant varieties',
      'Proper crop rotation',
      'Balanced fertilization',
      'Remove crop residues'
    ],
    treatment: [
      'Apply propiconazole fungicide',
      'Use triazole group fungicides',
      'Spray copper-based fungicides',
      'Maintain proper plant spacing'
    ],
    severity: 'High',
    economicImpact: 'Can cause 20-50% yield loss',
    imageUrl: '/images/diseases/wheat-rust.jpg'
  },
  {
    name: 'Wheat Blight',
    scientificName: 'Fusarium graminearum',
    affectedCrops: ['Wheat', 'Barley', 'Maize'],
    type: 'Fungal',
    symptoms: [
      'Pink-orange spore masses on spikelets',
      'Premature bleaching of heads',
      'Shriveled grains',
      'Mycotoxin contamination'
    ],
    causes: [
      'Wet weather during flowering',
      'High humidity',
      'Warm temperatures (25-30°C)',
      'Previous crop residues'
    ],
    prevention: [
      'Crop rotation with non-host crops',
      'Use resistant varieties',
      'Proper tillage practices',
      'Timely harvesting'
    ],
    treatment: [
      'Apply triazole fungicides at flowering',
      'Use strobilurin fungicides',
      'Post-harvest grain treatment',
      'Proper storage conditions'
    ],
    severity: 'High',
    economicImpact: 'Yield loss 10-60%, quality reduction',
    imageUrl: '/images/diseases/wheat-blight.jpg'
  },

  // Rice Diseases
  {
    name: 'Rice Blast',
    scientificName: 'Magnaporthe oryzae',
    affectedCrops: ['Rice'],
    type: 'Fungal',
    symptoms: [
      'Elliptical lesions with gray centers',
      'Brown margins on leaves',
      'Node infection causing lodging',
      'Panicle blast reducing grain fill'
    ],
    causes: [
      'High humidity (95-99%)',
      'Temperature 20-30°C',
      'Nitrogen over-fertilization',
      'Dense planting'
    ],
    prevention: [
      'Use resistant varieties',
      'Balanced nitrogen application',
      'Proper water management',
      'Seed treatment'
    ],
    treatment: [
      'Apply tricyclazole fungicide',
      'Use isoprothiolane',
      'Copper-based sprays',
      'Systemic fungicides'
    ],
    severity: 'Very High',
    economicImpact: 'Can destroy entire crop, 50-90% loss',
    imageUrl: '/images/diseases/rice-blast.jpg'
  },
  {
    name: 'Bacterial Leaf Blight',
    scientificName: 'Xanthomonas oryzae',
    affectedCrops: ['Rice'],
    type: 'Bacterial',
    symptoms: [
      'Water-soaked lesions on leaf tips',
      'Yellow to white stripes along veins',
      'Systemic infection',
      'Kresek (wilting of young plants)'
    ],
    causes: [
      'High humidity and temperature',
      'Wounds from insects or wind',
      'Contaminated water',
      'Dense planting'
    ],
    prevention: [
      'Use certified disease-free seeds',
      'Resistant varieties',
      'Proper water management',
      'Crop rotation'
    ],
    treatment: [
      'Copper-based bactericides',
      'Streptomycin sprays',
      'Zinc sulfate application',
      'Remove infected plants'
    ],
    severity: 'High',
    economicImpact: '20-40% yield loss in severe cases',
    imageUrl: '/images/diseases/bacterial-leaf-blight.jpg'
  },

  // Tomato Diseases
  {
    name: 'Tomato Late Blight',
    scientificName: 'Phytophthora infestans',
    affectedCrops: ['Tomato', 'Potato'],
    type: 'Oomycete',
    symptoms: [
      'Dark brown lesions on leaves',
      'White fuzzy growth on leaf undersides',
      'Brown lesions on fruits',
      'Rapid plant death'
    ],
    causes: [
      'Cool, wet weather',
      'High humidity (90-100%)',
      'Temperature 15-20°C',
      'Poor air circulation'
    ],
    prevention: [
      'Use resistant varieties',
      'Proper plant spacing',
      'Avoid overhead irrigation',
      'Remove plant debris'
    ],
    treatment: [
      'Apply copper fungicides',
      'Use mancozeb sprays',
      'Systemic fungicides (metalaxyl)',
      'Improve drainage'
    ],
    severity: 'Very High',
    economicImpact: 'Can destroy entire crop in days',
    imageUrl: '/images/diseases/tomato-late-blight.jpg'
  },
  {
    name: 'Tomato Mosaic Virus',
    scientificName: 'Tomato mosaic virus',
    affectedCrops: ['Tomato', 'Pepper', 'Tobacco'],
    type: 'Viral',
    symptoms: [
      'Mosaic pattern on leaves',
      'Stunted plant growth',
      'Reduced fruit size',
      'Irregular ripening'
    ],
    causes: [
      'Infected seeds',
      'Mechanical transmission',
      'Contaminated tools',
      'Worker clothing'
    ],
    prevention: [
      'Use virus-free seeds',
      'Sanitize tools regularly',
      'Remove infected plants',
      'Control weed hosts'
    ],
    treatment: [
      'No chemical cure available',
      'Remove infected plants',
      'Vector control',
      'Use resistant varieties'
    ],
    severity: 'Medium',
    economicImpact: '10-30% yield reduction',
    imageUrl: '/images/diseases/tomato-mosaic.jpg'
  },

  // Cotton Diseases
  {
    name: 'Cotton Wilt',
    scientificName: 'Fusarium oxysporum',
    affectedCrops: ['Cotton'],
    type: 'Fungal',
    symptoms: [
      'Yellowing of leaves from bottom up',
      'Wilting despite adequate moisture',
      'Brown discoloration in stem',
      'Premature leaf drop'
    ],
    causes: [
      'Soil-borne fungal pathogen',
      'Warm soil temperatures',
      'Poor drainage',
      'Stressed plants'
    ],
    prevention: [
      'Use resistant varieties',
      'Crop rotation',
      'Soil solarization',
      'Balanced fertilization'
    ],
    treatment: [
      'Soil fumigation before planting',
      'Biocontrol agents',
      'Improved drainage',
      'Organic matter addition'
    ],
    severity: 'High',
    economicImpact: '15-50% yield loss',
    imageUrl: '/images/diseases/cotton-wilt.jpg'
  },

  // General Crop Diseases
  {
    name: 'Powdery Mildew',
    scientificName: 'Erysiphe graminis',
    affectedCrops: ['Wheat', 'Barley', 'Pea', 'Cucumber', 'Grape'],
    type: 'Fungal',
    symptoms: [
      'White powdery coating on leaves',
      'Yellowing of affected areas',
      'Stunted growth',
      'Reduced photosynthesis'
    ],
    causes: [
      'High humidity',
      'Poor air circulation',
      'Dense canopy',
      'Moderate temperatures'
    ],
    prevention: [
      'Proper plant spacing',
      'Use resistant varieties',
      'Avoid overhead irrigation',
      'Regular pruning'
    ],
    treatment: [
      'Sulfur-based fungicides',
      'Triazole fungicides',
      'Potassium bicarbonate spray',
      'Neem oil application'
    ],
    severity: 'Medium',
    economicImpact: '10-25% yield loss',
    imageUrl: '/images/diseases/powdery-mildew.jpg'
  },
  {
    name: 'Aphid Infestation',
    scientificName: 'Aphis fabae',
    affectedCrops: ['Most crops'],
    type: 'Insect Pest',
    symptoms: [
      'Curled and distorted leaves',
      'Honeydew secretion',
      'Sooty mold growth',
      'Stunted plant growth'
    ],
    causes: [
      'Warm weather',
      'High nitrogen levels',
      'Absence of natural predators',
      'Drought stress'
    ],
    prevention: [
      'Encourage beneficial insects',
      'Use reflective mulches',
      'Balanced fertilization',
      'Regular monitoring'
    ],
    treatment: [
      'Insecticidal soap spray',
      'Neem oil application',
      'Systemic insecticides',
      'Biological control agents'
    ],
    severity: 'Medium',
    economicImpact: '5-20% yield loss, virus transmission',
    imageUrl: '/images/diseases/aphid-infestation.jpg'
  },
  {
    name: 'Root Rot',
    scientificName: 'Rhizoctonia solani',
    affectedCrops: ['Bean', 'Pea', 'Tomato', 'Cotton', 'Rice'],
    type: 'Fungal',
    symptoms: [
      'Blackened root system',
      'Stunted plant growth',
      'Yellowing leaves',
      'Plant wilting and death'
    ],
    causes: [
      'Waterlogged soil',
      'Poor drainage',
      'Soil compaction',
      'High soil temperature'
    ],
    prevention: [
      'Improve soil drainage',
      'Avoid overwatering',
      'Use raised beds',
      'Crop rotation'
    ],
    treatment: [
      'Fungicide soil drench',
      'Improve drainage',
      'Reduce irrigation',
      'Use biocontrol agents'
    ],
    severity: 'High',
    economicImpact: '20-80% plant mortality',
    imageUrl: '/images/diseases/root-rot.jpg'
  }
];

// Function to seed crops
const seedCrops = async () => {
  try {
    // Clear existing crops
    await Crop.deleteMany({});
    console.log('🗑️  Cleared existing crops');

    // Insert new crops
    const crops = await Crop.insertMany(cropsData);
    console.log(`✅ Inserted ${crops.length} crops`);
    
    return crops;
  } catch (error) {
    console.error('❌ Error seeding crops:', error);
    throw error;
  }
};

// Function to seed diseases
const seedDiseases = async (crops) => {
  try {
    // Clear existing diseases
    await Disease.deleteMany({});
    console.log('🗑️  Cleared existing diseases');

    // Map crop names to IDs for disease references
    const cropMap = {};
    crops.forEach(crop => {
      cropMap[crop.name] = crop._id;
    });

    // Update diseases with crop IDs
    const diseasesWithCropIds = diseasesData.map(disease => ({
      ...disease,
      affectedCrops: disease.affectedCrops.map(cropName => 
        cropMap[cropName] || cropName
      ).filter(Boolean)
    }));

    // Insert diseases
    const diseases = await Disease.insertMany(diseasesWithCropIds);
    console.log(`✅ Inserted ${diseases.length} diseases`);
    
    return diseases;
  } catch (error) {
    console.error('❌ Error seeding diseases:', error);
    throw error;
  }
};

// Function to seed market prices
const seedMarketPrices = async (crops) => {
  try {
    const MarketPrice = mongoose.model('MarketPrice');
    
    // Clear existing market prices
    await MarketPrice.deleteMany({});
    console.log('🗑️  Cleared existing market prices');

    const locations = [
      'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata',
      'Hyderabad', 'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow'
    ];

    const marketPrices = [];
    
    crops.forEach(crop => {
      locations.forEach(location => {
        const basePrice = Math.random() * 100 + 20; // Random price between 20-120
        const previousPrice = basePrice + (Math.random() - 0.5) * 20;
        
        marketPrices.push({
          crop: crop._id,
          location: location,
          price: Math.round(basePrice * 100) / 100,
          previousPrice: Math.round(previousPrice * 100) / 100,
          quality: ['Premium', 'Good', 'Standard'][Math.floor(Math.random() * 3)],
          unit: 'kg',
          source: 'Market Survey',
          date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
        });
      });
    });

    const insertedPrices = await MarketPrice.insertMany(marketPrices);
    console.log(`✅ Inserted ${insertedPrices.length} market prices`);
    
    return insertedPrices;
  } catch (error) {
    console.error('❌ Error seeding market prices:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    
    const crops = await seedCrops();
    const diseases = await seedDiseases(crops);
    const marketPrices = await seedMarketPrices(crops);
    
    console.log('\n📊 Seeding Summary:');
    console.log(`✅ Crops: ${crops.length}`);
    console.log(`✅ Diseases: ${diseases.length}`);
    console.log(`✅ Market Prices: ${marketPrices.length}`);
    console.log('\n🎉 Database seeding completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedCrops, seedDiseases, seedMarketPrices };
