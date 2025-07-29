import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { format, subDays, subMonths } from 'date-fns';

const FarmAnalytics = () => {
  const [timeframe, setTimeframe] = useState('month'); // week, month, quarter, year
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Generate comprehensive mock analytics data
  const generateAnalyticsData = useMemo(() => {
    const now = new Date();
    const data = {
      financial: {
        totalRevenue: 245000,
        totalExpenses: 156000,
        netProfit: 89000,
        profitMargin: 36.3,
        roi: 78.5,
        breakEvenPoint: new Date(2024, 8, 15),
        cashFlow: Array.from({ length: 12 }, (_, i) => ({
          month: format(subMonths(now, 11 - i), 'MMM'),
          revenue: Math.floor(Math.random() * 30000) + 15000,
          expenses: Math.floor(Math.random() * 20000) + 10000,
          profit: 0,
        })).map(item => ({ ...item, profit: item.revenue - item.expenses }))
      },
      production: {
        totalYield: 4750, // kg
        yieldPerHectare: 3.2,
        qualityGrade: 'A',
        wastePercentage: 8.5,
        crops: [
          { name: 'Tomatoes', yield: 2100, revenue: 105000, area: 2.5, grade: 'A+' },
          { name: 'Peppers', yield: 1200, revenue: 84000, area: 1.8, grade: 'A' },
          { name: 'Cucumbers', yield: 900, revenue: 36000, area: 1.2, grade: 'B+' },
          { name: 'Lettuce', yield: 550, revenue: 20000, area: 0.8, grade: 'A' }
        ]
      },
      efficiency: {
        laborProductivity: 92.3,
        equipmentUtilization: 87.1,
        energyEfficiency: 78.9,
        waterUsageEfficiency: 83.4,
        fertilityOptimization: 91.2
      },
      market: {
        priceVolatility: 12.3,
        marketShare: 5.2,
        customerSatisfaction: 94.7,
        supplychainReliability: 88.9
      },
      sustainability: {
        carbonFootprint: 145, // tons CO2
        waterConservation: 23.5, // % saved
        soilHealth: 87.3,
        biodiversityIndex: 76.8,
        organicPercentage: 34.2
      },
      predictions: {
        nextQuarterRevenue: 78000,
        expectedYield: 1580,
        optimalHarvestDate: new Date(2024, 9, 22),
        marketPriceTrend: 'increasing',
        weatherRisk: 'low',
        diseaseRisk: 'medium'
      }
    };

    // Calculate additional metrics
    data.financial.revenueGrowth = 18.7;
    data.financial.costReduction = 12.4;
    data.production.yieldImprovement = 15.3;
    
    return data;
  }, []);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(generateAnalyticsData);
      setLoading(false);
    }, 1500);
  }, [generateAnalyticsData, timeframe]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const MetricCard = ({ title, value, subtitle, trend, icon, color = 'blue' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${color}-500`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="mr-1">
              {trend > 0 ? '↗️' : '↘️'}
            </span>
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className={`text-3xl font-bold text-${color}-600`}>
          {typeof value === 'number' && value > 1000 ? formatCurrency(value) : value}
        </div>
      </div>
    </motion.div>
  );

  const ProfitLossChart = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Profit & Loss Analysis</h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={analyticsData?.financial.cashFlow}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
          <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
          <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const YieldAnalysis = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Crop Yield Performance</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={analyticsData?.production.crops}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="yield" fill="#8B5CF6" name="Yield (kg)" />
          <Bar dataKey="revenue" fill="#F59E0B" name="Revenue ($)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const EfficiencyRadar = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Farm Efficiency Metrics</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={[
          { metric: 'Labor', value: analyticsData?.efficiency.laborProductivity },
          { metric: 'Equipment', value: analyticsData?.efficiency.equipmentUtilization },
          { metric: 'Energy', value: analyticsData?.efficiency.energyEfficiency },
          { metric: 'Water', value: analyticsData?.efficiency.waterUsageEfficiency },
          { metric: 'Fertility', value: analyticsData?.efficiency.fertilityOptimization }
        ]}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Radar dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );

  const ROICalculator = () => {
    const [investment, setInvestment] = useState(50000);
    const [expectedReturn, setExpectedReturn] = useState(65000);
    const roi = ((expectedReturn - investment) / investment * 100).toFixed(1);

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">ROI Calculator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Investment Amount</label>
            <input
              type="number"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Return</label>
            <input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{roi}%</div>
              <div className="text-blue-100">Return on Investment</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PredictiveAnalytics = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">AI Predictions</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-bold text-green-800">Next Quarter Revenue</h4>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(analyticsData?.predictions.nextQuarterRevenue)}
            </div>
            <p className="text-sm text-green-600">+12% vs last quarter</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-bold text-blue-800">Expected Yield</h4>
            <div className="text-2xl font-bold text-blue-600">
              {analyticsData?.predictions.expectedYield} kg
            </div>
            <p className="text-sm text-blue-600">+8% improvement</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-bold text-yellow-800">Risk Assessment</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex justify-between">
              <span>Weather Risk:</span>
              <span className="text-green-600 font-medium">Low</span>
            </div>
            <div className="flex justify-between">
              <span>Disease Risk:</span>
              <span className="text-yellow-600 font-medium">Medium</span>
            </div>
            <div className="flex justify-between">
              <span>Market Risk:</span>
              <span className="text-green-600 font-medium">Low</span>
            </div>
            <div className="flex justify-between">
              <span>Supply Risk:</span>
              <span className="text-blue-600 font-medium">Stable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-bold mb-2">Processing Analytics</h3>
          <p className="text-gray-600">Crunching your farm data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 Farm Analytics & Business Intelligence
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into your farm's financial and operational performance
          </p>
        </div>

        {/* Time Frame Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Analytics Dashboard</h2>
            <div className="flex space-x-2">
              {['week', 'month', 'quarter', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeframe === period
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={analyticsData?.financial.totalRevenue}
            subtitle="This year"
            trend={analyticsData?.financial.revenueGrowth}
            icon="💰"
            color="green"
          />
          <MetricCard
            title="Net Profit"
            value={analyticsData?.financial.netProfit}
            subtitle={`${analyticsData?.financial.profitMargin}% margin`}
            trend={15.3}
            icon="📈"
            color="blue"
          />
          <MetricCard
            title="Total Yield"
            value={`${analyticsData?.production.totalYield} kg`}
            subtitle={`${analyticsData?.production.yieldPerHectare} kg/ha`}
            trend={analyticsData?.production.yieldImprovement}
            icon="🌾"
            color="purple"
          />
          <MetricCard
            title="ROI"
            value={`${analyticsData?.financial.roi}%`}
            subtitle="Return on Investment"
            trend={8.2}
            icon="🎯"
            color="orange"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'financial', label: 'Financial', icon: '💰' },
                { id: 'production', label: 'Production', icon: '🌱' },
                { id: 'predictions', label: 'Predictions', icon: '🔮' },
                { id: 'sustainability', label: 'Sustainability', icon: '🌍' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <ProfitLossChart />
                  <EfficiencyRadar />
                  <YieldAnalysis />
                  <ROICalculator />
                </motion.div>
              )}

              {activeTab === 'financial' && (
                <motion.div
                  key="financial"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="font-bold text-green-800 mb-2">Revenue Breakdown</h3>
                      <div className="space-y-2">
                        {analyticsData?.production.crops.map((crop, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{crop.name}</span>
                            <span className="font-medium">{formatCurrency(crop.revenue)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-red-50 rounded-lg p-6">
                      <h3 className="font-bold text-red-800 mb-2">Expense Categories</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Seeds & Fertilizer</span>
                          <span className="font-medium">$45,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Labor</span>
                          <span className="font-medium">$62,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Equipment</span>
                          <span className="font-medium">$28,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Utilities</span>
                          <span className="font-medium">$21,000</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="font-bold text-blue-800 mb-2">Financial Ratios</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Gross Margin</span>
                          <span className="font-medium">42.3%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Net Margin</span>
                          <span className="font-medium">36.3%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Asset Turnover</span>
                          <span className="font-medium">1.8x</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Ratio</span>
                          <span className="font-medium">2.4</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <ProfitLossChart />
                </motion.div>
              )}

              {activeTab === 'production' && (
                <motion.div
                  key="production"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <YieldAnalysis />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg border p-6">
                      <h3 className="font-bold mb-4">Production Efficiency</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Yield per Hectare</span>
                          <span className="font-bold text-green-600">
                            {analyticsData?.production.yieldPerHectare} kg/ha
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Quality Grade</span>
                          <span className="font-bold text-blue-600">
                            {analyticsData?.production.qualityGrade}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Waste Percentage</span>
                          <span className="font-bold text-red-600">
                            {analyticsData?.production.wastePercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <EfficiencyRadar />
                  </div>
                </motion.div>
              )}

              {activeTab === 'predictions' && (
                <motion.div
                  key="predictions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <PredictiveAnalytics />
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-bold mb-4">Market Forecast</h3>
                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="font-bold text-green-800">Price Trend</h4>
                          <p className="text-green-600">Increasing by 8-12% next quarter</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-bold text-blue-800">Demand Forecast</h4>
                          <p className="text-blue-600">High demand expected for organic produce</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h4 className="font-bold text-purple-800">Optimal Harvest</h4>
                          <p className="text-purple-600">
                            {analyticsData?.predictions.optimalHarvestDate.toDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'sustainability' && (
                <motion.div
                  key="sustainability"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="font-bold text-green-800 mb-4">🌱 Environmental Impact</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Carbon Footprint</span>
                        <span className="font-bold">{analyticsData?.sustainability.carbonFootprint} tons CO₂</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Water Conservation</span>
                        <span className="font-bold text-green-600">
                          {analyticsData?.sustainability.waterConservation}% saved
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Soil Health Score</span>
                        <span className="font-bold">{analyticsData?.sustainability.soilHealth}/100</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="font-bold text-blue-800 mb-4">🦋 Biodiversity</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Biodiversity Index</span>
                        <span className="font-bold">{analyticsData?.sustainability.biodiversityIndex}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Organic Percentage</span>
                        <span className="font-bold text-green-600">
                          {analyticsData?.sustainability.organicPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="font-bold text-purple-800 mb-4">💰 Carbon Credits</h3>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">$2,840</div>
                        <p className="text-sm text-purple-600">Potential carbon credit value</p>
                      </div>
                      <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600">
                        Apply for Credits
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmAnalytics;
