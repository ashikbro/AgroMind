// AgroMind Backend Component Test
console.log('🧪 Testing AgroMind Backend Components...');

async function testBasicRequirements() {
  console.log('\n📦 Testing basic Node.js modules...');
  
  try {
    const fs = require('fs');
    const path = require('path');
    console.log('✅ Node.js core modules working');
    
    // Test if package.json exists
    if (fs.existsSync('package.json')) {
      console.log('✅ Package.json found');
    } else {
      console.log('❌ Package.json not found');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Basic requirements failed:', error.message);
    return false;
  }
}

async function testDependencies() {
  console.log('\n📚 Testing installed dependencies...');
  
  const deps = ['axios', 'express', 'mongoose', 'cors'];
  let allGood = true;
  
  for (const dep of deps) {
    try {
      require(dep);
      console.log(`✅ ${dep} available`);
    } catch (error) {
      console.log(`❌ ${dep} missing`);
      allGood = false;
    }
  }
  
  // Test AI dependencies (optional)
  try {
    require('@tensorflow/tfjs-node');
    console.log('✅ TensorFlow.js available (full AI mode)');
  } catch (error) {
    console.log('⚠️ TensorFlow.js not available (intelligent mode)');
  }
  
  return allGood;
}

async function testServices() {
  console.log('\n🔧 Testing backend services...');
  
  try {
    // Test AI Service
    console.log('Testing AI Service...');
    const aiService = require('./services/aiService-complete');
    
    // Wait a moment for initialization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test basic AI functionality
    const testResult = await aiService.detectDisease('test-farm', null, {
      symptoms: ['yellowing'],
      environmental: { humidity: 70, temperature: 25 }
    });
    
    if (testResult && testResult.detectedDisease) {
      console.log('✅ AI Service working:', testResult.method);
    } else {
      console.log('❌ AI Service not responding properly');
      return false;
    }
    
    // Test Analytics Service
    console.log('Testing Analytics Service...');
    const analyticsService = require('./services/analyticsService-mock');
    const analytics = await analyticsService.generateFarmAnalytics('test-farm', 'monthly');
    
    if (analytics && analytics.overview) {
      console.log('✅ Analytics Service working');
    } else {
      console.log('❌ Analytics Service failed');
      return false;
    }
    
    // Test Market Service
    console.log('Testing Market Service...');
    const marketService = require('./services/marketService-mock');
    const prices = await marketService.getCurrentPrices(['wheat'], 'US');
    
    if (prices && prices.length > 0) {
      console.log('✅ Market Service working');
    } else {
      console.log('❌ Market Service failed');
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Services test failed:', error.message);
    console.log('📝 Error details:', error.stack);
    return false;
  }
}

async function testDatabase() {
  console.log('\n💾 Testing database models...');
  
  try {
    const models = require('./models');
    
    if (models.User && models.Crop && models.Disease && models.Diagnosis) {
      console.log('✅ All database models available');
      return true;
    } else {
      console.log('❌ Some database models missing');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Database models test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Running comprehensive backend test...\n');
  
  const tests = [
    { name: 'Basic Requirements', test: testBasicRequirements },
    { name: 'Dependencies', test: testDependencies },
    { name: 'Database Models', test: testDatabase },
    { name: 'Backend Services', test: testServices }
  ];
  
  let allPassed = true;
  
  for (const { name, test } of tests) {
    console.log(`\n=== ${name} ===`);
    const result = await test();
    if (!result) {
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ Backend is ready to start');
    console.log('🚀 Run: npm start');
  } else {
    console.log('⚠️ SOME TESTS FAILED');
    console.log('📝 Check the errors above');
    console.log('🔧 Try running: npm install');
  }
  
  console.log('='.repeat(50));
}

// Run the tests
runAllTests().catch(error => {
  console.error('💥 Test suite crashed:', error.message);
  console.log('🆘 Critical error - check your Node.js installation');
});
