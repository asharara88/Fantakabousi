# API Documentation Automation Setup

## Quick Start Guide

This guide helps you set up automated API documentation generation for the Biowell API.

## 1. Install Required Tools

```bash
# Core documentation tools
npm install -g @apidevtools/swagger-cli
npm install -g redoc-cli
npm install -g @openapitools/openapi-generator-cli

# Development dependencies
npm install --save-dev swagger-jsdoc swagger-ui-express
npm install --save-dev typedoc @types/swagger-jsdoc
```

## 2. OpenAPI Specification Generator

Create `scripts/generate-openapi.js`:

```javascript
const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Biowell API',
      version: '1.0.0',
      description: 'Comprehensive health and wellness platform API',
    },
    servers: [
      {
        url: 'https://your-project.supabase.co/functions/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: [
    './supabase/functions/*/index.ts',
    './src/lib/api.ts',
    './src/types/api.ts',
  ],
};

const specs = swaggerJSDoc(options);

// Write OpenAPI spec to file
fs.writeFileSync(
  path.join(__dirname, '../docs/api/openapi-generated.yaml'),
  JSON.stringify(specs, null, 2)
);

console.log('✅ OpenAPI specification generated successfully');
```

## 3. Add JSDoc Comments to Edge Functions

Update your edge functions with proper documentation:

```typescript
// supabase/functions/openai-chat/index.ts

/**
 * @swagger
 * /openai-chat:
 *   post:
 *     summary: Send message to Smart Coach
 *     description: Get personalized health advice from AI coach
 *     tags:
 *       - Smart Coach
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - userId
 *             properties:
 *               message:
 *                 type: string
 *                 description: User's message
 *                 example: "How can I improve my sleep?"
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: User ID
 *               sessionId:
 *                 type: string
 *                 format: uuid
 *                 description: Chat session ID
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   description: AI coach response
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 confidence:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 1
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Your existing function code...
});
```

## 4. GitHub Actions Workflow

Create `.github/workflows/docs.yml`:

```yaml
name: Generate and Deploy API Documentation

on:
  push:
    branches: [main]
    paths: 
      - 'supabase/functions/**'
      - 'src/lib/api.ts'
      - 'docs/api/**'
  pull_request:
    branches: [main]

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          npm ci
          npm install -g redoc-cli @openapitools/openapi-generator-cli
      
      - name: Generate OpenAPI specification
        run: |
          node scripts/generate-openapi.js
      
      - name: Validate OpenAPI spec
        run: |
          npx swagger-cli validate docs/api/openapi-generated.yaml
      
      - name: Generate Redoc documentation
        run: |
          redoc-cli build docs/api/openapi-extended.yaml --output docs/api/index.html \
            --options.theme.colors.primary.main="#48C6FF" \
            --options.theme.colors.primary.dark="#2A7FFF" \
            --title="Biowell API Documentation"
      
      - name: Generate TypeScript SDK
        run: |
          openapi-generator-cli generate \
            -i docs/api/openapi-extended.yaml \
            -g typescript-fetch \
            -o src/sdk/typescript \
            --additional-properties=npmName=@biowell/api-sdk,npmVersion=1.0.0
      
      - name: Generate Python SDK
        run: |
          openapi-generator-cli generate \
            -i docs/api/openapi-extended.yaml \
            -g python \
            -o src/sdk/python \
            --additional-properties=packageName=biowell_api,packageVersion=1.0.0
      
      - name: Run API tests
        run: |
          npm run test:api
      
      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/api
          cname: docs.biowell.com
      
      - name: Create release
        if: github.ref == 'refs/heads/main'
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: api-v${{ github.run_number }}
          release_name: API Documentation v${{ github.run_number }}
          body: |
            ## API Documentation Update
            
            - Updated OpenAPI specification
            - Generated fresh SDK packages
            - Validated all endpoints
            
            View documentation: https://docs.biowell.com
          draft: false
          prerelease: false
```

## 5. Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "docs:generate": "node scripts/generate-openapi.js",
    "docs:validate": "swagger-cli validate docs/api/openapi-extended.yaml",
    "docs:build": "redoc-cli build docs/api/openapi-extended.yaml --output docs/api/index.html",
    "docs:serve": "redoc-cli serve docs/api/openapi-extended.yaml --watch",
    "docs:sdk:typescript": "openapi-generator-cli generate -i docs/api/openapi-extended.yaml -g typescript-fetch -o src/sdk/typescript",
    "docs:sdk:python": "openapi-generator-cli generate -i docs/api/openapi-extended.yaml -g python -o src/sdk/python",
    "docs:deploy": "npm run docs:generate && npm run docs:validate && npm run docs:build",
    "test:api": "jest tests/api --verbose",
    "test:docs": "npm run docs:validate && npm run test:api"
  }
}
```

## 6. Swagger UI Integration

Create `src/docs/swagger-ui.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Biowell API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
  <style>
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #48C6FF; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: './openapi-extended.yaml',
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.presets.standalone
      ],
      layout: "BaseLayout",
      theme: "light",
      tryItOutEnabled: true,
      requestInterceptor: (request) => {
        // Add auth token if available
        const token = localStorage.getItem('biowell-auth-token');
        if (token) {
          request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
      }
    });
  </script>
</body>
</html>
```

## 7. API Testing Setup

Create `tests/api/smart-coach.test.js`:

```javascript
const { BiowellAPI } = require('../../src/sdk/typescript');

describe('Smart Coach API', () => {
  let api;
  
  beforeAll(() => {
    api = new BiowellAPI({
      baseUrl: process.env.API_BASE_URL || 'http://localhost:54321/functions/v1',
      authToken: process.env.TEST_AUTH_TOKEN
    });
  });

  describe('POST /openai-chat', () => {
    test('should return personalized advice', async () => {
      const response = await api.coach.sendMessage({
        message: 'How can I improve my sleep?',
        userId: 'test-user-id'
      });

      expect(response.data.response).toBeDefined();
      expect(response.data.confidence).toBeGreaterThan(0.8);
      expect(response.data.timestamp).toBeDefined();
    });

    test('should handle missing message', async () => {
      await expect(api.coach.sendMessage({
        userId: 'test-user-id'
      })).rejects.toThrow('Message is required');
    });

    test('should require authentication', async () => {
      const unauthenticatedApi = new BiowellAPI({
        baseUrl: process.env.API_BASE_URL
      });

      await expect(unauthenticatedApi.coach.sendMessage({
        message: 'Test',
        userId: 'test-user-id'
      })).rejects.toThrow('Authentication required');
    });
  });
});
```

## 8. Documentation Quality Checks

Create `scripts/validate-docs.js`:

```javascript
const fs = require('fs');
const yaml = require('js-yaml');

const validateDocumentation = () => {
  const issues = [];
  
  try {
    // Load OpenAPI spec
    const spec = yaml.load(fs.readFileSync('docs/api/openapi-extended.yaml', 'utf8'));
    
    // Check for missing descriptions
    Object.entries(spec.paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, operation]) => {
        if (!operation.description) {
          issues.push(`Missing description: ${method.toUpperCase()} ${path}`);
        }
        
        if (!operation.examples && !operation.requestBody?.content?.['application/json']?.examples) {
          issues.push(`Missing examples: ${method.toUpperCase()} ${path}`);
        }
        
        // Check for error responses
        if (!operation.responses['400']) {
          issues.push(`Missing 400 response: ${method.toUpperCase()} ${path}`);
        }
        if (!operation.responses['401']) {
          issues.push(`Missing 401 response: ${method.toUpperCase()} ${path}`);
        }
      });
    });
    
    // Check for missing schemas
    const requiredSchemas = ['Error', 'ResponseMeta', 'Pagination'];
    requiredSchemas.forEach(schema => {
      if (!spec.components?.schemas?.[schema]) {
        issues.push(`Missing schema: ${schema}`);
      }
    });
    
    if (issues.length === 0) {
      console.log('✅ Documentation validation passed');
    } else {
      console.error('❌ Documentation validation failed:');
      issues.forEach(issue => console.error(`  - ${issue}`));
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error validating documentation:', error.message);
    process.exit(1);
  }
};

validateDocumentation();
```

## 9. Deployment Configuration

### Netlify (`netlify.toml`):

```toml
[build]
  command = "npm run docs:deploy"
  publish = "docs/api"

[[redirects]]
  from = "/api/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### Vercel (`vercel.json`):

```json
{
  "builds": [
    {
      "src": "docs/api/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/docs/api/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 10. Monitoring and Analytics

### Documentation Usage Tracking

```javascript
// Add to documentation site
const trackDocumentationUsage = () => {
  // Google Analytics for docs
  gtag('config', 'GA_MEASUREMENT_ID', {
    custom_map: {
      custom_parameter_1: 'endpoint',
      custom_parameter_2: 'method'
    }
  });
  
  // Track endpoint views
  document.querySelectorAll('[data-endpoint]').forEach(element => {
    element.addEventListener('click', (e) => {
      const endpoint = e.target.dataset.endpoint;
      const method = e.target.dataset.method;
      
      gtag('event', 'endpoint_view', {
        custom_parameter_1: endpoint,
        custom_parameter_2: method
      });
    });
  });
};
```

### API Health Monitoring

```javascript
// scripts/monitor-api-health.js
const fetch = require('node-fetch');

const endpoints = [
  { name: 'Smart Coach', path: '/openai-chat', method: 'POST' },
  { name: 'Health Metrics', path: '/health-metrics', method: 'GET' },
  { name: 'Nutrition', path: '/nutrition-analysis', method: 'POST' },
];

const monitorEndpoints = async () => {
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      const start = Date.now();
      const response = await fetch(`${process.env.API_BASE_URL}${endpoint.path}`, {
        method: 'HEAD', // Just check if endpoint is reachable
        headers: {
          'Authorization': `Bearer ${process.env.MONITOR_TOKEN}`
        }
      });
      
      const duration = Date.now() - start;
      
      results.push({
        name: endpoint.name,
        status: response.status,
        responseTime: duration,
        healthy: response.status < 500
      });
      
    } catch (error) {
      results.push({
        name: endpoint.name,
        status: 0,
        responseTime: 0,
        healthy: false,
        error: error.message
      });
    }
  }
  
  console.log('API Health Check Results:');
  results.forEach(result => {
    const status = result.healthy ? '✅' : '❌';
    console.log(`${status} ${result.name}: ${result.responseTime}ms`);
  });
  
  return results;
};

monitorEndpoints();
```

## 11. Usage Examples

### Generate Documentation

```bash
# Generate OpenAPI spec from code
npm run docs:generate

# Validate the specification
npm run docs:validate

# Build static documentation
npm run docs:build

# Serve documentation locally
npm run docs:serve

# Generate SDK packages
npm run docs:sdk:typescript
npm run docs:sdk:python

# Deploy everything
npm run docs:deploy
```

### Continuous Integration

```bash
# In your CI/CD pipeline
npm run docs:validate  # Validate spec
npm run test:api       # Test all endpoints
npm run docs:build     # Generate static docs
npm run docs:deploy    # Deploy to hosting
```

## 12. Best Practices

### Documentation Standards

1. **Always include examples** for request/response
2. **Document all error cases** with proper status codes
3. **Use consistent naming** across all endpoints
4. **Include rate limiting information**
5. **Provide SDK examples** in multiple languages

### Automation Guidelines

1. **Validate on every commit** to catch issues early
2. **Generate docs from code** to ensure accuracy
3. **Test all examples** in CI/CD pipeline
4. **Monitor documentation usage** to improve content
5. **Version documentation** alongside API changes

### Maintenance Checklist

- [ ] OpenAPI spec validates without errors
- [ ] All endpoints have examples
- [ ] Error responses are documented
- [ ] SDK generation works correctly
- [ ] Documentation deploys successfully
- [ ] All links work correctly
- [ ] Examples are tested and accurate

---

This automation setup ensures your API documentation stays **accurate**, **up-to-date**, and **comprehensive** as your API evolves! 🚀