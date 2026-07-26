# AgroMind 🌾

AgroMind is an AI-powered agriculture platform with a Node.js backend and React frontend for crop diagnosis, weather insights, analytics, and farm management.

## Repository Status

This repository currently contains:
- **backend/**: Express + GraphQL API services
- **frontend/**: Main React web app (CRA)
- **frontend-vite/**: Vite/TypeScript migration workspace (not the default runtime app yet)

## Tech Stack

- **Backend:** Node.js, Express, GraphQL, MongoDB, JWT
- **Frontend:** React, React Router, Tailwind CSS, Axios
- **AI/Analytics:** TensorFlow.js integrations and analytics services

## Quick Start

### 1) Prerequisites
- Node.js 18+
- npm 9+
- MongoDB running locally (or remote URI)

### 2) Backend setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Backend runs on `http://localhost:5000` by default.

### 3) Frontend setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000` by default.

## Environment Variables (Backend)

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agromind
JWT_SECRET=replace-with-a-secure-secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Available Scripts

### Backend (`backend/package.json`)
- `npm run dev` – start backend with nodemon
- `npm start` – start backend in normal mode
- `npm run seed` – seed database
- `npm test` – run backend tests (if present)

### Frontend (`frontend/package.json`)
- `npm start` – run development server
- `npm run build` – create production build
- `npm test` – run test runner

## Key Features

- AI-assisted crop disease diagnosis
- Weather and forecasting dashboard
- Crop and disease information management
- Analytics dashboard
- User authentication and profile management

## Project Structure

```text
AgroMind/
├── backend/
│   ├── controllers/
│   ├── graphql/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
├── frontend-vite/
├── FEATURES.md
├── DEPLOYMENT_GUIDE.md
└── TROUBLESHOOTING.md
```

## Deployment

See `DEPLOYMENT_GUIDE.md` for deployment options and production setup.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make focused changes
4. Open a pull request

## License

MIT
