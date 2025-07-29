import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { aiAPI, analyticsAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentDiagnoses, setRecentDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user analytics
      const analyticsResponse = await analyticsAPI.getUserAnalytics();
      setStats(analyticsResponse.data.data);

      // Fetch recent diagnoses
      const diagnosesResponse = await aiAPI.getDiagnosisHistory({ limit: 5 });
      setRecentDiagnoses(diagnosesResponse.data.data.diagnoses);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'diagnosed': 'bg-blue-100 text-blue-800',
      'resolved': 'bg-green-100 text-green-800',
      'escalated': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your crops today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 text-lg">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Diagnoses
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats?.totalDiagnoses || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 text-lg">🔍</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Analysis
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats?.diagnosisByStatus?.find(s => s._id === 'pending')?.count || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 text-lg">✅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Resolved Issues
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats?.diagnosisByStatus?.find(s => s._id === 'resolved')?.count || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <span className="text-purple-600 text-lg">🌾</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Crops Analyzed
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats?.cropsAnalyzed?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Diagnoses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Diagnoses</h2>
            </div>
            <div className="p-6">
              {recentDiagnoses.length > 0 ? (
                <div className="space-y-4">
                  {recentDiagnoses.map((diagnosis) => (
                    <div key={diagnosis._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600">🔬</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {diagnosis.crop?.name || 'Unknown Crop'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(diagnosis.createdAt)}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(diagnosis.status)}`}>
                          {diagnosis.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">🔬</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">No diagnoses yet</h3>
                  <p className="text-sm text-gray-500 mb-4">Start by analyzing your first crop image</p>
                  <a
                    href="/diagnosis"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Start Analysis
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <a
                  href="/diagnosis"
                  className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-700 transition-colors">
                      <span className="text-white text-lg">📷</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Analyze Crop Disease</h3>
                    <p className="text-sm text-gray-500">Upload photos for instant AI diagnosis</p>
                  </div>
                </a>

                <a
                  href="/weather"
                  className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                      <span className="text-white text-lg">🌤️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Weather Dashboard</h3>
                    <p className="text-sm text-gray-500">Real-time weather and farm alerts</p>
                  </div>
                </a>

                <a
                  href="/calendar"
                  className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                      <span className="text-white text-lg">📅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Crop Calendar</h3>
                    <p className="text-sm text-gray-500">Plan your farming activities</p>
                  </div>
                </a>

                <a
                  href="/market"
                  className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center group-hover:bg-yellow-700 transition-colors">
                      <span className="text-white text-lg">💰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Market Prices</h3>
                    <p className="text-sm text-gray-500">Track crop prices and trends</p>
                  </div>
                </a>

                <a
                  href="/crops"
                  className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
                      <span className="text-white text-lg">🌾</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Browse Crops</h3>
                    <p className="text-sm text-gray-500">Learn about different crops and diseases</p>
                  </div>
                </a>

                <a
                  href="/profile"
                  className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                      <span className="text-white text-lg">👤</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Update Profile</h3>
                    <p className="text-sm text-gray-500">Manage your farm details and preferences</p>
                  </div>
                </a>

                <a
                  href="/iot"
                  className="flex items-center p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center group-hover:bg-cyan-700 transition-colors">
                      <span className="text-white text-lg">�</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">IoT Dashboard</h3>
                    <p className="text-sm text-gray-500">Monitor sensors and farm automation</p>
                  </div>
                </a>

                <a
                  href="/expert"
                  className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center group-hover:bg-orange-700 transition-colors">
                      <span className="text-white text-lg">👨‍🌾</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Expert Consultation</h3>
                    <p className="text-sm text-gray-500">Video calls with agricultural experts</p>
                  </div>
                </a>

                <a
                  href="/advanced-diagnosis"
                  className="flex items-center p-4 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center group-hover:bg-rose-700 transition-colors">
                      <span className="text-white text-lg">🔬</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Advanced AI Detection</h3>
                    <p className="text-sm text-gray-500">Computer vision disease analysis</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Farm Information */}
        {user?.farmDetails && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Farm Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Farm Size</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.farmDetails.farmSize?.value} {user.farmDetails.farmSize?.unit}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Soil Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">
                    {user.farmDetails.soilType || 'Not specified'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Irrigation</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">
                    {user.farmDetails.irrigationType || 'Not specified'}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
