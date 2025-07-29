const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date
  scalar JSON

  type Query {
    # Farm Analytics
    farmAnalytics(farmId: ID!, timeframe: String!): FarmAnalytics
    realTimeMetrics(farmId: ID!): RealTimeMetrics
    marketPredictions(crops: [String!]!, region: String!): [MarketPrediction!]!
    weatherAnalytics(farmId: ID!, days: Int): WeatherAnalytics
    
    # Sensor Data
    sensorData(farmId: ID!, sensorType: String, timeRange: TimeRangeInput): [SensorReading!]!
    sensorAlerts(farmId: ID!, severity: AlertSeverity): [Alert!]!
    
    # Crop Management
    crops(farmId: ID!): [Crop!]!
    cropAnalytics(cropId: ID!): CropAnalytics
    yieldPrediction(cropId: ID!): YieldPrediction
    
    # Financial Analytics
    financialReport(farmId: ID!, timeframe: String!): FinancialReport
    roiAnalysis(farmId: ID!, investmentType: String): ROIAnalysis
    profitLossStatement(farmId: ID!, period: String!): ProfitLossStatement
    
    # Market Data
    marketPrices(crops: [String!], region: String): [MarketPrice!]!
    priceHistory(crop: String!, days: Int): [PriceHistoryPoint!]!
    
    # Disease Detection
    diseaseHistory(farmId: ID!): [DiseaseDetection!]!
    riskAssessment(farmId: ID!): RiskAssessment
    
    # Expert Consultation
    experts(specialty: String, availability: Boolean): [Expert!]!
    consultations(farmId: ID!): [Consultation!]!
    
    # IoT & Automation
    automationRules(farmId: ID!): [AutomationRule!]!
    systemStatus(farmId: ID!): SystemStatus
    
    # Reports
    generateReport(farmId: ID!, reportType: String!, timeframe: String!): Report
    reportHistory(farmId: ID!): [Report!]!
  }

  type Mutation {
    # Farm Management
    createFarm(input: FarmInput!): Farm!
    updateFarm(farmId: ID!, input: FarmUpdateInput!): Farm!
    
    # Sensor Data
    recordSensorData(farmId: ID!, data: SensorDataInput!): SensorReading!
    calibrateSensor(sensorId: ID!, calibrationData: JSON!): Sensor!
    
    # Automation
    createAutomationRule(farmId: ID!, rule: AutomationRuleInput!): AutomationRule!
    updateAutomationRule(ruleId: ID!, rule: AutomationRuleUpdateInput!): AutomationRule!
    triggerAutomation(farmId: ID!, action: String!, parameters: JSON): AutomationResult!
    
    # AI Predictions
    triggerYieldPrediction(cropId: ID!): YieldPrediction!
    triggerMarketAnalysis(crops: [String!]!, region: String!): MarketAnalysis!
    triggerRiskAssessment(farmId: ID!): RiskAssessment!
    
    # Disease Detection
    submitDiseaseDetection(farmId: ID!, image: String!, metadata: JSON): DiseaseDetection!
    
    # Expert Consultation
    bookConsultation(expertId: ID!, farmId: ID!, topic: String!, scheduledAt: Date!): Consultation!
    startVideoCall(consultationId: ID!): VideoCallSession!
    endVideoCall(sessionId: ID!): VideoCallSession!
    
    # Financial
    recordTransaction(farmId: ID!, transaction: TransactionInput!): Transaction!
    createInvestment(farmId: ID!, investment: InvestmentInput!): Investment!
    
    # Reports
    generateCustomReport(farmId: ID!, config: ReportConfigInput!): Report!
    scheduleReport(farmId: ID!, config: ScheduledReportInput!): ScheduledReport!
    
    # Settings
    updateFarmSettings(farmId: ID!, settings: FarmSettingsInput!): FarmSettings!
    updateNotificationPreferences(farmId: ID!, preferences: NotificationInput!): NotificationSettings!
  }

  type Subscription {
    # Real-time Updates
    sensorDataUpdated(farmId: ID!): SensorReading!
    alertCreated(farmId: ID!): Alert!
    automationTriggered(farmId: ID!): AutomationEvent!
    marketPriceUpdated(crops: [String!]): MarketPrice!
    weatherUpdated(farmId: ID!): WeatherData!
    consultationStatusChanged(consultationId: ID!): Consultation!
  }

  # Core Types
  type Farm {
    id: ID!
    name: String!
    location: Location!
    area: Float!
    owner: User!
    crops: [Crop!]!
    sensors: [Sensor!]!
    settings: FarmSettings!
    createdAt: Date!
    updatedAt: Date!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    farms: [Farm!]!
    preferences: UserPreferences!
  }

  type Location {
    latitude: Float!
    longitude: Float!
    address: String!
    region: String!
    country: String!
  }

  # Analytics Types
  type FarmAnalytics {
    farmId: ID!
    timeframe: String!
    financial: FinancialMetrics!
    production: ProductionMetrics!
    efficiency: EfficiencyMetrics!
    market: MarketMetrics!
    sustainability: SustainabilityMetrics!
    predictions: PredictionMetrics!
    generatedAt: Date!
  }

  type FinancialMetrics {
    totalRevenue: Float!
    totalExpenses: Float!
    netProfit: Float!
    profitMargin: Float!
    roi: Float!
    revenueGrowth: Float!
    costReduction: Float!
    breakEvenPoint: Date
    cashFlow: [CashFlowPoint!]!
  }

  type ProductionMetrics {
    totalYield: Float!
    yieldPerHectare: Float!
    qualityGrade: String!
    wastePercentage: Float!
    yieldImprovement: Float!
    crops: [CropProductionMetrics!]!
  }

  type EfficiencyMetrics {
    laborProductivity: Float!
    equipmentUtilization: Float!
    energyEfficiency: Float!
    waterUsageEfficiency: Float!
    fertilityOptimization: Float!
  }

  type MarketMetrics {
    priceVolatility: Float!
    marketShare: Float!
    customerSatisfaction: Float!
    supplychainReliability: Float!
  }

  type SustainabilityMetrics {
    carbonFootprint: Float!
    waterConservation: Float!
    soilHealth: Float!
    biodiversityIndex: Float!
    organicPercentage: Float!
  }

  type PredictionMetrics {
    nextQuarterRevenue: Float!
    expectedYield: Float!
    optimalHarvestDate: Date!
    marketPriceTrend: String!
    weatherRisk: String!
    diseaseRisk: String!
  }

  # Sensor & IoT Types
  type Sensor {
    id: ID!
    farmId: ID!
    type: SensorType!
    location: SensorLocation!
    status: SensorStatus!
    lastReading: SensorReading
    calibrationDate: Date!
    batteryLevel: Float
  }

  type SensorReading {
    id: ID!
    sensorId: ID!
    value: Float!
    unit: String!
    timestamp: Date!
    quality: DataQuality!
    metadata: JSON
  }

  type RealTimeMetrics {
    farmId: ID!
    timestamp: Date!
    sensors: SensorDataCollection!
    automation: AutomationStatus!
    alerts: [Alert!]!
    weather: WeatherData!
  }

  type SensorDataCollection {
    soilMoisture: [SensorReading!]!
    temperature: [SensorReading!]!
    humidity: [SensorReading!]!
    phLevel: [SensorReading!]!
    lightIntensity: [SensorReading!]!
    nutrients: [SensorReading!]!
  }

  # Automation Types
  type AutomationRule {
    id: ID!
    farmId: ID!
    name: String!
    trigger: AutomationTrigger!
    action: AutomationAction!
    enabled: Boolean!
    lastTriggered: Date
    triggerCount: Int!
    createdAt: Date!
  }

  type AutomationTrigger {
    type: TriggerType!
    conditions: [TriggerCondition!]!
    schedule: Schedule
  }

  type AutomationAction {
    type: ActionType!
    parameters: JSON!
    duration: Int
    priority: ActionPriority!
  }

  type AutomationStatus {
    irrigation: SystemComponentStatus!
    ventilation: SystemComponentStatus!
    lighting: SystemComponentStatus!
    fertilizer: SystemComponentStatus!
    pestControl: SystemComponentStatus!
  }

  type SystemComponentStatus {
    active: Boolean!
    mode: String!
    intensity: Float
    scheduledUntil: Date
    lastActivated: Date
  }

  # Market & Prediction Types
  type MarketPrediction {
    crop: String!
    currentPrice: Float!
    predictedPrice: Float!
    priceChange: Float!
    confidence: Float!
    timeframe: String!
    factors: PredictionFactors!
    recommendations: [String!]!
    generatedAt: Date!
  }

  type PredictionFactors {
    weather: WeatherImpact!
    demand: DemandForecast!
    supply: SupplyForecast!
    seasonal: SeasonalTrend!
    economic: EconomicIndicators!
  }

  type YieldPrediction {
    cropId: ID!
    predictedYield: Float!
    confidence: Float!
    factors: [YieldFactor!]!
    recommendations: [String!]!
    optimalHarvestDate: Date!
    qualityPrediction: QualityPrediction!
    generatedAt: Date!
  }

  # Disease Detection Types
  type DiseaseDetection {
    id: ID!
    farmId: ID!
    cropId: ID
    image: String!
    primaryDetection: DiseaseResult!
    alternativeDetections: [DiseaseResult!]!
    confidence: Float!
    severity: DiseaseSeverity!
    treatment: TreatmentRecommendation!
    prevention: [PreventionMeasure!]!
    detectedAt: Date!
  }

  type DiseaseResult {
    name: String!
    confidence: Float!
    description: String!
    symptoms: [String!]!
    causes: [String!]!
  }

  # Expert Consultation Types
  type Expert {
    id: ID!
    name: String!
    specialty: String!
    experience: Int!
    rating: Float!
    languages: [String!]!
    hourlyRate: Float!
    availability: ExpertAvailability!
    certifications: [String!]!
    consultations: Int!
    successRate: Float!
  }

  type Consultation {
    id: ID!
    farmId: ID!
    expertId: ID!
    topic: String!
    status: ConsultationStatus!
    scheduledAt: Date!
    duration: Int
    rating: Int
    notes: String
    recordings: [String!]
    createdAt: Date!
  }

  # Financial Types
  type FinancialReport {
    farmId: ID!
    period: String!
    revenue: RevenueBreakdown!
    expenses: ExpenseBreakdown!
    profitLoss: ProfitLossAnalysis!
    ratios: FinancialRatios!
    trends: FinancialTrends!
    generatedAt: Date!
  }

  type ROIAnalysis {
    farmId: ID!
    investmentType: String
    totalInvestment: Float!
    totalReturn: Float!
    roi: Float!
    npv: Float
    irr: Float
    paybackPeriod: Int
    riskMetrics: RiskMetrics!
    generatedAt: Date!
  }

  # Alert & Notification Types
  type Alert {
    id: ID!
    farmId: ID!
    type: AlertType!
    severity: AlertSeverity!
    message: String!
    data: JSON
    read: Boolean!
    acknowledged: Boolean!
    createdAt: Date!
    expiresAt: Date
  }

  # Report Types
  type Report {
    id: ID!
    farmId: ID!
    type: ReportType!
    title: String!
    content: JSON!
    format: ReportFormat!
    url: String
    status: ReportStatus!
    requestedBy: ID!
    generatedAt: Date!
    expiresAt: Date
  }

  # Input Types
  input FarmInput {
    name: String!
    location: LocationInput!
    area: Float!
    cropTypes: [String!]
    settings: FarmSettingsInput
  }

  input LocationInput {
    latitude: Float!
    longitude: Float!
    address: String!
    region: String!
    country: String!
  }

  input SensorDataInput {
    sensorId: ID!
    readings: [SensorReadingInput!]!
  }

  input SensorReadingInput {
    type: SensorType!
    value: Float!
    unit: String!
    timestamp: Date
    metadata: JSON
  }

  input AutomationRuleInput {
    name: String!
    trigger: AutomationTriggerInput!
    action: AutomationActionInput!
    enabled: Boolean = true
  }

  input AutomationTriggerInput {
    type: TriggerType!
    conditions: [TriggerConditionInput!]!
    schedule: ScheduleInput
  }

  input TriggerConditionInput {
    parameter: String!
    operator: ComparisonOperator!
    value: Float!
    unit: String
  }

  input AutomationActionInput {
    type: ActionType!
    parameters: JSON!
    duration: Int
    priority: ActionPriority = MEDIUM
  }

  input TimeRangeInput {
    start: Date!
    end: Date!
  }

  input FarmSettingsInput {
    automationEnabled: Boolean
    alertThresholds: AlertThresholdsInput
    preferences: FarmPreferencesInput
  }

  input AlertThresholdsInput {
    soilMoisture: ThresholdInput
    temperature: ThresholdInput
    humidity: ThresholdInput
    phLevel: ThresholdInput
  }

  input ThresholdInput {
    min: Float
    max: Float
    critical: Float
  }

  # Enums
  enum UserRole {
    FARMER
    ADMIN
    EXPERT
    SUPPORT
  }

  enum SensorType {
    SOIL_MOISTURE
    TEMPERATURE
    HUMIDITY
    PH_LEVEL
    LIGHT_INTENSITY
    NUTRIENTS
    PRESSURE
    WIND_SPEED
    RAINFALL
  }

  enum SensorStatus {
    ACTIVE
    INACTIVE
    CALIBRATING
    ERROR
    MAINTENANCE
  }

  enum DataQuality {
    EXCELLENT
    GOOD
    FAIR
    POOR
    INVALID
  }

  enum TriggerType {
    THRESHOLD
    SCHEDULE
    WEATHER
    MANUAL
    CONDITION_BASED
  }

  enum ActionType {
    IRRIGATION
    FERTILIZATION
    VENTILATION
    LIGHTING
    NOTIFICATION
    REPORT_GENERATION
  }

  enum ActionPriority {
    LOW
    MEDIUM
    HIGH
    CRITICAL
  }

  enum ComparisonOperator {
    GREATER_THAN
    LESS_THAN
    EQUAL_TO
    GREATER_THAN_OR_EQUAL
    LESS_THAN_OR_EQUAL
    NOT_EQUAL_TO
  }

  enum AlertType {
    SENSOR_ALERT
    SYSTEM_ALERT
    WEATHER_ALERT
    DISEASE_ALERT
    MARKET_ALERT
    MAINTENANCE_ALERT
  }

  enum AlertSeverity {
    INFO
    WARNING
    ERROR
    CRITICAL
  }

  enum ConsultationStatus {
    SCHEDULED
    IN_PROGRESS
    COMPLETED
    CANCELLED
    RESCHEDULED
  }

  enum ExpertAvailability {
    AVAILABLE
    BUSY
    OFFLINE
  }

  enum DiseaseSeverity {
    LOW
    MEDIUM
    HIGH
    CRITICAL
  }

  enum ReportType {
    FINANCIAL
    PRODUCTION
    ANALYTICS
    COMPLIANCE
    CUSTOM
  }

  enum ReportFormat {
    PDF
    EXCEL
    CSV
    JSON
    HTML
  }

  enum ReportStatus {
    PENDING
    GENERATING
    COMPLETED
    FAILED
    EXPIRED
  }
`;

module.exports = { typeDefs };
