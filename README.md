# 🌾 AgroMind - Complete AI-Powered Agricultural Platform

![AgroMind Logo](https://img.shields.io/badge/AgroMind-v1.0-green?style=for-the-badge&logo=leaf)

## 🚀 Quick Start Guide

### **Method 1: One-Click Start (Recommended)**
1. **Double-click** `START-AGROMIND.bat` in the root folder
2. Choose option 3 to start both backend and frontend
3. Wait for both servers to initialize
4. Open http://localhost:3000 in your browser

### **Method 2: Manual Start**
1. **Backend**: Run `backend/RUN-BACKEND.bat`
2. **Frontend**: Run `frontend/RUN-FRONTEND.bat` 
3. Access the platform at http://localhost:3000

## 🌟 Platform Overview

AgroMind is a comprehensive agricultural technology platform that combines cutting-edge AI, real-time analytics, and sustainable farming practices to revolutionize modern agriculture.

### 🔬 AI Disease Diagnosis
- **Instant Analysis**: Upload crop images for immediate AI-powered disease detection
- **High Accuracy**: Advanced machine learning models trained on agricultural datasets
- **Treatment Recommendations**: Get specific treatment plans and prevention strategies
- **Multi-crop Support**: Works with various crop types including cereals, vegetables, and fruits

### 🌤️ Weather Dashboard
- **Real-time Weather**: Current conditions and detailed forecasts
- **Agricultural Alerts**: Weather warnings specific to farming activities
- **Best Timing**: Recommendations for planting, watering, and harvesting
- **Soil Conditions**: Moisture and temperature insights for better decision making

### 📅 Crop Calendar
- **Activity Planning**: Schedule sowing, watering, fertilizing, and harvesting
- **Smart Reminders**: Automated notifications for important farming tasks
- **Seasonal Recommendations**: Month-wise farming tips and best practices
- **Progress Tracking**: Monitor completed and upcoming activities

### 💰 Market Price Tracker
- **Real-time Prices**: Current market rates across major agricultural markets
- **Price Trends**: Historical data and trend analysis for better selling decisions
- **Price Alerts**: Set custom alerts for target prices
- **Market Intelligence**: Best selling times and quality premium insights

### 🌾 Crop Database
- **Comprehensive Information**: Detailed crop profiles with growing requirements
- **Disease Encyclopedia**: Common diseases, symptoms, and treatments
- **Variety Selection**: Different crop varieties and their characteristics
- **Growing Guides**: Step-by-step cultivation instructions

### 👤 User Management
- **Farmer Profiles**: Personalized dashboards with farm-specific information
- **Multi-language Support**: Interface available in 12+ Indian languages
- **Farm Details**: Location, soil type, irrigation, and size management
- **Subscription Plans**: Free, basic, and premium tiers with different features

## Quick Start

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agromind
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
UPLOAD_DIR=uploads
```

### 4. Start MongoDB
Make sure MongoDB is running on your system.

### 5. Start the Application
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
AgroMind/
├── backend/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── controllers/     # API controllers
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── app.js          # Express app setup
│   ├── package.json
│   └── server.js           # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── App.js         # Main app component
│   ├── package.json
│   └── public/
│
└── README.md
```

## Features

### Core Features
- **User Authentication**: JWT-based secure authentication
- **Crop Disease Detection**: AI-powered image analysis for disease identification
- **Crop Database**: Comprehensive crop information and management
- **Farm Profile Management**: Detailed farm and farmer profiles
- **Dashboard Analytics**: Visual insights and recommendations

### Technical Features
- **Backend**: Node.js, Express.js, MongoDB, JWT Authentication
- **Frontend**: React.js, TailwindCSS, React Router
- **File Upload**: Multer with image processing
- **Real-time**: Socket.io integration ready
- **Responsive Design**: Mobile-first approach

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Crops
- `GET /api/crops` - Get all crops
- `GET /api/crops/:id` - Get specific crop
- `POST /api/crops` - Create new crop (admin)
- `PUT /api/crops/:id` - Update crop (admin)

### Diseases
- `GET /api/diseases` - Get all diseases
- `GET /api/diseases/:id` - Get specific disease
- `POST /api/diseases/diagnose` - AI disease diagnosis

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/reports` - Generate reports

## Default Users

The system will create default users on first run:

### Admin User
- Email: admin@agromind.com
- Password: admin123
- Role: admin

### Test Farmer
- Email: farmer@example.com
- Password: farmer123
- Role: farmer

## Development

### Backend Development
```bash
cd backend
npm run dev    # Start with nodemon
npm run start  # Start in production mode
```

### Frontend Development
```bash
cd frontend
npm start      # Start development server
npm run build  # Build for production
```

### Adding New Features

1. **Backend API Endpoint**:
   - Add route in `backend/src/routes/`
   - Create controller in `backend/src/controllers/`
   - Add validation middleware if needed

2. **Frontend Component**:
   - Create component in `frontend/src/components/`
   - Add page in `frontend/src/pages/`
   - Update routing in `App.js`

3. **Database Model**:
   - Add model in `backend/src/models/`
   - Update controllers to use new model

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running: `mongod`
   - Check connection string in `.env`

2. **Port Already in Use**:
   - Change PORT in `.env` file
   - Kill process: `npx kill-port 5000`

3. **CORS Issues**:
   - Frontend must run on http://localhost:3000
   - Backend configured for this URL

4. **Package Dependencies**:
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

### Database Seeding

The application will automatically seed the database with:
- Sample crop data
- Common disease information
- Default user accounts

## Deployment

### Backend Deployment
1. Set environment variables
2. Install dependencies: `npm install`
3. Start application: `npm start`

### Frontend Deployment
1. Build application: `npm run build`
2. Serve static files from `build/` directory

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=mongodb://your-mongo-url/agromind
JWT_SECRET=your-super-secure-production-secret
NODE_ENV=production
UPLOAD_DIR=uploads
```

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Happy Farming with AgroMind! 🌱**
