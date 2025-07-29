# AgroMind Deployment & Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB 4.4+
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AgroMind
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run seed    # Populate database with sample data
   npm run dev     # Start development server
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start       # Start React development server
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🌟 New Features Implemented

### 1. ✅ Enhanced Disease Diagnosis System
- **AI-powered image analysis** with drag-drop interface
- **Multi-image upload** support
- **Crop-specific disease detection**
- **Treatment recommendations** and severity assessment
- **Historical diagnosis tracking**

### 2. ✅ Real-time Weather Dashboard
- **Live weather data** integration with OpenWeatherMap API
- **7-day weather forecasts** with agricultural insights
- **Farming recommendations** based on current conditions
- **Weather alerts** and notifications
- **Historical weather trends**

### 3. ✅ Comprehensive Crop Calendar
- **Visual calendar interface** for farming activities
- **Activity scheduling** and reminders
- **Seasonal recommendations** for each crop
- **Event management** with CRUD operations
- **Color-coded calendar** for different activity types

### 4. ✅ Market Price Tracker
- **Real-time commodity prices** from multiple sources
- **Price trend analysis** with interactive charts
- **Custom price alerts** and notifications
- **Market comparison** across different locations
- **Historical price data** and analytics

### 5. ✅ Voice Commands (Hands-free Operation)
- **Speech recognition** for navigation
- **Natural language processing** for commands
- **Voice-activated features**:
  - "Go to dashboard" - Navigate to dashboard
  - "Crop diagnosis" - Open disease analysis
  - "Show weather" - View weather dashboard
  - "Market prices" - Check commodity prices
  - "My crops" - Access crop management
  - "Weather for Delhi" - Location-specific weather
  - "Price of wheat" - Crop-specific pricing
- **Visual feedback** and status indicators
- **Browser compatibility** with fallback support

### 6. ✅ Comprehensive Database with 20+ Crops & Diseases
- **Cereals**: Wheat, Rice, Maize, Barley
- **Pulses**: Chickpea, Lentil, Pigeon Pea
- **Vegetables**: Tomato, Onion, Potato, Cabbage, Cauliflower
- **Cash Crops**: Cotton, Sugarcane, Mustard
- **Fruits**: Mango, Banana
- **Spices**: Turmeric, Ginger
- **15+ Disease profiles** with symptoms, treatments, and prevention

## 🔧 Production Deployment

### Environment Configuration

1. **Set up production environment variables**
   ```bash
   # Copy and edit environment file
   cp .env.example .env
   ```

2. **Required API Keys for Production**:
   
   **Weather API (OpenWeatherMap)**
   - Sign up at: https://openweathermap.org/api
   - Get free API key (1000 calls/day)
   - Add to `.env`: `WEATHER_API_KEY=your_api_key`

   **Market Data API (MarketStack)**
   - Sign up at: https://marketstack.com/
   - Get free API key (1000 calls/month)
   - Add to `.env`: `COMMODITY_API_KEY=your_api_key`

   **MongoDB Production**
   - MongoDB Atlas: https://cloud.mongodb.com/
   - Update `MONGODB_URI` with production connection string

### Database Seeding

```bash
# Populate database with comprehensive crop and disease data
cd backend
npm run seed
```

This adds:
- 20+ crops with detailed information
- 15+ diseases with symptoms and treatments
- Market prices for all major crops
- Seasonal recommendations

### Production Deployment Options

#### Option 1: Traditional VPS/Cloud Server
```bash
# Install dependencies
sudo apt update
sudo apt install nodejs npm mongodb

# Clone and setup
git clone <repository-url>
cd AgroMind

# Backend setup
cd backend
npm install --production
npm run seed
npm start

# Frontend setup (in another terminal)
cd frontend
npm install
npm run build
# Serve build folder with nginx/apache
```

#### Option 2: Docker Deployment
```bash
# Create Dockerfile for backend
# Create Dockerfile for frontend
# Use docker-compose for orchestration
docker-compose up -d
```

#### Option 3: Cloud Platforms
- **Heroku**: Easy deployment with buildpacks
- **Vercel**: Perfect for React frontend
- **Railway**: Full-stack deployment
- **DigitalOcean App Platform**: Managed deployment

## 📱 Next Phase: Mobile App Development

### React Native Setup (Future Enhancement)
```bash
# Install React Native CLI
npm install -g @react-native-community/cli

# Create new React Native project
npx react-native init AgroMindMobile

# Key features to port:
# - Disease diagnosis with camera integration
# - Offline weather data caching
# - Push notifications for alerts
# - GPS-based weather and market data
# - Voice commands with native speech APIs
```

## 🔮 Expert Consultation System (Upcoming)

### Features to Implement:
- **Video calling** integration (WebRTC/Agora)
- **Expert marketplace** with ratings and reviews
- **Appointment scheduling** system
- **Chat messaging** with file sharing
- **Payment integration** for consultations
- **Expert verification** and credentialing

## 🎙️ Voice Commands Usage

### Activation
- Click the floating microphone button (bottom-right)
- Button turns red when listening
- Speak clearly and wait for recognition

### Supported Commands
- **Navigation**: "Go to dashboard", "Show weather", "Crop diagnosis"
- **Weather**: "Weather for [city]", "Check weather forecast"
- **Market**: "Market prices", "Price of [crop]"
- **Crops**: "My crops", "Add new crop"
- **System**: "Refresh", "Logout", "Help"

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Limited support
- Mobile browsers: Varies by device

## 🛡️ Security & Performance

### Security Features
- JWT authentication with secure tokens
- Input validation and sanitization
- Rate limiting on API endpoints
- File upload restrictions
- CORS configuration
- Environment variable protection

### Performance Optimizations
- Image compression for uploads
- API response caching
- Database indexing
- Code splitting in React
- Lazy loading of components
- CDN integration for static assets

## 📊 Monitoring & Analytics

### Recommended Tools
- **Error Tracking**: Sentry
- **Performance**: Google PageSpeed Insights
- **Analytics**: Google Analytics
- **Uptime Monitoring**: UptimeRobot
- **Database Monitoring**: MongoDB Atlas Monitoring

## 🔄 Continuous Deployment

### CI/CD Pipeline Setup
```yaml
# .github/workflows/deploy.yml
name: Deploy AgroMind
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install and test
        run: |
          cd backend && npm install && npm test
          cd frontend && npm install && npm test
      - name: Deploy to production
        run: |
          # Your deployment script
```

## 📝 API Documentation

### Backend Endpoints
- `GET /api/weather/current` - Current weather data
- `GET /api/weather/forecast` - 7-day forecast
- `GET /api/market/prices` - Live market prices
- `POST /api/ai/diagnose` - Disease diagnosis
- `GET /api/crops` - Crop management
- `POST /api/calendar/events` - Calendar operations

### Frontend Routes
- `/dashboard` - Main dashboard
- `/diagnosis` - Disease diagnosis
- `/weather` - Weather dashboard
- `/market` - Price tracker
- `/calendar` - Crop calendar
- `/crops` - Crop management
- `/profile` - User profile

## 🚨 Troubleshooting

### Common Issues

1. **Voice commands not working**
   - Check browser compatibility
   - Ensure microphone permissions
   - Test with HTTPS in production

2. **API calls failing**
   - Verify API keys in .env
   - Check network connectivity
   - Review API rate limits

3. **Database connection issues**
   - Verify MongoDB is running
   - Check connection string
   - Ensure database permissions

4. **Build errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Review environment variables

## 📞 Support

For technical support or feature requests:
1. Check the troubleshooting guide above
2. Review the GitHub issues
3. Contact the development team

---

**AgroMind** - Revolutionizing Agriculture with AI and Technology 🌱🚀
