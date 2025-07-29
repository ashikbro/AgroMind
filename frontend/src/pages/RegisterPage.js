import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    farmDetails: {
      farmName: '',
      location: {
        state: '',
        district: '',
        village: ''
      },
      farmSize: {
        value: '',
        unit: 'acres'
      },
      soilType: '',
      irrigationType: ''
    },
    preferences: {
      language: 'en',
      units: 'metric'
    }
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const soilTypes = ['clay', 'sandy', 'loamy', 'silt', 'peaty', 'chalky'];
  const irrigationTypes = ['rain-fed', 'drip', 'sprinkler', 'flood', 'furrow'];
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'te', name: 'Telugu' },
    { code: 'ta', name: 'Tamil' },
    { code: 'mr', name: 'Marathi' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🌱</span>
            <span className="text-2xl font-bold text-green-600">AgroMind</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Basic Info</span>
              <span>Farm Details</span>
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 input-field ${errors.name ? 'input-error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 input-field ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 input-field ${errors.phone ? 'input-error' : ''}`}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 input-field ${errors.password ? 'input-error' : ''}`}
                  placeholder="Create a password"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full btn-primary"
              >
                Next: Farm Details →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="farmDetails.farmName" className="block text-sm font-medium text-gray-700">
                  Farm Name (Optional)
                </label>
                <input
                  id="farmDetails.farmName"
                  name="farmDetails.farmName"
                  type="text"
                  value={formData.farmDetails.farmName}
                  onChange={handleChange}
                  className="mt-1 input-field"
                  placeholder="Enter your farm name"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="farmDetails.location.state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    id="farmDetails.location.state"
                    name="farmDetails.location.state"
                    type="text"
                    value={formData.farmDetails.location.state}
                    onChange={handleChange}
                    className="mt-1 input-field"
                    placeholder="Enter your state"
                  />
                </div>

                <div>
                  <label htmlFor="farmDetails.location.district" className="block text-sm font-medium text-gray-700">
                    District
                  </label>
                  <input
                    id="farmDetails.location.district"
                    name="farmDetails.location.district"
                    type="text"
                    value={formData.farmDetails.location.district}
                    onChange={handleChange}
                    className="mt-1 input-field"
                    placeholder="Enter your district"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="farmDetails.farmSize.value" className="block text-sm font-medium text-gray-700">
                    Farm Size
                  </label>
                  <input
                    id="farmDetails.farmSize.value"
                    name="farmDetails.farmSize.value"
                    type="number"
                    value={formData.farmDetails.farmSize.value}
                    onChange={handleChange}
                    className="mt-1 input-field"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label htmlFor="farmDetails.farmSize.unit" className="block text-sm font-medium text-gray-700">
                    Unit
                  </label>
                  <select
                    id="farmDetails.farmSize.unit"
                    name="farmDetails.farmSize.unit"
                    value={formData.farmDetails.farmSize.unit}
                    onChange={handleChange}
                    className="mt-1 input-field"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="farmDetails.soilType" className="block text-sm font-medium text-gray-700">
                  Soil Type
                </label>
                <select
                  id="farmDetails.soilType"
                  name="farmDetails.soilType"
                  value={formData.farmDetails.soilType}
                  onChange={handleChange}
                  className="mt-1 input-field"
                >
                  <option value="">Select soil type</option>
                  {soilTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="farmDetails.irrigationType" className="block text-sm font-medium text-gray-700">
                  Irrigation Type
                </label>
                <select
                  id="farmDetails.irrigationType"
                  name="farmDetails.irrigationType"
                  value={formData.farmDetails.irrigationType}
                  onChange={handleChange}
                  className="mt-1 input-field"
                >
                  <option value="">Select irrigation type</option>
                  {irrigationTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="preferences.language" className="block text-sm font-medium text-gray-700">
                  Preferred Language
                </label>
                <select
                  id="preferences.language"
                  name="preferences.language"
                  value={formData.preferences.language}
                  onChange={handleChange}
                  className="mt-1 input-field"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 btn-secondary"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="text-center">
              <Link 
                to="/" 
                className="text-sm text-gray-600 hover:text-green-600 transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
