import React, { useState, useEffect } from 'react';
import FintechService from '../services/FintechService';

const InsuranceClaimsPortal = () => {
  const [activeTab, setActiveTab] = useState('submit');
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClaimsData();
  }, []);

  const loadClaimsData = async () => {
    try {
      setIsLoading(true);
      
      // Load claims and policies data
      const [claimsData, policiesData] = await Promise.all([
        loadExistingClaims(),
        loadActivePolicies()
      ]);

      setClaims(claimsData);
      setPolicies(policiesData);
    } catch (error) {
      console.error('Failed to load claims data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExistingClaims = async () => {
    // Sample claims data
    return [
      {
        id: 'claim_001',
        policyId: 'ins_001',
        policyType: 'Crop Insurance',
        claimType: 'Weather Damage',
        dateSubmitted: '2024-02-15',
        incidentDate: '2024-02-10',
        status: 'under_review',
        claimAmount: 45000,
        estimatedPayout: 38000,
        description: 'Hail damage to corn crop - approximately 60% yield loss',
        documentation: [
          { type: 'photos', count: 12, uploaded: true },
          { type: 'weather_report', count: 1, uploaded: true },
          { type: 'yield_assessment', count: 1, uploaded: true },
          { type: 'adjuster_report', count: 1, uploaded: false }
        ],
        timeline: [
          { date: '2024-02-15', event: 'Claim submitted', status: 'completed' },
          { date: '2024-02-16', event: 'Initial review completed', status: 'completed' },
          { date: '2024-02-18', event: 'Adjuster assigned', status: 'completed' },
          { date: '2024-02-20', event: 'Field inspection scheduled', status: 'pending' }
        ]
      },
      {
        id: 'claim_002',
        policyId: 'ins_002',
        policyType: 'Equipment Insurance',
        claimType: 'Mechanical Failure',
        dateSubmitted: '2024-01-28',
        incidentDate: '2024-01-25',
        status: 'approved',
        claimAmount: 15000,
        approvedPayout: 13500,
        description: 'Tractor transmission failure during harvest season',
        documentation: [
          { type: 'photos', count: 8, uploaded: true },
          { type: 'repair_estimate', count: 2, uploaded: true },
          { type: 'maintenance_records', count: 1, uploaded: true },
          { type: 'purchase_receipt', count: 1, uploaded: true }
        ],
        timeline: [
          { date: '2024-01-28', event: 'Claim submitted', status: 'completed' },
          { date: '2024-01-29', event: 'Documentation verified', status: 'completed' },
          { date: '2024-01-31', event: 'Claim approved', status: 'completed' },
          { date: '2024-02-02', event: 'Payment processed', status: 'completed' }
        ]
      },
      {
        id: 'claim_003',
        policyId: 'ins_001',
        policyType: 'Crop Insurance',
        claimType: 'Disease Outbreak',
        dateSubmitted: '2024-01-10',
        incidentDate: '2024-01-05',
        status: 'denied',
        claimAmount: 25000,
        denialReason: 'Pre-existing condition not covered under policy terms',
        description: 'Bacterial blight affecting soybean crops',
        documentation: [
          { type: 'photos', count: 15, uploaded: true },
          { type: 'lab_analysis', count: 1, uploaded: true },
          { type: 'expert_report', count: 1, uploaded: true }
        ],
        appealOption: true
      }
    ];
  };

  const loadActivePolicies = async () => {
    // Sample policies data
    return [
      {
        id: 'ins_001',
        type: 'Crop Insurance',
        provider: 'AgriGuard Insurance',
        coverage: 200000,
        deductible: 10000,
        status: 'active'
      },
      {
        id: 'ins_002',
        type: 'Equipment Insurance',
        provider: 'FarmShield',
        coverage: 150000,
        deductible: 2500,
        status: 'active'
      }
    ];
  };

  const renderClaimSubmissionTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Submit New Insurance Claim</h3>
        <ClaimSubmissionForm 
          policies={policies}
          onSubmit={(claimData) => handleClaimSubmission(claimData)}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center mb-2">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h4 className="font-medium text-blue-900">Emergency Claims</h4>
          </div>
          <p className="text-sm text-blue-700 mb-3">
            For urgent situations requiring immediate attention
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
            File Emergency Claim
          </button>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center mb-2">
            <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 className="font-medium text-green-900">Claim Templates</h4>
          </div>
          <p className="text-sm text-green-700 mb-3">
            Use pre-filled templates for common claim types
          </p>
          <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
            Browse Templates
          </button>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center mb-2">
            <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-medium text-purple-900">Need Help?</h4>
          </div>
          <p className="text-sm text-purple-700 mb-3">
            Get assistance with your claim submission
          </p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );

  const renderClaimsListTab = () => (
    <div className="space-y-6">
      {/* Claims Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select className="p-2 border border-gray-300 rounded">
              <option>All Claims</option>
              <option>Under Review</option>
              <option>Approved</option>
              <option>Denied</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Policy Type
            </label>
            <select className="p-2 border border-gray-300 rounded">
              <option>All Types</option>
              <option>Crop Insurance</option>
              <option>Equipment Insurance</option>
              <option>Livestock Insurance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select className="p-2 border border-gray-300 rounded">
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.map((claim) => (
          <div key={claim.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Claim #{claim.id}</h3>
                <p className="text-gray-600">{claim.policyType} - {claim.claimType}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                  claim.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                  claim.status === 'denied' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {claim.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Claim Amount</p>
                <p className="font-medium">${claim.claimAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {claim.status === 'approved' ? 'Approved Payout' : 
                   claim.status === 'under_review' ? 'Estimated Payout' : 
                   'Requested Amount'}
                </p>
                <p className="font-medium">
                  ${(claim.approvedPayout || claim.estimatedPayout || claim.claimAmount).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Incident Date</p>
                <p className="font-medium">{new Date(claim.incidentDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="font-medium">{new Date(claim.dateSubmitted).toLocaleDateString()}</p>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{claim.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSelectedClaim(claim)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                  View Details
                </button>
                {claim.status === 'under_review' && (
                  <button className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">
                    Upload Documents
                  </button>
                )}
                {claim.status === 'denied' && claim.appealOption && (
                  <button className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700">
                    File Appeal
                  </button>
                )}
              </div>
              
              {/* Progress Indicator */}
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-600">
                  {claim.status === 'under_review' && 'Processing...'}
                  {claim.status === 'approved' && 'Completed'}
                  {claim.status === 'denied' && 'Review Required'}
                </div>
                {claim.status === 'under_review' && (
                  <div className="w-4 h-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentationTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Documentation Guidelines</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3 text-green-700">✓ Required Documents</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Photos of damage (multiple angles, clear visibility)
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Weather reports or official incident reports
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Repair estimates or replacement costs
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Farm records and maintenance logs
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-blue-700">📋 Best Practices</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Submit claims within 30 days of incident
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Take photos immediately after incident
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Keep detailed records of all expenses
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Cooperate fully with adjusters and inspectors
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Document Upload Tool */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>
        <DocumentUploadTool />
      </div>
    </div>
  );

  const handleClaimSubmission = async (claimData) => {
    try {
      // Process claim submission
      console.log('Submitting claim:', claimData);
      
      // Add to claims list
      const newClaim = {
        id: `claim_${Date.now()}`,
        ...claimData,
        dateSubmitted: new Date().toISOString(),
        status: 'under_review',
        timeline: [
          { 
            date: new Date().toISOString(), 
            event: 'Claim submitted', 
            status: 'completed' 
          }
        ]
      };
      
      setClaims([newClaim, ...claims]);
      setActiveTab('claims');
      
      // Show success message
      alert('Claim submitted successfully! You will receive updates via email and SMS.');
    } catch (error) {
      console.error('Claim submission failed:', error);
      alert('Failed to submit claim. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading claims data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Insurance Claims Portal</h1>
          <p className="mt-2 text-gray-600">
            Submit and track your insurance claims
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'submit', name: 'Submit Claim', icon: '📝' },
              { id: 'claims', name: 'My Claims', icon: '📋' },
              { id: 'documentation', name: 'Documentation', icon: '📄' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
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
        {activeTab === 'submit' && renderClaimSubmissionTab()}
        {activeTab === 'claims' && renderClaimsListTab()}
        {activeTab === 'documentation' && renderDocumentationTab()}

        {/* Claim Details Modal */}
        {selectedClaim && (
          <ClaimDetailsModal 
            claim={selectedClaim} 
            onClose={() => setSelectedClaim(null)}
          />
        )}
      </div>
    </div>
  );
};

// Claim Submission Form Component
const ClaimSubmissionForm = ({ policies, onSubmit }) => {
  const [formData, setFormData] = useState({
    policyId: '',
    claimType: '',
    incidentDate: '',
    description: '',
    estimatedAmount: '',
    location: '',
    witnesses: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const claimData = {
      ...formData,
      documentation: selectedFiles,
      claimAmount: parseFloat(formData.estimatedAmount)
    };
    
    onSubmit(claimData);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Insurance Policy *
          </label>
          <select
            required
            value={formData.policyId}
            onChange={(e) => setFormData({...formData, policyId: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select policy</option>
            {policies.map((policy) => (
              <option key={policy.id} value={policy.id}>
                {policy.type} - {policy.provider}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Claim Type *
          </label>
          <select
            required
            value={formData.claimType}
            onChange={(e) => setFormData({...formData, claimType: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select claim type</option>
            <option value="Weather Damage">Weather Damage</option>
            <option value="Equipment Failure">Equipment Failure</option>
            <option value="Disease Outbreak">Disease Outbreak</option>
            <option value="Pest Infestation">Pest Infestation</option>
            <option value="Fire Damage">Fire Damage</option>
            <option value="Theft">Theft</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Incident Date *
          </label>
          <input
            type="date"
            required
            value={formData.incidentDate}
            onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Loss Amount ($) *
          </label>
          <input
            type="number"
            required
            value={formData.estimatedAmount}
            onChange={(e) => setFormData({...formData, estimatedAmount: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter estimated loss"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location of Incident
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Field location, coordinates, or address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Description *
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Provide detailed description of the incident and damages"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Witnesses (if any)
        </label>
        <textarea
          value={formData.witnesses}
          onChange={(e) => setFormData({...formData, witnesses: e.target.value})}
          rows={2}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Names and contact information of witnesses"
        ></textarea>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Supporting Documents
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <label className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload photos and documents
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="sr-only"
                />
                <span className="mt-1 block text-sm text-gray-500">
                  PNG, JPG, PDF up to 10MB each
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Submit Insurance Claim
      </button>
    </form>
  );
};

// Document Upload Tool Component
const DocumentUploadTool = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString()
    }));
    
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-4">
            <label className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Click to upload files
              </span>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="sr-only"
              />
              <span className="mt-1 block text-sm text-gray-500">
                or drag and drop
              </span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            PNG, JPG, GIF, PDF, DOC up to 10MB
          </p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="text-red-500 hover:text-red-700 text-sm">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Claim Details Modal Component
const ClaimDetailsModal = ({ claim, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Claim #{claim.id}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Claim Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                  claim.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {claim.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Claim Amount</p>
                <p className="font-medium">${claim.claimAmount.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="text-gray-900">{claim.description}</p>
            </div>

            {/* Timeline */}
            {claim.timeline && (
              <div>
                <h4 className="font-medium mb-2">Timeline</h4>
                <div className="space-y-2">
                  {claim.timeline.map((event, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        event.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documentation */}
            {claim.documentation && (
              <div>
                <h4 className="font-medium mb-2">Documentation</h4>
                <div className="space-y-2">
                  {claim.documentation.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{doc.type.replace('_', ' ')} ({doc.count})</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        doc.uploaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {doc.uploaded ? 'Uploaded' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Close
            </button>
            {claim.status === 'under_review' && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Upload More Documents
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceClaimsPortal;
