# 🌾 AgroMind — AI-Powered Agriculture Intelligence Platform

AgroMind is a full-stack agriculture technology platform focused on helping farmers improve productivity, reduce crop loss, and optimize inputs using practical AI-driven decision support.

## Problem Statement

Farmers face recurring challenges that directly impact yield and profitability:
- Late disease detection and delayed treatment
- Uncertain yield planning due to weather variability
- Inefficient fertilizer, irrigation, and labor allocation
- Fragmented market/weather/agronomy information

AgroMind addresses these gaps with a unified web platform that combines crop intelligence, prediction models, and actionable recommendations.

## Solution Overview

AgroMind delivers a modern end-to-end workflow:
1. Capture farm/crop context and field observations
2. Analyze disease risk and likely crop issues from uploaded images + symptoms
3. Forecast yield and monitor seasonal trends
4. Integrate weather and market insights
5. Provide farmer guidance for treatment, prevention, and resource planning

## Key Features

- **Crop Monitoring**: Crop and farm profile management with health tracking
- **Yield Prediction**: AI-assisted estimates for planning harvest and inputs
- **Disease Detection**: Image + symptom-based diagnosis with confidence scoring
- **Resource Optimization**: Recommendations for irrigation, treatment, and operations
- **Weather Integration**: Forecast-aware planning support and advisories
- **Farmer Guidance**: Actionable treatment/prevention and follow-up workflows

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- GraphQL (Apollo)
- TensorFlow.js (AI integration), ML utilities
- JWT authentication, Multer uploads

### Frontend
- React (CRA app in `frontend/`)
- Tailwind CSS
- React Router, Apollo Client

### Alternative Frontend Workspace
- Vite + React + TypeScript workspace in `frontend-vite/`

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or hosted)

### 1) Clone and install dependencies
```bash
git clone https://github.com/ashikbro/AgroMind.git
cd AgroMind

# Root (shared deps/tools)
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2) Configure environment
Copy the root env template and backend template:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

### 3) Start services
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm start
```

## Quick Start Guide

1. Register/login as a farmer
2. Add farm and crop details
3. Upload crop image(s) in disease analysis
4. Review diagnosis confidence + recommendation plan
5. Track diagnosis history and follow-up updates
6. Use weather/market signals for planning input timing

## How It Works (End-to-End)

1. **Data Intake**: User submits crop context, image(s), and optional symptoms
2. **Image Processing**: Backend optimizes image payloads for analysis
3. **AI Inference**: Model pipeline generates ranked disease predictions
4. **Decision Layer**: Confidence + severity generate treatment/prevention guidance
5. **Persistence**: Diagnosis and follow-up are stored in MongoDB
6. **Insights**: Analytics endpoints expose trend and status summaries

## API Documentation

- Full API reference: [`docs/API.md`](docs/API.md)
- Data contract and quality expectations: [`docs/DATA_REQUIREMENTS.md`](docs/DATA_REQUIREMENTS.md)

Quick endpoint highlights:
- `POST /api/ai/analyze-disease`
- `GET /api/ai/diagnosis/:id`
- `GET /api/ai/diagnosis-history`
- `POST /api/ai/diagnosis/:id/follow-up`
- `GET /api/ai/analytics`

## Usage Examples (Farming Scenarios)

- **Scenario 1: Early Leaf Spot Alert**
  - Upload affected leaf image + symptom notes
  - Receive confidence-scored diagnosis and immediate action list

- **Scenario 2: Monsoon Resource Planning**
  - Monitor weather + crop stage
  - Optimize irrigation schedule and disease prevention timing

- **Scenario 3: Mid-Season Yield Adjustment**
  - Compare crop health trend and environmental factors
  - Update expected yield and operational plan

Detailed walkthroughs are available in:
- [`examples/workflows/smallholder-vegetable-farm.md`](examples/workflows/smallholder-vegetable-farm.md)
- [`docs/AGRICULTURE_GUIDE.md`](docs/AGRICULTURE_GUIDE.md)

## Data Requirements

See [`docs/DATA_REQUIREMENTS.md`](docs/DATA_REQUIREMENTS.md) for:
- Required agronomic fields
- Image quality requirements for diagnosis
- Optional weather/soil/market enrichment data
- Validation and data quality checks

Sample payloads:
- [`examples/sample-data/disease-analysis-request.json`](examples/sample-data/disease-analysis-request.json)
- [`examples/sample-data/farm-profile.json`](examples/sample-data/farm-profile.json)

## Model Accuracy & Performance

Current platform metrics (project baseline targets):
- Disease detection confidence output: ranked top-3 prediction flow
- Reference quality target: **90%+ top-1 accuracy** on curated disease image sets
- Typical diagnosis response target: **2–5 seconds** per request (environment-dependent)

> Note: Exact performance depends on dataset quality, hardware, and model version. Track model updates in `CHANGELOG.md`.

## Roadmap

- [ ] Integrate production-grade trained disease models per crop family
- [ ] Add explainable AI overlays (symptom regions and confidence rationale)
- [ ] Expand IoT ingestion (soil moisture, EC, pH, weather station sync)
- [ ] Add multilingual agronomy recommendations with regional calendars
- [ ] Introduce MLOps evaluation + model drift monitoring

## Contributing Guidelines

Please review [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening issues or pull requests.

## Additional Documentation

- [`docs/AGRICULTURE_GUIDE.md`](docs/AGRICULTURE_GUIDE.md)
- [`docs/API.md`](docs/API.md)
- [`docs/DATA_REQUIREMENTS.md`](docs/DATA_REQUIREMENTS.md)
- [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)
- [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md)

## License

This project is licensed under the MIT License. See [`LICENSE.md`](LICENSE.md).
