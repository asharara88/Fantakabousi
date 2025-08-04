const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Biowell API',
      version: '1.0.0',
      description: `
# Biowell API Documentation

Comprehensive health and wellness platform API providing AI-powered coaching,
biometric tracking, nutrition analysis, and personalized recommendations.

## Features

- **Smart Coach**: AI-powered health guidance with personalized recommendations
- **Health Metrics**: Real-time biometric data tracking and trend analysis  
- **Nutrition Analysis**: Food logging with glucose impact and health scoring
- **Text-to-Speech**: Voice synthesis for AI responses
- **Recipe Search**: Health-optimized meal recommendations
- **Supplement Management**: Evidence-based supplement stack optimization

## Authentication

All endpoints require JWT authentication via Supabase. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer your-jwt-token
\`\`\`

## Rate Limits

- **Smart Coach**: 20 requests per minute
- **Nutrition Analysis**: 50 requests per minute  
- **Text-to-Speech**: 30 requests per minute
- **General Endpoints**: 100 requests per minute

## Error Handling

All errors follow a consistent format with appropriate HTTP status codes and detailed error information.

## Support

For API support, contact: api@biowell.com
      `,
      contact: {
        name: 'Biowell API Support',
        email: 'api@biowell.com',
        url: 'https://docs.biowell.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://your-project.supabase.co/functions/v1',
        description: 'Production server'
      },
      {
        url: 'https://your-staging-project.supabase.co/functions/v1',
        description: 'Staging server'
      },
      {
        url: 'http://localhost:54321/functions/v1',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Supabase JWT token obtained through authentication'
        }
      }
    },
    security: [{ BearerAuth: [] }],
    tags: [
      {
        name: 'Smart Coach',
        description: 'AI-powered health coaching endpoints',
        externalDocs: {
          description: 'Smart Coach Guide',
          url: 'https://docs.biowell.com/smart-coach'
        }
      },
      {
        name: 'Health Metrics',
        description: 'Biometric data tracking and retrieval'
      },
      {
        name: 'Nutrition',
        description: 'Food logging and nutrition analysis'
      },
      {
        name: 'Text-to-Speech',
        description: 'Voice synthesis for AI responses'
      },
      {
        name: 'Recipes',
        description: 'Recipe search and recommendations'
      }
    ]
  },
  apis: [
    './supabase/functions/*/index.ts',
    './src/lib/api.ts',
    './docs/api/schemas.yaml'
  ],
};

const generateDocumentation = () => {
  try {
    console.log('🔄 Generating OpenAPI specification...');
    
    // Generate OpenAPI spec
    const specs = swaggerJSDoc(options);
    
    // Enhance with additional metadata
    specs.info.version = process.env.npm_package_version || '1.0.0';
    specs.info['x-generated-at'] = new Date().toISOString();
    specs.info['x-generator'] = 'swagger-jsdoc';
    
    // Add custom extensions
    specs['x-biowell-config'] = {
      environment: process.env.NODE_ENV || 'development',
      features: [
        'smart-coach',
        'health-metrics',
        'nutrition-analysis',
        'text-to-speech',
        'recipe-search'
      ]
    };
    
    // Write JSON version
    const jsonPath = path.join(__dirname, '../docs/api/openapi-generated.json');
    fs.writeFileSync(jsonPath, JSON.stringify(specs, null, 2));
    
    // Write YAML version
    const yamlPath = path.join(__dirname, '../docs/api/openapi-generated.yaml');
    fs.writeFileSync(yamlPath, yaml.dump(specs, { indent: 2 }));
    
    console.log('✅ OpenAPI specification generated successfully');
    console.log(`📄 JSON: ${jsonPath}`);
    console.log(`📄 YAML: ${yamlPath}`);
    
    // Validate the generated spec
    validateSpec(specs);
    
  } catch (error) {
    console.error('❌ Error generating OpenAPI specification:', error);
    process.exit(1);
  }
};

const validateSpec = (spec) => {
  const issues = [];
  
  // Check required fields
  if (!spec.info.title) issues.push('Missing API title');
  if (!spec.info.version) issues.push('Missing API version');
  if (!spec.info.description) issues.push('Missing API description');
  
  // Check paths
  if (!spec.paths || Object.keys(spec.paths).length === 0) {
    issues.push('No API paths defined');
  }
  
  // Check security
  if (!spec.security || spec.security.length === 0) {
    issues.push('No security schemes defined');
  }
  
  if (issues.length > 0) {
    console.warn('⚠️  Documentation validation warnings:');
    issues.forEach(issue => console.warn(`   - ${issue}`));
  } else {
    console.log('✅ Documentation validation passed');
  }
};

// Generate changelog entry
const generateChangelog = () => {
  const version = process.env.npm_package_version || '1.0.0';
  const date = new Date().toISOString().split('T')[0];
  
  const changelogEntry = `
## [${version}] - ${date}

### Added
- Smart Coach chat endpoints with personalized recommendations
- Health metrics tracking with device integration
- Nutrition analysis with glucose impact calculations
- Text-to-speech integration for AI responses
- Recipe search with health optimization scoring

### Changed
- Improved error handling and response formats
- Enhanced authentication flow
- Updated rate limiting policies

### Security
- JWT token validation
- Input sanitization
- CORS configuration
- Rate limiting implementation
`;

  const changelogPath = path.join(__dirname, '../docs/api/CHANGELOG.md');
  
  if (fs.existsSync(changelogPath)) {
    const existingChangelog = fs.readFileSync(changelogPath, 'utf8');
    fs.writeFileSync(changelogPath, changelogEntry + '\n' + existingChangelog);
  } else {
    fs.writeFileSync(changelogPath, `# Changelog\n${changelogEntry}`);
  }
  
  console.log('📝 Changelog updated');
};

// Run generation
if (require.main === module) {
  generateDocumentation();
  generateChangelog();
}

module.exports = { generateDocumentation, validateSpec };