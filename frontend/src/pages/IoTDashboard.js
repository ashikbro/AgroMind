import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const IoTDashboard = () => {
  const [sensorData, setSensorData] = useState({
    soilMoisture: [],
    temperature: [],
    humidity: [],
    phLevel: [],
    lightIntensity: []
  });
  const [isConnected, setIsConnected] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate IoT sensor data
    const generateSensorData = () => {
      const now = new Date();
      const timeStamp = now.toLocaleTimeString();
      
      const newDataPoint = {
        time: timeStamp,
        timestamp: now,
        soilMoisture: Math.random() * 40 + 30, // 30-70%
        temperature: Math.random() * 15 + 20, // 20-35°C
        humidity: Math.random() * 30 + 50, // 50-80%
        phLevel: Math.random() * 2 + 6, // 6-8 pH
        lightIntensity: Math.random() * 50000 + 20000 // 20k-70k lux
      };

      setSensorData(prev => ({
        soilMoisture: [...prev.soilMoisture.slice(-19), newDataPoint],
        temperature: [...prev.temperature.slice(-19), newDataPoint],
        humidity: [...prev.humidity.slice(-19), newDataPoint],
        phLevel: [...prev.phLevel.slice(-19), newDataPoint],
        lightIntensity: [...prev.lightIntensity.slice(-19), newDataPoint]
      }));

      // Check for alerts
      checkAlerts(newDataPoint);
      setLastUpdate(now);
    };

    const checkAlerts = (data) => {
      const newAlerts = [];
      
      if (data.soilMoisture < 35) {
        newAlerts.push({
          id: Date.now() + 1,
          type: 'warning',
          sensor: 'Soil Moisture',
          message: `Low soil moisture detected: ${data.soilMoisture.toFixed(1)}%`,
          action: 'Consider irrigation',
          timestamp: new Date()
        });
      }
      
      if (data.temperature > 32) {
        newAlerts.push({
          id: Date.now() + 2,
          type: 'alert',
          sensor: 'Temperature',
          message: `High temperature: ${data.temperature.toFixed(1)}°C`,
          action: 'Provide shade or cooling',
          timestamp: new Date()
        });
      }
      
      if (data.phLevel < 6.2 || data.phLevel > 7.8) {
        newAlerts.push({
          id: Date.now() + 3,
          type: 'warning',
          sensor: 'pH Level',
          message: `pH out of optimal range: ${data.phLevel.toFixed(1)}`,
          action: 'Adjust soil pH',
          timestamp: new Date()
        });
      }

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev.slice(0, 9)]); // Keep last 10 alerts
      }
    };

    // Simulate connection
    setIsConnected(true);
    const interval = setInterval(generateSensorData, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getCurrentValue = (sensorType) => {
    const data = sensorData[sensorType];
    return data.length > 0 ? data[data.length - 1] : null;
  };

  const SensorCard = ({ title, value, unit, icon, color, optimal, status }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{icon}</div>
          <div>
            <h3 className="font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{optimal}</p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold" style={{ color }}>
            {value?.toFixed(1) || '--'}
            <span className="text-lg text-gray-500 ml-1">{unit}</span>
          </div>
          <div className={`text-sm font-medium ${
            status === 'optimal' ? 'text-green-600' : 
            status === 'warning' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {status === 'optimal' ? '✓ Optimal' : 
             status === 'warning' ? '⚠ Warning' : '🚨 Alert'}
          </div>
        </div>
      </div>
    </div>
  );

  const getStatus = (value, min, max) => {
    if (!value) return 'unknown';
    if (value >= min && value <= max) return 'optimal';
    if (value < min * 0.8 || value > max * 1.2) return 'alert';
    return 'warning';
  };

  const currentSoilMoisture = getCurrentValue('soilMoisture');
  const currentTemperature = getCurrentValue('temperature');
  const currentHumidity = getCurrentValue('humidity');
  const currentPH = getCurrentValue('phLevel');
  const currentLight = getCurrentValue('lightIntensity');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">IoT Sensor Dashboard</h1>
            <p className="text-gray-600">Real-time monitoring of your farm conditions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="text-sm text-gray-500">
              Last update: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Sensor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SensorCard
            title="Soil Moisture"
            value={currentSoilMoisture?.soilMoisture}
            unit="%"
            icon="💧"
            color="#3B82F6"
            optimal="Optimal: 40-60%"
            status={getStatus(currentSoilMoisture?.soilMoisture, 40, 60)}
          />
          
          <SensorCard
            title="Temperature"
            value={currentTemperature?.temperature}
            unit="°C"
            icon="🌡️"
            color="#EF4444"
            optimal="Optimal: 22-28°C"
            status={getStatus(currentTemperature?.temperature, 22, 28)}
          />
          
          <SensorCard
            title="Humidity"
            value={currentHumidity?.humidity}
            unit="%"
            icon="☁️"
            color="#10B981"
            optimal="Optimal: 60-70%"
            status={getStatus(currentHumidity?.humidity, 60, 70)}
          />
          
          <SensorCard
            title="pH Level"
            value={currentPH?.phLevel}
            unit="pH"
            icon="🧪"
            color="#8B5CF6"
            optimal="Optimal: 6.5-7.5"
            status={getStatus(currentPH?.phLevel, 6.5, 7.5)}
          />
          
          <SensorCard
            title="Light Intensity"
            value={currentLight?.lightIntensity}
            unit="lux"
            icon="☀️"
            color="#F59E0B"
            optimal="Optimal: 30k-50k lux"
            status={getStatus(currentLight?.lightIntensity, 30000, 50000)}
          />
          
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="font-bold">Automation</h3>
                <p className="text-blue-100 text-sm">Smart controls active</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Auto Irrigation</span>
                <span className="text-green-300">● ON</span>
              </div>
              <div className="flex justify-between">
                <span>Climate Control</span>
                <span className="text-green-300">● ON</span>
              </div>
              <div className="flex justify-between">
                <span>Fertilizer System</span>
                <span className="text-yellow-300">● STANDBY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Soil Moisture Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sensorData.soilMoisture}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="soilMoisture" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Temperature & Humidity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorData.temperature}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="humidity" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Recent Alerts & Notifications</h3>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">✅</div>
              <p>All sensors are operating within normal parameters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'alert' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${
                          alert.type === 'alert' ? 'text-red-800' : 'text-yellow-800'
                        }`}>
                          {alert.sensor}
                        </span>
                        <span className="text-sm text-gray-500">
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={`${alert.type === 'alert' ? 'text-red-700' : 'text-yellow-700'}`}>
                        {alert.message}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Recommended action:</strong> {alert.action}
                      </p>
                    </div>
                    <button className={`px-3 py-1 text-xs rounded-full ${
                      alert.type === 'alert' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    } transition-colors`}>
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IoTDashboard;
