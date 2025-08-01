# Biowell API Comprehensive Documentation

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL & Versioning](#base-url--versioning)
4. [Request/Response Format](#requestresponse-format)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Endpoints](#endpoints)
8. [Webhooks](#webhooks)
9. [SDKs](#sdks)
10. [Testing](#testing)
11. [Changelog](#changelog)

## Overview

The Biowell API provides comprehensive health and wellness data management capabilities, including:

- **AI-powered health coaching** with personalized recommendations
- **Biometric data tracking** from wearables and manual input
- **Nutrition analysis** with glucose impact calculations
- **Supplement management** with evidence-based recommendations
- **Recipe search** optimized for health goals
- **User profile management** with health preferences

**Current Version:** v1.0.0  
**Base URL:** `https://your-project.supabase.co/functions/v1`  
**Protocol:** HTTPS only  
**Data Format:** JSON  

## Authentication

All API endpoints require authentication using Supabase JWT tokens.

### Getting a Token

```javascript
// Sign in to get JWT token
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

const token = data.session?.access_token;
```

### Using the Token

Include the JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Token Validation

Tokens are validated on each request. Invalid or expired tokens return:

```json
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED",
  "details": "Valid JWT token required",
  "timestamp": "2025-01-30T12:00:00Z"
}
```

## Base URL & Versioning

### Current Base URL
```
https://your-project.supabase.co/functions/v1
```

### Versioning Strategy
- **URL Versioning:** `/v1/`, `/v2/` etc.
- **Header Versioning:** `API-Version: 1.0`
- **Backward Compatibility:** Maintained for 12 months

### Environment URLs
```bash
# Production
https://your-project.supabase.co/functions/v1

# Staging  
https://your-staging-project.supabase.co/functions/v1

# Development
http://localhost:54321/functions/v1
```

## Request/Response Format

### Request Headers
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
Accept: application/json
User-Agent: Biowell-App/1.0.0
X-Request-ID: <unique-request-id>
```

### Response Format
All responses follow this structure:

```json
{
  "data": {}, // Response payload
  "meta": {
    "timestamp": "2025-01-30T12:00:00Z",
    "request_id": "req_123456789",
    "version": "1.0.0"
  },
  "pagination": { // For paginated responses
    "page": 1,
    "limit": 50,
    "total": 150,
    "has_more": true
  }
}
```

### Error Response Format
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    },
    "timestamp": "2025-01-30T12:00:00Z",
    "request_id": "req_123456789"
  }
}
```

## Error Handling

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content returned |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 502 | Bad Gateway | Upstream service error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `UNAUTHORIZED` | Invalid or missing authentication | Provide valid JWT token |
| `FORBIDDEN` | Insufficient permissions | Check user permissions |
| `VALIDATION_ERROR` | Request validation failed | Fix request parameters |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist | Check resource ID |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait and retry |
| `EXTERNAL_SERVICE_ERROR` | Third-party service error | Retry or contact support |
| `DATABASE_ERROR` | Database operation failed | Contact support |

### Error Response Examples

```json
// 400 - Validation Error
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "message": "Message is required",
      "userId": "User ID must be a valid UUID"
    },
    "timestamp": "2025-01-30T12:00:00Z"
  }
}

// 401 - Unauthorized
{
  "error": {
    "message": "Authentication required",
    "code": "UNAUTHORIZED",
    "details": "JWT token is missing or invalid",
    "timestamp": "2025-01-30T12:00:00Z"
  }
}

// 429 - Rate Limited
{
  "error": {
    "message": "Rate limit exceeded",
    "code": "RATE_LIMIT_EXCEEDED",
    "details": {
      "limit": 100,
      "window": "1 minute",
      "retry_after": 45
    },
    "timestamp": "2025-01-30T12:00:00Z"
  }
}
```

## Rate Limiting

### Limits by Endpoint

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/openai-chat` | 20 requests | 1 minute |
| `/nutrition-analysis` | 50 requests | 1 minute |
| `/elevenlabs-tts` | 30 requests | 1 minute |
| `/spoonacular-recipes` | 100 requests | 1 minute |
| General endpoints | 100 requests | 1 minute |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643723400
X-RateLimit-Window: 60
```

### Handling Rate Limits

```javascript
// Example retry logic
const makeRequestWithRetry = async (url, options, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || 60;
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      continue;
    }
    
    return response;
  }
  throw new Error('Max retries exceeded');
};
```

## Endpoints

### Smart Coach

#### Send Message to Smart Coach

Send a message to the AI coach and receive personalized health advice.

**Endpoint:** `POST /openai-chat`

**Request:**
```json
{
  "message": "How can I improve my sleep quality?",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "sessionId": "987fcdeb-51a2-43d1-9f12-123456789abc"
}
```

**Response:**
```json
{
  "data": {
    "response": "Based on your recent sleep data showing 6.5 hours average, I recommend establishing a consistent bedtime routine. Your HRV data suggests stress may be impacting sleep quality. Consider magnesium supplementation 30 minutes before bed and reducing screen time after 9 PM.",
    "timestamp": "2025-01-30T12:00:00Z",
    "confidence": 0.94,
    "sources": ["sleep_metrics", "hrv_data", "supplement_history"],
    "session_id": "987fcdeb-51a2-43d1-9f12-123456789abc"
  },
  "meta": {
    "timestamp": "2025-01-30T12:00:00Z",
    "request_id": "req_openai_123",
    "processing_time_ms": 1250
  }
}
```

**cURL Example:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/openai-chat \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I improve my sleep quality?",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "sessionId": "987fcdeb-51a2-43d1-9f12-123456789abc"
  }'
```

**Error Responses:**
```json
// 400 - Missing required fields
{
  "error": {
    "message": "Missing required fields",
    "code": "VALIDATION_ERROR",
    "details": {
      "message": "Message is required",
      "userId": "User ID is required"
    }
  }
}

// 500 - OpenAI service error
{
  "error": {
    "message": "AI service temporarily unavailable",
    "code": "EXTERNAL_SERVICE_ERROR",
    "details": "OpenAI API returned error 503"
  }
}
```

### Health Metrics

#### Log Health Metric

Record a new health metric reading.

**Endpoint:** `POST /health-metrics`

**Request:**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "metricType": "heart_rate",
  "value": 72,
  "unit": "bpm",
  "source": "wearable",
  "timestamp": "2025-01-30T12:00:00Z",
  "metadata": {
    "device": "Apple Watch Series 9",
    "activity": "rest",
    "confidence": 0.98
  }
}
```

**Response:**
```json
{
  "data": {
    "id": "metric_123456789",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "metricType": "heart_rate",
    "value": 72,
    "unit": "bpm",
    "source": "wearable",
    "timestamp": "2025-01-30T12:00:00Z",
    "metadata": {
      "device": "Apple Watch Series 9",
      "activity": "rest",
      "confidence": 0.98
    },
    "createdAt": "2025-01-30T12:00:00Z"
  }
}
```

#### Get Health Metrics

Retrieve health metrics for a user with filtering options.

**Endpoint:** `GET /health-metrics`

**Query Parameters:**
- `userId` (required): User ID
- `metricType` (optional): Filter by metric type
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)
- `limit` (optional): Number of records (default: 50, max: 100)
- `page` (optional): Page number (default: 1)

**Example Request:**
```
GET /health-metrics?userId=123e4567-e89b-12d3-a456-426614174000&metricType=heart_rate&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "id": "metric_123456789",
      "metricType": "heart_rate",
      "value": 72,
      "unit": "bpm",
      "timestamp": "2025-01-30T12:00:00Z",
      "source": "wearable",
      "metadata": {
        "device": "Apple Watch Series 9"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "has_more": true
  }
}
```

### Nutrition Analysis

#### Analyze Food

Analyze nutritional content and health impact of food items.

**Endpoint:** `POST /nutrition-analysis`

**Request:**
```json
{
  "foodName": "grilled chicken breast",
  "quantity": "150g",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "mealType": "lunch"
}
```

**Response:**
```json
{
  "data": {
    "nutrition": {
      "calories": 231,
      "protein": 43.5,
      "carbohydrates": 0,
      "fat": 5.0,
      "fiber": 0,
      "sugar": 0,
      "sodium": 74
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
    "savedToLog": true,
    "logId": "food_log_123456789"
  }
}
```

### Text-to-Speech

#### Generate Speech

Convert text to speech using ElevenLabs AI voices.

**Endpoint:** `POST /elevenlabs-tts`

**Request:**
```json
{
  "text": "Based on your sleep data, I recommend going to bed 30 minutes earlier tonight.",
  "voiceId": "EXAVITQu4vr4xnSDxMaL",
  "settings": {
    "stability": 0.5,
    "similarity_boost": 0.5,
    "style": 0.0,
    "use_speaker_boost": true
  }
}
```

**Response:**
```json
{
  "data": {
    "audioData": "base64-encoded-audio-data",
    "contentType": "audio/mpeg",
    "duration": 5.2,
    "voiceId": "EXAVITQu4vr4xnSDxMaL",
    "characterCount": 89,
    "cost": 0.0089
  }
}
```

### Recipe Search

#### Search Health-Optimized Recipes

Search for recipes based on dietary preferences and health goals.

**Endpoint:** `GET /spoonacular-recipes`

**Query Parameters:**
- `query` (optional): Search term (default: "healthy")
- `diet` (optional): Diet type (keto, paleo, mediterranean, etc.)
- `intolerances` (optional): Food intolerances (comma-separated)
- `maxReadyTime` (optional): Maximum cooking time in minutes
- `number` (optional): Number of results (default: 12, max: 50)
- `minProtein` (optional): Minimum protein content
- `maxCarbs` (optional): Maximum carbohydrate content

**Example Request:**
```
GET /spoonacular-recipes?query=high+protein&diet=ketogenic&maxReadyTime=30&number=12&minProtein=25&maxCarbs=15
```

**Response:**
```json
{
  "data": {
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
          "fat": 18,
          "fiber": 6
        },
        "healthTags": ["High Protein", "Low Carb", "Omega-3"],
        "fertilityScore": 88,
        "muscleScore": 92,
        "insulinScore": 85,
        "instructions": [
          {
            "step": 1,
            "instruction": "Season salmon with herbs..."
          }
        ]
      }
    ],
    "totalResults": 150,
    "offset": 0,
    "number": 12
  }
}
```

### User Management

#### Get User Profile

Retrieve user profile information.

**Endpoint:** `GET /users/{userId}/profile`

**Response:**
```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": "https://...",
    "healthProfile": {
      "age": 28,
      "gender": "male",
      "height": 180,
      "weight": 75,
      "activityLevel": "moderately-active",
      "healthGoals": ["muscle_building", "insulin_optimization"],
      "medicalConditions": ["insulin_resistance"],
      "allergies": []
    },
    "preferences": {
      "units": "metric",
      "timezone": "Asia/Dubai",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    },
    "onboardingCompleted": true,
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-30T12:00:00Z"
  }
}
```

#### Update User Profile

Update user profile information.

**Endpoint:** `PATCH /users/{userId}/profile`

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "healthProfile": {
    "weight": 76,
    "healthGoals": ["muscle_building", "insulin_optimization", "fertility"]
  },
  "preferences": {
    "notifications": {
      "email": true,
      "push": false
    }
  }
}
```

### Chat Sessions

#### Create Chat Session

Create a new chat session with the Smart Coach.

**Endpoint:** `POST /chat-sessions`

**Request:**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Sleep Optimization Discussion",
  "context": {
    "topic": "sleep",
    "priority": "high"
  }
}
```

**Response:**
```json
{
  "data": {
    "id": "session_123456789",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Sleep Optimization Discussion",
    "messageCount": 0,
    "lastMessage": null,
    "context": {
      "topic": "sleep",
      "priority": "high"
    },
    "createdAt": "2025-01-30T12:00:00Z",
    "updatedAt": "2025-01-30T12:00:00Z"
  }
}
```

#### Get Chat Sessions

Retrieve user's chat sessions.

**Endpoint:** `GET /chat-sessions`

**Query Parameters:**
- `userId` (required): User ID
- `limit` (optional): Number of sessions (default: 20)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "data": [
    {
      "id": "session_123456789",
      "title": "Sleep Optimization Discussion",
      "messageCount": 15,
      "lastMessage": "Thank you for the sleep advice!",
      "lastMessageAt": "2025-01-30T11:45:00Z",
      "createdAt": "2025-01-30T10:00:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 5,
    "has_more": false
  }
}
```

### Supplement Management

#### Get User's Supplement Stack

Retrieve user's current supplement stack.

**Endpoint:** `GET /users/{userId}/supplements`

**Response:**
```json
{
  "data": {
    "supplements": [
      {
        "id": "supp_123456789",
        "name": "Vitamin D3",
        "dosage": "4000 IU",
        "timing": "morning",
        "price": 89,
        "subscriptionActive": true,
        "nextDelivery": "2025-02-15T00:00:00Z",
        "evidenceRating": 4.8,
        "category": "vitamins"
      }
    ],
    "totalMonthlyCost": 267,
    "subscriptionDiscount": 53.4,
    "nextBillingDate": "2025-02-01T00:00:00Z"
  }
}
```

#### Add Supplement to Stack

Add a supplement to user's stack.

**Endpoint:** `POST /users/{userId}/supplements`

**Request:**
```json
{
  "supplementId": "supp_987654321",
  "dosage": "2 capsules",
  "timing": "morning",
  "subscriptionEnabled": true
}
```

## Webhooks

### Webhook Events

| Event | Description | Payload |
|-------|-------------|---------|
| `health_metric.created` | New health metric logged | Health metric object |
| `chat_session.completed` | Chat session ended | Session summary |
| `supplement.subscription_renewed` | Subscription renewed | Subscription details |
| `user.goal_achieved` | Health goal achieved | Goal and achievement data |

### Webhook Payload Example

```json
{
  "event": "health_metric.created",
  "timestamp": "2025-01-30T12:00:00Z",
  "data": {
    "id": "metric_123456789",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "metricType": "heart_rate",
    "value": 72,
    "unit": "bpm",
    "source": "wearable"
  },
  "metadata": {
    "webhook_id": "wh_123456789",
    "delivery_attempt": 1
  }
}
```

### Webhook Security

Webhooks are signed with HMAC-SHA256:

```javascript
// Verify webhook signature
const crypto = require('crypto');

const verifyWebhook = (payload, signature, secret) => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};
```

## SDKs

### JavaScript/TypeScript SDK

```bash
npm install @biowell/api-sdk
```

```javascript
import { BiowellAPI } from '@biowell/api-sdk';

const api = new BiowellAPI({
  baseUrl: 'https://your-project.supabase.co/functions/v1',
  apiKey: 'your-supabase-anon-key',
  authToken: 'user-jwt-token'
});

// Send message to Smart Coach
const response = await api.coach.sendMessage({
  message: 'How can I improve my sleep?',
  userId: 'user-id'
});

// Log health metric
const metric = await api.health.logMetric({
  userId: 'user-id',
  metricType: 'heart_rate',
  value: 72,
  unit: 'bpm'
});
```

### Python SDK

```bash
pip install biowell-api-sdk
```

```python
from biowell_api import BiowellAPI

api = BiowellAPI(
    base_url='https://your-project.supabase.co/functions/v1',
    api_key='your-supabase-anon-key',
    auth_token='user-jwt-token'
)

# Send message to Smart Coach
response = api.coach.send_message(
    message='How can I improve my sleep?',
    user_id='user-id'
)

# Analyze nutrition
nutrition = api.nutrition.analyze(
    food_name='grilled chicken breast',
    quantity='150g',
    user_id='user-id'
)
```

## Testing

### Test Environment

```bash
# Base URL for testing
https://your-staging-project.supabase.co/functions/v1

# Test user credentials
email: test@biowell.com
password: TestPassword123!
```

### Example Test Cases

```javascript
// Jest test example
describe('Smart Coach API', () => {
  test('should return personalized advice', async () => {
    const response = await api.coach.sendMessage({
      message: 'How can I improve my sleep?',
      userId: 'test-user-id'
    });
    
    expect(response.data.response).toBeDefined();
    expect(response.data.confidence).toBeGreaterThan(0.8);
    expect(response.data.sources).toContain('sleep_metrics');
  });
  
  test('should handle missing message', async () => {
    await expect(api.coach.sendMessage({
      userId: 'test-user-id'
    })).rejects.toThrow('Message is required');
  });
});
```

### Postman Collection

Import our Postman collection for easy testing:

```bash
# Download collection
curl -o biowell-api.postman_collection.json \
  https://docs.biowell.com/api/postman-collection.json

# Import into Postman
# File > Import > biowell-api.postman_collection.json
```

## Changelog

### v1.0.0 (2025-01-30)

**Added:**
- Smart Coach chat endpoints
- Health metrics tracking
- Nutrition analysis with glucose impact
- Text-to-speech integration
- Recipe search with health scoring
- User profile management
- Chat session management
- Supplement stack management

**Security:**
- JWT authentication
- Rate limiting
- Input validation
- CORS configuration

**Documentation:**
- Comprehensive API documentation
- OpenAPI specification
- Postman collection
- SDK examples

---

## Automatic Documentation Tools

### Recommended Tools for Auto-Generation

#### 1. OpenAPI/Swagger Tools

**Swagger UI** - Interactive documentation
```bash
npm install swagger-ui-express
npm install swagger-jsdoc
```

**Redoc** - Beautiful static documentation
```bash
npx redoc-cli build openapi.yaml --output docs/index.html
```

#### 2. Code-First Documentation

**TypeDoc** - Generate docs from TypeScript
```bash
npm install typedoc --save-dev
npx typedoc src/lib/api.ts --out docs/code
```

**JSDoc** - Generate docs from comments
```javascript
/**
 * Send a message to the Smart Coach
 * @param {string} message - The user's message
 * @param {string} userId - User's unique identifier
 * @param {string} [sessionId] - Optional chat session ID
 * @returns {Promise<ChatResponse>} Promise with AI response
 * @throws {ValidationError} When required fields are missing
 * @example
 * const response = await sendChatMessage(
 *   'How can I improve my sleep?',
 *   'user-123'
 * );
 */
```

#### 3. API Testing and Documentation

**Postman** - Collections and automated testing
```bash
# Run tests and generate reports
newman run collection.json --environment env.json \
  --reporters cli,html --reporter-html-export report.html
```

**Insomnia** - API client with documentation features
- Export collections for CI/CD
- GraphQL support
- Plugin ecosystem

#### 4. Automated Pipeline

**GitHub Actions** for documentation deployment:

```yaml
name: Generate API Documentation

on:
  push:
    branches: [main]
    paths: ['src/**', 'docs/api/**']

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate OpenAPI spec
        run: |
          npx swagger-jsdoc -d swaggerDef.js -o docs/api/openapi.yaml src/**/*.ts
      
      - name: Generate Redoc documentation
        run: |
          npx redoc-cli build docs/api/openapi.yaml --output docs/api/index.html
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/api
```

### Documentation Maintenance Strategy

1. **Version Control**
   - Tag API versions in git
   - Maintain changelog
   - Document breaking changes

2. **Quality Assurance**
   - Validate OpenAPI specs
   - Test all examples
   - Check for broken links

3. **User Feedback**
   - Collect documentation feedback
   - Monitor API usage patterns
   - Update based on common questions

4. **Automation**
   - Auto-generate from code comments
   - Validate examples in CI/CD
   - Deploy documentation automatically

---

For questions about the API or documentation, contact the development team or check our [GitHub repository](https://github.com/biowell/api).