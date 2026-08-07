# AgroMind API Reference

Base URL (local): `http://localhost:5000`

## Authentication

Most endpoints require `Authorization: ******

### POST `/api/auth/register`
Create user account.

### POST `/api/auth/login`
Authenticate and return token.

---

## AI Disease Diagnosis

### POST `/api/ai/analyze-disease`
Analyze uploaded crop images and optional symptoms.

**Content-Type**: `multipart/form-data`

**Fields**:
- `images` (required, up to 5)
- `cropType` (optional string)
- `symptoms` (optional string)

**Success (201)**
```json
{
  "success": true,
  "message": "Disease analysis completed",
  "data": {
    "diagnosis": {
      "status": "diagnosed"
    }
  }
}
```

### GET `/api/ai/diagnosis/:id`
Fetch one diagnosis for authenticated farmer.

### GET `/api/ai/diagnosis-history?page=1&limit=10&status=&crop=`
Fetch paginated diagnosis history.

### POST `/api/ai/diagnosis/:id/follow-up`
Append follow-up status, notes, and optional images.

### GET `/api/ai/analytics`
Get status distribution, common diseases, and monthly trend data.

---

## Crop and Disease Data

### GET `/api/crops`
List available crops.

### GET `/api/diseases`
List diseases and treatment metadata.

---

## Error Format

```json
{
  "success": false,
  "message": "Failed to analyze crop disease",
  "error": "<details>"
}
```

Use meaningful HTTP status codes (`400`, `401`, `404`, `500`) for client handling.
