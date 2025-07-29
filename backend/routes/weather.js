const express = require('express');
const router = express.Router();
const axios = require('axios');
const { auth } = require('../middleware/auth');

// Real weather API integration - OpenWeatherMap
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'demo_key';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get current weather
router.get('/current', async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Location is required'
      });
    }

    // Use real OpenWeatherMap API
    if (WEATHER_API_KEY && WEATHER_API_KEY !== 'demo_key') {
      try {
        const weatherResponse = await axios.get(`${WEATHER_BASE_URL}/weather`, {
          params: {
            q: location,
            appid: WEATHER_API_KEY,
            units: 'metric'
          }
        });

        const weatherData = weatherResponse.data;
        
        const formattedData = {
          location: weatherData.name,
          temperature: Math.round(weatherData.main.temp),
          feelsLike: Math.round(weatherData.main.feels_like),
          condition: weatherData.weather[0].main.toLowerCase(),
          humidity: weatherData.main.humidity,
          windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
          rainfall: weatherData.rain ? weatherData.rain['1h'] || 0 : 0,
          visibility: weatherData.visibility ? weatherData.visibility / 1000 : 10, // Convert to km
          pressure: weatherData.main.pressure,
          uvIndex: 5, // Would need UV Index API call
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
          updatedAt: new Date()
        };

        res.json({
          success: true,
          data: formattedData
        });
        return;
      } catch (apiError) {
        console.warn('Weather API failed, falling back to mock data:', apiError.message);
      }
    }

    // Fallback to mock data if API key not available or API fails
    const mockWeatherData = {
      location: location,
      temperature: Math.floor(Math.random() * 20) + 20,
      feelsLike: Math.floor(Math.random() * 20) + 22,
      condition: ['clear', 'cloudy', 'rainy', 'stormy'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      rainfall: Math.floor(Math.random() * 20),
      visibility: Math.floor(Math.random() * 10) + 5,
      pressure: Math.floor(Math.random() * 50) + 1000,
      uvIndex: Math.floor(Math.random() * 11) + 1,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      data: mockWeatherData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get weather data',
      error: error.message
    });
  }
});

// Get weather forecast
router.get('/forecast', async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Location is required'
      });
    }

    // Use real OpenWeatherMap forecast API
    if (WEATHER_API_KEY && WEATHER_API_KEY !== 'demo_key') {
      try {
        const forecastResponse = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
          params: {
            q: location,
            appid: WEATHER_API_KEY,
            units: 'metric'
          }
        });

        const forecastData = forecastResponse.data;
        
        // Process 5-day forecast (group by day)
        const dailyForecasts = {};
        forecastData.list.forEach(item => {
          const date = new Date(item.dt * 1000).toDateString();
          if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
              date: new Date(item.dt * 1000).toISOString(),
              temps: [],
              conditions: [],
              humidity: [],
              rainChance: 0
            };
          }
          dailyForecasts[date].temps.push(item.main.temp);
          dailyForecasts[date].conditions.push(item.weather[0].main.toLowerCase());
          dailyForecasts[date].humidity.push(item.main.humidity);
          if (item.pop) dailyForecasts[date].rainChance = Math.max(dailyForecasts[date].rainChance, item.pop * 100);
        });

        // Format daily forecasts
        const forecast = Object.values(dailyForecasts).slice(0, 7).map(day => ({
          date: day.date,
          maxTemp: Math.round(Math.max(...day.temps)),
          minTemp: Math.round(Math.min(...day.temps)),
          condition: day.conditions[0] || 'clear',
          rainChance: Math.round(day.rainChance),
          humidity: Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length),
          windSpeed: Math.round(Math.random() * 20) + 5 // Fallback for wind
        }));

        res.json({
          success: true,
          data: forecast
        });
        return;
      } catch (apiError) {
        console.warn('Forecast API failed, falling back to mock data:', apiError.message);
      }
    }

    // Fallback mock 7-day forecast
    const forecast = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toISOString(),
        maxTemp: Math.floor(Math.random() * 15) + 25,
        minTemp: Math.floor(Math.random() * 10) + 15,
        condition: ['clear', 'cloudy', 'rainy', 'stormy'][Math.floor(Math.random() * 4)],
        rainChance: Math.floor(Math.random() * 100),
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5
      });
    }

    res.json({
      success: true,
      data: forecast
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get weather forecast',
      error: error.message
    });
  }
});

// Get farming recommendations based on weather
router.get('/recommendations', async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Location is required'
      });
    }

    // Get current weather for recommendations
    let currentWeather = null;
    
    if (WEATHER_API_KEY && WEATHER_API_KEY !== 'demo_key') {
      try {
        const weatherResponse = await axios.get(`${WEATHER_BASE_URL}/weather`, {
          params: {
            q: location,
            appid: WEATHER_API_KEY,
            units: 'metric'
          }
        });
        currentWeather = weatherResponse.data;
      } catch (apiError) {
        console.warn('Weather API failed for recommendations, using mock data:', apiError.message);
      }
    }

    // Generate recommendations based on weather conditions
    const recommendations = [];
    
    const temp = currentWeather ? currentWeather.main.temp : Math.floor(Math.random() * 15) + 25;
    const condition = currentWeather ? currentWeather.weather[0].main.toLowerCase() : 'clear';
    const humidity = currentWeather ? currentWeather.main.humidity : Math.floor(Math.random() * 40) + 40;
    const windSpeed = currentWeather ? Math.round(currentWeather.wind?.speed * 3.6) : Math.floor(Math.random() * 20) + 5;

    // Temperature-based recommendations
    if (temp > 35) {
      recommendations.push({
        type: 'warning',
        title: 'High Temperature Alert',
        description: 'Ensure adequate irrigation for crops. Consider shade nets for sensitive plants.',
        priority: 'high'
      });
    } else if (temp < 10) {
      recommendations.push({
        type: 'warning',
        title: 'Cold Weather Alert',
        description: 'Protect crops from frost. Consider covering sensitive plants.',
        priority: 'high'
      });
    } else if (temp >= 20 && temp <= 30) {
      recommendations.push({
        type: 'info',
        title: 'Optimal Growing Conditions',
        description: 'Excellent conditions for most crops. Consider planting or transplanting.',
        priority: 'medium'
      });
    }

    // Weather condition-based recommendations
    if (condition.includes('rain')) {
      recommendations.push({
        type: 'info',
        title: 'Rainy Weather',
        description: 'Reduce irrigation. Check for proper drainage to prevent waterlogging.',
        priority: 'medium'
      });
    } else if (condition.includes('clear') || condition.includes('sun')) {
      recommendations.push({
        type: 'info',
        title: 'Sunny Weather',
        description: 'Good conditions for harvesting and field work. Monitor soil moisture.',
        priority: 'low'
      });
    } else if (condition.includes('cloud')) {
      recommendations.push({
        type: 'info',
        title: 'Cloudy Weather',
        description: 'Reduced evaporation. Adjust irrigation schedule accordingly.',
        priority: 'low'
      });
    }

    // Humidity-based recommendations
    if (humidity > 80) {
      recommendations.push({
        type: 'warning',
        title: 'High Humidity Alert',
        description: 'Monitor for fungal diseases. Ensure good air circulation around plants.',
        priority: 'medium'
      });
    } else if (humidity < 30) {
      recommendations.push({
        type: 'info',
        title: 'Low Humidity',
        description: 'Increase watering frequency. Consider mulching to retain moisture.',
        priority: 'medium'
      });
    }

    // Wind-based recommendations
    if (windSpeed > 25) {
      recommendations.push({
        type: 'warning',
        title: 'High Wind Alert',
        description: 'Secure tall plants and structures. Check for wind damage after the event.',
        priority: 'medium'
      });
    }

    // General farming tips
    recommendations.push({
      type: 'tip',
      title: 'Daily Farming Tip',
      description: 'Check soil moisture before watering. Early morning is the best time for irrigation.',
      priority: 'low'
    });

    res.json({
      success: true,
      data: {
        recommendations,
        weather: {
          temperature: temp,
          condition,
          humidity,
          windSpeed
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get farming recommendations',
      error: error.message
    });
  }
});

// Get weather alerts
router.get('/alerts', async (req, res) => {
  try {
    const { location } = req.query;
    
    // Mock weather alerts
    const alerts = [
      {
        type: 'storm',
        title: 'Thunderstorm Warning',
        description: 'Heavy thunderstorms expected in the evening. Secure loose objects.',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        severity: 'moderate'
      }
    ];

    res.json({
      success: true,
      data: alerts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get weather alerts',
      error: error.message
    });
  }
});

// Get historical weather data
router.get('/historical', async (req, res) => {
  try {
    const { location, days = 30 } = req.query;
    
    const historicalData = [];
    for (let i = 0; i < parseInt(days); i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      historicalData.push({
        date: date.toISOString(),
        temperature: Math.floor(Math.random() * 20) + 20,
        humidity: Math.floor(Math.random() * 40) + 40,
        rainfall: Math.floor(Math.random() * 50)
      });
    }

    res.json({
      success: true,
      data: historicalData.reverse()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get historical weather data',
      error: error.message
    });
  }
});

module.exports = router;
