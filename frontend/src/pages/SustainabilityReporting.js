import React, { useState, useEffect } from 'react';
import SustainabilityService from '../services/SustainabilityService';

const SustainabilityReporting = () => {
  const [reportType, setReportType] = useState('annual');
  const [reportData, setReportData] = useState(null);
  const [reportPeriod, setReportPeriod] = useState({
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState('GRI');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReportData();
    loadGeneratedReports();
  }, [reportType, reportPeriod]);

  const loadReportData = async () => {
    try {
      // Sample farm data for reporting
      const farmData = {
        farmId: 'farm_001',
        farmName: 'Sustainable Acres Farm',
        farmSize: 250,
        location: 'Iowa, USA',
        reportPeriod: reportPeriod,
        cropTypes: [
          { type: 'corn', area: 100, yield: 180, practices: ['cover crops', 'no-till'] },
          { type: 'soybeans', area: 80, yield: 50, practices: ['crop rotation', 'no-till'] },
          { type: 'wheat', area: 70, yield: 65, practices: ['cover crops', 'reduced tillage'] }
        ],
        livestock: [
          { type: 'cattle', count: 150, managementPractice: 'rotational grazing' }
        ],
        sustainabilityPractices: [
          { practice: 'coverCropping', area: 180, adoptionYear: 2020 },
          { practice: 'noTill', area: 250, adoptionYear: 2019 },
          { practice: 'cropRotation', area: 250, adoptionYear: 2018 },
          { practice: 'rotationalGrazing', area: 120, adoptionYear: 2021 }
        ]
      };

      const report = await SustainabilityService.generateSustainabilityReport(farmData);
      setReportData(report);
    } catch (error) {
      setError(error.message);
    }
  };

  const loadGeneratedReports = async () => {
    // Sample historical reports
    setGeneratedReports([
      {
        reportId: 'rpt_001',
        title: 'Annual Sustainability Report 2024',
        type: 'annual',
        framework: 'GRI',
        period: { start: '2024-01-01', end: '2024-12-31' },
        generatedDate: '2024-12-31T23:59:59Z',
        status: 'completed',
        fileSize: '2.4 MB',
        downloadUrl: '#'
      },
      {
        reportId: 'rpt_002',
        title: 'Q4 2024 Carbon Footprint Report',
        type: 'carbon',
        framework: 'GHG Protocol',
        period: { start: '2024-10-01', end: '2024-12-31' },
        generatedDate: '2024-12-31T18:30:00Z',
        status: 'completed',
        fileSize: '1.8 MB',
        downloadUrl: '#'
      },
      {
        reportId: 'rpt_003',
        title: 'ESG Compliance Report 2024',
        type: 'esg',
        framework: 'SASB',
        period: { start: '2024-01-01', end: '2024-12-31' },
        generatedDate: '2024-12-30T14:20:00Z',
        status: 'completed',
        fileSize: '3.1 MB',
        downloadUrl: '#'
      }
    ]);
  };

  const generateReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const reportConfig = {
        type: reportType,
        framework: selectedFramework,
        period: reportPeriod,
        format: exportFormat,
        includeComparisons: true,
        includeBenchmarks: true,
        includeRecommendations: true
      };

      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newReport = {
        reportId: `rpt_${Date.now()}`,
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Sustainability Report ${new Date().getFullYear()}`,
        type: reportType,
        framework: selectedFramework,
        period: reportPeriod,
        generatedDate: new Date().toISOString(),
        status: 'completed',
        fileSize: '2.1 MB',
        downloadUrl: '#'
      };

      setGeneratedReports([newReport, ...generatedReports]);
      alert('Report generated successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderReportPreview = () => {
    if (!reportData) return null;

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Sustainability Report Preview</h2>
          <p className="text-green-100">
            {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report • 
            {selectedFramework} Framework • 
            {new Date(reportPeriod.startDate).getFullYear()}
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Executive Summary */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Executive Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Sustainability Score</h4>
                <p className="text-3xl font-bold text-green-600">{reportData.overallSustainabilityScore}/100</p>
                <p className="text-sm text-green-700">Excellent performance</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Carbon Impact</h4>
                <p className="text-3xl font-bold text-blue-600">
                  {(reportData.carbonMetrics.netImpact / 1000).toFixed(1)}
                </p>
                <p className="text-sm text-blue-700">
                  tCO₂e {reportData.carbonMetrics.netImpact < 0 ? 'sequestered' : 'emitted'}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2">Credits Generated</h4>
                <p className="text-3xl font-bold text-purple-600">
                  {Math.round(reportData.carbonMetrics.carbonCreditsGenerated)}
                </p>
                <p className="text-sm text-purple-700">Carbon credits earned</p>
              </div>
            </div>
          </section>

          {/* Key Performance Indicators */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Key Performance Indicators</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Carbon Intensity
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reportData.carbonMetrics.carbonIntensity.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      kg CO₂e/kg product
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      &lt; 0.5
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Exceeds Target
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Soil Health Score
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reportData.soilMetrics.score}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Score (0-100)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      &gt; 75
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Meets Target
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Water Use Efficiency
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reportData.waterMetrics.efficiencyScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Score (0-100)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      &gt; 80
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Meets Target
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Biodiversity Index
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reportData.biodiversityMetrics.score}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Score (0-100)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      &gt; 70
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Exceeds Target
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Environmental Impact */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Environmental Impact Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Carbon Footprint Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Crop Production:</span>
                    <span className="text-sm font-medium">
                      {(reportData.carbonMetrics.emissions.cropProduction / 1000).toFixed(1)} tCO₂e
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Livestock:</span>
                    <span className="text-sm font-medium">
                      {(reportData.carbonMetrics.emissions.livestockEmissions / 1000).toFixed(1)} tCO₂e
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Equipment:</span>
                    <span className="text-sm font-medium">
                      {(reportData.carbonMetrics.emissions.equipmentEmissions / 1000).toFixed(1)} tCO₂e
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Total Emissions:</span>
                    <span className="text-sm font-bold text-red-600">
                      {(reportData.carbonMetrics.emissions.total / 1000).toFixed(1)} tCO₂e
                    </span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Carbon Sequestration</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Soil Carbon:</span>
                    <span className="text-sm font-medium">
                      {(reportData.carbonMetrics.sequestration.soilCarbon / 1000).toFixed(1)} tCO₂e
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vegetation:</span>
                    <span className="text-sm font-medium">
                      {(reportData.carbonMetrics.sequestration.vegetationCarbon / 1000).toFixed(1)} tCO₂e
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Agroforestry:</span>
                    <span className="text-sm font-medium">
                      {(reportData.carbonMetrics.sequestration.agroforestryCarbon / 1000).toFixed(1)} tCO₂e
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Total Sequestration:</span>
                    <span className="text-sm font-bold text-green-600">
                      {(reportData.carbonMetrics.sequestration.total / 1000).toFixed(1)} tCO₂e
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sustainability Practices */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Sustainability Practices Implementation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { practice: 'Cover Cropping', area: 180, impact: 'High', benefit: 'Soil health, carbon sequestration' },
                { practice: 'No-Till Farming', area: 250, impact: 'High', benefit: 'Soil conservation, carbon storage' },
                { practice: 'Crop Rotation', area: 250, impact: 'Medium', benefit: 'Soil fertility, pest management' },
                { practice: 'Rotational Grazing', area: 120, impact: 'Medium', benefit: 'Grassland health, biodiversity' },
                { practice: 'Agroforestry', area: 25, impact: 'High', benefit: 'Carbon sequestration, biodiversity' },
                { practice: 'Precision Agriculture', area: 250, impact: 'Medium', benefit: 'Resource efficiency, reduced inputs' }
              ].map((practice, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{practice.practice}</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-medium">{practice.area} hectares</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impact:</span>
                      <span className={`font-medium ${
                        practice.impact === 'High' ? 'text-green-600' :
                        practice.impact === 'Medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {practice.impact}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs mt-2">{practice.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendations */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Recommendations for Improvement</h3>
            <div className="space-y-4">
              {[
                {
                  priority: 'High',
                  recommendation: 'Expand agroforestry implementation',
                  description: 'Increase tree integration on additional 50 hectares to enhance carbon sequestration and biodiversity.',
                  impact: 'Could generate additional 200-300 carbon credits annually',
                  timeline: '2-3 years',
                  investment: '$15,000 - $25,000'
                },
                {
                  priority: 'Medium',
                  recommendation: 'Implement renewable energy systems',
                  description: 'Install solar panels and wind systems to reduce energy emissions and achieve carbon neutrality.',
                  impact: 'Reduce energy emissions by 80-90%',
                  timeline: '1-2 years',
                  investment: '$50,000 - $75,000'
                },
                {
                  priority: 'Medium',
                  recommendation: 'Enhance water management systems',
                  description: 'Implement precision irrigation and water conservation technologies.',
                  impact: 'Improve water efficiency by 20-30%',
                  timeline: '1 year',
                  investment: '$20,000 - $35,000'
                }
              ].map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{rec.recommendation}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Expected Impact:</span>
                      <p className="font-medium">{rec.impact}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Timeline:</span>
                      <p className="font-medium">{rec.timeline}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Investment:</span>
                      <p className="font-medium">{rec.investment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Compliance Status */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Compliance & Certification Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Current Certifications</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Regenerative Agriculture', status: 'Certified', expires: '2027-03-15' },
                    { name: 'USDA Organic', status: 'In Transition', progress: 65 },
                    { name: 'Carbon Neutral Farm', status: 'Eligible', action: 'Apply Now' }
                  ].map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{cert.name}</p>
                        {cert.expires && (
                          <p className="text-xs text-gray-600">Expires: {new Date(cert.expires).toLocaleDateString()}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cert.status === 'Certified' ? 'bg-green-100 text-green-800' :
                        cert.status === 'In Transition' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {cert.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Regulatory Compliance</h4>
                <div className="space-y-2">
                  {[
                    { requirement: 'Environmental Protection Act', status: 'Compliant', lastAudit: '2024-08-15' },
                    { requirement: 'Water Quality Standards', status: 'Compliant', lastAudit: '2024-09-20' },
                    { requirement: 'GHG Reporting Requirements', status: 'Compliant', lastAudit: '2024-12-01' },
                    { requirement: 'Biodiversity Conservation', status: 'Exceeds', lastAudit: '2024-10-10' }
                  ].map((req, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{req.requirement}</p>
                        <p className="text-xs text-gray-600">Last audit: {new Date(req.lastAudit).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        req.status === 'Exceeds' ? 'bg-green-100 text-green-800' :
                        req.status === 'Compliant' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sustainability Reporting</h1>
          <p className="mt-2 text-gray-600">
            Generate comprehensive sustainability reports and track environmental performance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Configuration */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
              <h2 className="text-lg font-semibold">Report Configuration</h2>

              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="annual">Annual Sustainability Report</option>
                  <option value="carbon">Carbon Footprint Report</option>
                  <option value="esg">ESG Compliance Report</option>
                  <option value="certification">Certification Report</option>
                  <option value="impact">Environmental Impact Assessment</option>
                </select>
              </div>

              {/* Reporting Framework */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reporting Framework
                </label>
                <select
                  value={selectedFramework}
                  onChange={(e) => setSelectedFramework(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="GRI">GRI Standards</option>
                  <option value="SASB">SASB Standards</option>
                  <option value="TCFD">TCFD Framework</option>
                  <option value="GHG Protocol">GHG Protocol</option>
                  <option value="ISO 14001">ISO 14001</option>
                  <option value="CDP">CDP Framework</option>
                </select>
              </div>

              {/* Report Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reporting Period
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={reportPeriod.startDate}
                      onChange={(e) => setReportPeriod({...reportPeriod, startDate: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={reportPeriod.endDate}
                      onChange={(e) => setReportPeriod({...reportPeriod, endDate: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Export Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setExportFormat('pdf')}
                    className={`p-3 rounded-lg border text-sm font-medium ${
                      exportFormat === 'pdf'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    PDF Report
                  </button>
                  <button
                    onClick={() => setExportFormat('excel')}
                    className={`p-3 rounded-lg border text-sm font-medium ${
                      exportFormat === 'excel'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Excel Data
                  </button>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Report...
                  </div>
                ) : (
                  'Generate Report'
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
            </div>

            {/* Generated Reports */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
              <div className="space-y-3">
                {generatedReports.map((report) => (
                  <div key={report.reportId} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{report.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        report.status === 'completed' ? 'bg-green-100 text-green-800' :
                        report.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {report.framework} • {new Date(report.generatedDate).toLocaleDateString()} • {report.fileSize}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-xs">View</button>
                      <button className="text-green-600 hover:text-green-800 text-xs">Download</button>
                      <button className="text-gray-600 hover:text-gray-800 text-xs">Share</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report Preview */}
          <div className="lg:col-span-2">
            {renderReportPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityReporting;
