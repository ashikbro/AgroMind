import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { weatherAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const WeatherPage = () => {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      
      // Use user's farm location or allow manual input
      const userLocation = user?.farmDetails?.location?.district || location;
      
      if (!userLocation) {
        setLoading(false);
        return;
      }

      const [weatherResponse, forecastResponse, alertsResponse] = await Promise.all([
        weatherAPI.getCurrentWeather(userLocation),
        weatherAPI.getForecast(userLocation),
        weatherAPI.getWeatherAlerts(userLocation)
      ]);

      setWeatherData(weatherResponse.data.data);
      setForecast(forecastResponse.data.data);
      setAlerts(alertsResponse.data.data || []);
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast.error('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      'clear': '☀️',
      'cloudy': '☁️',
      'rainy': '🌧️',
      'stormy': '⛈️',
      'snowy': '❄️',
      'foggy': '🌫️',
      'windy': '💨'
    };
    return icons[condition?.toLowerCase()] || '🌤️';
  };

  const getAlertIcon = (type) => {
    const icons = {
      'storm': '⛈️',
      'flood': '🌊',
      'drought': '🌵',
      'frost': '🧊',
      'heatwave': '🔥',
      'wind': '💨'
    };
    return icons[type?.toLowerCase()] || '⚠️';
  };

  const getRecommendations = (weather) => {
    const recommendations = [];
    
    if (weather?.temperature > 35) {
      recommendations.push({
        icon: '💧',
        text: 'High temperature detected. Increase irrigation frequency.',
        type: 'warning'
      });
    }
    
    if (weather?.humidity > 80) {
      recommendations.push({
        icon: '🍄',
        text: 'High humidity may cause fungal diseases. Monitor crops closely.',
        type: 'info'
      });
    }
    
    if (weather?.rainfall > 50) {
      recommendations.push({
        icon: '🌊',
        text: 'Heavy rainfall expected. Ensure proper drainage.',
        type: 'warning'
      });
    }
    
    if (weather?.windSpeed > 25) {
      recommendations.push({
        icon: '💨',
        text: 'Strong winds forecasted. Secure young plants.',
        type: 'alert'
      });
    }

    return recommendations;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🌤️ Weather Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Real-time weather data and agricultural alerts for your farm
          </p>
        </div>

        {/* Location Input */}
        {!weatherData && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Enter Your Location
            </h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city or district name"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button
                onClick={fetchWeatherData}
                className="btn-primary px-6"
              >
                Get Weather
              </button>
            </div>
          </div>
        )}

        {weatherData && (
          <>
            {/* Weather Alerts */}
            {alerts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  🚨 Weather Alerts
                </h2>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">{getAlertIcon(alert.type)}</span>
                        <div>
                          <h3 className="font-semibold text-red-800">{alert.title}</h3>
                          <p className="text-red-600 text-sm">{alert.description}</p>
                          <p className="text-red-500 text-xs mt-1">
                            Valid until: {new Date(alert.validUntil).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Current Weather */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Current Weather
                    </h2>
                    <button
                      onClick={fetchWeatherData}
                      className="text-green-600 hover:text-green-700 transition-colors"
                    >
                      🔄 Refresh
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Weather Info */}
                    <div className="text-center">
                      <div className="text-6xl mb-4">
                        {getWeatherIcon(weatherData.condition)}
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {weatherData.temperature}°C
                      </h3>
                      <p className="text-lg text-gray-600 capitalize">
                        {weatherData.condition}
                      </p>
                      <p className="text-sm text-gray-500">
                        Feels like {weatherData.feelsLike}°C
                      </p>
                    </div>

                    {/* Weather Details */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">💧 Humidity:</span>
                        <span className="font-medium">{weatherData.humidity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">💨 Wind Speed:</span>
                        <span className="font-medium">{weatherData.windSpeed} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">🌧️ Rainfall:</span>
                        <span className="font-medium">{weatherData.rainfall || 0} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">👁️ Visibility:</span>
                        <span className="font-medium">{weatherData.visibility} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">📊 Pressure:</span>
                        <span className="font-medium">{weatherData.pressure} hPa</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">🌅 UV Index:</span>
                        <span className="font-medium">{weatherData.uvIndex}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7-Day Forecast */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    7-Day Forecast
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                    {forecast.map((day, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                        </p>
                        <div className="text-3xl mb-2">
                          {getWeatherIcon(day.condition)}
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-gray-900">{day.maxTemp}°</p>
                          <p className="text-sm text-gray-500">{day.minTemp}°</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          🌧️ {day.rainChance}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Agricultural Recommendations */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🌾 Farm Recommendations
                  </h3>
                  <div className="space-y-3">
                    {getRecommendations(weatherData).map((rec, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        rec.type === 'alert' ? 'bg-red-50 border border-red-200' :
                        rec.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                        'bg-blue-50 border border-blue-200'
                      }`}>
                        <div className="flex items-start">
                          <span className="text-lg mr-2">{rec.icon}</span>
                          <p className={`text-sm ${
                            rec.type === 'alert' ? 'text-red-700' :
                            rec.type === 'warning' ? 'text-yellow-700' :
                            'text-blue-700'
                          }`}>
                            {rec.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Times for Farming */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    ⏰ Today's Best Times
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">🌱 Planting:</span>
                      <span className="font-medium text-green-600">6:00 - 9:00 AM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">💧 Watering:</span>
                      <span className="font-medium text-blue-600">5:30 - 7:00 AM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">🚜 Field Work:</span>
                      <span className="font-medium text-purple-600">8:00 - 11:00 AM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">🌿 Harvesting:</span>
                      <span className="font-medium text-orange-600">6:00 - 10:00 AM</span>
                    </div>
                  </div>
                </div>

                {/* Soil Conditions */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🌍 Soil Conditions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Moisture Level:</span>
                      <span className="font-medium text-green-600">
                        {weatherData.humidity > 70 ? 'High' : weatherData.humidity > 40 ? 'Moderate' : 'Low'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature:</span>
                      <span className="font-medium">
                        {weatherData.temperature > 30 ? 'Warm' : weatherData.temperature > 20 ? 'Moderate' : 'Cool'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Workability:</span>
                      <span className="font-medium text-blue-600">
                        {weatherData.rainfall > 10 ? 'Poor' : 'Good'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    ⚡ Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors text-sm">
                      📱 Set Weather Alerts
                    </button>
                    <button className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                      📊 View Historical Data
                    </button>
                    <button className="w-full bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                      🌾 Crop Calendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
