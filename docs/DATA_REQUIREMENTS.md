# Data Requirements

## 1. Core Farm Profile Data

Required:
- Farmer identifier
- Farm location
- Crop type

Recommended:
- Soil category / pH
- Irrigation mode
- Plot area
- Historical crop performance

## 2. Disease Analysis Input Data

Required:
- At least one crop image (`jpg`, `jpeg`, `png`)

Recommended quality:
- Resolution: 720p or higher
- Good lighting, low blur, symptom-focused framing

Optional metadata:
- Symptoms text notes
- Crop growth stage
- Recent weather events

## 3. Yield Prediction Input Features

Minimum set:
- Crop type
- Planting date / crop age
- Field location

Enhanced model features:
- Soil moisture
- Temperature
- Humidity
- Rainfall
- NPK values
- Planting density

## 4. Weather and Market Data

Optional integrations:
- Weather API (current + forecast)
- Commodity/market API for local crop prices

## 5. Data Validation Rules

- Reject empty uploads for disease analysis
- Enforce pagination bounds for history endpoints
- Validate numeric ranges where applicable (e.g., limit values)
- Preserve timestamp fields in UTC

## 6. Performance & Accuracy Considerations

- Model confidence is represented as percentage values (0–100)
- Collect follow-up outcomes to improve model quality over time
- Monitor response latency under real upload size distributions
