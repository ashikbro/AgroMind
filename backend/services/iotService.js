const mqtt = require('mqtt');
const WebSocket = require('ws');
const EventEmitter = require('events');
const pubsub = require('../pubsub');

class IoTService extends EventEmitter {
  constructor() {
    super();
    this.sensors = new Map();
    this.automationRules = new Map();
    this.mqttClient = null;
    this.wsServer = null;
    this.sensorData = new Map();
    this.alerts = [];
    this.automationStatus = new Map();
    
    this.initializeMQTT();
    this.initializeWebSocket();
    this.startDataCollection();
  }

  // Initialize MQTT client for IoT device communication
  initializeMQTT() {
    const mqttBroker = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
    
    this.mqttClient = mqtt.connect(mqttBroker, {
      clientId: `agromind_server_${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: 'agromind/status',
        payload: 'Server disconnected',
        qos: 0,
        retain: false
      }
    });

    this.mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      
      // Subscribe to sensor topics
      this.mqttClient.subscribe([
        'agromind/+/sensors/+/data',
        'agromind/+/automation/+/status',
        'agromind/+/alerts/+'
      ], (err) => {
        if (err) console.error('MQTT subscription error:', err);
      });
    });

    this.mqttClient.on('message', (topic, message) => {
      this.handleMQTTMessage(topic, message);
    });

    this.mqttClient.on('error', (error) => {
      console.error('MQTT error:', error);
    });
  }

  // Initialize WebSocket server for real-time communication
  initializeWebSocket() {
    const port = process.env.WS_PORT || 8080;
    
    this.wsServer = new WebSocket.Server({ port });
    
    this.wsServer.on('connection', (ws, req) => {
      console.log('WebSocket client connected');
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleWebSocketMessage(ws, data);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        console.log('WebSocket client disconnected');
      });

      // Send initial data
      this.sendInitialData(ws);
    });
  }

  // Handle MQTT messages from IoT devices
  handleMQTTMessage(topic, message) {
    try {
      const data = JSON.parse(message.toString());
      const topicParts = topic.split('/');
      
      if (topicParts[2] === 'sensors') {
        const farmId = topicParts[1];
        const sensorId = topicParts[3];
        
        this.processSensorData(farmId, sensorId, data);
      } else if (topicParts[2] === 'automation') {
        const farmId = topicParts[1];
        const deviceId = topicParts[3];
        
        this.processAutomationStatus(farmId, deviceId, data);
      } else if (topicParts[2] === 'alerts') {
        const farmId = topicParts[1];
        
        this.processAlert(farmId, data);
      }
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  }

  // Process sensor data
  processSensorData(farmId, sensorId, data) {
    const timestamp = new Date();
    const reading = {
      id: `${sensorId}_${timestamp.getTime()}`,
      sensorId,
      farmId,
      ...data,
      timestamp,
      quality: this.assessDataQuality(data)
    };

    // Store sensor data
    if (!this.sensorData.has(farmId)) {
      this.sensorData.set(farmId, new Map());
    }
    
    const farmSensors = this.sensorData.get(farmId);
    if (!farmSensors.has(sensorId)) {
      farmSensors.set(sensorId, []);
    }
    
    const sensorReadings = farmSensors.get(sensorId);
    sensorReadings.push(reading);
    
    // Keep only last 1000 readings per sensor
    if (sensorReadings.length > 1000) {
      sensorReadings.shift();
    }

    // Check for alerts
    this.checkSensorAlerts(farmId, sensorId, reading);

    // Broadcast to WebSocket clients
    this.broadcastSensorData(farmId, reading);

    // Publish to GraphQL subscriptions
    pubsub.publishSensorUpdate(farmId, reading);

    // Check automation rules
    this.checkAutomationRules(farmId, reading);
  }

  // Process automation status updates
  processAutomationStatus(farmId, deviceId, data) {
    if (!this.automationStatus.has(farmId)) {
      this.automationStatus.set(farmId, new Map());
    }
    
    this.automationStatus.get(farmId).set(deviceId, {
      ...data,
      lastUpdated: new Date()
    });

    // Broadcast status update
    this.broadcastAutomationStatus(farmId, deviceId, data);
  }

  // Process alerts
  processAlert(farmId, alertData) {
    const alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      farmId,
      ...alertData,
      timestamp: new Date(),
      read: false,
      acknowledged: false
    };

    this.alerts.push(alert);

    // Keep only last 500 alerts
    if (this.alerts.length > 500) {
      this.alerts.shift();
    }

    // Broadcast alert
    this.broadcastAlert(farmId, alert);

    // Publish to GraphQL subscriptions
    pubsub.publishAlert(farmId, alert);
  }

  // Get real-time metrics for a farm
  async getRealTimeMetrics(farmId) {
    const farmSensors = this.sensorData.get(farmId) || new Map();
    const farmAutomation = this.automationStatus.get(farmId) || new Map();
    const farmAlerts = this.alerts.filter(alert => alert.farmId === farmId && !alert.read);

    // Get latest readings from each sensor type
    const sensorTypes = ['soilMoisture', 'temperature', 'humidity', 'phLevel', 'lightIntensity', 'nutrients'];
    const sensors = {};
    
    sensorTypes.forEach(type => {
      sensors[type] = [];
      farmSensors.forEach((readings, sensorId) => {
        const latestReading = readings[readings.length - 1];
        if (latestReading && latestReading.type === type) {
          sensors[type].push(latestReading);
        }
      });
    });

    // Get automation status
    const automation = {
      irrigation: this.getComponentStatus(farmAutomation, 'irrigation'),
      ventilation: this.getComponentStatus(farmAutomation, 'ventilation'),
      lighting: this.getComponentStatus(farmAutomation, 'lighting'),
      fertilizer: this.getComponentStatus(farmAutomation, 'fertilizer'),
      pestControl: this.getComponentStatus(farmAutomation, 'pestControl')
    };

    // Get weather data (mock for now)
    const weather = await this.getCurrentWeather(farmId);

    return {
      farmId,
      timestamp: new Date(),
      sensors,
      automation,
      alerts: farmAlerts,
      weather
    };
  }

  // Get sensor data with filtering
  async getSensorData(farmId, sensorType = null, timeRange = null) {
    const farmSensors = this.sensorData.get(farmId) || new Map();
    let allReadings = [];

    farmSensors.forEach((readings) => {
      allReadings = allReadings.concat(readings);
    });

    // Filter by sensor type
    if (sensorType) {
      allReadings = allReadings.filter(reading => reading.type === sensorType);
    }

    // Filter by time range
    if (timeRange) {
      const start = new Date(timeRange.start);
      const end = new Date(timeRange.end);
      allReadings = allReadings.filter(reading => 
        reading.timestamp >= start && reading.timestamp <= end
      );
    }

    // Sort by timestamp
    allReadings.sort((a, b) => b.timestamp - a.timestamp);

    return allReadings;
  }

  // Get alerts with filtering
  async getAlerts(farmId, severity = null) {
    let farmAlerts = this.alerts.filter(alert => alert.farmId === farmId);

    if (severity) {
      farmAlerts = farmAlerts.filter(alert => alert.severity === severity);
    }

    return farmAlerts.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Record sensor data manually
  async recordSensorData(farmId, data) {
    const reading = {
      id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      farmId,
      ...data,
      timestamp: new Date(),
      quality: 'GOOD',
      source: 'MANUAL'
    };

    this.processSensorData(farmId, data.sensorId, reading);
    return reading;
  }

  // Automation Rules Management
  async createAutomationRule(farmId, ruleData) {
    const rule = {
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      farmId,
      ...ruleData,
      enabled: true,
      createdAt: new Date(),
      lastTriggered: null,
      triggerCount: 0
    };

    if (!this.automationRules.has(farmId)) {
      this.automationRules.set(farmId, new Map());
    }

    this.automationRules.get(farmId).set(rule.id, rule);
    return rule;
  }

  async updateAutomationRule(ruleId, updateData) {
    // Find and update rule across all farms
    for (const [farmId, rules] of this.automationRules) {
      if (rules.has(ruleId)) {
        const rule = rules.get(ruleId);
        const updatedRule = { ...rule, ...updateData, updatedAt: new Date() };
        rules.set(ruleId, updatedRule);
        return updatedRule;
      }
    }
    throw new Error('Automation rule not found');
  }

  async getAutomationRules(farmId) {
    const rules = this.automationRules.get(farmId);
    return rules ? Array.from(rules.values()) : [];
  }

  // Trigger automation manually
  async triggerAutomation(farmId, action, parameters = {}) {
    const command = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      farmId,
      action,
      parameters,
      timestamp: new Date(),
      status: 'PENDING'
    };

    // Send MQTT command to farm devices
    const topic = `agromind/${farmId}/automation/${action}/command`;
    this.mqttClient.publish(topic, JSON.stringify(command));

    // Broadcast automation event
    pubsub.publishAutomationEvent(farmId, command);

    return {
      id: command.id,
      action,
      status: 'TRIGGERED',
      timestamp: command.timestamp
    };
  }

  // Check automation rules against sensor readings
  checkAutomationRules(farmId, reading) {
    const rules = this.automationRules.get(farmId);
    if (!rules) return;

    rules.forEach(rule => {
      if (!rule.enabled) return;

      const shouldTrigger = this.evaluateRuleConditions(rule, reading);
      
      if (shouldTrigger) {
        this.executeAutomationRule(rule, reading);
      }
    });
  }

  // Evaluate rule conditions
  evaluateRuleConditions(rule, reading) {
    if (rule.trigger.type === 'THRESHOLD') {
      return rule.trigger.conditions.some(condition => {
        const value = reading[condition.parameter];
        if (value === undefined) return false;

        switch (condition.operator) {
          case 'GREATER_THAN':
            return value > condition.value;
          case 'LESS_THAN':
            return value < condition.value;
          case 'EQUAL_TO':
            return value === condition.value;
          case 'GREATER_THAN_OR_EQUAL':
            return value >= condition.value;
          case 'LESS_THAN_OR_EQUAL':
            return value <= condition.value;
          case 'NOT_EQUAL_TO':
            return value !== condition.value;
          default:
            return false;
        }
      });
    }

    return false;
  }

  // Execute automation rule
  executeAutomationRule(rule, triggerData) {
    rule.lastTriggered = new Date();
    rule.triggerCount++;

    // Execute the action
    this.triggerAutomation(rule.farmId, rule.action.type, {
      ...rule.action.parameters,
      triggerReason: 'AUTOMATION_RULE',
      ruleId: rule.id,
      triggerData
    });
  }

  // Check for sensor alerts
  checkSensorAlerts(farmId, sensorId, reading) {
    // Define alert thresholds (these would come from farm settings)
    const thresholds = {
      soilMoisture: { min: 20, max: 80, critical: 10 },
      temperature: { min: 15, max: 35, critical: 40 },
      humidity: { min: 40, max: 80, critical: 90 },
      phLevel: { min: 6.0, max: 7.5, critical: 5.0 }
    };

    const threshold = thresholds[reading.type];
    if (!threshold) return;

    let alertLevel = null;
    let message = '';

    if (reading.value <= threshold.critical) {
      alertLevel = 'CRITICAL';
      message = `Critical ${reading.type} level: ${reading.value}${reading.unit}`;
    } else if (reading.value < threshold.min) {
      alertLevel = 'WARNING';
      message = `Low ${reading.type}: ${reading.value}${reading.unit}`;
    } else if (reading.value > threshold.max) {
      alertLevel = 'WARNING';
      message = `High ${reading.type}: ${reading.value}${reading.unit}`;
    }

    if (alertLevel) {
      this.processAlert(farmId, {
        type: 'SENSOR_ALERT',
        severity: alertLevel,
        message,
        sensorId,
        reading: reading.value,
        threshold
      });
    }
  }

  // WebSocket broadcasting
  broadcastSensorData(farmId, reading) {
    this.wsServer.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'SENSOR_DATA',
          farmId,
          data: reading
        }));
      }
    });
  }

  broadcastAutomationStatus(farmId, deviceId, data) {
    this.wsServer.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'AUTOMATION_STATUS',
          farmId,
          deviceId,
          data
        }));
      }
    });
  }

  broadcastAlert(farmId, alert) {
    this.wsServer.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'ALERT',
          farmId,
          data: alert
        }));
      }
    });
  }

  // Utility methods
  assessDataQuality(data) {
    // Simple data quality assessment
    if (!data.value || isNaN(data.value)) return 'INVALID';
    if (data.signal && data.signal > 80) return 'EXCELLENT';
    if (data.signal && data.signal > 60) return 'GOOD';
    if (data.signal && data.signal > 40) return 'FAIR';
    return 'POOR';
  }

  getComponentStatus(farmAutomation, component) {
    const status = farmAutomation.get(component);
    return status || {
      active: false,
      mode: 'OFF',
      intensity: 0,
      scheduledUntil: null,
      lastActivated: null
    };
  }

  async getCurrentWeather(farmId) {
    // Mock weather data - integrate with weather API
    return {
      temperature: 22.5,
      humidity: 65,
      windSpeed: 12,
      rainfall: 0,
      pressure: 1013.25,
      timestamp: new Date()
    };
  }

  sendInitialData(ws) {
    // Send current system status to new WebSocket connections
    ws.send(JSON.stringify({
      type: 'SYSTEM_STATUS',
      data: {
        connected: true,
        timestamp: new Date(),
        activeFarms: this.sensorData.size,
        totalSensors: Array.from(this.sensorData.values())
          .reduce((total, sensors) => total + sensors.size, 0)
      }
    }));
  }

  handleWebSocketMessage(ws, data) {
    switch (data.type) {
      case 'SUBSCRIBE_FARM':
        ws.farmId = data.farmId;
        break;
      case 'TRIGGER_AUTOMATION':
        this.triggerAutomation(data.farmId, data.action, data.parameters);
        break;
      case 'ACK_ALERT':
        this.acknowledgeAlert(data.alertId);
        break;
    }
  }

  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedAt = new Date();
    }
  }

  // Start periodic data collection simulation
  startDataCollection() {
    setInterval(() => {
      this.simulateSensorData();
    }, 30000); // Every 30 seconds
  }

  simulateSensorData() {
    // Simulate sensor data for demo purposes
    const farmIds = ['farm_1', 'farm_2'];
    const sensorTypes = ['soilMoisture', 'temperature', 'humidity', 'phLevel'];
    
    farmIds.forEach(farmId => {
      sensorTypes.forEach((type, index) => {
        const sensorId = `sensor_${farmId}_${type}`;
        const value = this.generateMockSensorValue(type);
        
        this.processSensorData(farmId, sensorId, {
          type,
          value,
          unit: this.getSensorUnit(type),
          signal: Math.random() * 100
        });
      });
    });
  }

  generateMockSensorValue(type) {
    switch (type) {
      case 'soilMoisture':
        return Math.random() * 100;
      case 'temperature':
        return 15 + Math.random() * 20;
      case 'humidity':
        return 30 + Math.random() * 50;
      case 'phLevel':
        return 5.5 + Math.random() * 2;
      default:
        return Math.random() * 100;
    }
  }

  getSensorUnit(type) {
    const units = {
      soilMoisture: '%',
      temperature: '°C',
      humidity: '%',
      phLevel: 'pH',
      lightIntensity: 'lux',
      nutrients: 'ppm'
    };
    return units[type] || '';
  }
}

module.exports = new IoTService();
