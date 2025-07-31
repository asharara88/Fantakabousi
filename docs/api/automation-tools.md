# API Documentation Automation Tools

## Overview

This guide covers tools and strategies for automatically generating and maintaining API documentation as your Biowell API grows.

## Recommended Tools

### 1. OpenAPI/Swagger Tools

#### Swagger UI
- **Purpose:** Interactive API documentation
- **Features:** Try-it-out functionality, schema validation
- **Setup:**
```bash
npm install swagger-ui-express
```

```javascript
// server.js
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load('./docs/api/openapi.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Biowell API Documentation'
}));
```

#### Redoc
- **Purpose:** Beautiful static documentation
- **Features:** Three-panel layout, search, code samples
- **Setup:**
```bash
npx redoc-cli build docs/api/openapi.yaml --output docs/api/index.html
```

#### Swagger Codegen
- **Purpose:** Generate client SDKs
- **Features:** Multiple language support
- **Setup:**
```bash
# Generate TypeScript client
npx @openapitools/openapi-generator-cli generate \
  -i docs/api/openapi.yaml \
  -g typescript-fetch \
  -o src/sdk/typescript

# Generate Python client
npx @openapitools/openapi-generator-cli generate \
  -i docs/api/openapi.yaml \
  -g python \
  -o src/sdk/python
```

### 2. Documentation from Code

#### TSDoc/JSDoc
- **Purpose:** Generate docs from code comments
- **Features:** Type-safe documentation
- **Setup:**
```typescript
/**
 * Send a message to the AI health coach
 * @param message - The user's message
 * @param userId - User's unique identifier
 * @param sessionId - Optional chat session ID
 * @returns Promise with AI response
 * @throws {ValidationError} When required fields are missing
 * @throws {AuthenticationError} When user is not authenticated
 * @example
 * ```typescript
 * const response = await sendChatMessage(
 *   'How can I improve my sleep?',
 *   'user-123',
 *   'session-456'
 * );
 * console.log(response.response);
 * ```
 */
export async function sendChatMessage(
  message: string,
  userId: string,
  sessionId?: string
): Promise<ChatResponse> {
  // Implementation
}
```

#### TypeDoc
- **Purpose:** Generate documentation from TypeScript
- **Setup:**
```bash
npm install typedoc --save-dev
npx typedoc src/lib/api.ts --out docs/code
```

### 3. API Testing and Documentation

#### Postman
- **Purpose:** API testing and documentation
- **Features:** Collections, environments, automated testing
- **Automation:**
```bash
# Run tests and generate reports
newman run docs/api/postman-collection.json \
  --environment docs/api/postman-environment.json \
  --reporters cli,html \
  --reporter-html-export docs/api/test-report.html
```

#### Insomnia
- **Purpose:** API client with documentation features
- **Features:** GraphQL support, plugin ecosystem
- **Export:**
```bash
# Export collection for CI/CD
insomnia export --output docs/api/insomnia-workspace.json
```

### 4. Automated Documentation Generation

#### GitHub Actions Workflow

```yaml
# .github/workflows/docs.yml
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
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate OpenAPI spec from code
        run: |
          npx swagger-jsdoc -d swaggerDef.js -o docs/api/openapi.yaml src/**/*.ts
      
      - name: Generate Redoc documentation
        run: |
          npx redoc-cli build docs/api/openapi.yaml --output docs/api/index.html
      
      - name: Generate TypeScript SDK
        run: |
          npx @openapitools/openapi-generator-cli generate \
            -i docs/api/openapi.yaml \
            -g typescript-fetch \
            -o src/sdk/typescript
      
      - name: Run API tests
        run: |
          newman run docs/api/postman-collection.json \
            --environment docs/api/postman-environment.json \
            --reporters cli,html \
            --reporter-html-export docs/api/test-report.html
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/api
```

### 5. Documentation Hosting

#### GitHub Pages
```bash
# Enable GitHub Pages for docs
git checkout --orphan gh-pages
git rm -rf .
echo "API Documentation" > index.html
git add index.html
git commit -m "Initial docs"
git push origin gh-pages
```

#### Netlify
```toml
# netlify.toml
[build]
  command = "npm run build:docs"
  publish = "docs/api"

[[redirects]]
  from = "/api/*"
  to = "/index.html"
  status = 200
```

#### Vercel
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
  ]
}
```

## Advanced Automation

### 1. Schema Validation

```javascript
// validate-api-schema.js
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs';
import YAML from 'yamljs';

const ajv = new Ajv();
addFormats(ajv);

const schema = YAML.load('./docs/api/openapi.yaml');
const validate = ajv.compile(schema);

// Validate API responses against schema
export const validateResponse = (endpoint, response) => {
  const endpointSchema = schema.paths[endpoint]?.responses?.['200']?.content?.['application/json']?.schema;
  
  if (!endpointSchema) {
    throw new Error(`No schema found for ${endpoint}`);
  }
  
  const valid = validate(response);
  if (!valid) {
    console.error('Validation errors:', validate.errors);
    return false;
  }
  
  return true;
};
```

### 2. Documentation Linting

```javascript
// lint-docs.js
import { lint } from '@apidevtools/swagger-parser';

const lintApiDocs = async () => {
  try {
    await lint('./docs/api/openapi.yaml');
    console.log('✅ API documentation is valid');
  } catch (error) {
    console.error('❌ API documentation errors:', error);
    process.exit(1);
  }
};

lintApiDocs();
```

### 3. Changelog Generation

```javascript
// generate-changelog.js
import { execSync } from 'child_process';
import fs from 'fs';

const generateChangelog = () => {
  const commits = execSync('git log --oneline --since="1 month ago"', { encoding: 'utf8' });
  const lines = commits.trim().split('\n');
  
  const changelog = {
    version: process.env.npm_package_version,
    date: new Date().toISOString().split('T')[0],
    changes: {
      added: [],
      changed: [],
      fixed: [],
      removed: []
    }
  };
  
  lines.forEach(line => {
    if (line.includes('feat:')) changelog.changes.added.push(line);
    if (line.includes('fix:')) changelog.changes.fixed.push(line);
    if (line.includes('refactor:')) changelog.changes.changed.push(line);
    if (line.includes('remove:')) changelog.changes.removed.push(line);
  });
  
  fs.writeFileSync('./docs/api/CHANGELOG.json', JSON.stringify(changelog, null, 2));
};

generateChangelog();
```

### 4. Performance Monitoring

```javascript
// monitor-api-performance.js
import { performance } from 'perf_hooks';

export const monitorEndpoint = (endpoint) => {
  return async (req, res, next) => {
    const start = performance.now();
    
    res.on('finish', () => {
      const duration = performance.now() - start;
      
      // Log performance metrics
      console.log({
        endpoint,
        method: req.method,
        statusCode: res.statusCode,
        duration: `${duration.toFixed(2)}ms`,
        timestamp: new Date().toISOString()
      });
      
      // Alert if response time is too high
      if (duration > 5000) {
        console.warn(`⚠️ Slow response: ${endpoint} took ${duration.toFixed(2)}ms`);
      }
    });
    
    next();
  };
};
```

## Documentation Best Practices

### 1. Versioning Strategy

```yaml
# Version in OpenAPI spec
openapi: 3.0.3
info:
  version: "1.2.0"
  
# URL versioning
servers:
  - url: https://api.biowell.com/v1
  - url: https://api.biowell.com/v2
```

### 2. Breaking Change Detection

```javascript
// detect-breaking-changes.js
import { diff } from 'swagger-diff';

const detectBreakingChanges = async () => {
  const oldSpec = './docs/api/openapi-v1.yaml';
  const newSpec = './docs/api/openapi.yaml';
  
  const differences = await diff(oldSpec, newSpec);
  
  const breakingChanges = differences.filter(change => 
    change.type === 'breaking'
  );
  
  if (breakingChanges.length > 0) {
    console.error('❌ Breaking changes detected:');
    breakingChanges.forEach(change => {
      console.error(`- ${change.action}: ${change.path}`);
    });
    process.exit(1);
  }
  
  console.log('✅ No breaking changes detected');
};
```

### 3. Documentation Quality Checks

```javascript
// quality-checks.js
const checkDocumentationQuality = (spec) => {
  const issues = [];
  
  // Check for missing descriptions
  Object.entries(spec.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, operation]) => {
      if (!operation.description) {
        issues.push(`Missing description: ${method.toUpperCase()} ${path}`);
      }
      
      if (!operation.examples && !operation.requestBody?.content?.['application/json']?.examples) {
        issues.push(`Missing examples: ${method.toUpperCase()} ${path}`);
      }
    });
  });
  
  // Check for missing error responses
  Object.entries(spec.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, operation]) => {
      if (!operation.responses['400']) {
        issues.push(`Missing 400 response: ${method.toUpperCase()} ${path}`);
      }
      if (!operation.responses['401']) {
        issues.push(`Missing 401 response: ${method.toUpperCase()} ${path}`);
      }
    });
  });
  
  return issues;
};
```

## Integration with Development Workflow

### 1. Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "docs/api/**/*.yaml": [
      "swagger-parser validate",
      "redoc-cli build --output docs/api/index.html"
    ],
    "src/**/*.ts": [
      "swagger-jsdoc -d swaggerDef.js -o docs/api/openapi.yaml"
    ]
  }
}
```

### 2. API Contract Testing

```javascript
// contract-tests.js
import { Pact } from '@pact-foundation/pact';

const provider = new Pact({
  consumer: 'Biowell Frontend',
  provider: 'Biowell API',
  port: 1234,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'INFO'
});

describe('AI Coach API Contract', () => {
  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());

  test('should return AI response for valid message', async () => {
    await provider.addInteraction({
      state: 'user is authenticated',
      uponReceiving: 'a request for AI advice',
      withRequest: {
        method: 'POST',
        path: '/openai-chat',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token'
        },
        body: {
          message: 'How can I improve my sleep?',
          userId: 'user-123'
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          response: 'Based on your sleep data...',
          timestamp: '2025-01-30T12:00:00Z',
          confidence: 0.94
        }
      }
    });

    const response = await api.aiCoach.sendMessage({
      message: 'How can I improve my sleep?',
      userId: 'user-123'
    });

    expect(response.response).toBeDefined();
    expect(response.confidence).toBeGreaterThan(0.8);
  });
});
```

### 3. Documentation Deployment Pipeline

```yaml
# .github/workflows/deploy-docs.yml
name: Deploy API Documentation

on:
  push:
    branches: [main]
    paths: ['docs/api/**', 'src/**/*.ts']

jobs:
  deploy-docs:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Validate OpenAPI spec
        run: npx swagger-parser validate docs/api/openapi.yaml
      
      - name: Generate documentation
        run: |
          # Generate Redoc HTML
          npx redoc-cli build docs/api/openapi.yaml --output docs/api/index.html
          
          # Generate SDK
          npx @openapitools/openapi-generator-cli generate \
            -i docs/api/openapi.yaml \
            -g typescript-fetch \
            -o docs/sdk/typescript
      
      - name: Run API tests
        run: |
          newman run docs/api/postman-collection.json \
            --environment docs/api/postman-environment.json \
            --reporters cli,html \
            --reporter-html-export docs/api/test-report.html
      
      - name: Deploy to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 sync docs/api s3://biowell-api-docs --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
      
      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'API documentation updated: https://docs.api.biowell.com'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## Monitoring and Analytics

### 1. Documentation Usage Analytics

```javascript
// analytics.js
export const trackDocumentationUsage = () => {
  // Google Analytics for docs site
  gtag('config', 'GA_MEASUREMENT_ID', {
    custom_map: {
      custom_parameter_1: 'endpoint',
      custom_parameter_2: 'method'
    }
  });
  
  // Track API endpoint views
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

### 2. API Usage Metrics

```javascript
// api-metrics.js
export const trackAPIUsage = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Send metrics to analytics service
    analytics.track('api_request', {
      endpoint: req.path,
      method: req.method,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
  });
  
  next();
};
```

## Documentation Maintenance

### 1. Automated Updates

```javascript
// update-docs.js
import { execSync } from 'child_process';
import fs from 'fs';

const updateDocumentation = () => {
  // Update version in OpenAPI spec
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const openApiSpec = YAML.load('./docs/api/openapi.yaml');
  
  openApiSpec.info.version = packageJson.version;
  
  fs.writeFileSync('./docs/api/openapi.yaml', YAML.stringify(openApiSpec));
  
  // Regenerate documentation
  execSync('npx redoc-cli build docs/api/openapi.yaml --output docs/api/index.html');
  
  // Update Postman collection
  execSync('postman-to-openapi docs/api/postman-collection.json > docs/api/openapi-from-postman.yaml');
  
  console.log('✅ Documentation updated successfully');
};
```

### 2. Quality Assurance

```javascript
// qa-checks.js
const runQualityChecks = () => {
  const checks = [
    checkForMissingExamples,
    checkForMissingErrorResponses,
    checkForOutdatedVersions,
    validateSchemaConsistency,
    checkForBrokenLinks
  ];
  
  const results = checks.map(check => {
    try {
      return { name: check.name, passed: check(), errors: [] };
    } catch (error) {
      return { name: check.name, passed: false, errors: [error.message] };
    }
  });
  
  const failed = results.filter(r => !r.passed);
  
  if (failed.length > 0) {
    console.error('❌ Documentation quality checks failed:');
    failed.forEach(check => {
      console.error(`- ${check.name}: ${check.errors.join(', ')}`);
    });
    process.exit(1);
  }
  
  console.log('✅ All documentation quality checks passed');
};
```

## Tool Recommendations by Use Case

### For Small Teams (1-5 developers)
- **OpenAPI + Swagger UI** for interactive docs
- **Postman** for testing and collaboration
- **GitHub Pages** for hosting
- **Manual updates** with validation

### For Medium Teams (5-20 developers)
- **OpenAPI + Redoc** for beautiful docs
- **Insomnia** for advanced API testing
- **Netlify/Vercel** for hosting with CI/CD
- **Automated generation** from code comments

### For Large Teams (20+ developers)
- **Full automation pipeline** with GitHub Actions
- **Multiple documentation formats** (Swagger UI + Redoc)
- **Contract testing** with Pact
- **Dedicated documentation site** with search
- **Analytics and monitoring** for usage insights

## Getting Started Checklist

- [ ] Choose documentation format (OpenAPI recommended)
- [ ] Set up basic API documentation structure
- [ ] Configure automated generation pipeline
- [ ] Add validation and quality checks
- [ ] Set up hosting and deployment
- [ ] Implement usage tracking
- [ ] Train team on documentation workflow
- [ ] Establish review process for API changes

---

For questions about documentation automation, contact the development team or check our [GitHub repository](https://github.com/biowell/api-docs).