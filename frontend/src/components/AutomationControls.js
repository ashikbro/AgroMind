import React, { useState, useEffect } from 'react';

const AutomationControls = () => {
  const [automationRules, setAutomationRules] = useState([
    {
      id: 1,
      name: 'Auto Irrigation',
      trigger: 'Soil moisture < 35%',
      action: 'Activate sprinkler system for 15 minutes',
      enabled: true,
      lastTriggered: '2 hours ago',
      icon: '💧'
    },
    {
      id: 2,
      name: 'Temperature Control',
      trigger: 'Temperature > 30°C',
      action: 'Open greenhouse vents',
      enabled: true,
      lastTriggered: '45 minutes ago',
      icon: '🌡️'
    },
    {
      id: 3,
      name: 'Fertilizer Release',
      trigger: 'pH level < 6.0 OR > 8.0',
      action: 'Release pH adjustment solution',
      enabled: false,
      lastTriggered: 'Never',
      icon: '🧪'
    },
    {
      id: 4,
      name: 'Pest Alert',
      trigger: 'Unusual insect activity detected',
      action: 'Send notification to farmer',
      enabled: true,
      lastTriggered: '3 days ago',
      icon: '🐛'
    }
  ]);

  const [manualControls, setManualControls] = useState({
    irrigation: false,
    ventilation: false,
    lighting: false,
    fertilizer: false
  });

  const toggleAutomation = (ruleId) => {
    setAutomationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const toggleManualControl = (control) => {
    setManualControls(prev => ({
      ...prev,
      [control]: !prev[control]
    }));
  };

  const AutomationRule = ({ rule }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{rule.icon}</span>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{rule.name}</h3>
            <p className="text-sm text-gray-500">Last triggered: {rule.lastTriggered}</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={rule.enabled}
            onChange={() => toggleAutomation(rule.id)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm font-medium text-gray-700">Trigger Condition:</p>
          <p className="text-sm text-gray-600">{rule.trigger}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm font-medium text-gray-700">Automated Action:</p>
          <p className="text-sm text-gray-600">{rule.action}</p>
        </div>
      </div>
    </div>
  );

  const ManualControl = ({ name, icon, active, control, description }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className={`w-4 h-4 rounded-full ${active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
      </div>
      
      <button
        onClick={() => toggleManualControl(control)}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          active 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {active ? 'Stop' : 'Start'} {name}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Farm Automation Center</h1>
          <p className="text-gray-600">Control and monitor your automated farming systems</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Active Rules</p>
                <p className="text-2xl font-bold">{automationRules.filter(r => r.enabled).length}</p>
              </div>
              <div className="text-3xl">⚙️</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Manual Controls</p>
                <p className="text-2xl font-bold">{Object.values(manualControls).filter(Boolean).length}</p>
              </div>
              <div className="text-3xl">🎮</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Energy Saved</p>
                <p className="text-2xl font-bold">23%</p>
              </div>
              <div className="text-3xl">⚡</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Water Saved</p>
                <p className="text-2xl font-bold">157L</p>
              </div>
              <div className="text-3xl">💧</div>
            </div>
          </div>
        </div>

        {/* Automation Rules */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Automation Rules</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {automationRules.map(rule => (
              <AutomationRule key={rule.id} rule={rule} />
            ))}
          </div>
        </div>

        {/* Manual Controls */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Manual Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ManualControl
              name="Irrigation"
              icon="💧"
              active={manualControls.irrigation}
              control="irrigation"
              description="Water your crops manually"
            />
            <ManualControl
              name="Ventilation"
              icon="🌬️"
              active={manualControls.ventilation}
              control="ventilation"
              description="Control greenhouse airflow"
            />
            <ManualControl
              name="LED Lighting"
              icon="💡"
              active={manualControls.lighting}
              control="lighting"
              description="Supplemental grow lights"
            />
            <ManualControl
              name="Fertilizer"
              icon="🧪"
              active={manualControls.fertilizer}
              control="fertilizer"
              description="Release nutrient solution"
            />
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🟢</span>
              </div>
              <h3 className="font-bold text-gray-800">All Systems Online</h3>
              <p className="text-sm text-gray-500">99.8% uptime this month</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📡</span>
              </div>
              <h3 className="font-bold text-gray-800">IoT Connectivity</h3>
              <p className="text-sm text-gray-500">12 sensors connected</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔋</span>
              </div>
              <h3 className="font-bold text-gray-800">Power Status</h3>
              <p className="text-sm text-gray-500">Solar: 85% | Grid: 15%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationControls;
