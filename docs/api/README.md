# Biowell API Documentation

## Overview

The Biowell API provides comprehensive health and wellness data management capabilities, including user profiles, health metrics tracking, AI coaching, supplement management, and device integrations.

**Base URL:** `https://your-project.supabase.co/functions/v1`

**API Version:** v1

**Authentication:** Bearer Token (Supabase JWT)

## Table of Contents

1. [Authentication](#authentication)
2. [Error Handling](#error-handling)
3. [Rate Limiting](#rate-limiting)
4. [Endpoints](#endpoints)
   - [AI Coach](#ai-coach)
   - [Health Metrics](#health-metrics)
   - [Nutrition](#nutrition)
   - [Text-to-Speech](#text-to-speech)
   - [Recipes](#recipes)
5. [Data Models](#data-models)
6. [SDKs and Tools](#sdks-and-tools)

## Authentication

All API endpoints require authentication using Supabase JWT tokens.

### Headers Required

```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### Getting a Token

```javascript
import { supabase } from './lib/supabase'

// Sign in to get token
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

const token = data.session?.access_token
```

## Error Handling

### Standard Error Response

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": "Additional error details",
  "timestamp": "2025-01-30T12:00:00Z"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Rate Limited |
| 500 | Internal Server Error |

## Rate Limiting

- **Default:** 100 requests per minute per user
- **Burst:** 20 requests per 10 seconds
- **Headers:** Rate limit info included in response headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643723400
```

## Endpoints

### AI Coach

#### Send Chat Message

Send a message to the AI health coach and receive personalized advice.

**Endpoint:** `POST /openai-chat`

**Authentication:** Required

**Request Body:**
```json
{
  "message": "How can I improve my sleep quality?",
  "userId": "uuid-string",
  "sessionId": "uuid-string"
}
```

**Response:**
```json
{
  "response": "Based on your recent sleep data showing 6.5 hours average, I recommend establishing a consistent bedtime routine. Your HRV data suggests stress may be impacting sleep quality. Consider magnesium supplementation 30 minutes before bed and reducing screen time after 9 PM.",
  "timestamp": "2025-01-30T12:00:00Z",
  "confidence": 0.94,
  "sources": ["sleep_metrics", "hrv_data", "supplement_history"]
}
```

**Error Responses:**
```json
// 400 - Missing required fields
{
  "error": "Missing required fields",
  "code": "MISSING_FIELDS",
  "details": "message and userId are required"
}

// 500 - OpenAI API error
{
  "error": "AI service temporarily unavailable",
  "code": "AI_SERVICE_ERROR",
  "details": "OpenAI API returned error 503"
}
```

### Health Metrics

#### Log Health Metric

Record a new health metric reading.

**Endpoint:** `POST /health-metrics`

**Authentication:** Required

**Request Body:**
```json
{
  "userId": "uuid-string",
  "metricType": "heart_rate",
  "value": 72,
  "unit": "bpm",
  "source": "wearable",
  "timestamp": "2025-01-30T12:00:00Z",
  "metadata": {
    "device": "Apple Watch",
    "activity": "rest"
  }
}
```

**Response:**
```json
{
  "id": "uuid-string",
  "userId": "uuid-string",
  "metricType": "heart_rate",
  "value": 72,
  "unit": "bpm",
  "source": "wearable",
  "timestamp": "2025-01-30T12:00:00Z",
  "metadata": {
    "device": "Apple Watch",
    "activity": "rest"
  },
  "createdAt": "2025-01-30T12:00:00Z"
}
```

#### Get Health Metrics

Retrieve health metrics for a user.

**Endpoint:** `GET /health-metrics`

**Authentication:** Required

**Query Parameters:**
- `userId` (required): User ID
- `metricType` (optional): Filter by metric type
- `startDate` (optional): Start date for range
- `endDate` (optional): End date for range
- `limit` (optional): Number of records (default: 50, max: 100)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-string",
      "metricType": "heart_rate",
      "value": 72,
      "unit": "bpm",
      "timestamp": "2025-01-30T12:00:00Z",
      "source": "wearable"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "hasMore": true
  }
}
```

### Nutrition

#### Analyze Food

Analyze nutritional content and health impact of food items.

**Endpoint:** `POST /nutrition-analysis`

**Authentication:** Required

**Request Body:**
```json
{
  "foodName": "grilled chicken breast",
  "quantity": "150g",
  "userId": "uuid-string"
}
```

**Response:**
```json
{
  "nutrition": {
    "calories": 231,
    "protein": 43.5,
    "carbohydrates": 0,
    "fat": 5.0,
    "fiber": 0,
    "sugar": 0
  },
  "glycemicImpact": 0,
  "insights": {
    "fertilityScore": 85,
    "muscleScore": 95,
    "insulinScore": 90,
    "recommendations": [
      "Excellent protein content for muscle building",
      "Zero glycemic impact - perfect for insulin sensitivity",
      "High in leucine for muscle protein synthesis"
    ]
  },
  "foodName": "Grilled Chicken Breast",
  "image": "https://api.spoonacular.com/...",
  "savedToLog": true
}
```

### Text-to-Speech

#### Generate Speech

Convert text to speech using ElevenLabs AI voices.

**Endpoint:** `POST /elevenlabs-tts`

**Authentication:** Required

**Request Body:**
```json
{
  "text": "Based on your sleep data, I recommend going to bed 30 minutes earlier tonight.",
  "voiceId": "EXAVITQu4vr4xnSDxMaL"
}
```

**Response:**
```json
{
  "audioData": "base64-encoded-audio-data",
  "contentType": "audio/mpeg",
  "duration": 5.2,
  "voiceId": "EXAVITQu4vr4xnSDxMaL"
}
```

### Recipes

#### Search Recipes

Search for health-optimized recipes based on dietary preferences and health goals.

**Endpoint:** `GET /spoonacular-recipes`

**Authentication:** Required

**Query Parameters:**
- `query` (optional): Search term (default: "healthy")
- `diet` (optional): Diet type (keto, paleo, mediterranean, etc.)
- `intolerances` (optional): Food intolerances
- `maxReadyTime` (optional): Maximum cooking time in minutes
- `number` (optional): Number of results (default: 12, max: 50)

**Response:**
```json
{
  "recipes": [
    {
      "id": 123456,
      "title": "High-Protein Salmon Bowl",
      "image": "https://spoonacular.com/...",
      "readyInMinutes": 25,
      "servings": 2,
      "summary": "Nutrient-dense salmon bowl...",
      "nutrition": {
        "calories": 420,
        "protein": 35,
        "carbs": 28,
        "fat": 18
      },
      "healthTags": ["High Protein", "Low Carb", "Omega-3"],
      "fertilityScore": 88,
      "muscleScore": 92
    }
  ],
  "totalResults": 150,
  "offset": 0,
  "number": 12
}
```

## Data Models

### User Profile

```typescript
interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isAdmin?: boolean;
  onboardingCompleted?: boolean;
  mobile?: string;
  createdAt: string;
  updatedAt?: string;
}
```

### Health Metric

```typescript
interface HealthMetric {
  id: string;
  userId: string;
  metricType: 'heart_rate' | 'steps' | 'glucose' | 'sleep' | 'energy' | 'stress';
  value: number;
  unit: string;
  timestamp: string;
  source: 'wearable' | 'cgm' | 'manual' | 'calculated';
  metadata?: Record<string, any>;
  createdAt: string;
}
```

### Chat Message

```typescript
interface ChatMessage {
  id: string;
  userId: string;
  sessionId?: string;
  content: string;
  role: 'user' | 'assistant';
  metadata?: Record<string, any>;
  createdAt: string;
}
```

### Supplement

```typescript
interface Supplement {
  id: string;
  name: string;
  description: string;
  benefits?: string[];
  dosage?: string;
  price: number;
  imageUrl?: string;
  isActive?: boolean;
  formType?: string;
  evidenceRating?: number;
  category?: string;
  tier?: 'green' | 'yellow' | 'orange' | 'red';
  stockQuantity: number;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
}
```

## SDKs and Tools

### Recommended Documentation Tools

1. **OpenAPI/Swagger**
   - Generate interactive docs
   - Auto-sync with code changes
   - Built-in testing interface

2. **Postman Collections**
   - Pre-configured requests
   - Environment variables
   - Automated testing

3. **Insomnia**
   - GraphQL support
   - Environment management
   - Plugin ecosystem

### Code Generation

```bash
# Generate TypeScript types from OpenAPI spec
npx swagger-typescript-api -p ./docs/api/openapi.yaml -o ./src/types/api

# Generate client SDK
npx @openapitools/openapi-generator-cli generate \
  -i ./docs/api/openapi.yaml \
  -g typescript-fetch \
  -o ./src/sdk
```

### Testing

```javascript
// Example API test
describe('AI Coach API', () => {
  it('should return personalized advice', async () => {
    const response = await fetch('/functions/v1/openai-chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'How can I improve my sleep?',
        userId: 'test-user-id'
      })
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.response).toBeDefined();
    expect(data.confidence).toBeGreaterThan(0.8);
  });
});
```

## Changelog

### v1.0.0 (2025-01-30)
- Initial API release
- AI Coach endpoints
- Health metrics tracking
- Nutrition analysis
- Text-to-speech integration
- Recipe search functionality

---

For questions or support, contact the development team or check our [GitHub repository](https://github.com/biowell/api).