# AgroMind Development Setup Guide

Complete guide for setting up AgroMind for local development.

## 📋 Prerequisites

### Required Software

1. **Node.js** (v16.x or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB** (v4.4 or higher)
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://cloud.mongodb.com/
   - Verify installation: `mongod --version`

3. **Git**
   - Download from: https://git-scm.com/downloads
   - Verify installation: `git --version`

### Optional but Recommended

- **VS Code** with extensions:
  - ESLint
  - Prettier
  - ES7+ React/Redux/React-Native snippets
  - MongoDB for VS Code
- **Postman** or **Insomnia** for API testing
- **MongoDB Compass** for database management

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/ashikbro/AgroMind.git
cd AgroMind
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Use your preferred text editor
nano .env  # or code .env
```

#### Backend Environment Variables

Edit `.env` file with these configurations:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/agromind

# Server
PORT=5000
NODE_ENV=development

# JWT Secret (change this to a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# Optional API Keys (can use demo_key for development)
WEATHER_API_KEY=demo_key
COMMODITY_API_KEY=demo_key
```

#### Seed the Database

```bash
# Populate database with sample data
npm run seed
```

This will create:
- Sample crops data (20+ crops)
- Disease information (15+ diseases)
- Default admin and farmer accounts
- Market price data

#### Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

Backend should now be running at: http://localhost:5000

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend should automatically open at: http://localhost:3000

## 🔧 MongoDB Setup

### Option 1: Local MongoDB

1. **Start MongoDB Service**
   - Windows: MongoDB should start automatically, or run `net start MongoDB`
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

2. **Verify MongoDB is Running**
   ```bash
   mongo
   # Should connect to MongoDB shell
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at: https://cloud.mongodb.com/
2. Create a new cluster (free tier available)
3. Get connection string
4. Update `MONGODB_URI` in backend `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/agromind?retryWrites=true&w=majority
   ```

## ✅ Verification

### Backend Verification

1. Check backend console for:
   ```
   ✅ Connected to MongoDB
   ✅ AI Service initialized
   ✅ GraphQL server ready
   ✅ Server running on port 5000
   ```

2. Test API endpoints:
   ```bash
   # Health check
   curl http://localhost:5000/api/health

   # Get crops
   curl http://localhost:5000/api/crops
   ```

### Frontend Verification

1. Browser should open automatically to http://localhost:3000
2. You should see the AgroMind landing page
3. No console errors in browser DevTools

### Test Login

Use these default accounts:

**Admin Account:**
- Email: `admin@agromind.com`
- Password: `admin123`

**Farmer Account:**
- Email: `farmer@example.com`
- Password: `farmer123`

## 🛠️ Development Workflow

### Running Both Servers

**Option 1: Two Terminal Windows**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

**Option 2: Using npm scripts (from root)**
```bash
# Install concurrently globally
npm install -g concurrently

# Run both servers
npm run dev
```

### Hot Reloading

- **Backend**: Uses `nodemon` for automatic restart on file changes
- **Frontend**: Uses React's built-in hot reloading

### Code Quality

```bash
# Backend linting (if configured)
cd backend
npm run lint

# Frontend linting
cd frontend
npm run lint
```

## 📊 Database Management

### Using MongoDB Compass

1. Download: https://www.mongodb.com/products/compass
2. Connect using: `mongodb://localhost:27017`
3. Browse the `agromind` database

### Using Command Line

```bash
# Connect to MongoDB
mongo

# Switch to agromind database
use agromind

# View collections
show collections

# Query crops
db.crops.find().pretty()

# Query users
db.users.find().pretty()
```

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

### MongoDB Connection Issues

1. Ensure MongoDB is running:
   ```bash
   # Check status
   # Windows
   sc query MongoDB
   
   # macOS/Linux
   sudo systemctl status mongod
   ```

2. Check connection string in `.env`
3. Try connecting with MongoDB Compass

### Dependencies Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📝 API Documentation

Once backend is running, access:
- REST API: http://localhost:5000/api
- GraphQL Playground: http://localhost:5000/graphql

## 🔐 Security Notes

- Never commit `.env` files
- Use strong JWT secrets in production
- Keep dependencies updated
- Review security advisories regularly

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

## 🆘 Getting Help

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Review [GitHub Issues](https://github.com/ashikbro/AgroMind/issues)
- Read [CONTRIBUTING.md](./CONTRIBUTING.md)
- Contact the development team

## 🎉 Next Steps

After successful setup:

1. Explore the codebase
2. Read [FEATURES.md](./FEATURES.md)
3. Check [CONTRIBUTING.md](./CONTRIBUTING.md)
4. Start building features!

---

**Happy Developing! 🌱**
