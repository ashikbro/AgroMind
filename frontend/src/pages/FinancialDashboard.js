import React, { useState, useEffect } from 'react';
import FintechService from '../services/FintechService';

const FinancialDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [financialData, setFinancialData] = useState(null);
  const [loanApplications, setLoanApplications] = useState([]);
  const [insurancePolicies, setInsurancePolicies] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      setIsLoading(true);
      
      // Load various financial data
      const [
        financialReport,
        loans,
        insurance,
        investmentData
      ] = await Promise.all([
        FintechService.generateFinancialReport('farm_001'),
        loadLoanApplications(),
        loadInsurancePolicies(),
        loadInvestmentData()
      ]);

      setFinancialData(financialReport);
      setLoanApplications(loans);
      setInsurancePolicies(insurance);
      setInvestments(investmentData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLoanApplications = async () => {
    // Sample loan applications data
    return [
      {
        id: 'loan_001',
        type: 'Equipment Financing',
        amount: 75000,
        status: 'approved',
        appliedDate: '2024-01-15',
        approvedAmount: 70000,
        interestRate: 5.2,
        term: 60 // months
      },
      {
        id: 'loan_002',
        type: 'Operating Capital',
        amount: 50000,
        status: 'under_review',
        appliedDate: '2024-02-01',
        estimatedRate: 4.8,
        term: 36
      }
    ];
  };

  const loadInsurancePolicies = async () => {
    // Sample insurance policies data
    return [
      {
        id: 'ins_001',
        type: 'Crop Insurance',
        provider: 'AgriGuard Insurance',
        coverage: 200000,
        premium: 12000,
        status: 'active',
        renewalDate: '2024-12-31',
        crops: ['Corn', 'Soybeans']
      },
      {
        id: 'ins_002',
        type: 'Equipment Insurance',
        provider: 'FarmShield',
        coverage: 150000,
        premium: 3600,
        status: 'active',
        renewalDate: '2024-08-15',
        equipment: ['Tractors', 'Harvesters', 'Irrigation Systems']
      }
    ];
  };

  const loadInvestmentData = async () => {
    // Sample investment data
    return [
      {
        id: 'inv_001',
        title: 'Precision Agriculture Fund',
        amount: 25000,
        currentValue: 28500,
        return: 14.0,
        status: 'active',
        investmentDate: '2023-06-01'
      },
      {
        id: 'inv_002',
        title: 'Sustainable Farming ETF',
        amount: 15000,
        currentValue: 16200,
        return: 8.0,
        status: 'active',
        investmentDate: '2023-09-15'
      }
    ];
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$250,000</p>
              <p className="text-sm text-green-600">+12.5% from last year</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">$70,000</p>
              <p className="text-sm text-blue-600">28% profit margin</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">$800,000</p>
              <p className="text-sm text-purple-600">8.75% ROA</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Credit Score</p>
              <p className="text-2xl font-bold text-gray-900">765</p>
              <p className="text-sm text-orange-600">Excellent rating</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-500">Chart visualization</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Cash Flow Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="text-gray-500">Trend analysis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Financial Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Loan Payment Received</p>
                <p className="text-sm text-gray-600">Equipment financing - Monthly payment</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-600">+$1,450</p>
              <p className="text-sm text-gray-500">2 days ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Insurance Premium Paid</p>
                <p className="text-sm text-gray-600">Crop insurance renewal</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-red-600">-$12,000</p>
              <p className="text-sm text-gray-500">1 week ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Investment Return</p>
                <p className="text-sm text-gray-600">Precision Agriculture Fund dividend</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-600">+$850</p>
              <p className="text-sm text-gray-500">2 weeks ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLoansTab = () => (
    <div className="space-y-6">
      {/* Loan Application Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Apply for Agricultural Loan</h3>
        <LoanApplicationForm onSubmit={(data) => console.log('Loan application:', data)} />
      </div>

      {/* Existing Loans */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Your Loan Applications</h3>
        <div className="space-y-4">
          {loanApplications.map((loan) => (
            <div key={loan.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{loan.type}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                  loan.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {loan.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Amount</p>
                  <p className="font-medium">${loan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Interest Rate</p>
                  <p className="font-medium">{loan.interestRate || loan.estimatedRate}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Term</p>
                  <p className="font-medium">{loan.term} months</p>
                </div>
                <div>
                  <p className="text-gray-600">Applied Date</p>
                  <p className="font-medium">{new Date(loan.appliedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInsuranceTab = () => (
    <div className="space-y-6">
      {/* Insurance Quote Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Get Insurance Quote</h3>
        <InsuranceQuoteForm onSubmit={(data) => console.log('Insurance quote:', data)} />
      </div>

      {/* Active Policies */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Your Insurance Policies</h3>
        <div className="space-y-4">
          {insurancePolicies.map((policy) => (
            <div key={policy.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{policy.type}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  policy.status === 'active' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {policy.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Provider</p>
                  <p className="font-medium">{policy.provider}</p>
                </div>
                <div>
                  <p className="text-gray-600">Coverage</p>
                  <p className="font-medium">${policy.coverage.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Annual Premium</p>
                  <p className="font-medium">${policy.premium.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Renewal Date</p>
                  <p className="font-medium">{new Date(policy.renewalDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInvestmentsTab = () => (
    <div className="space-y-6">
      {/* Investment Opportunities */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Investment Opportunities</h3>
        <InvestmentOpportunities />
      </div>

      {/* Your Investments */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Your Investment Portfolio</h3>
        <div className="space-y-4">
          {investments.map((investment) => (
            <div key={investment.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{investment.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  investment.return > 0 ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {investment.return > 0 ? '+' : ''}{investment.return}%
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Invested Amount</p>
                  <p className="font-medium">${investment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Current Value</p>
                  <p className="font-medium">${investment.currentValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Return</p>
                  <p className={`font-medium ${
                    investment.return > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${(investment.currentValue - investment.amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Investment Date</p>
                  <p className="font-medium">{new Date(investment.investmentDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 mb-2">Error loading financial data</p>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={loadFinancialData}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your farm finances, loans, insurance, and investments
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'loans', name: 'Loans & Credit', icon: '🏦' },
              { id: 'insurance', name: 'Insurance', icon: '🛡️' },
              { id: 'investments', name: 'Investments', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'loans' && renderLoansTab()}
        {activeTab === 'insurance' && renderInsuranceTab()}
        {activeTab === 'investments' && renderInvestmentsTab()}
      </div>
    </div>
  );
};

// Loan Application Form Component
const LoanApplicationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    loanType: '',
    amount: '',
    purpose: '',
    farmSize: '',
    annualRevenue: '',
    creditScore: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Type
          </label>
          <select
            value={formData.loanType}
            onChange={(e) => setFormData({...formData, loanType: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select loan type</option>
            <option value="equipment">Equipment Financing</option>
            <option value="operating">Operating Capital</option>
            <option value="land">Land Purchase</option>
            <option value="improvement">Farm Improvement</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount ($)
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter loan amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Farm Size (acres)
          </label>
          <input
            type="number"
            value={formData.farmSize}
            onChange={(e) => setFormData({...formData, farmSize: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter farm size"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual Revenue ($)
          </label>
          <input
            type="number"
            value={formData.annualRevenue}
            onChange={(e) => setFormData({...formData, annualRevenue: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter annual revenue"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Purpose of Loan
        </label>
        <textarea
          value={formData.purpose}
          onChange={(e) => setFormData({...formData, purpose: e.target.value})}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Describe the purpose of the loan"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        Submit Loan Application
      </button>
    </form>
  );
};

// Insurance Quote Form Component
const InsuranceQuoteForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    insuranceType: '',
    coverageAmount: '',
    farmSize: '',
    crops: '',
    location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Insurance Type
          </label>
          <select
            value={formData.insuranceType}
            onChange={(e) => setFormData({...formData, insuranceType: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select insurance type</option>
            <option value="crop">Crop Insurance</option>
            <option value="weather">Weather Insurance</option>
            <option value="livestock">Livestock Insurance</option>
            <option value="equipment">Equipment Insurance</option>
            <option value="liability">Liability Insurance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coverage Amount ($)
          </label>
          <input
            type="number"
            value={formData.coverageAmount}
            onChange={(e) => setFormData({...formData, coverageAmount: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter coverage amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Farm Size (acres)
          </label>
          <input
            type="number"
            value={formData.farmSize}
            onChange={(e) => setFormData({...formData, farmSize: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter farm size"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter farm location"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Crops/Livestock Details
        </label>
        <textarea
          value={formData.crops}
          onChange={(e) => setFormData({...formData, crops: e.target.value})}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Describe your crops or livestock"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Get Insurance Quote
      </button>
    </form>
  );
};

// Investment Opportunities Component
const InvestmentOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      const investorProfile = {
        riskTolerance: 'Medium',
        investmentAmount: 50000,
        timeHorizon: 36,
        interests: ['Organic Farming', 'AgTech']
      };

      const response = await FintechService.getInvestmentOpportunities(investorProfile);
      setOpportunities(response.opportunities);
    } catch (error) {
      console.error('Failed to load investment opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading investment opportunities...</div>;
  }

  return (
    <div className="space-y-4">
      {opportunities.map((opportunity) => (
        <div key={opportunity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-lg">{opportunity.title}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              opportunity.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
              opportunity.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {opportunity.riskLevel} Risk
            </span>
          </div>
          
          <p className="text-gray-600 mb-3">{opportunity.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
            <div>
              <p className="text-gray-600">Investment Range</p>
              <p className="font-medium">
                ${opportunity.investmentRange.min.toLocaleString()} - 
                ${opportunity.investmentRange.max.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Expected Return</p>
              <p className="font-medium text-green-600">
                {opportunity.expectedReturn.min}% - {opportunity.expectedReturn.max}%
              </p>
            </div>
            <div>
              <p className="text-gray-600">Time Horizon</p>
              <p className="font-medium">{opportunity.timeHorizon} months</p>
            </div>
            <div>
              <p className="text-gray-600">Score</p>
              <p className="font-medium">{opportunity.score}/100</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{opportunity.recommendation}</p>
          
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
            Invest Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default FinancialDashboard;
