import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { marketAPI, cropAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const MarketPricePage = () => {
  const { user } = useAuth();
  const [marketData, setMarketData] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceHistory, setPriceHistory] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    cropId: '',
    targetPrice: '',
    condition: 'above', // above or below
    location: ''
  });

  const locations = [
    'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCrop && selectedLocation) {
      fetchPriceHistory();
    }
  }, [selectedCrop, selectedLocation]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [marketResponse, cropsResponse, alertsResponse] = await Promise.all([
        marketAPI.getCurrentPrices(),
        cropAPI.getCrops(),
        marketAPI.getPriceAlerts()
      ]);
      
      setMarketData(marketResponse.data.data || []);
      setCrops(cropsResponse.data.data.crops || []);
      setPriceAlerts(alertsResponse.data.data || []);
      
      // Set default selections
      if (cropsResponse.data.data.crops.length > 0) {
        setSelectedCrop(cropsResponse.data.data.crops[0]._id);
      }
      if (user?.farmDetails?.location?.district) {
        setSelectedLocation(user.farmDetails.location.district);
      } else {
        setSelectedLocation(locations[0]);
      }
      
    } catch (error) {
      console.error('Error fetching market data:', error);
      toast.error('Failed to load market data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceHistory = async () => {
    try {
      const response = await marketAPI.getPriceHistory(selectedCrop, selectedLocation, 30);
      setPriceHistory(response.data.data || []);
    } catch (error) {
      console.error('Error fetching price history:', error);
    }
  };

  const handleAddAlert = async (e) => {
    e.preventDefault();
    
    if (!newAlert.cropId || !newAlert.targetPrice || !newAlert.location) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await marketAPI.addPriceAlert(newAlert);
      toast.success('Price alert added successfully!');
      setShowAddAlert(false);
      setNewAlert({
        cropId: '',
        targetPrice: '',
        condition: 'above',
        location: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error adding price alert:', error);
      toast.error('Failed to add price alert');
    }
  };

  const deleteAlert = async (alertId) => {
    try {
      await marketAPI.deletePriceAlert(alertId);
      toast.success('Price alert deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast.error('Failed to delete alert');
    }
  };

  const getPriceChange = (current, previous) => {
    if (!previous) return { change: 0, percentage: 0 };
    const change = current - previous;
    const percentage = ((change / previous) * 100).toFixed(1);
    return { change: change.toFixed(2), percentage };
  };

  const getCropMarketData = (cropId) => {
    return marketData.filter(item => item.cropId === cropId);
  };

  const getAveragePrice = (cropData) => {
    if (cropData.length === 0) return 0;
    const total = cropData.reduce((sum, item) => sum + item.price, 0);
    return (total / cropData.length).toFixed(2);
  };

  const getHighestPrice = (cropData) => {
    if (cropData.length === 0) return { price: 0, location: '' };
    return cropData.reduce((max, item) => item.price > max.price ? item : max);
  };

  const getLowestPrice = (cropData) => {
    if (cropData.length === 0) return { price: 0, location: '' };
    return cropData.reduce((min, item) => item.price < min.price ? item : min);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const selectedCropData = getCropMarketData(selectedCrop);
  const selectedCropInfo = crops.find(c => c._id === selectedCrop);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            💰 Market Price Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Real-time crop prices and market trends across major markets
          </p>
        </div>

        {/* Price Alerts */}
        {priceAlerts.length > 0 && (
          <div className="mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-yellow-800 mb-3">
                🔔 Active Price Alerts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {priceAlerts.map((alert, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-yellow-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{alert.cropName}</p>
                        <p className="text-sm text-gray-600">{alert.location}</p>
                        <p className="text-sm text-yellow-700">
                          Alert when {alert.condition} ₹{alert.targetPrice}/kg
                        </p>
                      </div>
                      <button
                        onClick={() => deleteAlert(alert._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Market Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Crop
                  </label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {crops.map(crop => (
                      <option key={crop._id} value={crop._id}>{crop.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Market
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Price Statistics */}
            {selectedCropData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    📊 Average Price
                  </h3>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{getAveragePrice(selectedCropData)}
                  </p>
                  <p className="text-sm text-gray-500">per kg</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    📈 Highest Price
                  </h3>
                  <p className="text-3xl font-bold text-red-600">
                    ₹{getHighestPrice(selectedCropData).price}
                  </p>
                  <p className="text-sm text-gray-500">
                    at {getHighestPrice(selectedCropData).location}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    📉 Lowest Price
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{getLowestPrice(selectedCropData).price}
                  </p>
                  <p className="text-sm text-gray-500">
                    at {getLowestPrice(selectedCropData).location}
                  </p>
                </div>
              </div>
            )}

            {/* Price Chart */}
            {priceHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  📈 Price Trend (Last 30 Days)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value) => [`₹${value}`, 'Price per kg']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#059669" 
                      strokeWidth={2}
                      dot={{ fill: '#059669' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Market Prices Table */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                🏪 Current Market Prices
              </h3>
              
              {selectedCropData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Market</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Price (₹/kg)</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Change</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Quality</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCropData.map((item, index) => {
                        const priceChange = getPriceChange(item.price, item.previousPrice);
                        return (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-gray-900">{item.location}</td>
                            <td className="py-3 px-4">
                              <span className="text-lg font-semibold text-green-600">
                                ₹{item.price}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`flex items-center ${
                                priceChange.change > 0 ? 'text-green-600' : 
                                priceChange.change < 0 ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {priceChange.change > 0 ? '↑' : priceChange.change < 0 ? '↓' : '→'}
                                <span className="ml-1">
                                  ₹{Math.abs(priceChange.change)} ({Math.abs(priceChange.percentage)}%)
                                </span>
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                item.quality === 'Premium' ? 'bg-green-100 text-green-800' :
                                item.quality === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {item.quality || 'Standard'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-500">
                              {new Date(item.updatedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No price data available for selected crop and location
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ⚡ Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowAddAlert(true)}
                  className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors text-sm"
                >
                  🔔 Set Price Alert
                </button>
                <button className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                  📊 Export Data
                </button>
                <button className="w-full bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                  📈 Price Prediction
                </button>
              </div>
            </div>

            {/* Market Tips */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💡 Market Tips
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">Best Selling Time</p>
                  <p className="text-blue-600">Early morning (6-9 AM) for better prices</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="font-medium text-yellow-800">Quality Matters</p>
                  <p className="text-yellow-600">Premium quality can fetch 20-30% higher prices</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-800">Seasonal Demand</p>
                  <p className="text-green-600">Track festival seasons for better returns</p>
                </div>
              </div>
            </div>

            {/* Top Performing Crops */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🏆 Top Performers Today
              </h3>
              <div className="space-y-3">
                {crops.slice(0, 5).map((crop, index) => {
                  const cropData = getCropMarketData(crop._id);
                  const avgPrice = getAveragePrice(cropData);
                  return (
                    <div key={crop._id} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{crop.name}</span>
                      <span className="text-sm font-semibold text-green-600">₹{avgPrice}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Add Price Alert Modal */}
        {showAddAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Set Price Alert
              </h3>
              
              <form onSubmit={handleAddAlert} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop *
                  </label>
                  <select
                    value={newAlert.cropId}
                    onChange={(e) => setNewAlert({...newAlert, cropId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select crop</option>
                    {crops.map(crop => (
                      <option key={crop._id} value={crop._id}>{crop.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Market Location *
                  </label>
                  <select
                    value={newAlert.location}
                    onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alert Condition *
                  </label>
                  <select
                    value={newAlert.condition}
                    onChange={(e) => setNewAlert({...newAlert, condition: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="above">Price goes above</option>
                    <option value="below">Price goes below</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Price (₹/kg) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newAlert.targetPrice}
                    onChange={(e) => setNewAlert({...newAlert, targetPrice: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., 45.50"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Set Alert
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAlert(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPricePage;
