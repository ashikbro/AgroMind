import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import FloatingChatbot from './components/FloatingChatbot';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import DiagnosisPage from './pages/DiagnosisPage';
import WeatherPage from './pages/WeatherPage';
import CropCalendarPage from './pages/CropCalendarPage';
import MarketPricePage from './pages/MarketPricePage';
import CropsPage from './pages/CropsPage';
import ProfilePage from './pages/ProfilePage';
import FarmAnalytics from './pages/FarmAnalytics';
import ExpertConsultation from './pages/ExpertConsultation';
import CommunityHub from './pages/CommunityHub';
import FarmersMarketplace from './pages/FarmersMarketplace';
import FinancialDashboard from './pages/FinancialDashboard';
import SustainabilityDashboard from './pages/SustainabilityDashboard';
import IoTDashboard from './pages/IoTDashboard';
import AdvancedDiseaseDetection from './pages/AdvancedDiseaseDetection';
import FieldMapping from './pages/FieldMapping';
import SatelliteDashboard from './pages/SatelliteDashboard';
import CarbonCreditsPortal from './pages/CarbonCreditsPortal';
import InsuranceClaimsPortal from './pages/InsuranceClaimsPortal';
import PaymentPortal from './pages/PaymentPortal';
import SustainabilityReporting from './pages/SustainabilityReporting';
import FarmerGroups from './pages/FarmerGroups';
import LiveChat from './pages/LiveChat';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diagnosis" element={<DiagnosisPage />} />
          <Route path="/diagnosis/advanced" element={<AdvancedDiseaseDetection />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/calendar" element={<CropCalendarPage />} />
          <Route path="/market" element={<MarketPricePage />} />
          <Route path="/crops" element={<CropsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Advanced Features */}
          <Route path="/analytics" element={<FarmAnalytics />} />
          <Route path="/expert-consultation" element={<ExpertConsultation />} />
          <Route path="/community" element={<CommunityHub />} />
          <Route path="/marketplace" element={<FarmersMarketplace />} />
          <Route path="/financial" element={<FinancialDashboard />} />
          <Route path="/sustainability" element={<SustainabilityDashboard />} />
          <Route path="/sustainability/reporting" element={<SustainabilityReporting />} />
          <Route path="/iot" element={<IoTDashboard />} />
          <Route path="/field-mapping" element={<FieldMapping />} />
          <Route path="/satellite" element={<SatelliteDashboard />} />
          <Route path="/carbon-credits" element={<CarbonCreditsPortal />} />
          <Route path="/insurance" element={<InsuranceClaimsPortal />} />
          <Route path="/payments" element={<PaymentPortal />} />
          <Route path="/groups" element={<FarmerGroups />} />
          <Route path="/chat" element={<LiveChat />} />

          {/* Redirect unknown routes to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <FloatingChatbot />
      </div>
    </Router>
  );
}

export default App;
