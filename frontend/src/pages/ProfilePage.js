import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    farmDetails: {
      farmName: user?.farmDetails?.farmName || '',
      location: {
        state: user?.farmDetails?.location?.state || '',
        district: user?.farmDetails?.location?.district || '',
        village: user?.farmDetails?.location?.village || ''
      },
      farmSize: {
        value: user?.farmDetails?.farmSize?.value || '',
        unit: user?.farmDetails?.farmSize?.unit || 'acres'
      },
      soilType: user?.farmDetails?.soilType || '',
      irrigationType: user?.farmDetails?.irrigationType || ''
    },
    preferences: {
      language: user?.preferences?.language || 'en',
      units: user?.preferences?.units || 'metric'
    }
  });
  const [loading, setLoading] = useState(false);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await updateProfile(formData);
    if (result.success) {
      // Profile updated successfully
    }
    
    setLoading(false);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'farm', name: 'Farm Details', icon: '🏡' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' }
  ];

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and farm information</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-2xl font-bold">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="input-field bg-gray-50 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <input
                        type="text"
                        value={user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1)}
                        disabled
                        className="input-field bg-gray-50 cursor-not-allowed capitalize"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Farm Tab */}
              {activeTab === 'farm' && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="farmDetails.farmName" className="block text-sm font-medium text-gray-700 mb-2">
                      Farm Name
                    </label>
                    <input
                      type="text"
                      id="farmDetails.farmName"
                      name="farmDetails.farmName"
                      value={formData.farmDetails.farmName}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your farm name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="farmDetails.location.state" className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        id="farmDetails.location.state"
                        name="farmDetails.location.state"
                        value={formData.farmDetails.location.state}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label htmlFor="farmDetails.location.district" className="block text-sm font-medium text-gray-700 mb-2">
                        District
                      </label>
                      <input
                        type="text"
                        id="farmDetails.location.district"
                        name="farmDetails.location.district"
                        value={formData.farmDetails.location.district}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label htmlFor="farmDetails.location.village" className="block text-sm font-medium text-gray-700 mb-2">
                        Village
                      </label>
                      <input
                        type="text"
                        id="farmDetails.location.village"
                        name="farmDetails.location.village"
                        value={formData.farmDetails.location.village}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="farmDetails.farmSize.value" className="block text-sm font-medium text-gray-700 mb-2">
                        Farm Size
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          id="farmDetails.farmSize.value"
                          name="farmDetails.farmSize.value"
                          value={formData.farmDetails.farmSize.value}
                          onChange={handleChange}
                          className="input-field flex-1"
                          placeholder="5"
                        />
                        <select
                          name="farmDetails.farmSize.unit"
                          value={formData.farmDetails.farmSize.unit}
                          onChange={handleChange}
                          className="input-field w-24"
                        >
                          <option value="acres">Acres</option>
                          <option value="hectares">Hectares</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="farmDetails.soilType" className="block text-sm font-medium text-gray-700 mb-2">
                        Soil Type
                      </label>
                      <select
                        id="farmDetails.soilType"
                        name="farmDetails.soilType"
                        value={formData.farmDetails.soilType}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select soil type</option>
                        {soilTypes.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="farmDetails.irrigationType" className="block text-sm font-medium text-gray-700 mb-2">
                        Irrigation Type
                      </label>
                      <select
                        id="farmDetails.irrigationType"
                        name="farmDetails.irrigationType"
                        value={formData.farmDetails.irrigationType}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select irrigation type</option>
                        {irrigationTypes.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="preferences.language" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Language
                      </label>
                      <select
                        id="preferences.language"
                        name="preferences.language"
                        value={formData.preferences.language}
                        onChange={handleChange}
                        className="input-field"
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="preferences.units" className="block text-sm font-medium text-gray-700 mb-2">
                        Measurement Units
                      </label>
                      <select
                        id="preferences.units"
                        name="preferences.units"
                        value={formData.preferences.units}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="metric">Metric (kg, cm, °C)</option>
                        <option value="imperial">Imperial (lbs, ft, °F)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Notification Preferences</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="notifications-email"
                          type="checkbox"
                          defaultChecked={user?.preferences?.notifications?.email !== false}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notifications-email" className="ml-2 block text-sm text-gray-900">
                          Email notifications
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="notifications-sms"
                          type="checkbox"
                          defaultChecked={user?.preferences?.notifications?.sms === true}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notifications-sms" className="ml-2 block text-sm text-gray-900">
                          SMS notifications
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="notifications-push"
                          type="checkbox"
                          defaultChecked={user?.preferences?.notifications?.push !== false}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notifications-push" className="ml-2 block text-sm text-gray-900">
                          Push notifications
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
