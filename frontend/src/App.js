import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import DiagnosisPage from './pages/DiagnosisPage';
import WeatherPage from './pages/WeatherPage';
import CropsPage from './pages/CropsPage';
import CropCalendarPage from './pages/CropCalendarPage';
import MarketPricePage from './pages/MarketPricePage';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="spinner w-10 h-10 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/diagnosis"
      element={
        <ProtectedRoute>
          <DiagnosisPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/weather"
      element={
        <ProtectedRoute>
          <WeatherPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/crops"
      element={
        <ProtectedRoute>
          <CropsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/calendar"
      element={
        <ProtectedRoute>
          <CropCalendarPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/market"
      element={
        <ProtectedRoute>
          <MarketPricePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
      <Toaster position="top-right" />
    </Router>
  </AuthProvider>
);

export default App;
