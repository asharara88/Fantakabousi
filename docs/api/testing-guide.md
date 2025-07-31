# API Testing Guide

## Overview

This guide covers testing strategies for the Biowell API, including unit tests, integration tests, and end-to-end testing.

## Testing Tools

### Recommended Stack

1. **Jest** - Unit testing framework
2. **Supertest** - HTTP assertion library
3. **MSW** - Mock Service Worker for API mocking
4. **Playwright** - End-to-end testing
5. **Postman/Newman** - API testing and automation

## Test Categories

### 1. Unit Tests

Test individual functions and components in isolation.

```javascript
// Example: Testing nutrition analysis function
import { analyzeNutrition } from '../lib/nutrition';

describe('Nutrition Analysis', () => {
  test('should calculate correct macros for chicken breast', () => {
    const result = analyzeNutrition('grilled chicken breast', '150g');
    
    expect(result.nutrition.protein).toBeGreaterThan(40);
    expect(result.nutrition.carbohydrates).toBeLessThan(5);
    expect(result.glycemicImpact).toBeLessThan(5);
  });
  
  test('should handle invalid food names', () => {
    expect(() => {
      analyzeNutrition('', '100g');
    }).toThrow('Food name is required');
  });
});
```

### 2. Integration Tests

Test API endpoints with real database interactions.

```javascript
// Example: Testing AI coach endpoint
import request from 'supertest';
import { app } from '../server';

describe('AI Coach API', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Setup test user and get auth token
    const authResponse = await request(app)
      .post('/auth/signin')
      .send({
        email: 'test@example.com',
        password: 'testpassword'
      });
    
    authToken = authResponse.body.token;
    userId = authResponse.body.user.id;
  });

  test('should return personalized advice', async () => {
    const response = await request(app)
      .post('/functions/v1/openai-chat')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        message: 'How can I improve my sleep?',
        userId: userId
      });

    expect(response.status).toBe(200);
    expect(response.body.response).toBeDefined();
    expect(response.body.confidence).toBeGreaterThan(0.8);
    expect(response.body.timestamp).toBeDefined();
  });

  test('should handle missing message', async () => {
    const response = await request(app)
      .post('/functions/v1/openai-chat')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        userId: userId
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('message');
  });

  test('should require authentication', async () => {
    const response = await request(app)
      .post('/functions/v1/openai-chat')
      .send({
        message: 'Test message',
        userId: userId
      });

    expect(response.status).toBe(401);
  });
});
```

### 3. End-to-End Tests

Test complete user workflows using Playwright.

```javascript
// Example: E2E test for chat functionality
import { test, expect } from '@playwright/test';

test.describe('AI Coach Chat', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'testpassword');
    await page.click('[data-testid="signin-button"]');
    
    // Navigate to coach
    await page.click('[data-testid="nav-coach"]');
  });

  test('should send message and receive response', async ({ page }) => {
    // Type message
    await page.fill('[data-testid="chat-input"]', 'How can I improve my sleep?');
    
    // Send message
    await page.click('[data-testid="send-button"]');
    
    // Wait for response
    await page.waitForSelector('[data-testid="ai-response"]', { timeout: 10000 });
    
    // Verify response appears
    const response = await page.textContent('[data-testid="ai-response"]');
    expect(response).toContain('sleep');
    
    // Test audio playback
    await page.click('[data-testid="play-audio"]');
    await expect(page.locator('[data-testid="audio-playing"]')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/functions/v1/openai-chat', route => {
      route.abort();
    });
    
    await page.fill('[data-testid="chat-input"]', 'Test message');
    await page.click('[data-testid="send-button"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});
```

## Mock Data Setup

### MSW Setup for API Mocking

```javascript
// mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  // AI Coach mock
  rest.post('/functions/v1/openai-chat', (req, res, ctx) => {
    const { message } = req.body;
    
    return res(
      ctx.json({
        response: `Mock AI response to: ${message}`,
        timestamp: new Date().toISOString(),
        confidence: 0.95
      })
    );
  }),

  // Nutrition analysis mock
  rest.post('/functions/v1/nutrition-analysis', (req, res, ctx) => {
    const { foodName } = req.body;
    
    return res(
      ctx.json({
        nutrition: {
          calories: 231,
          protein: 43.5,
          carbohydrates: 0,
          fat: 5.0
        },
        glycemicImpact: 0,
        insights: {
          fertilityScore: 85,
          muscleScore: 95,
          insulinScore: 90
        }
      })
    );
  }),

  // TTS mock
  rest.post('/functions/v1/elevenlabs-tts', (req, res, ctx) => {
    return res(
      ctx.json({
        audioData: 'mock-base64-audio-data',
        contentType: 'audio/mpeg'
      })
    );
  })
];
```

## Performance Testing

### Load Testing with Artillery

```yaml
# artillery-config.yml
config:
  target: 'https://your-project.supabase.co'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Load test"
  defaults:
    headers:
      Authorization: 'Bearer {{ $randomString() }}'

scenarios:
  - name: "AI Coach Chat"
    weight: 70
    flow:
      - post:
          url: "/functions/v1/openai-chat"
          json:
            message: "How can I improve my health?"
            userId: "{{ $randomString() }}"
          
  - name: "Nutrition Analysis"
    weight: 30
    flow:
      - post:
          url: "/functions/v1/nutrition-analysis"
          json:
            foodName: "chicken breast"
            userId: "{{ $randomString() }}"
```

## Test Data Management

### Database Seeding

```javascript
// tests/setup/seed.js
import { supabase } from '../../src/lib/supabase';

export const seedTestData = async () => {
  // Create test user
  const { data: user } = await supabase.auth.admin.createUser({
    email: 'test@example.com',
    password: 'testpassword',
    email_confirm: true
  });

  // Create test profile
  await supabase.from('profiles').insert({
    id: user.user.id,
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User'
  });

  // Create test health metrics
  const metrics = [
    {
      user_id: user.user.id,
      metric_type: 'heart_rate',
      value: 72,
      unit: 'bpm',
      source: 'manual',
      timestamp: new Date().toISOString()
    }
  ];

  await supabase.from('health_metrics').insert(metrics);

  return user.user.id;
};

export const cleanupTestData = async (userId) => {
  await supabase.from('health_metrics').delete().eq('user_id', userId);
  await supabase.from('profiles').delete().eq('id', userId);
  await supabase.auth.admin.deleteUser(userId);
};
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/api-tests.yml
name: API Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
        
      - name: Run integration tests
        run: npm run test:integration
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Monitoring and Alerting

### API Health Checks

```javascript
// health-check.js
export const healthCheck = async () => {
  const checks = {
    database: false,
    openai: false,
    elevenlabs: false,
    spoonacular: false
  };

  try {
    // Database check
    const { error: dbError } = await supabase.from('profiles').select('id').limit(1);
    checks.database = !dbError;

    // OpenAI check
    const openaiResponse = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
    });
    checks.openai = openaiResponse.ok;

    // ElevenLabs check
    const elevenLabsResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY }
    });
    checks.elevenlabs = elevenLabsResponse.ok;

    // Spoonacular check
    const spoonacularResponse = await fetch(
      `https://api.spoonacular.com/recipes/random?apiKey=${process.env.SPOONACULAR_API_KEY}&number=1`
    );
    checks.spoonacular = spoonacularResponse.ok;

  } catch (error) {
    console.error('Health check failed:', error);
  }

  return {
    status: Object.values(checks).every(Boolean) ? 'healthy' : 'degraded',
    checks,
    timestamp: new Date().toISOString()
  };
};
```

## Best Practices

### 1. Test Organization

```
tests/
├── unit/
│   ├── lib/
│   ├── components/
│   └── hooks/
├── integration/
│   ├── api/
│   └── database/
├── e2e/
│   ├── user-flows/
│   └── critical-paths/
├── fixtures/
├── mocks/
└── setup/
```

### 2. Test Naming Convention

```javascript
// Format: should_[expected behavior]_when_[condition]
test('should_return_personalized_advice_when_valid_message_sent', () => {});
test('should_throw_validation_error_when_message_is_empty', () => {});
test('should_require_authentication_when_no_token_provided', () => {});
```

### 3. Environment Management

```javascript
// test.env
NODE_ENV=test
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=test-anon-key
OPENAI_API_KEY=test-openai-key
ELEVENLABS_API_KEY=test-elevenlabs-key
SPOONACULAR_API_KEY=test-spoonacular-key
```

### 4. Test Data Isolation

```javascript
// Each test should clean up after itself
afterEach(async () => {
  await cleanupTestData();
});

// Use transactions for database tests
beforeEach(async () => {
  await supabase.rpc('begin_test_transaction');
});

afterEach(async () => {
  await supabase.rpc('rollback_test_transaction');
});
```

## Debugging

### API Request Logging

```javascript
// Add to edge functions for debugging
console.log('Request:', {
  method: req.method,
  url: req.url,
  headers: Object.fromEntries(req.headers.entries()),
  body: await req.clone().text()
});
```

### Error Tracking

```javascript
// Sentry integration for production
import * as Sentry from '@sentry/node';

Sentry.captureException(error, {
  tags: {
    function: 'openai-chat',
    userId: userId
  },
  extra: {
    request: requestData,
    response: responseData
  }
});
```

## Documentation Maintenance

### Automated Updates

1. **OpenAPI Generation**
   ```bash
   # Generate from code annotations
   npx swagger-jsdoc -d swaggerDef.js -o docs/api/openapi.yaml src/**/*.ts
   ```

2. **Postman Sync**
   ```bash
   # Update Postman collection
   newman run docs/api/postman-collection.json --export-collection updated-collection.json
   ```

3. **Documentation Site**
   ```bash
   # Generate static docs with Redoc
   npx redoc-cli build docs/api/openapi.yaml --output docs/api/index.html
   ```

### Version Control

- Tag API versions in git
- Maintain changelog
- Document breaking changes
- Provide migration guides

---

For more information, see the [API Reference](./README.md) or contact the development team.