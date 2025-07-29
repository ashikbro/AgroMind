# AgroMind Backend Startup Guide

## Quick Start (Recommended)

1. **Double-click** `start.bat` in the backend folder
   - This will automatically check requirements and start the server

## Manual Start (If needed)

### Step 1: Verify Node.js
```bash
node --version
npm --version
```

### Step 2: Install Dependencies
```bash
cd E:\project\AgroMind\backend
npm install
```

### Step 3: Test Backend
```bash
node test-backend.js
```

### Step 4: Start Server
```bash
npm start
```

## Expected Output

✅ **Server should start on:** http://localhost:4000
✅ **GraphQL Playground:** http://localhost:4000/graphql
✅ **AI Service:** Ready with intelligent algorithms
✅ **Database:** MongoDB connection ready

## Troubleshooting

### Common Issues:

1. **"node is not recognized"**
   - Install Node.js from https://nodejs.org/
   - Restart your terminal/command prompt

2. **"Cannot find module"**
   - Run: `npm install`
   - Wait for installation to complete

3. **Port already in use**
   - Close other applications using port 4000
   - Or change PORT in .env file

4. **TensorFlow warnings**
   - These are normal - the AI system has intelligent fallbacks
   - Full functionality available even without TensorFlow

### Features Available:

🌾 **Crop Management** - Complete database operations
🔬 **Disease Detection** - AI-powered with visual analysis
📊 **Analytics Dashboard** - Real-time farm insights
🏪 **Market Intelligence** - Price tracking and predictions
☁️ **Weather Integration** - Localized weather data
🤖 **AI Predictions** - Yield and risk assessments
💰 **Sustainability Credits** - Carbon tracking
🗣️ **Voice Commands** - Natural language interface
📱 **Mobile Responsive** - Works on all devices
🔒 **Secure Authentication** - JWT-based security

## Success Indicators:

- Server starts without errors
- GraphQL endpoint responds
- Database connection established
- AI services initialized
- All routes accessible

## Next Steps:

1. Frontend: Open http://localhost:3000
2. Backend: Available at http://localhost:4000
3. Test full platform integration
4. Deploy to production when ready
