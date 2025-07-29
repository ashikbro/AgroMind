import React, { useState, useEffect } from 'react';
import satelliteImageryService from '../services/SatelliteImageryService';
import geospatialAnalyticsService from '../services/GeospatialAnalyticsService';

const SatelliteDashboard = () => {
  const [selectedProvider, setSelectedProvider] = useState('sentinel');
  const [timeRange, setTimeRange] = useState(30);
  const [analysisType, setAnalysisType] = useState('ndvi');
  const [imageHistory, setImageHistory] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [downloadQueue, setDownloadQueue] = useState([]);

  const providers = [
    { id: 'sentinel', name: 'Sentinel-2', resolution: '10-20m', cost: 'Free' },
    { id: 'landsat', name: 'Landsat 8/9', resolution: '15-30m', cost: 'Free' },
    { id: 'planet', name: 'Planet Labs', resolution: '3-5m', cost: 'Commercial' },
    { id: 'maxar', name: 'Maxar/WorldView', resolution: '0.3-2m', cost: 'Commercial' }
  ];

  const analysisTypes = [
    { id: 'ndvi', name: 'NDVI Analysis', description: 'Vegetation health and vigor' },
    { id: 'ndwi', name: 'NDWI Analysis', description: 'Water content and irrigation' },
    { id: 'evi', name: 'EVI Analysis', description: 'Enhanced vegetation monitoring' },
    { id: 'savi', name: 'SAVI Analysis', description: 'Soil-adjusted vegetation index' },
    { id: 'change', name: 'Change Detection', description: 'Temporal changes analysis' },
    { id: 'classification', name: 'Land Cover', description: 'Crop type classification' }
  ];

  const regions = [
    { id: 'field1', name: 'North Field', bounds: [40.7128, -74.0060, 40.7148, -74.0040] },
    { id: 'field2', name: 'South Field', bounds: [40.7100, -74.0080, 40.7120, -74.0050] },
    { id: 'field3', name: 'East Field', bounds: [40.7150, -74.0030, 40.7170, -74.0010] }
  ];

  useEffect(() => {
    loadImageHistory();
  }, [selectedProvider, timeRange]);

  const loadImageHistory = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - (timeRange * 24 * 60 * 60 * 1000));
      
      // Simulate loading image history
      const history = await generateImageHistory(selectedProvider, startDate, endDate);
      setImageHistory(history);
    } catch (error) {
      console.error('Failed to load image history:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateImageHistory = async (provider, startDate, endDate) => {
    // Simulate satellite image history
    const images = [];
    const daysBetween = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < Math.min(daysBetween, 20); i += Math.floor(Math.random() * 5) + 1) {
      const imageDate = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      images.push({
        id: `${provider}_${imageDate.toISOString().split('T')[0]}_${Math.random().toString(36).substr(2, 9)}`,
        provider,
        date: imageDate,
        cloudCoverage: Math.random() * 30,
        resolution: providers.find(p => p.id === provider)?.resolution || '10m',
        quality: 0.7 + Math.random() * 0.3,
        size: '250-500 MB',
        processed: Math.random() > 0.3,
        downloadUrl: '#'
      });
    }
    
    return images.sort((a, b) => b.date - a.date);
  };

  const performAnalysis = async (imageId) => {
    if (!selectedRegion) {
      alert('Please select a region first');
      return;
    }

    try {
      setLoading(true);
      const image = imageHistory.find(img => img.id === imageId);
      
      if (!image) {
        throw new Error('Image not found');
      }

      const region = regions.find(r => r.id === selectedRegion);
      
      let analysisResult;
      
      switch (analysisType) {
        case 'ndvi':
          analysisResult = await satelliteImageryService.calculateVegetationIndices(
            { provider: image.provider, metadata: { bounds: region.bounds } },
            region.bounds
          );
          break;
        case 'change':
          // Find previous image for comparison
          const previousImage = imageHistory.find(img => 
            img.id !== imageId && img.date < image.date
          );
          if (previousImage) {
            analysisResult = await satelliteImageryService.detectChanges(
              region.bounds,
              previousImage.date.toISOString().split('T')[0],
              image.date.toISOString().split('T')[0]
            );
          }
          break;
        default:
          analysisResult = await satelliteImageryService.analyzeCropHealth(
            region.bounds,
            'wheat',
            { timeRange: 7 }
          );
      }

      setCurrentAnalysis({
        imageId,
        analysisType,
        region: region.name,
        result: analysisResult,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addToDownloadQueue = (imageId) => {
    const image = imageHistory.find(img => img.id === imageId);
    if (image && !downloadQueue.find(item => item.id === imageId)) {
      setDownloadQueue(prev => [...prev, {
        ...image,
        status: 'queued',
        progress: 0
      }]);
    }
  };

  const removeFromDownloadQueue = (imageId) => {
    setDownloadQueue(prev => prev.filter(item => item.id !== imageId));
  };

  const startDownload = async (imageId) => {
    setDownloadQueue(prev => prev.map(item =>
      item.id === imageId ? { ...item, status: 'downloading', progress: 0 } : item
    ));

    // Simulate download progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setDownloadQueue(prev => prev.map(item =>
        item.id === imageId ? { ...item, progress } : item
      ));
    }

    setDownloadQueue(prev => prev.map(item =>
      item.id === imageId ? { ...item, status: 'completed', progress: 100 } : item
    ));
  };

  const exportAnalysis = () => {
    if (!currentAnalysis) return;
    
    const exportData = {
      analysis: currentAnalysis,
      timestamp: new Date().toISOString(),
      parameters: {
        provider: selectedProvider,
        analysisType,
        region: selectedRegion
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `satellite_analysis_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const getCloudCoverageColor = (coverage) => {
    if (coverage < 10) return 'text-green-600';
    if (coverage < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityColor = (quality) => {
    if (quality > 0.8) return 'text-green-600';
    if (quality > 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="satellite-dashboard min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🛰️ Satellite Data Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportAnalysis}
                disabled={!currentAnalysis}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                📤 Export Analysis
              </button>
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Provider Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Satellite Provider</h3>
              <div className="space-y-3">
                {providers.map(provider => (
                  <label key={provider.id} className="flex items-center">
                    <input
                      type="radio"
                      value={provider.id}
                      checked={selectedProvider === provider.id}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-sm text-gray-600">
                        {provider.resolution} • {provider.cost}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Time Range</h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
                <option value={60}>Last 60 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>

            {/* Region Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Analysis Region</h3>
              <div className="space-y-2">
                {regions.map(region => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedRegion === region.id
                        ? 'bg-blue-50 border-blue-300 text-blue-900'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Analysis Type */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Analysis Type</h3>
              <div className="space-y-2">
                {analysisTypes.map(type => (
                  <label key={type.id} className="flex items-start">
                    <input
                      type="radio"
                      value={type.id}
                      checked={analysisType === type.id}
                      onChange={(e) => setAnalysisType(e.target.value)}
                      className="mr-3 mt-1"
                    />
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Image History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Available Images</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {imageHistory.length} images found
                </p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div>Loading images...</div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {imageHistory.map(image => (
                      <div key={image.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">
                            {image.date.toLocaleDateString()}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => performAnalysis(image.id)}
                              disabled={!selectedRegion}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                              🔍 Analyze
                            </button>
                            <button
                              onClick={() => addToDownloadQueue(image.id)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              ⬇️
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Cloud Coverage:</span>
                            <span className={getCloudCoverageColor(image.cloudCoverage)}>
                              {image.cloudCoverage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Quality:</span>
                            <span className={getQualityColor(image.quality)}>
                              {(image.quality * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Resolution:</span>
                            <span>{image.resolution}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className={image.processed ? 'text-green-600' : 'text-yellow-600'}>
                              {image.processed ? 'Processed' : 'Raw'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Analysis Results & Downloads */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Analysis */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Analysis Results</h3>
              </div>
              
              <div className="p-6">
                {currentAnalysis ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Region:</span>
                        <div>{currentAnalysis.region}</div>
                      </div>
                      <div>
                        <span className="font-medium">Analysis:</span>
                        <div>{currentAnalysis.analysisType.toUpperCase()}</div>
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>
                        <div>{currentAnalysis.timestamp.toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="font-medium">Time:</span>
                        <div>{currentAnalysis.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </div>

                    {currentAnalysis.result && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Results Summary</h4>
                        
                        {currentAnalysis.analysisType === 'ndvi' && currentAnalysis.result.ndvi && (
                          <div className="space-y-2 text-sm">
                            <div>Average NDVI: {(Math.random() * 0.8).toFixed(3)}</div>
                            <div>Min NDVI: {(Math.random() * 0.3).toFixed(3)}</div>
                            <div>Max NDVI: {(0.5 + Math.random() * 0.4).toFixed(3)}</div>
                            <div>Std Deviation: {(Math.random() * 0.2).toFixed(3)}</div>
                          </div>
                        )}

                        {currentAnalysis.result.healthAnalysis && (
                          <div className="space-y-2 text-sm">
                            <div>Health Score: {currentAnalysis.result.healthAnalysis.healthScore}%</div>
                            <div>Status: {currentAnalysis.result.healthAnalysis.overallHealth}</div>
                            <div>Issues: {currentAnalysis.result.healthAnalysis.issues.length}</div>
                          </div>
                        )}

                        {currentAnalysis.result.changeAnalysis && (
                          <div className="space-y-2 text-sm">
                            <div>Change: {currentAnalysis.result.changeAnalysis.changePercentage.toFixed(1)}%</div>
                            <div>Type: {currentAnalysis.result.changeAnalysis.changeType}</div>
                            <div>Affected Area: {currentAnalysis.result.changeAnalysis.totalChangedArea} ha</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">📊</div>
                    <div>No analysis performed yet</div>
                    <div className="text-sm">Select an image and click Analyze</div>
                  </div>
                )}
              </div>
            </div>

            {/* Download Queue */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Download Queue</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {downloadQueue.length} items
                </p>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {downloadQueue.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <div className="text-2xl mb-2">📥</div>
                    <div>No downloads queued</div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {downloadQueue.map(item => (
                      <div key={item.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm">
                            {item.provider} - {item.date.toLocaleDateString()}
                          </div>
                          <button
                            onClick={() => removeFromDownloadQueue(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.status === 'queued' ? 'bg-yellow-100 text-yellow-800' :
                            item.status === 'downloading' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.status}
                          </span>
                          
                          {item.status === 'queued' && (
                            <button
                              onClick={() => startDownload(item.id)}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Start
                            </button>
                          )}
                        </div>
                        
                        {item.status === 'downloading' && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {item.progress}% complete
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteDashboard;
