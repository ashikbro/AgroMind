import React, { useState, useEffect } from 'react';
import SustainabilityService from '../services/SustainabilityService';

const SustainabilityDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sustainabilityData, setSustainabilityData] = useState(null);
  const [carbonProjects, setCarbonProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [carbonPrices, setCarbonPrices] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSustainabilityData();
  }, []);

  const loadSustainabilityData = async () => {
    try {
      setIsLoading(true);
      
      // Sample farm data
      const farmData = {
        farmId: 'farm_001',
        farmSize: 250, // hectares
        cropTypes: [
          { type: 'corn', area: 100 },
          { type: 'soybeans', area: 80 },
          { type: 'wheat', area: 70 }
        ],
        livestock: [
          { type: 'cattle', count: 150 }
        ],
        equipment: [
          { type: 'tractors', count: 3, fuelType: 'diesel' },
          { type: 'harvesters', count: 2, fuelType: 'diesel' }
        ],
        fertilizers: [
          { type: 'nitrogen', amount: 5000 },
          { type: 'phosphorus', amount: 2000 }
        ],
        energy: {
          electricity: 15000, // kWh per year
          fuel: 8000, // liters per year
          renewable: 5250 // kWh from renewable sources
        },
        practices: [
          { type: 'coverCropping', area: 180 },
          { type: 'noTill', area: 250 },
          { type: 'cropRotation', area: 250 }
        ],
        location: 'Iowa, USA'
      };

      const [
        report,
        projects,
        certs,
        prices
      ] = await Promise.all([
        SustainabilityService.generateSustainabilityReport(farmData),
        loadCarbonProjects(),
        loadCertificationStatus(),
        SustainabilityService.getCarbonCreditPrices()
      ]);

      setSustainabilityData(report);
      setCarbonProjects(projects);
      setCertifications(certs);
      setCarbonPrices(prices);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCarbonProjects = async () => {
    return [
      {
        projectId: 'carbon_farm_001_1719648000000',
        projectName: 'Regenerative Agriculture Carbon Project',
        status: 'verified',
        totalCredits: 1250,
        creditsIssued: 950,
        creditsSold: 600,
        creditsAvailable: 350,
        vintage: 2024,
        price: 18.50,
        revenue: 11100,
        methodology: 'VCS (Verified Carbon Standard)',
        startDate: '2024-01-01',
        nextVerification: '2025-01-01'
      },
      {
        projectId: 'carbon_farm_001_1719648000001',
        projectName: 'Soil Carbon Sequestration Project',
        status: 'under_validation',
        totalCredits: 800,
        creditsIssued: 0,
        creditsSold: 0,
        creditsAvailable: 0,
        vintage: 2025,
        estimatedPrice: 22.00,
        methodology: 'Gold Standard',
        startDate: '2025-01-01',
        expectedValidation: '2025-09-01'
      }
    ];
  };

  const loadCertificationStatus = async () => {
    return [
      {
        certificationType: 'regenerativeAg',
        name: 'Regenerative Agriculture Certification',
        status: 'certified',
        issueDate: '2024-03-15',
        expiryDate: '2027-03-15',
        certifyingBody: 'Regenerative Organic Alliance',
        benefits: ['25% price premium', 'Carbon credit eligibility'],
        complianceScore: 92
      },
      {
        certificationType: 'organicCertified',
        name: 'USDA Organic Certification',
        status: 'in_transition',
        transitionStarted: '2023-01-01',
        expectedCertification: '2026-01-01',
        certifyingBody: 'USDA National Organic Program',
        currentProgress: 65,
        nextInspection: '2025-08-15'
      },
      {
        certificationType: 'carbonNeutral',
        name: 'Carbon Neutral Farm Certification',
        status: 'eligible',
        estimatedCost: 7500,
        timeToComplete: '12-18 months',
        certifyingBody: 'Climate Neutral Group',
        complianceGaps: 2
      }
    ];
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Sustainability Score</p>
              <p className="text-3xl font-bold text-green-600">
                {sustainabilityData?.overallSustainabilityScore || 85}
              </p>
              <p className="text-sm text-green-600">Excellent rating</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Carbon Credits Earned</p>
              <p className="text-3xl font-bold text-blue-600">
                {sustainabilityData?.carbonMetrics.carbonCreditsGenerated.toFixed(0) || 1250}
              </p>
              <p className="text-sm text-blue-600">tCO₂e sequestered</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Carbon Revenue</p>
              <p className="text-3xl font-bold text-purple-600">$23,125</p>
              <p className="text-sm text-purple-600">This year</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Certifications</p>
              <p className="text-3xl font-bold text-orange-600">
                {certifications.filter(c => c.status === 'certified').length}
              </p>
              <p className="text-sm text-orange-600">Active certifications</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Carbon Footprint Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Carbon Footprint Breakdown</h3>
          <CarbonFootprintChart data={sustainabilityData?.carbonMetrics} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Sustainability Metrics</h3>
          <SustainabilityMetricsChart data={sustainabilityData} />
        </div>
      </div>

      {/* Current Carbon Projects */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Active Carbon Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {carbonProjects.map((project) => (
            <div key={project.projectId} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{project.projectName}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'verified' ? 'bg-green-100 text-green-800' :
                  project.status === 'under_validation' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Credits</p>
                  <p className="font-medium">{project.totalCredits} tCO₂e</p>
                </div>
                <div>
                  <p className="text-gray-600">Available</p>
                  <p className="font-medium">{project.creditsAvailable || project.totalCredits} tCO₂e</p>
                </div>
                <div>
                  <p className="text-gray-600">Revenue</p>
                  <p className="font-medium">${(project.revenue || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Price</p>
                  <p className="font-medium">${project.price || project.estimatedPrice}/tCO₂e</p>
                </div>
              </div>
              
              {project.status === 'verified' && project.creditsAvailable > 0 && (
                <button className="mt-3 w-full bg-green-600 text-white py-2 px-4 rounded text-sm hover:bg-green-700">
                  Sell Credits
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-green-900">Regenerative Agriculture Certified</p>
              <p className="text-sm text-green-600">Achieved 92% compliance score - March 2024</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-blue-900">Carbon Credits Verified</p>
              <p className="text-sm text-blue-600">1,250 tCO₂e credits issued - February 2024</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-purple-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-purple-900">Revenue Milestone</p>
              <p className="text-sm text-purple-600">$23,125 earned from carbon credit sales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCarbonCreditsTab = () => (
    <div className="space-y-6">
      {/* Market Prices */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Carbon Credit Market Prices</h3>
        {carbonPrices && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Verra VCS</h4>
              <p className="text-2xl font-bold text-green-600">${carbonPrices.voluntary.verra.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600">per tCO₂e</p>
              <p className="text-xs text-green-600">+{carbonPrices.trends.daily.toFixed(1)}% today</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Gold Standard</h4>
              <p className="text-2xl font-bold text-blue-600">${carbonPrices.voluntary.goldStandard.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600">per tCO₂e</p>
              <p className="text-xs text-blue-600">+{carbonPrices.trends.weekly.toFixed(1)}% this week</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Average Price</h4>
              <p className="text-2xl font-bold text-purple-600">${carbonPrices.voluntary.average.toFixed(2)}</p>
              <p className="text-sm text-gray-600">per tCO₂e</p>
              <p className="text-xs text-purple-600">Market average</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Agriculture Premium</h4>
              <p className="text-2xl font-bold text-orange-600">${(carbonPrices.voluntary.average * 1.25).toFixed(2)}</p>
              <p className="text-sm text-gray-600">per tCO₂e</p>
              <p className="text-xs text-orange-600">+25% premium</p>
            </div>
          </div>
        )}
      </div>

      {/* Project Creation */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Create New Carbon Project</h3>
        <CarbonProjectForm onSubmit={(projectData) => handleProjectCreation(projectData)} />
      </div>

      {/* Existing Projects */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Your Carbon Projects</h3>
        <div className="space-y-4">
          {carbonProjects.map((project) => (
            <div key={project.projectId} className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium">{project.projectName}</h4>
                  <p className="text-gray-600">{project.methodology} • Vintage {project.vintage}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'verified' ? 'bg-green-100 text-green-800' :
                  project.status === 'under_validation' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Total Credits</p>
                  <p className="text-lg font-semibold">{project.totalCredits}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Issued</p>
                  <p className="text-lg font-semibold">{project.creditsIssued}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sold</p>
                  <p className="text-lg font-semibold">{project.creditsSold}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-lg font-semibold">{project.creditsAvailable}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-lg font-semibold">${(project.revenue || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                {project.status === 'verified' && project.creditsAvailable > 0 && (
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    List for Sale
                  </button>
                )}
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  View Details
                </button>
                {project.status === 'under_validation' && (
                  <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                    Upload Documents
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCertificationsTab = () => (
    <div className="space-y-6">
      {/* Certification Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Active Certifications</h3>
              <p className="text-2xl font-bold text-green-600">
                {certifications.filter(c => c.status === 'certified').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900">In Progress</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {certifications.filter(c => c.status === 'in_transition').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Available</h3>
              <p className="text-2xl font-bold text-blue-600">
                {certifications.filter(c => c.status === 'eligible').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certification Details */}
      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{cert.name}</h3>
                <p className="text-gray-600">{cert.certifyingBody}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                cert.status === 'certified' ? 'bg-green-100 text-green-800' :
                cert.status === 'in_transition' ? 'bg-yellow-100 text-yellow-800' :
                cert.status === 'eligible' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {cert.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {cert.status === 'certified' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Issue Date</p>
                  <p className="font-medium">{new Date(cert.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expiry Date</p>
                  <p className="font-medium">{new Date(cert.expiryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Compliance Score</p>
                  <p className="font-medium">{cert.complianceScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Benefits</p>
                  <p className="font-medium">{cert.benefits?.[0] || 'Premium pricing'}</p>
                </div>
              </div>
            )}

            {cert.status === 'in_transition' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Transition Started</p>
                  <p className="font-medium">{new Date(cert.transitionStarted).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expected Completion</p>
                  <p className="font-medium">{new Date(cert.expectedCertification).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${cert.currentProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{cert.currentProgress}%</span>
                  </div>
                </div>
              </div>
            )}

            {cert.status === 'eligible' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Estimated Cost</p>
                  <p className="font-medium">${cert.estimatedCost?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time to Complete</p>
                  <p className="font-medium">{cert.timeToComplete}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Compliance Gaps</p>
                  <p className="font-medium">{cert.complianceGaps} items</p>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              {cert.status === 'eligible' && (
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Apply for Certification
                </button>
              )}
              {cert.status === 'in_transition' && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Upload Documents
                </button>
              )}
              <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                View Requirements
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Available Certifications */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Explore More Certifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'Biodiversity Conservation',
              description: 'Certifies biodiversity enhancement practices',
              estimatedCost: 4000,
              timeframe: '6-9 months',
              benefits: ['Biodiversity premium', 'ESG compliance']
            },
            {
              name: 'Water Stewardship',
              description: 'Sustainable water management certification',
              estimatedCost: 3500,
              timeframe: '4-6 months',
              benefits: ['Water credits', 'Premium pricing']
            },
            {
              name: 'Fair Trade Agriculture',
              description: 'Social and environmental standards',
              estimatedCost: 2500,
              timeframe: '3-6 months',
              benefits: ['Fair trade premium', 'Market access']
            }
          ].map((cert, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">{cert.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{cert.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-medium">${cert.estimatedCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeframe:</span>
                  <span className="font-medium">{cert.timeframe}</span>
                </div>
              </div>
              <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      {/* Report Generation */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Generate Sustainability Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="font-medium mb-2">Annual Report</h4>
            <p className="text-sm text-gray-600 mb-3">Comprehensive yearly sustainability analysis</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
              Generate Report
            </button>
          </div>

          <div className="border rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-medium mb-2">Carbon Footprint</h4>
            <p className="text-sm text-gray-600 mb-3">Detailed carbon emissions and sequestration</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
              Generate Report
            </button>
          </div>

          <div className="border rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h4 className="font-medium mb-2">Compliance Report</h4>
            <p className="text-sm text-gray-600 mb-3">Certification and regulatory compliance</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {[
            {
              name: 'Annual Sustainability Report 2024',
              type: 'Annual Report',
              date: '2024-12-31',
              size: '2.4 MB',
              format: 'PDF'
            },
            {
              name: 'Q4 2024 Carbon Footprint Analysis',
              type: 'Carbon Report',
              date: '2024-12-31',
              size: '1.8 MB',
              format: 'PDF'
            },
            {
              name: 'Regenerative Agriculture Compliance Report',
              type: 'Compliance Report',
              date: '2024-11-15',
              size: '3.2 MB',
              format: 'PDF'
            }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">{report.name}</h4>
                  <p className="text-sm text-gray-600">
                    {report.type} • {new Date(report.date).toLocaleDateString()} • {report.size}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                <button className="text-green-600 hover:text-green-800 text-sm">Download</button>
                <button className="text-gray-600 hover:text-gray-800 text-sm">Share</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const handleProjectCreation = async (projectData) => {
    try {
      // Process project creation
      console.log('Creating carbon project:', projectData);
      
      const newProject = {
        projectId: `carbon_project_${Date.now()}`,
        projectName: projectData.projectName,
        status: 'draft',
        totalCredits: projectData.estimatedCredits,
        creditsIssued: 0,
        creditsSold: 0,
        creditsAvailable: 0,
        vintage: new Date().getFullYear() + 1,
        methodology: projectData.methodology,
        startDate: projectData.startDate
      };
      
      setCarbonProjects([newProject, ...carbonProjects]);
      alert('Carbon project created successfully! You can now submit it for validation.');
    } catch (error) {
      console.error('Project creation failed:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sustainability data...</p>
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
          <p className="text-red-600 mb-2">Error loading sustainability data</p>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={loadSustainabilityData}
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
          <h1 className="text-3xl font-bold text-gray-900">Sustainability Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Track environmental impact, manage carbon credits, and earn from sustainable practices
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '🌱' },
              { id: 'carbon', name: 'Carbon Credits', icon: '🌍' },
              { id: 'certifications', name: 'Certifications', icon: '📜' },
              { id: 'reports', name: 'Reports', icon: '📊' }
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
        {activeTab === 'carbon' && renderCarbonCreditsTab()}
        {activeTab === 'certifications' && renderCertificationsTab()}
        {activeTab === 'reports' && renderReportsTab()}
      </div>
    </div>
  );
};

// Carbon Footprint Chart Component
const CarbonFootprintChart = ({ data }) => {
  if (!data) return <div className="text-gray-500">No data available</div>;

  const emissions = data.emissions || {};
  const sequestration = data.sequestration || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-red-600 mb-2">Emissions (tCO₂e)</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Crops:</span>
              <span>{(emissions.cropProduction / 1000).toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Livestock:</span>
              <span>{(emissions.livestockEmissions / 1000).toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Equipment:</span>
              <span>{(emissions.equipmentEmissions / 1000).toFixed(1)}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-2">
              <span>Total:</span>
              <span>{(emissions.total / 1000).toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-green-600 mb-2">Sequestration (tCO₂e)</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Soil Carbon:</span>
              <span>{(sequestration.soilCarbon / 1000).toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Vegetation:</span>
              <span>{(sequestration.vegetationCarbon / 1000).toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Agroforestry:</span>
              <span>{(sequestration.agroforestryCarbon / 1000).toFixed(1)}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-2">
              <span>Total:</span>
              <span>{(sequestration.total / 1000).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Net Impact:</span>
          <span className={`font-bold ${data.netImpact < 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.netImpact < 0 ? '-' : '+'}{Math.abs(data.netImpact / 1000).toFixed(1)} tCO₂e
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {data.netImpact < 0 ? 'Carbon Positive Farm' : 'Opportunity for improvement'}
        </p>
      </div>
    </div>
  );
};

// Sustainability Metrics Chart Component
const SustainabilityMetricsChart = ({ data }) => {
  if (!data) return <div className="text-gray-500">No data available</div>;

  const metrics = [
    { name: 'Carbon', score: data.carbonMetrics?.sustainabilityScore || 85, color: 'green' },
    { name: 'Biodiversity', score: data.biodiversityMetrics?.score || 78, color: 'blue' },
    { name: 'Water', score: data.waterMetrics?.efficiencyScore || 82, color: 'cyan' },
    { name: 'Soil', score: data.soilMetrics?.score || 88, color: 'yellow' },
    { name: 'Energy', score: data.energyMetrics?.score || 75, color: 'purple' }
  ];

  return (
    <div className="space-y-4">
      {metrics.map((metric) => (
        <div key={metric.name}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{metric.name}</span>
            <span className="text-sm font-medium">{metric.score}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-${metric.color}-600 h-2 rounded-full`} 
              style={{ width: `${metric.score}%` }}
            ></div>
          </div>
        </div>
      ))}
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Overall Score:</span>
          <span className="text-2xl font-bold text-green-600">
            {data.overallSustainabilityScore || 85}/100
          </span>
        </div>
      </div>
    </div>
  );
};

// Carbon Project Form Component
const CarbonProjectForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    methodology: 'VCS',
    projectType: 'regenerativeAgriculture',
    startDate: '',
    estimatedCredits: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Reset form
    setFormData({
      projectName: '',
      methodology: 'VCS',
      projectType: 'regenerativeAgriculture',
      startDate: '',
      estimatedCredits: '',
      description: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name *
          </label>
          <input
            type="text"
            required
            value={formData.projectName}
            onChange={(e) => setFormData({...formData, projectName: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Methodology *
          </label>
          <select
            required
            value={formData.methodology}
            onChange={(e) => setFormData({...formData, methodology: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="VCS">VCS (Verified Carbon Standard)</option>
            <option value="Gold Standard">Gold Standard</option>
            <option value="Climate Action Reserve">Climate Action Reserve</option>
            <option value="American Carbon Registry">American Carbon Registry</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Type *
          </label>
          <select
            required
            value={formData.projectType}
            onChange={(e) => setFormData({...formData, projectType: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="regenerativeAgriculture">Regenerative Agriculture</option>
            <option value="soilSequestration">Soil Carbon Sequestration</option>
            <option value="agroforestry">Agroforestry</option>
            <option value="methaneReduction">Methane Reduction</option>
            <option value="renewableEnergy">Renewable Energy</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Credits (tCO₂e) *
          </label>
          <input
            type="number"
            required
            value={formData.estimatedCredits}
            onChange={(e) => setFormData({...formData, estimatedCredits: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter estimated carbon credits"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Describe your carbon project..."
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        Create Carbon Project
      </button>
    </form>
  );
};

export default SustainabilityDashboard;
