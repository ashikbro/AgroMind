# AgroMind Frontend

React-based frontend application for the AgroMind agricultural platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📁 Project Structure

```
frontend/
├── public/              # Static files
│   ├── index.html      # HTML template
│   ├── manifest.json   # PWA manifest
│   └── favicon.ico     # Favicon
├── src/
│   ├── components/     # Reusable React components
│   │   ├── Navbar.js
│   │   ├── AIChatbot.js
│   │   ├── VoiceCommands.js
│   │   └── ...
│   ├── pages/          # Page components
│   │   ├── Dashboard.js
│   │   ├── DiagnosisPage.js
│   │   ├── WeatherPage.js
│   │   └── ...
│   ├── services/       # API service layer
│   │   ├── APIService.js
│   │   ├── NotificationService.js
│   │   └── ...
│   ├── context/        # React Context providers
│   ├── utils/          # Utility functions
│   ├── graphql/        # GraphQL queries/mutations
│   ├── App.js          # Main app component
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── package.json        # Dependencies
└── tailwind.config.js  # Tailwind CSS configuration
```

## 🎨 Tech Stack

- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **Socket.io Client** - Real-time communication
- **Apollo Client** - GraphQL client
- **React Dropzone** - File uploads
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory (optional):

```env
# API endpoint (defaults to proxy in package.json)
REACT_APP_API_URL=http://localhost:5000/api

# GraphQL endpoint
REACT_APP_GRAPHQL_URL=http://localhost:5000/graphql

# Socket.io endpoint
REACT_APP_SOCKET_URL=http://localhost:5000

# Feature flags
REACT_APP_ENABLE_VOICE=true
REACT_APP_ENABLE_PWA=true
```

### Proxy Configuration

API requests are proxied through package.json:

```json
{
  "proxy": "http://localhost:5000"
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🏗️ Building

### Development Build

```bash
npm start
```

Runs on `http://localhost:3000` with hot reloading.

### Production Build

```bash
npm run build
```

Creates optimized production build in `build/` directory.

### Analyzing Bundle Size

```bash
npm run build
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*.js'
```

## 📱 Features

### Core Features
- User authentication and authorization
- Responsive mobile design
- Real-time updates via WebSocket
- Offline support (PWA)
- Multi-language support

### Pages
- **Landing Page**: Welcome and feature overview
- **Dashboard**: User overview and quick actions
- **Diagnosis**: AI-powered disease detection
- **Weather**: Real-time weather and forecasts
- **Calendar**: Crop activity scheduling
- **Market**: Price tracking and trends
- **Crops**: Crop database and management
- **Profile**: User profile management
- **Analytics**: Farm analytics dashboard
- **Community**: Farmer community hub
- **Marketplace**: Buy/sell agricultural products
- **Financial**: Financial management tools
- **Sustainability**: Carbon tracking and eco-metrics

### Components
- **Navbar**: Main navigation
- **AIChatbot**: AI assistant for queries
- **VoiceCommands**: Voice-activated controls
- **LoadingSpinner**: Loading states
- **PWAInstaller**: Install prompt for PWA

## 🎯 Development Guidelines

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use PropTypes for type checking
- Keep components small and focused
- Use Tailwind CSS for styling

### Component Structure

```jsx
import React from 'react';
import PropTypes from 'prop-types';

const MyComponent = ({ title, onAction }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
};

export default MyComponent;
```

### API Calls

Use the APIService for consistent API interactions:

```javascript
import APIService from '../services/APIService';

// GET request
const crops = await APIService.getCrops();

// POST request
const result = await APIService.diagnoseCrop(formData);
```

### State Management

- Use React hooks (useState, useEffect, useContext)
- React Query for server state
- Context API for global state

## 🚢 Deployment

### Using npm

```bash
npm run build
# Serve the build folder
```

### Using Docker

```bash
docker build -t agromind-frontend .
docker run -p 3000:80 agromind-frontend
```

### Using Netlify/Vercel

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy!

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm start
```

### Module not found errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build fails

```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Try building again
npm run build
```

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com/)
- [React Query Docs](https://tanstack.com/query/latest)

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) in the root directory.

## 📄 License

MIT License - see [LICENSE](../LICENSE) in the root directory.

---

**Part of the AgroMind agricultural platform 🌾**
