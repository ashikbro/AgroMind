const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || 'demo_key';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getCurrentWeather(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });
      
      return {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        windSpeed: response.data.wind.speed,
        windDirection: response.data.wind.deg,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        visibility: response.data.visibility,
        cloudCover: response.data.clouds.all
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      // Return mock data for development
      return {
        temperature: 25,
        humidity: 60,
        pressure: 1013,
        windSpeed: 5.5,
        windDirection: 180,
        description: 'Partly cloudy',
        icon: '02d',
        visibility: 10000,
        cloudCover: 30
      };
    }
  }

  async getWeatherForecast(lat, lon, days = 5) {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8 // 8 forecasts per day (every 3 hours)
        }
      });
      
      return response.data.list.map(item => ({
        dateTime: new Date(item.dt * 1000),
        temperature: item.main.temp,
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        windSpeed: item.wind.speed,
        windDirection: item.wind.deg,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        cloudCover: item.clouds.all,
        precipitation: item.rain ? item.rain['3h'] || 0 : 0
      }));
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      // Return mock data for development
      const mockForecast = [];
      for (let i = 0; i < days * 8; i++) {
        const date = new Date();
        date.setHours(date.getHours() + i * 3);
        mockForecast.push({
          dateTime: date,
          temperature: 25 + Math.random() * 10 - 5,
          humidity: 60 + Math.random() * 20 - 10,
          pressure: 1013 + Math.random() * 20 - 10,
          windSpeed: 5 + Math.random() * 5,
          windDirection: Math.random() * 360,
          description: 'Partly cloudy',
          icon: '02d',
          cloudCover: 30 + Math.random() * 40,
          precipitation: Math.random() * 2
        });
      }
      return mockForecast;
    }
  }

  async getHistoricalWeather(lat, lon, startDate, endDate) {
    try {
      // OpenWeatherMap historical data requires a paid subscription
      // For now, return mock historical data
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const historicalData = [];
      
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        historicalData.push({
          date,
          maxTemp: 25 + Math.random() * 10,
          minTemp: 15 + Math.random() * 10,
          avgHumidity: 60 + Math.random() * 20,
          totalPrecipitation: Math.random() * 5,
          avgWindSpeed: 5 + Math.random() * 5,
          maxWindSpeed: 10 + Math.random() * 10
        });
      }
      
      return historicalData;
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      return [];
    }
  }

  async getWeatherAlerts(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/onecall`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          exclude: 'minutely,hourly,daily'
        }
      });
      
      return response.data.alerts || [];
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return [];
    }
  }

  async getAgriculturalIndex(lat, lon) {
    try {
      // Mock agricultural weather index
      return {
        evapotranspiration: 4.5 + Math.random() * 2,
        soilTemperature: 18 + Math.random() * 8,
        soilMoisture: 0.3 + Math.random() * 0.4,
        growingDegreeDays: 15 + Math.random() * 10,
        precipitationAccumulation: Math.random() * 20,
        windChill: -5 + Math.random() * 15,
        heatIndex: 25 + Math.random() * 15
      };
    } catch (error) {
      console.error('Error calculating agricultural index:', error);
      return null;
    }
  }

  async getUVIndex(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/uvi`, {
        params: {
          lat,
          lon,
          appid: this.apiKey
        }
      });
      
      return {
        uvIndex: response.data.value,
        maxUvIndex: response.data.value * 1.2,
        uvRisk: this.getUVRiskLevel(response.data.value)
      };
    } catch (error) {
      console.error('Error fetching UV index:', error);
      return {
        uvIndex: 5,
        maxUvIndex: 6,
        uvRisk: 'moderate'
      };
    }
  }

  getUVRiskLevel(uvIndex) {
    if (uvIndex <= 2) return 'low';
    if (uvIndex <= 5) return 'moderate';
    if (uvIndex <= 7) return 'high';
    if (uvIndex <= 10) return 'very_high';
    return 'extreme';
  }

  async analyzeWeatherForCrop(lat, lon, cropType, growthStage) {
    try {
      const currentWeather = await this.getCurrentWeather(lat, lon);
      const forecast = await this.getWeatherForecast(lat, lon, 7);
      const agricIndex = await this.getAgriculturalIndex(lat, lon);
      
      // Analyze weather conditions for specific crop and growth stage
      const analysis = this.analyzeCropWeatherSuitability(
        currentWeather,
        forecast,
        agricIndex,
        cropType,
        growthStage
      );
      
      return {
        currentWeather,
        forecast: forecast.slice(0, 7), // Next 7 forecasts
        agriculturalIndex: agricIndex,
        cropAnalysis: analysis,
        recommendations: this.generateWeatherRecommendations(analysis, cropType, growthStage)
      };
    } catch (error) {
      console.error('Error analyzing weather for crop:', error);
      return null;
    }
  }

  analyzeCropWeatherSuitability(current, forecast, agIndex, cropType, growthStage) {
    // Simplified crop weather suitability analysis
    const analysis = {
      temperatureSuitability: 'optimal',
      humiditySuitability: 'optimal',
      precipitationSuitability: 'optimal',
      windSuitability: 'optimal',
      overallSuitability: 'optimal',
      riskFactors: [],
      favorableFactors: []
    };

    // Temperature analysis
    if (current.temperature < 10 || current.temperature > 35) {
      analysis.temperatureSuitability = 'poor';
      analysis.riskFactors.push('Temperature outside optimal range');
    } else if (current.temperature < 15 || current.temperature > 30) {
      analysis.temperatureSuitability = 'moderate';
    } else {
      analysis.favorableFactors.push('Optimal temperature range');
    }

    // Humidity analysis
    if (current.humidity < 40 || current.humidity > 80) {
      analysis.humiditySuitability = 'moderate';
      if (current.humidity > 80) {
        analysis.riskFactors.push('High humidity may increase disease risk');
      }
    } else {
      analysis.favorableFactors.push('Suitable humidity levels');
    }

    // Wind analysis
    if (current.windSpeed > 15) {
      analysis.windSuitability = 'poor';
      analysis.riskFactors.push('Strong winds may damage crops');
    } else if (current.windSpeed > 10) {
      analysis.windSuitability = 'moderate';
    } else {
      analysis.favorableFactors.push('Gentle winds promote air circulation');
    }

    // Overall assessment
    const suitabilityScores = {
      optimal: 3,
      moderate: 2,
      poor: 1
    };

    const avgScore = (
      suitabilityScores[analysis.temperatureSuitability] +
      suitabilityScores[analysis.humiditySuitability] +
      suitabilityScores[analysis.precipitationSuitability] +
      suitabilityScores[analysis.windSuitability]
    ) / 4;

    if (avgScore >= 2.5) analysis.overallSuitability = 'optimal';
    else if (avgScore >= 2) analysis.overallSuitability = 'moderate';
    else analysis.overallSuitability = 'poor';

    return analysis;
  }

  generateWeatherRecommendations(analysis, cropType, growthStage) {
    const recommendations = [];

    if (analysis.riskFactors.includes('Temperature outside optimal range')) {
      recommendations.push({
        type: 'temperature',
        priority: 'high',
        message: 'Consider protective measures for temperature stress',
        action: 'Monitor crop closely and consider irrigation or shade protection'
      });
    }

    if (analysis.riskFactors.includes('High humidity may increase disease risk')) {
      recommendations.push({
        type: 'disease_prevention',
        priority: 'medium',
        message: 'Increased disease risk due to high humidity',
        action: 'Improve air circulation and monitor for fungal diseases'
      });
    }

    if (analysis.riskFactors.includes('Strong winds may damage crops')) {
      recommendations.push({
        type: 'wind_protection',
        priority: 'high',
        message: 'Strong winds detected',
        action: 'Install windbreaks or protective barriers if possible'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'general',
        priority: 'low',
        message: 'Weather conditions are favorable',
        action: 'Continue regular monitoring and maintenance'
      });
    }

    return recommendations;
  }
}

module.exports = new WeatherService();
