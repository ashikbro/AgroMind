import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
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
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  },
);

type AuthPayload = Record<string, unknown>;

export const authAPI = {
  register: (userData: AuthPayload) => api.post('/auth/register', userData),
  login: (credentials: AuthPayload) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData: AuthPayload) => api.put('/auth/profile', userData),
  changePassword: (passwordData: AuthPayload) => api.put('/auth/change-password', passwordData),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (resetData: AuthPayload) => api.post('/auth/reset-password', resetData),
  logout: () => api.post('/auth/logout'),
};
