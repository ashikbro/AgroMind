import React, { useState, useEffect, useRef } from 'react';
import satelliteImageryService from '../services/SatelliteImageryService';

const FieldMapping = () => {
  const [selectedField, setSelectedField] = useState(null);
  const [fields, setFields] = useState([]);
  const [analysisMode, setAnalysisMode] = useState('health');
  const [loading, setLoading] = useState(false);
  const [mapData, setMapData] = useState(null);
  const [timeRange, setTimeRange] = useState('current');
  const [cropType, setCropType] = useState('wheat');
  const [showLegend, setShowLegend] = useState(true);
  const [tools, setTools] = useState({
    measure: false,
    draw: false,
    analyze: false
  });

  const mapRef = useRef(null);
  const canvasRef = useRef(null);

  const analysisModes = [
    { id: 'health', name: 'Crop Health', icon: '🌱' },
    { id: 'ndvi', name: 'NDVI Analysis', icon: '📊' },
    { id: 'water', name: 'Water Stress', icon: '💧' },
    { id: 'yield', name: 'Yield Prediction', icon: '🌾' },
    { id: 'change', name: 'Change Detection', icon: '🔄' },
    { id: 'boundaries', name: 'Field Boundaries', icon: '🗺️' }
  ];

  const timeRanges = [
    { id: 'current', name: 'Current (7 days)', days: 7 },
    { id: 'monthly', name: 'Monthly (30 days)', days: 30 },
    { id: 'seasonal', name: 'Seasonal (90 days)', days: 90 },
    { id: 'yearly', name: 'Yearly (365 days)', days: 365 }
  ];

  const cropTypes = [
    'wheat', 'corn', 'rice', 'soybeans', 'cotton', 'barley', 'oats', 'sorghum'
  ];

  useEffect(() => {
    initializeMap();
    loadFields();
  }, []);

  useEffect(() => {
    if (selectedField && analysisMode) {
      performAnalysis();
    }
  }, [selectedField, analysisMode, timeRange, cropType]);

  const initializeMap = () => {
    // Initialize map with sample fields
    const sampleFields = [
      {
        id: 'field_1',
        name: 'North Field',
        coordinates: [
          [40.7128, -74.0060],
          [40.7138, -74.0060],
          [40.7138, -74.0040],
          [40.7128, -74.0040],
          [40.7128, -74.0060]
        ],
        area: 25.6,
        cropType: 'wheat',
        plantingDate: '2024-03-15',
        center: [40.7133, -74.0050]
      },
      {
        id: 'field_2',
        name: 'South Field',
        coordinates: [
          [40.7100, -74.0080],
          [40.7120, -74.0080],
          [40.7120, -74.0050],
          [40.7100, -74.0050],
          [40.7100, -74.0080]
        ],
        area: 18.3,
        cropType: 'corn',
        plantingDate: '2024-04-01',
        center: [40.7110, -74.0065]
      },
      {
        id: 'field_3',
        name: 'East Field',
        coordinates: [
          [40.7150, -74.0030],
          [40.7170, -74.0030],
          [40.7170, -74.0010],
          [40.7150, -74.0010],
          [40.7150, -74.0030]
        ],
        area: 15.8,
        cropType: 'rice',
        plantingDate: '2024-03-20',
        center: [40.7160, -74.0020]
      }
    ];

    setFields(sampleFields);
    if (sampleFields.length > 0) {
      setSelectedField(sampleFields[0]);
    }
  };

  const loadFields = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from API
      // const response = await fetch('/api/fields');
      // const fieldsData = await response.json();
      // setFields(fieldsData);
    } catch (error) {
      console.error('Failed to load fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const performAnalysis = async () => {
    if (!selectedField) return;

    try {
      setLoading(true);
      
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - (timeRanges.find(r => r.id === timeRange)?.days || 7) * 24 * 60 * 60 * 1000);
      
      const fieldBounds = calculateFieldBounds(selectedField.coordinates);
      
      let analysisData;
      
      switch (analysisMode) {
        case 'health':
          analysisData = await satelliteImageryService.analyzeCropHealth(
            fieldBounds,
            cropType,
            { timeRange: timeRanges.find(r => r.id === timeRange)?.days || 7 }
          );
          break;
          
        case 'ndvi':
          const imagery = await satelliteImageryService.getSatelliteImagery({
            bounds: fieldBounds,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            spectralBand: 'ndvi'
          });
          analysisData = await satelliteImageryService.calculateVegetationIndices(imagery, fieldBounds);
          break;
          
        case 'yield':
          analysisData = await satelliteImageryService.predictYield(
            fieldBounds,
            cropType,
            selectedField.plantingDate
          );
          break;
          
        case 'boundaries':
          analysisData = await satelliteImageryService.detectFieldBoundaries(
            selectedField.center,
            1000
          );
          break;
          
        case 'change':
          const compareDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
          analysisData = await satelliteImageryService.detectChanges(
            fieldBounds,
            compareDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0]
          );
          break;
          
        default:
          analysisData = null;
      }
      
      setMapData(analysisData);
      renderAnalysisData(analysisData);
      
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFieldBounds = (coordinates) => {
    const lats = coordinates.map(coord => coord[0]);
    const lngs = coordinates.map(coord => coord[1]);
    
    return [
      Math.min(...lats),
      Math.min(...lngs),
      Math.max(...lats),
      Math.max(...lngs)
    ];
  };

  const renderAnalysisData = (data) => {
    if (!canvasRef.current || !data) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render based on analysis mode
    switch (analysisMode) {
      case 'health':
        renderHealthMap(ctx, data);
        break;
      case 'ndvi':
        renderNDVIMap(ctx, data);
        break;
      case 'yield':
        renderYieldMap(ctx, data);
        break;
      case 'boundaries':
        renderBoundariesMap(ctx, data);
        break;
      case 'change':
        renderChangeMap(ctx, data);
        break;
    }
  };

  const renderHealthMap = (ctx, healthData) => {
    const { healthAnalysis } = healthData;
    
    // Create health visualization
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    
    if (healthAnalysis.overallHealth === 'good') {
      gradient.addColorStop(0, '#22c55e'); // Green
      gradient.addColorStop(1, '#16a34a');
    } else if (healthAnalysis.overallHealth === 'moderate') {
      gradient.addColorStop(0, '#eab308'); // Yellow
      gradient.addColorStop(1, '#ca8a04');
    } else {
      gradient.addColorStop(0, '#ef4444'); // Red
      gradient.addColorStop(1, '#dc2626');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);
    
    // Add health score overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 120, 40);
    
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(`Health Score: ${healthAnalysis.healthScore}%`, 20, 30);
  };

  const renderNDVIMap = (ctx, ndviData) => {
    // NDVI visualization with color scale
    const { ndvi } = ndviData;
    
    if (!ndvi || ndvi.length === 0) return;
    
    const size = Math.sqrt(ndvi.length);
    const cellWidth = 400 / size;
    const cellHeight = 300 / size;
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const value = ndvi[i * size + j];
        const color = getNDVIColor(value);
        
        ctx.fillStyle = color;
        ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
      }
    }
  };

  const renderYieldMap = (ctx, yieldData) => {
    const { yieldPrediction } = yieldData;
    
    // Yield prediction visualization
    ctx.fillStyle = 'rgba(34, 197, 94, 0.8)';
    ctx.fillRect(0, 0, 400, 300);
    
    // Add yield information
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 200, 80);
    
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Predicted Yield:`, 20, 30);
    ctx.fillText(`${yieldPrediction.predictedYield} ${yieldPrediction.unit}`, 20, 50);
    ctx.fillText(`Confidence: ${(yieldPrediction.confidence * 100).toFixed(1)}%`, 20, 70);
  };

  const renderBoundariesMap = (ctx, boundaryData) => {
    const { detectedFields } = boundaryData;
    
    // Clear and set base color
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 400, 300);
    
    // Draw detected boundaries
    detectedFields.forEach((field, index) => {
      ctx.strokeStyle = `hsl(${index * 60}, 70%, 50%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Simplified boundary drawing
      const points = generateBoundaryPoints(field, 400, 300);
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.stroke();
      
      // Add field label
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.fillText(`Field ${index + 1}`, points[0].x + 5, points[0].y - 5);
    });
  };

  const renderChangeMap = (ctx, changeData) => {
    const { changeAnalysis } = changeData;
    
    // Change detection visualization
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 400, 300);
    
    // Highlight changed areas
    changeAnalysis.changedRegions.forEach((region, index) => {
      const color = region.changeValue < 0 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(34, 197, 94, 0.6)';
      ctx.fillStyle = color;
      
      // Simplified change region drawing
      const rect = {
        x: Math.random() * 300,
        y: Math.random() * 200,
        width: 80 + Math.random() * 40,
        height: 60 + Math.random() * 40
      };
      
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.strokeStyle = region.changeValue < 0 ? '#dc2626' : '#16a34a';
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    });
    
    // Add change statistics
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 250, 180, 40);
    
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(`Change: ${changeAnalysis.changePercentage.toFixed(1)}%`, 20, 270);
    ctx.fillText(`Type: ${changeAnalysis.changeType}`, 20, 285);
  };

  const getNDVIColor = (value) => {
    // NDVI color scale: Red (low) -> Yellow -> Green (high)
    if (value < 0) return '#8b4513'; // Brown for bare soil/water
    if (value < 0.2) return '#ff0000'; // Red for very low vegetation
    if (value < 0.4) return '#ff8000'; // Orange for low vegetation
    if (value < 0.6) return '#ffff00'; // Yellow for moderate vegetation
    if (value < 0.8) return '#80ff00'; // Light green for good vegetation
    return '#00ff00'; // Green for excellent vegetation
  };

  const generateBoundaryPoints = (field, canvasWidth, canvasHeight) => {
    // Convert field coordinates to canvas coordinates
    const numPoints = 8;
    const points = [];
    
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: 50 + Math.random() * (canvasWidth - 100),
        y: 50 + Math.random() * (canvasHeight - 100)
      });
    }
    
    return points;
  };

  const toggleTool = (tool) => {
    setTools(prev => ({
      ...prev,
      [tool]: !prev[tool]
    }));
  };

  const exportAnalysis = () => {
    if (!mapData) return;
    
    const exportData = {
      field: selectedField,
      analysisMode,
      timeRange,
      cropType,
      data: mapData,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `field_analysis_${selectedField?.id}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="field-mapping-container h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            🗺️ Field Mapping & Analysis
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportAnalysis}
              disabled={!mapData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              📤 Export Analysis
            </button>
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              {showLegend ? '🙈 Hide Legend' : '👁️ Show Legend'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg overflow-y-auto">
          {/* Field Selection */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg mb-3">Select Field</h3>
            <div className="space-y-2">
              {fields.map(field => (
                <button
                  key={field.id}
                  onClick={() => setSelectedField(field)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedField?.id === field.id
                      ? 'bg-blue-50 border-blue-300 text-blue-900'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{field.name}</div>
                  <div className="text-sm text-gray-600">
                    {field.area} hectares • {field.cropType}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Mode */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg mb-3">Analysis Mode</h3>
            <div className="grid grid-cols-2 gap-2">
              {analysisModes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setAnalysisMode(mode.id)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    analysisMode === mode.id
                      ? 'bg-green-50 border-green-300 text-green-900'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-lg">{mode.icon}</div>
                  <div className="text-xs font-medium">{mode.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg mb-3">Time Range</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {timeRanges.map(range => (
                <option key={range.id} value={range.id}>
                  {range.name}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Type */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg mb-3">Crop Type</h3>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {cropTypes.map(crop => (
                <option key={crop} value={crop}>
                  {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Tools */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg mb-3">Tools</h3>
            <div className="space-y-2">
              {Object.entries(tools).map(([tool, active]) => (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={`w-full p-2 rounded-lg border transition-colors ${
                    active
                      ? 'bg-purple-50 border-purple-300 text-purple-900'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {tool === 'measure' && '📏 Measure'}
                  {tool === 'draw' && '✏️ Draw'}
                  {tool === 'analyze' && '🔍 Analyze'}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Results */}
          {mapData && (
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-3">Analysis Results</h3>
              <div className="space-y-3">
                {analysisMode === 'health' && mapData.healthAnalysis && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium mb-2">Crop Health</div>
                    <div className="text-sm space-y-1">
                      <div>Score: {mapData.healthAnalysis.healthScore}%</div>
                      <div>Status: {mapData.healthAnalysis.overallHealth}</div>
                      <div className="text-xs text-gray-600">
                        Issues: {mapData.healthAnalysis.issues.length}
                      </div>
                    </div>
                  </div>
                )}

                {analysisMode === 'yield' && mapData.yieldPrediction && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium mb-2">Yield Prediction</div>
                    <div className="text-sm space-y-1">
                      <div>Predicted: {mapData.yieldPrediction.predictedYield} {mapData.yieldPrediction.unit}</div>
                      <div>Confidence: {(mapData.yieldPrediction.confidence * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                )}

                {analysisMode === 'change' && mapData.changeAnalysis && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium mb-2">Change Detection</div>
                    <div className="text-sm space-y-1">
                      <div>Change: {mapData.changeAnalysis.changePercentage.toFixed(1)}%</div>
                      <div>Type: {mapData.changeAnalysis.changeType}</div>
                      <div>Area: {mapData.changeAnalysis.totalChangedArea} ha</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative">
          {/* Map Canvas */}
          <div className="h-full bg-gray-100 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="border border-gray-300 bg-white shadow-lg"
            />
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div className="text-lg font-medium">Analyzing field data...</div>
              </div>
            </div>
          )}

          {/* Legend */}
          {showLegend && (
            <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
              <h4 className="font-semibold mb-3">Legend</h4>
              {analysisMode === 'ndvi' && (
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 mr-2"></div>
                    <span>Low NDVI (&lt; 0.2)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                    <span>Moderate NDVI (0.2-0.6)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 mr-2"></div>
                    <span>High NDVI (&gt; 0.6)</span>
                  </div>
                </div>
              )}
              {analysisMode === 'health' && (
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 mr-2"></div>
                    <span>Healthy</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 mr-2"></div>
                    <span>Poor Health</span>
                  </div>
                </div>
              )}
              {analysisMode === 'change' && (
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 mr-2"></div>
                    <span>Vegetation Decrease</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 mr-2"></div>
                    <span>Vegetation Increase</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldMapping;
