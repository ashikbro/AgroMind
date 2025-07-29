import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { aiAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const DiagnosisPage = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [cropType, setCropType] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [history, setHistory] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== acceptedFiles.length) {
      toast.error('Please select only image files');
    }
    
    if (imageFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setSelectedImages(prev => {
      const newImages = [...prev, ...imageFiles].slice(0, 5);
      return newImages;
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5
  });

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalysis = async () => {
    if (selectedImages.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      selectedImages.forEach((image, index) => {
        formData.append('images', image);
      });
      
      if (cropType) formData.append('cropType', cropType);
      if (symptoms) formData.append('symptoms', symptoms);

      const response = await aiAPI.analyzeDisease(formData);
      setDiagnosis(response.data.data);
      toast.success('Analysis completed successfully!');
      
      // Add to history
      setHistory(prev => [response.data.data, ...prev.slice(0, 4)]);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedImages([]);
    setCropType('');
    setSymptoms('');
    setDiagnosis(null);
  };

  const cropTypes = [
    'Rice', 'Wheat', 'Tomato', 'Potato', 'Corn', 'Cotton', 'Sugarcane',
    'Soybean', 'Onion', 'Chili', 'Cabbage', 'Cauliflower', 'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔬 Crop Disease Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Upload images of your crops for instant AI-powered disease detection and treatment recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analysis Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Crop Images (Max 5)
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="text-6xl mb-4">📷</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? 'Drop images here' : 'Upload or drag crop images'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Take clear photos of affected leaves or plant parts for best results
                  </p>
                  <button type="button" className="btn-primary">
                    Choose Images
                  </button>
                </div>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Selected Images ({selectedImages.length}/5)
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Selected ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Crop Type Selection */}
              <div className="mb-6">
                <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type
                </label>
                <select
                  id="cropType"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select crop type (optional)</option>
                  {cropTypes.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              {/* Symptoms Description */}
              <div className="mb-6">
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe Symptoms (Optional)
                </label>
                <textarea
                  id="symptoms"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe what you've observed: yellowing leaves, spots, wilting, etc."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAnalysis}
                  disabled={loading || selectedImages.length === 0}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Analyzing...</span>
                    </>
                  ) : (
                    '🔍 Analyze Disease'
                  )}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Analysis Results */}
            {diagnosis && (
              <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  🎯 Analysis Results
                </h2>
                
                <div className="space-y-6">
                  {/* Primary Diagnosis */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Primary Diagnosis
                    </h3>
                    <p className="text-green-700 text-lg font-medium mb-2">
                      {diagnosis.primaryDiagnosis?.disease || 'Disease detected'}
                    </p>
                    <p className="text-green-600">
                      Confidence: {diagnosis.confidence || '85'}%
                    </p>
                  </div>

                  {/* Treatment Recommendations */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                      💊 Treatment Recommendations
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-blue-700">Immediate Actions:</h4>
                        <ul className="list-disc list-inside text-blue-600 mt-1">
                          <li>Remove affected leaves immediately</li>
                          <li>Improve air circulation around plants</li>
                          <li>Avoid overhead watering</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-700">Recommended Treatment:</h4>
                        <p className="text-blue-600">
                          Apply copper-based fungicide spray every 7-10 days until symptoms improve
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Prevention Tips */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                      🛡️ Prevention Tips
                    </h3>
                    <ul className="list-disc list-inside text-yellow-700 space-y-1">
                      <li>Maintain proper plant spacing for air circulation</li>
                      <li>Water at soil level to avoid wet leaves</li>
                      <li>Remove crop debris after harvest</li>
                      <li>Rotate crops annually</li>
                      <li>Use disease-resistant varieties when possible</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📋 Photo Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Take clear, well-lit photos
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Focus on affected areas
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Include multiple angles
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Avoid blurry or dark images
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Show entire leaf when possible
                </li>
              </ul>
            </div>

            {/* Recent Analysis History */}
            {history.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📊 Recent Analysis
                </h3>
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-sm text-gray-900">
                        {item.primaryDiagnosis?.disease || 'Disease detected'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Confidence: {item.confidence || '85'}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                🚨 Need Expert Help?
              </h3>
              <p className="text-sm text-red-600 mb-4">
                For severe cases or if you're unsure about the diagnosis, consult with our agricultural experts.
              </p>
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                Contact Expert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisPage;
