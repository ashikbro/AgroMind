import React, { useState, useEffect } from 'react';
import SustainabilityService from '../services/SustainabilityService';

const CarbonCreditsPortal = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [marketplaceData, setMarketplaceData] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [myCredits, setMyCredits] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [marketPrices, setMarketPrices] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCarbonCreditsData();
  }, []);

  const loadCarbonCreditsData = async () => {
    try {
      setIsLoading(true);
      
      const [
        marketplace,
        prices,
        projects,
        credits,
        transactionHistory
      ] = await Promise.all([
        loadMarketplaceData(),
        SustainabilityService.getCarbonCreditPrices(),
        loadMyProjects(),
        loadMyCredits(),
        loadTransactionHistory()
      ]);

      setMarketplaceData(marketplace);
      setMarketPrices(prices);
      setMyProjects(projects);
      setMyCredits(credits);
      setTransactions(transactionHistory);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMarketplaceData = async () => {
    return {
      availableCredits: [
        {
          creditId: 'VCS_001_2024',
          projectName: 'Midwest Regenerative Agriculture Project',
          projectType: 'Regenerative Agriculture',
          methodology: 'VCS',
          vintage: 2024,
          quantity: 2500,
          price: 18.50,
          seller: 'Green Farms Co-op',
          location: 'Iowa, USA',
          certification: 'VCS Verified',
          additionality: 'High',
          permanence: '100 years',
          cobenefits: ['Biodiversity enhancement', 'Soil health improvement', 'Water quality'],
          description: 'Large-scale regenerative agriculture project covering 5,000 hectares of farmland implementing cover cropping, rotational grazing, and agroforestry practices.',
          images: ['/api/placeholder/400/200'],
          verificationDate: '2024-03-15',
          rating: 4.8
        },
        {
          creditId: 'GS_002_2024',
          projectName: 'Tropical Agroforestry Initiative',
          projectType: 'Agroforestry',
          methodology: 'Gold Standard',
          vintage: 2024,
          quantity: 1800,
          price: 22.75,
          seller: 'Sustainable Tropics Ltd',
          location: 'Costa Rica',
          certification: 'Gold Standard Certified',
          additionality: 'High',
          permanence: '100 years',
          cobenefits: ['Biodiversity conservation', 'Community development', 'Watershed protection'],
          description: 'Agroforestry project integrating timber trees with coffee and cacao production, providing carbon sequestration while supporting local communities.',
          images: ['/api/placeholder/400/200'],
          verificationDate: '2024-02-20',
          rating: 4.9
        },
        {
          creditId: 'CAR_003_2024',
          projectName: 'Grassland Carbon Storage Project',
          projectType: 'Grassland Management',
          methodology: 'Climate Action Reserve',
          vintage: 2024,
          quantity: 3200,
          price: 16.25,
          seller: 'Prairie Carbon LLC',
          location: 'Montana, USA',
          certification: 'CAR Verified',
          additionality: 'Medium',
          permanence: '100 years',
          cobenefits: ['Wildlife habitat', 'Erosion control'],
          description: 'Improved grassland management across 8,000 acres of rangeland, implementing planned grazing systems to enhance soil carbon storage.',
          images: ['/api/placeholder/400/200'],
          verificationDate: '2024-01-10',
          rating: 4.6
        }
      ],
      buyerRequests: [
        {
          buyerId: 'buyer_001',
          companyName: 'EcoTech Industries',
          requestedQuantity: 5000,
          maxPrice: 20.00,
          preferredVintage: 2024,
          preferredMethodology: ['VCS', 'Gold Standard'],
          urgency: 'High',
          deadline: '2025-03-31',
          requirements: 'Agriculture-focused projects with biodiversity co-benefits',
          contact: 'procurement@ecotech.com'
        },
        {
          buyerId: 'buyer_002',
          companyName: 'Carbon Neutral Corp',
          requestedQuantity: 2500,
          maxPrice: 25.00,
          preferredVintage: 2024,
          preferredMethodology: ['Gold Standard'],
          urgency: 'Medium',
          deadline: '2025-06-30',
          requirements: 'High additionality projects with community co-benefits',
          contact: 'carbon@carbonneutral.com'
        }
      ],
      marketStats: {
        totalVolume: 47500,
        avgPrice: 19.25,
        volumeChange: 12.5,
        priceChange: 8.3,
        activeProjects: 156,
        totalBuyers: 89
      }
    };
  };

  const loadMyProjects = async () => {
    return [
      {
        projectId: 'my_project_001',
        projectName: 'Sustainable Corn & Soybean Operation',
        status: 'verified',
        totalCredits: 1250,
        creditsIssued: 1250,
        creditsListed: 800,
        creditsSold: 450,
        creditsAvailable: 350,
        currentPrice: 18.50,
        totalRevenue: 8325,
        methodology: 'VCS',
        vintage: 2024,
        verificationDate: '2024-02-15',
        nextVerification: '2025-02-15',
        cobenefits: ['Soil health', 'Water quality', 'Biodiversity'],
        buyer_interest: 12
      },
      {
        projectId: 'my_project_002',
        projectName: 'Regenerative Cattle Ranch',
        status: 'under_verification',
        totalCredits: 2100,
        creditsIssued: 0,
        creditsListed: 0,
        creditsSold: 0,
        creditsAvailable: 0,
        estimatedPrice: 20.00,
        expectedRevenue: 42000,
        methodology: 'Gold Standard',
        vintage: 2025,
        submissionDate: '2024-11-20',
        expectedVerification: '2025-04-15',
        verificationProgress: 65
      }
    ];
  };

  const loadMyCredits = async () => {
    return [
      {
        creditId: 'my_credit_001',
        projectName: 'Sustainable Corn & Soybean Operation',
        quantity: 350,
        vintage: 2024,
        purchasePrice: 17.25,
        currentPrice: 18.50,
        unrealizedGain: 437.50,
        status: 'available',
        methodology: 'VCS',
        expiryDate: '2034-12-31'
      },
      {
        creditId: 'my_credit_002',
        projectName: 'Midwest Agroforestry Project',
        quantity: 200,
        vintage: 2023,
        purchasePrice: 15.75,
        currentPrice: 19.25,
        unrealizedGain: 700.00,
        status: 'retired',
        methodology: 'Gold Standard',
        retirementDate: '2024-10-15',
        retirementReason: 'Corporate offsetting'
      }
    ];
  };

  const loadTransactionHistory = async () => {
    return [
      {
        transactionId: 'txn_001',
        type: 'sale',
        creditId: 'my_credit_001_partial',
        projectName: 'Sustainable Corn & Soybean Operation',
        quantity: 150,
        price: 18.50,
        total: 2775.00,
        buyer: 'EcoTech Industries',
        date: '2024-12-20',
        status: 'completed',
        fees: 83.25
      },
      {
        transactionId: 'txn_002',
        type: 'purchase',
        creditId: 'purchased_001',
        projectName: 'Midwest Agroforestry Project',
        quantity: 200,
        price: 15.75,
        total: 3150.00,
        seller: 'Forest Carbon LLC',
        date: '2024-11-10',
        status: 'completed',
        fees: 94.50
      },
      {
        transactionId: 'txn_003',
        type: 'retirement',
        creditId: 'my_credit_002',
        projectName: 'Midwest Agroforestry Project',
        quantity: 200,
        price: 15.75,
        date: '2024-10-15',
        status: 'completed',
        retirementReason: 'Corporate carbon neutrality'
      }
    ];
  };

  const renderMarketplaceTab = () => (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Market Volume</p>
              <p className="text-2xl font-bold text-blue-600">
                {marketplaceData?.marketStats.totalVolume.toLocaleString()} tCO₂e
              </p>
              <p className="text-sm text-green-600">
                +{marketplaceData?.marketStats.volumeChange}% this month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Average Price</p>
              <p className="text-2xl font-bold text-green-600">
                ${marketplaceData?.marketStats.avgPrice}
              </p>
              <p className="text-sm text-green-600">
                +{marketplaceData?.marketStats.priceChange}% this month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-purple-600">
                {marketplaceData?.marketStats.activeProjects}
              </p>
              <p className="text-sm text-gray-600">Available for purchase</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Active Buyers</p>
              <p className="text-2xl font-bold text-orange-600">
                {marketplaceData?.marketStats.totalBuyers}
              </p>
              <p className="text-sm text-gray-600">Looking to purchase</p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Current Market Prices</h3>
        {marketPrices && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Voluntary Market</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>VCS Average:</span>
                  <span className="font-medium">${marketPrices.voluntary.verra.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gold Standard:</span>
                  <span className="font-medium">${marketPrices.voluntary.goldStandard.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CAR:</span>
                  <span className="font-medium">${marketPrices.voluntary.car.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Agriculture Premium</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Regenerative Ag:</span>
                  <span className="font-medium">${(marketPrices.voluntary.average * 1.25).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Agroforestry:</span>
                  <span className="font-medium">${(marketPrices.voluntary.average * 1.35).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Soil Carbon:</span>
                  <span className="font-medium">${(marketPrices.voluntary.average * 1.20).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Market Trends</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Daily Change:</span>
                  <span className="font-medium text-green-600">+{marketPrices.trends.daily.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekly Change:</span>
                  <span className="font-medium text-green-600">+{marketPrices.trends.weekly.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Change:</span>
                  <span className="font-medium text-green-600">+{marketPrices.trends.monthly.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Available Credits */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Available Carbon Credits</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {marketplaceData?.availableCredits.map((credit) => (
            <CreditCard key={credit.creditId} credit={credit} onPurchase={handlePurchaseCredit} />
          ))}
        </div>
      </div>

      {/* Buyer Requests */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Buyer Requests</h3>
        <div className="space-y-4">
          {marketplaceData?.buyerRequests.map((request) => (
            <BuyerRequestCard 
              key={request.buyerId} 
              request={request} 
              onRespond={handleRespondToBuyer} 
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderMyProjectsTab = () => (
    <div className="space-y-6">
      {/* Projects Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-green-600">{myProjects.length}</p>
              <p className="text-sm text-gray-600">Active projects</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Credits Issued</p>
              <p className="text-2xl font-bold text-blue-600">
                {myProjects.reduce((sum, p) => sum + p.creditsIssued, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">tCO₂e verified</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Credits Available</p>
              <p className="text-2xl font-bold text-purple-600">
                {myProjects.reduce((sum, p) => sum + p.creditsAvailable, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Ready to sell</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-orange-600">
                ${myProjects.reduce((sum, p) => sum + (p.totalRevenue || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">From carbon sales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="space-y-6">
        {myProjects.map((project) => (
          <div key={project.projectId} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">{project.projectName}</h3>
                <p className="text-gray-600">{project.methodology} • Vintage {project.vintage}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'verified' ? 'bg-green-100 text-green-800' :
                project.status === 'under_verification' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold">{project.totalCredits}</p>
                <p className="text-sm text-gray-500">tCO₂e</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available to Sell</p>
                <p className="text-2xl font-bold text-green-600">{project.creditsAvailable}</p>
                <p className="text-sm text-gray-500">tCO₂e</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Price</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${project.currentPrice || project.estimatedPrice}
                </p>
                <p className="text-sm text-gray-500">per tCO₂e</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${(project.totalRevenue || project.expectedRevenue || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{project.status === 'verified' ? 'earned' : 'projected'}</p>
              </div>
            </div>

            {project.status === 'verified' && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">Buyer Interest: {project.buyer_interest} inquiries</p>
                    <p className="text-sm text-gray-600">Next verification: {new Date(project.nextVerification).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      List for Sale
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      View Analytics
                    </button>
                  </div>
                </div>
              </div>
            )}

            {project.status === 'under_verification' && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">Verification Progress: {project.verificationProgress}%</p>
                    <p className="text-sm text-gray-600">Expected completion: {new Date(project.expectedVerification).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                      Upload Documents
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                      Check Status
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${project.verificationProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create New Project */}
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-dashed border-gray-300">
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Carbon Project</h3>
          <p className="text-gray-600 mb-4">Start generating carbon credits from your sustainable farming practices</p>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Create Project
          </button>
        </div>
      </div>
    </div>
  );

  const renderMyCreditsTab = () => (
    <div className="space-y-6">
      {/* Credits Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-green-600">
                {myCredits.reduce((sum, c) => sum + c.quantity, 0)}
              </p>
              <p className="text-sm text-gray-600">tCO₂e owned</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Available Credits</p>
              <p className="text-2xl font-bold text-blue-600">
                {myCredits.filter(c => c.status === 'available').reduce((sum, c) => sum + c.quantity, 0)}
              </p>
              <p className="text-sm text-gray-600">Ready to sell/retire</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
              <p className="text-2xl font-bold text-purple-600">
                ${myCredits.reduce((sum, c) => sum + (c.quantity * c.currentPrice), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Current market value</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Unrealized Gains</p>
              <p className="text-2xl font-bold text-orange-600">
                ${myCredits.reduce((sum, c) => sum + (c.unrealizedGain || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Paper profit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Credits Inventory */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Credits Inventory</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gain/Loss
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myCredits.map((credit) => (
                <tr key={credit.creditId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{credit.projectName}</div>
                      <div className="text-sm text-gray-500">{credit.methodology} • {credit.vintage}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {credit.quantity} tCO₂e
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${credit.purchasePrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${credit.currentPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      (credit.unrealizedGain || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${Math.abs(credit.unrealizedGain || 0).toLocaleString()}
                      <span className="text-xs ml-1">
                        ({(((credit.currentPrice - credit.purchasePrice) / credit.purchasePrice) * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      credit.status === 'available' ? 'bg-green-100 text-green-800' :
                      credit.status === 'retired' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {credit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {credit.status === 'available' ? (
                      <div className="flex space-x-2">
                        <button className="text-green-600 hover:text-green-900">Sell</button>
                        <button className="text-blue-600 hover:text-blue-900">Retire</button>
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        {credit.status === 'retired' ? 'Retired' : 'Not available'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTransactionsTab = () => (
    <div className="space-y-6">
      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-green-600">
                ${transactions
                  .filter(t => t.type === 'sale')
                  .reduce((sum, t) => sum + t.total, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                {transactions.filter(t => t.type === 'sale').length} transactions
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Purchases</p>
              <p className="text-2xl font-bold text-blue-600">
                ${transactions
                  .filter(t => t.type === 'purchase')
                  .reduce((sum, t) => sum + t.total, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                {transactions.filter(t => t.type === 'purchase').length} transactions
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Credits Retired</p>
              <p className="text-2xl font-bold text-purple-600">
                {transactions
                  .filter(t => t.type === 'retirement')
                  .reduce((sum, t) => sum + t.quantity, 0)}
              </p>
              <p className="text-sm text-gray-600">tCO₂e offset</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Counterparty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.transactionId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === 'sale' ? 'bg-green-100 text-green-800' :
                      transaction.type === 'purchase' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.projectName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.quantity} tCO₂e
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${transaction.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${transaction.total?.toLocaleString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.buyer || transaction.seller || transaction.retirementReason || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const handlePurchaseCredit = (creditId) => {
    // Handle credit purchase
    console.log('Purchasing credit:', creditId);
    alert('Purchase initiated! You will be redirected to complete the transaction.');
  };

  const handleRespondToBuyer = (buyerId) => {
    // Handle responding to buyer request
    console.log('Responding to buyer:', buyerId);
    setSelectedBuyer(buyerId);
    alert('Response form opened. You can now submit your proposal.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading carbon credits data...</p>
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
          <p className="text-red-600 mb-2">Error loading carbon credits data</p>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={loadCarbonCreditsData}
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
          <h1 className="text-3xl font-bold text-gray-900">Carbon Credits Portal</h1>
          <p className="mt-2 text-gray-600">
            Trade carbon credits, manage your projects, and track sustainability investments
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'marketplace', name: 'Marketplace', icon: '🏪' },
              { id: 'projects', name: 'My Projects', icon: '🌱' },
              { id: 'credits', name: 'My Credits', icon: '💚' },
              { id: 'transactions', name: 'Transactions', icon: '📊' }
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
        {activeTab === 'marketplace' && renderMarketplaceTab()}
        {activeTab === 'projects' && renderMyProjectsTab()}
        {activeTab === 'credits' && renderMyCreditsTab()}
        {activeTab === 'transactions' && renderTransactionsTab()}
      </div>
    </div>
  );
};

// Credit Card Component
const CreditCard = ({ credit, onPurchase }) => (
  <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div className="h-32 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
      <div className="text-center text-white">
        <p className="text-lg font-bold">{credit.quantity} tCO₂e</p>
        <p className="text-sm">{credit.methodology}</p>
      </div>
    </div>
    
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm">{credit.projectName}</h4>
        <div className="flex items-center">
          <span className="text-yellow-400 mr-1">★</span>
          <span className="text-sm text-gray-600">{credit.rating}</span>
        </div>
      </div>
      
      <p className="text-xs text-gray-600 mb-3">{credit.location} • {credit.projectType}</p>
      
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-lg font-bold text-green-600">${credit.price}</p>
          <p className="text-xs text-gray-500">per tCO₂e</p>
        </div>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          {credit.certification}
        </span>
      </div>
      
      <div className="mb-3">
        <p className="text-xs text-gray-600 mb-1">Co-benefits:</p>
        <div className="flex flex-wrap gap-1">
          {credit.cobenefits.slice(0, 2).map((benefit, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {benefit}
            </span>
          ))}
          {credit.cobenefits.length > 2 && (
            <span className="text-xs text-gray-500">+{credit.cobenefits.length - 2} more</span>
          )}
        </div>
      </div>
      
      <button
        onClick={() => onPurchase(credit.creditId)}
        className="w-full bg-green-600 text-white py-2 px-4 rounded text-sm hover:bg-green-700 transition-colors"
      >
        Purchase Credits
      </button>
    </div>
  </div>
);

// Buyer Request Card Component
const BuyerRequestCard = ({ request, onRespond }) => (
  <div className="border rounded-lg p-4">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h4 className="font-medium">{request.companyName}</h4>
        <p className="text-sm text-gray-600">{request.contact}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        request.urgency === 'High' ? 'bg-red-100 text-red-800' :
        request.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
        'bg-green-100 text-green-800'
      }`}>
        {request.urgency} Priority
      </span>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
      <div>
        <p className="text-gray-600">Quantity</p>
        <p className="font-medium">{request.requestedQuantity.toLocaleString()} tCO₂e</p>
      </div>
      <div>
        <p className="text-gray-600">Max Price</p>
        <p className="font-medium">${request.maxPrice}/tCO₂e</p>
      </div>
      <div>
        <p className="text-gray-600">Vintage</p>
        <p className="font-medium">{request.preferredVintage}</p>
      </div>
      <div>
        <p className="text-gray-600">Deadline</p>
        <p className="font-medium">{new Date(request.deadline).toLocaleDateString()}</p>
      </div>
    </div>
    
    <p className="text-sm text-gray-700 mb-3">{request.requirements}</p>
    
    <div className="flex items-center justify-between">
      <div className="flex space-x-2">
        {request.preferredMethodology.map((method) => (
          <span key={method} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
            {method}
          </span>
        ))}
      </div>
      <button
        onClick={() => onRespond(request.buyerId)}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
      >
        Respond
      </button>
    </div>
  </div>
);

export default CarbonCreditsPortal;
