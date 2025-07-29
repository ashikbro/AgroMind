import React, { useState, useEffect } from 'react';
import { cropAPI } from '../services/api';

const CropsPage = () => {
  const [crops, setCrops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrops();
    fetchCategories();
  }, [selectedCategory, searchTerm]);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      
      const response = await cropAPI.getCrops(params);
      setCrops(response.data.data.crops);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await cropAPI.getCategories();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Crop Database
          </h1>
          <p className="text-lg text-gray-600">
            Explore different crops, their growing requirements, and common diseases
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Crops
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by crop name..."
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Crops Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading crops...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {crops.map((crop) => (
              <div key={crop._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-6xl">🌾</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {crop.name}
                  </h3>
                  {crop.scientificName && (
                    <p className="text-sm text-gray-500 italic mb-2">
                      {crop.scientificName}
                    </p>
                  )}
                  <div className="flex items-center mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {crop.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {crop.climate && (
                      <p>
                        <span className="font-medium">Climate:</span> {crop.climate.optimal}°C optimal
                      </p>
                    )}
                    {crop.season && crop.season.months && (
                      <p>
                        <span className="font-medium">Season:</span> {crop.season.months.slice(0, 2).join(', ')}
                        {crop.season.months.length > 2 && '...'}
                      </p>
                    )}
                  </div>
                  <button className="mt-4 w-full btn-primary">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && crops.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">🌾</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No crops found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropsPage;
