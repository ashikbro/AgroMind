import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedDiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [analysisMode, setAnalysisMode] = useState('upload'); // 'upload' or 'camera'
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Simulate advanced AI disease detection
  const analyzeImage = useCallback(async (imageData) => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock AI analysis results
    const diseases = [
      {
        name: 'Late Blight',
        confidence: 94.5,
        severity: 'High',
        description: 'Phytophthora infestans infection commonly affecting tomatoes and potatoes',
        symptoms: ['Dark water-soaked lesions', 'White fungal growth', 'Yellowing leaves'],
        treatment: 'Apply copper-based fungicide immediately',
        prevention: 'Improve air circulation, avoid overhead watering'
      },
      {
        name: 'Early Blight',
        confidence: 87.2,
        severity: 'Medium',
        description: 'Alternaria solani fungal infection',
        symptoms: ['Concentric ring spots', 'Yellowing leaves', 'Defoliation'],
        treatment: 'Use chlorothalonil or mancozeb fungicides',
        prevention: 'Crop rotation, proper spacing'
      },
      {
        name: 'Bacterial Spot',
        confidence: 76.8,
        severity: 'Medium',
        description: 'Xanthomonas bacterial infection',
        symptoms: ['Small dark spots', 'Yellow halos', 'Fruit lesions'],
        treatment: 'Copper sprays, resistant varieties',
        prevention: 'Avoid overhead irrigation, sanitation'
      }
    ];

    const primaryDisease = diseases[0];
    const alternativeDisease = diseases[Math.floor(Math.random() * (diseases.length - 1)) + 1];

    const result = {
      id: Date.now(),
      image: imageData,
      timestamp: new Date(),
      primaryDetection: primaryDisease,
      alternativeDetections: [alternativeDisease],
      overallHealth: Math.random() > 0.5 ? 'Infected' : 'Healthy',
      recommendations: [
        'Immediate treatment required',
        'Monitor closely for spread',
        'Consider isolating affected plants',
        'Consult with agricultural expert'
      ],
      environmentalFactors: {
        humidity: 'High',
        temperature: 'Optimal for pathogen',
        rainfall: 'Recent heavy rain'
      }
    };

    setAnalysisResult(result);
    setDetectionHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10
    setIsAnalyzing(false);
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setSelectedImage(imageData);
        analyzeImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setAnalysisMode('camera');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setSelectedImage(imageData);
      analyzeImage(imageData);
      stopCamera();
    }
  };

  const AnalysisResults = ({ result }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Analysis Results</h3>
        <span className="text-sm text-gray-500">
          {result.timestamp.toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Detection */}
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border-l-4 ${
            result.primaryDetection.severity === 'High' ? 'border-red-500 bg-red-50' :
            result.primaryDetection.severity === 'Medium' ? 'border-yellow-500 bg-yellow-50' :
            'border-green-500 bg-green-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-lg">{result.primaryDetection.name}</h4>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  result.primaryDetection.severity === 'High' ? 'bg-red-200 text-red-800' :
                  result.primaryDetection.severity === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {result.primaryDetection.severity}
                </span>
                <span className="font-bold text-blue-600">
                  {result.primaryDetection.confidence}%
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-3">{result.primaryDetection.description}</p>
            
            <div className="space-y-2">
              <div>
                <h5 className="font-semibold text-sm">Symptoms:</h5>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {result.primaryDetection.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-sm">Treatment:</h5>
                <p className="text-sm text-gray-600">{result.primaryDetection.treatment}</p>
              </div>
              
              <div>
                <h5 className="font-semibold text-sm">Prevention:</h5>
                <p className="text-sm text-gray-600">{result.primaryDetection.prevention}</p>
              </div>
            </div>
          </div>

          {/* Alternative Detections */}
          <div className="space-y-2">
            <h4 className="font-bold">Alternative Possibilities:</h4>
            {result.alternativeDetections.map((disease, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{disease.name}</span>
                  <span className="text-blue-600 font-medium">{disease.confidence}%</span>
                </div>
                <p className="text-sm text-gray-600">{disease.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations & Environment */}
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-bold mb-3 text-blue-800">🎯 Recommendations</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-sm text-blue-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold mb-3">🌍 Environmental Factors</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">Humidity:</span>
                <span className="ml-2 text-gray-600">{result.environmentalFactors.humidity}</span>
              </div>
              <div>
                <span className="font-medium">Temperature:</span>
                <span className="ml-2 text-gray-600">{result.environmentalFactors.temperature}</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium">Recent Weather:</span>
                <span className="ml-2 text-gray-600">{result.environmentalFactors.rainfall}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-bold mb-3 text-green-800">📊 Plant Health Score</h4>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    result.overallHealth === 'Healthy' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: result.overallHealth === 'Healthy' ? '85%' : '25%' 
                  }}
                ></div>
              </div>
              <span className={`font-bold ${
                result.overallHealth === 'Healthy' ? 'text-green-600' : 'text-red-600'
              }`}>
                {result.overallHealth === 'Healthy' ? '85/100' : '25/100'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔬 Advanced Disease Detection
          </h1>
          <p className="text-gray-600">
            AI-powered plant disease identification with computer vision
          </p>
        </div>

        {/* Input Methods */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={() => setAnalysisMode('upload')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                analysisMode === 'upload'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📁 Upload Image
            </button>
            <button
              onClick={() => setAnalysisMode('camera')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                analysisMode === 'camera'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📷 Use Camera
            </button>
          </div>

          {analysisMode === 'upload' && (
            <div className="text-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-blue-500 cursor-pointer transition-colors"
              >
                <div className="text-6xl mb-4">📸</div>
                <p className="text-lg font-medium text-gray-700">
                  Click to upload plant image
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports JPG, PNG, WebP up to 10MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}

          {analysisMode === 'camera' && (
            <div className="text-center">
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  className="bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-600 transition-colors"
                >
                  📷 Start Camera
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="rounded-lg shadow-lg max-w-lg"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={capturePhoto}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      📸 Capture & Analyze
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">Analyzing Image...</h3>
              <p className="text-gray-600 mb-4">
                Our AI is examining your plant for diseases and health issues
              </p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Image */}
        {selectedImage && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-xl font-bold mb-4">Uploaded Image</h3>
            <img
              src={selectedImage}
              alt="Plant analysis"
              className="max-w-md mx-auto rounded-lg shadow-md"
            />
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysisResult && <AnalysisResults result={analysisResult} />}

        {/* Detection History */}
        {detectionHistory.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Detection History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {detectionHistory.map((detection, index) => (
                <motion.div
                  key={detection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setAnalysisResult(detection)}
                >
                  <img
                    src={detection.image}
                    alt="Detection"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-bold">{detection.primaryDetection.name}</h4>
                  <p className="text-sm text-gray-600">{detection.timestamp.toLocaleDateString()}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      detection.primaryDetection.severity === 'High' ? 'bg-red-100 text-red-800' :
                      detection.primaryDetection.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {detection.primaryDetection.severity}
                    </span>
                    <span className="font-bold text-blue-600">
                      {detection.primaryDetection.confidence}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedDiseaseDetection;
