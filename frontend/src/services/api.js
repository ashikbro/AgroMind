import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'NETWORK_ERROR') {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (resetData) => api.post('/auth/reset-password', resetData),
  logout: () => api.post('/auth/logout'),
};

export const cropAPI = {
  getCrops: (params) => api.get('/crops', { params }),
  getCrop: (id) => api.get(`/crops/${id}`),
  getCategories: () => api.get('/crops/categories/list'),
  getSeasonalCrops: (season) => api.get(`/crops/seasonal/${season}`),
};

export const diseaseAPI = {
  getDiseases: (params) => api.get('/diseases', { params }),
  getDisease: (id) => api.get(`/diseases/${id}`),
  getDiseaseTypes: () => api.get('/diseases/types/list'),
  getDiseasesByCrop: (cropId) => api.get(`/diseases/crop/${cropId}`),
};

export const aiAPI = {
  analyzeDisease: (formData) => 
    api.post('/ai/analyze-disease', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getDiagnosis: (id) => api.get(`/ai/diagnosis/${id}`),
  getDiagnosisHistory: (params) => api.get('/ai/diagnosis-history', { params }),
  addFollowUp: (id, formData) => 
    api.post(`/ai/diagnosis/${id}/follow-up`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAnalytics: () => api.get('/ai/analytics'),
};

export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  updateUserStatus: (id, status) => api.put(`/users/${id}/status`, status),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const analyticsAPI = {
  getUserAnalytics: () => api.get('/analytics/user'),
  getAdminAnalytics: () => api.get('/analytics/admin'),
  getSystemHealth: () => api.get('/analytics/health'),
};

export const weatherAPI = {
  getCurrentWeather: (location) => api.get(`/weather/current?location=${location}`),
  getForecast: (location) => api.get(`/weather/forecast?location=${location}`),
  getWeatherAlerts: (location) => api.get(`/weather/alerts?location=${location}`),
  getHistoricalData: (location, days) => api.get(`/weather/historical?location=${location}&days=${days}`),
};

export const calendarAPI = {
  getEvents: (year, month) => api.get(`/calendar/events?year=${year}&month=${month}`),
  addEvent: (eventData) => api.post('/calendar/events', eventData),
  updateEvent: (id, eventData) => api.put(`/calendar/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/calendar/events/${id}`),
  getReminders: () => api.get('/calendar/reminders'),
};

export const marketAPI = {
  getCurrentPrices: () => api.get('/market/prices'),
  getPriceHistory: (cropId, location, days) => api.get(`/market/history?cropId=${cropId}&location=${location}&days=${days}`),
  getPriceAlerts: () => api.get('/market/alerts'),
  addPriceAlert: (alertData) => api.post('/market/alerts', alertData),
  deletePriceAlert: (id) => api.delete(`/market/alerts/${id}`),
  getMarketTrends: () => api.get('/market/trends'),
};

export default api;
