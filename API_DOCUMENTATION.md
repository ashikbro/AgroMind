# AgroMind API Documentation

Complete API reference for the AgroMind backend services.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require authentication via JWT tokens.

### Headers

```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Farmer",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "farmer",
  "phone": "+1234567890",
  "location": {
    "state": "Punjab",
    "district": "Ludhiana"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "email": "john@example.com",
    "role": "farmer"
  }
}
```

### Login

Authenticate and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "email": "john@example.com",
    "role": "farmer"
  }
}
```

### Get Profile

Get current user profile.

**Endpoint:** `GET /api/auth/profile`

**Headers:** Requires `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "email": "john@example.com",
    "role": "farmer",
    "phone": "+1234567890",
    "location": {
      "state": "Punjab",
      "district": "Ludhiana"
    },
    "farmDetails": {
      "size": 10,
      "soilType": "loamy",
      "irrigationType": "drip"
    }
  }
}
```

## Crop Endpoints

### Get All Crops

Retrieve list of all crops.

**Endpoint:** `GET /api/crops`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by crop name

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Wheat",
      "scientificName": "Triticum aestivum",
      "category": "cereal",
      "season": "rabi",
      "duration": 120,
      "waterRequirement": "moderate",
      "soilType": ["loamy", "clay"],
      "description": "Major cereal crop",
      "image": "https://example.com/wheat.jpg"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50
  }
}
```

### Get Crop by ID

Get detailed information about a specific crop.

**Endpoint:** `GET /api/crops/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Wheat",
    "scientificName": "Triticum aestivum",
    "category": "cereal",
    "season": "rabi",
    "duration": 120,
    "waterRequirement": "moderate",
    "soilType": ["loamy", "clay"],
    "description": "Major cereal crop for food production",
    "cultivationSteps": [
      "Prepare land by plowing",
      "Sow seeds at appropriate depth",
      "Apply fertilizers as needed"
    ],
    "commonDiseases": ["rust", "powdery_mildew"],
    "marketPrice": {
      "min": 1800,
      "max": 2200,
      "unit": "INR per quintal"
    }
  }
}
```

## Disease Endpoints

### Get All Diseases

Retrieve list of crop diseases.

**Endpoint:** `GET /api/diseases`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Wheat Rust",
      "scientificName": "Puccinia graminis",
      "affectedCrops": ["wheat", "barley"],
      "symptoms": [
        "Orange-red pustules on leaves",
        "Yellow streaks on stems",
        "Reduced grain quality"
      ],
      "treatment": "Apply fungicides like propiconazole",
      "prevention": "Use resistant varieties, proper spacing"
    }
  ]
}
```

### Diagnose Disease

AI-powered disease diagnosis from image.

**Endpoint:** `POST /api/diseases/diagnose`

**Headers:** 
- `Content-Type: multipart/form-data`
- `Authorization: Bearer <token>`

**Request Body:**
```
Form Data:
- image: (file) Crop image
- cropType: (string, optional) Crop type
- symptoms: (string, optional) Description of symptoms
```

**Response:** `200 OK`
```json
{
  "success": true,
  "diagnosis": {
    "disease": "Wheat Rust",
    "confidence": 0.87,
    "severity": "moderate",
    "affectedArea": 0.35,
    "treatment": {
      "immediate": [
        "Apply propiconazole fungicide",
        "Remove severely affected plants"
      ],
      "preventive": [
        "Improve air circulation",
        "Use resistant varieties in next season"
      ]
    },
    "estimatedLoss": "15-25%"
  }
}
```

## Weather Endpoints

### Get Current Weather

Get current weather for a location.

**Endpoint:** `GET /api/weather/current`

**Query Parameters:**
- `lat`: Latitude
- `lon`: Longitude
- OR `city`: City name

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "location": "Ludhiana, Punjab",
    "temperature": 28.5,
    "feelsLike": 30.2,
    "humidity": 65,
    "windSpeed": 12.5,
    "description": "Partly cloudy",
    "icon": "02d",
    "rainfall": 0,
    "pressure": 1013,
    "uvIndex": 7
  }
}
```

### Get Weather Forecast

Get 7-day weather forecast.

**Endpoint:** `GET /api/weather/forecast`

**Query Parameters:**
- `lat`: Latitude
- `lon`: Longitude
- OR `city`: City name

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-12-09",
      "temperature": {
        "min": 18,
        "max": 30,
        "avg": 24
      },
      "humidity": 60,
      "rainfall": 0,
      "windSpeed": 10,
      "description": "Clear sky",
      "farmingRecommendation": "Good day for field work"
    }
  ]
}
```

## Market Price Endpoints

### Get Market Prices

Get current market prices for crops.

**Endpoint:** `GET /api/market/prices`

**Query Parameters:**
- `crop` (optional): Filter by crop name
- `location` (optional): Filter by market location

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "crop": "Wheat",
      "location": "Delhi Mandi",
      "price": 2100,
      "unit": "INR per quintal",
      "quality": "premium",
      "date": "2024-12-08",
      "change": "+50",
      "changePercent": "+2.4%"
    }
  ]
}
```

### Get Price History

Get historical price data for trend analysis.

**Endpoint:** `GET /api/market/history`

**Query Parameters:**
- `crop`: Crop name (required)
- `location` (optional): Market location
- `days` (optional): Number of days (default: 30)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "crop": "Wheat",
    "location": "Delhi Mandi",
    "priceHistory": [
      {
        "date": "2024-12-08",
        "price": 2100,
        "volume": 1500
      },
      {
        "date": "2024-12-07",
        "price": 2050,
        "volume": 1450
      }
    ],
    "statistics": {
      "min": 1950,
      "max": 2150,
      "avg": 2050,
      "trend": "upward"
    }
  }
}
```

## Calendar Endpoints

### Get Calendar Events

Get farming calendar events.

**Endpoint:** `GET /api/calendar/events`

**Headers:** Requires authentication

**Query Parameters:**
- `month` (optional): Month (1-12)
- `year` (optional): Year
- `type` (optional): Event type (sowing, watering, fertilizing, etc.)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Sow wheat seeds",
      "type": "sowing",
      "crop": "Wheat",
      "date": "2024-12-15",
      "notes": "Prepare field before sowing",
      "completed": false,
      "reminder": true
    }
  ]
}
```

### Create Calendar Event

Create a new farming activity.

**Endpoint:** `POST /api/calendar/events`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "title": "Apply fertilizer",
  "type": "fertilizing",
  "crop": "Wheat",
  "date": "2024-12-20",
  "notes": "Use NPK fertilizer",
  "reminder": true,
  "reminderDays": 1
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "title": "Apply fertilizer",
    "type": "fertilizing",
    "crop": "Wheat",
    "date": "2024-12-20",
    "notes": "Use NPK fertilizer",
    "completed": false,
    "reminder": true,
    "reminderDays": 1
  }
}
```

## Analytics Endpoints

### Get Dashboard Stats

Get overview statistics for dashboard.

**Endpoint:** `GET /api/analytics/dashboard`

**Headers:** Requires authentication

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalCrops": 5,
    "activeDiagnoses": 3,
    "upcomingEvents": 8,
    "weatherAlerts": 1,
    "recentActivity": [
      {
        "type": "diagnosis",
        "description": "Disease detected in wheat crop",
        "date": "2024-12-08"
      }
    ]
  }
}
```

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Common Error Codes

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

## Rate Limiting

API requests are limited to:
- 100 requests per 15 minutes for authenticated users
- 20 requests per 15 minutes for unauthenticated users

## GraphQL API

GraphQL endpoint is available at:

```
http://localhost:5000/graphql
```

See GraphQL Playground for interactive documentation and schema exploration.

## WebSocket Events

Real-time updates via Socket.io:

```javascript
// Connect
const socket = io('http://localhost:5000', {
  auth: { token: 'your-jwt-token' }
});

// Listen for events
socket.on('weatherUpdate', (data) => {
  console.log('New weather data:', data);
});

socket.on('priceUpdate', (data) => {
  console.log('Price updated:', data);
});
```

## Support

For API support:
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Review [GitHub Issues](https://github.com/ashikbro/AgroMind/issues)
- Contact development team

---

**API Version: 1.0.0**
**Last Updated: December 8, 2024**
