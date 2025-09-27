# ScripTeam API Testing Guide

## Overview

This guide provides comprehensive testing strategies, tools, and examples for validating the ScripTeam API endpoints. It covers unit testing, integration testing, and end-to-end testing scenarios.

## Testing Strategy

### 1. Test Pyramid Structure

```
    /\
   /  \     E2E Tests (Few)
  /____\    Integration Tests (Some)
 /      \   Unit Tests (Many)
/________\
```

- **Unit Tests**: Test individual service functions and utilities
- **Integration Tests**: Test API endpoints with database and external services
- **E2E Tests**: Test complete user workflows from upload to practice

### 2. Test Categories

| Category | Scope | Tools | Coverage |
|----------|-------|-------|----------|
| **Unit** | Services, utilities, validation | Jest | 90%+ |
| **Integration** | API endpoints, database | Jest + Supertest | 80%+ |
| **Contract** | API specification compliance | Dredd, OpenAPI | 100% |
| **Performance** | Load, stress, endurance | Artillery, k6 | Key endpoints |
| **Security** | Auth, input validation, CORS | OWASP ZAP | Critical paths |

## Unit Testing

### Test Structure

```javascript
// Example: Script service unit tests
describe('ScriptService', () => {
  describe('createScript', () => {
    it('should create script with valid parameters', async () => {
      // Arrange
      const params = {
        title: 'Test Script',
        originalText: 'Character 1: Hello world!',
        expectedLanguage: 'en',
        fileMetadata: mockFileMetadata,
        fileUrl: 'http://example.com/script.pdf'
      };

      // Act
      const script = await scriptService.createScript(params);

      // Assert
      expect(script).toMatchObject({
        id: expect.any(String),
        title: 'Test Script',
        processingStatus: 'uploading',
        primaryLanguage: 'en'
      });
    });

    it('should throw error with invalid language', async () => {
      // Arrange
      const params = {
        title: 'Test Script',
        originalText: 'Hello world!',
        expectedLanguage: 'invalid',
        fileMetadata: mockFileMetadata,
        fileUrl: 'http://example.com/script.pdf'
      };

      // Act & Assert
      await expect(scriptService.createScript(params))
        .rejects
        .toThrow('Invalid language');
    });
  });
});
```

### Test Data Factories

```javascript
// test/factories/scriptFactory.js
export const createMockScript = (overrides = {}) => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  userId: '00000000-0000-4000-8000-000000000001',
  title: 'Test Script',
  originalText: 'Character 1: Hello\nCharacter 2: World',
  detectedLanguage: 'en',
  primaryLanguage: 'en',
  characters: [],
  uploadedAt: new Date('2025-09-27T10:30:00.000Z'),
  processingStatus: 'complete',
  fileMetadata: {
    originalName: 'test-script.pdf',
    size: 1024,
    mimeType: 'application/pdf',
    uploadedAt: new Date('2025-09-27T10:30:00.000Z')
  },
  ...overrides
});

export const createMockCharacter = (overrides = {}) => ({
  id: '456e7890-e89b-12d3-a456-426614174001',
  scriptId: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Romeo',
  aiProfile: {
    personality: ['passionate', 'impulsive'],
    age: 'young adult',
    gender: 'male',
    emotionalRange: ['love', 'anger'],
    speakingStyle: 'poetic',
    relationships: 'lover of Juliet',
    motivations: ['love', 'family honor']
  },
  voiceSettings: {
    language: 'en',
    region: 'us',
    characteristics: {
      age: 'young',
      gender: 'male',
      tone: 'passionate',
      pace: 'normal'
    },
    generatedAt: new Date('2025-09-27T10:30:00.000Z'),
    audioSamples: []
  },
  relationships: [],
  ...overrides
});
```

## Integration Testing

### API Endpoint Tests

```javascript
// test/integration/scripts.test.js
import request from 'supertest';
import app from '../../src/index.js';
import { databaseService } from '../../src/services/database.js';

describe('Scripts API', () => {
  beforeEach(async () => {
    await databaseService.clearTestData();
  });

  describe('POST /api/scripts', () => {
    it('should upload and process script successfully', async () => {
      const response = await request(app)
        .post('/api/scripts')
        .attach('file', 'test/fixtures/test-script.pdf')
        .field('title', 'Test Script')
        .field('expectedLanguage', 'en')
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        title: 'Test Script',
        processingStatus: 'uploading',
        uploadedAt: expect.any(String)
      });

      // Verify script was stored in database
      const script = await databaseService.query(
        'SELECT * FROM scripts WHERE id = $1',
        [response.body.id]
      );
      expect(script.rows).toHaveLength(1);
    });

    it('should reject files larger than 10MB', async () => {
      const response = await request(app)
        .post('/api/scripts')
        .attach('file', 'test/fixtures/large-file.pdf')
        .field('title', 'Large Script')
        .expect(413);

      expect(response.body).toMatchObject({
        error: 'File too large',
        message: 'File size must be less than 10MB'
      });
    });

    it('should enforce rate limiting', async () => {
      // Make 5 requests (the limit)
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/scripts')
          .attach('file', 'test/fixtures/test-script.pdf')
          .field('title', `Script ${i}`)
          .expect(201);
      }

      // 6th request should be rate limited
      const response = await request(app)
        .post('/api/scripts')
        .attach('file', 'test/fixtures/test-script.pdf')
        .field('title', 'Rate Limited Script')
        .expect(429);

      expect(response.body).toMatchObject({
        error: 'Too many requests',
        retryAfter: expect.any(Number)
      });

      expect(response.headers).toHaveProperty('retry-after');
    });
  });

  describe('GET /api/scripts/:id', () => {
    it('should return script details', async () => {
      // Upload script first
      const uploadResponse = await request(app)
        .post('/api/scripts')
        .attach('file', 'test/fixtures/test-script.pdf')
        .field('title', 'Test Script');

      const scriptId = uploadResponse.body.id;

      // Get script details
      const response = await request(app)
        .get(`/api/scripts/${scriptId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: scriptId,
        title: 'Test Script',
        originalText: expect.any(String),
        processingStatus: expect.any(String)
      });
    });

    it('should return 404 for non-existent script', async () => {
      const response = await request(app)
        .get('/api/scripts/999e9999-e99b-99d9-a999-999999999999')
        .expect(404);

      expect(response.body).toMatchObject({
        error: 'Script not found'
      });
    });
  });

  describe('GET /api/scripts', () => {
    it('should return user scripts', async () => {
      // Upload multiple scripts
      const script1 = await request(app)
        .post('/api/scripts')
        .attach('file', 'test/fixtures/test-script.pdf')
        .field('title', 'Script 1');

      const script2 = await request(app)
        .post('/api/scripts')
        .attach('file', 'test/fixtures/test-script.pdf')
        .field('title', 'Script 2');

      // Get all scripts
      const response = await request(app)
        .get('/api/scripts')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.map(s => s.title)).toContain('Script 1');
      expect(response.body.map(s => s.title)).toContain('Script 2');
    });
  });
});
```

### Database Integration Tests

```javascript
// test/integration/database.test.js
describe('Database Integration', () => {
  describe('Script CRUD operations', () => {
    it('should handle script lifecycle', async () => {
      // Create
      const script = await scriptService.createScript({
        title: 'Test Script',
        originalText: 'Hello world',
        expectedLanguage: 'en',
        fileMetadata: mockFileMetadata,
        fileUrl: 'http://example.com/script.pdf'
      });

      expect(script.id).toBeDefined();

      // Read
      const retrieved = await scriptService.getScript(script.id);
      expect(retrieved).toMatchObject(script);

      // Update (processing status)
      await scriptService.updateProcessingStatus(script.id, 'complete');
      const updated = await scriptService.getScript(script.id);
      expect(updated.processingStatus).toBe('complete');

      // Delete (cleanup)
      await scriptService.deleteScript(script.id);
      const deleted = await scriptService.getScript(script.id);
      expect(deleted).toBeNull();
    });

    it('should handle database connection failures gracefully', async () => {
      // Simulate database failure
      jest.spyOn(databaseService, 'query')
        .mockRejectedValueOnce(new Error('Connection failed'));

      // Should fallback to in-memory storage
      const script = await scriptService.createScript({
        title: 'Fallback Test',
        originalText: 'Hello world',
        expectedLanguage: 'en',
        fileMetadata: mockFileMetadata,
        fileUrl: 'http://example.com/script.pdf'
      });

      expect(script.id).toBeDefined();
      // Verify it's stored in memory cache
      expect(scriptService.scriptsCache.has(script.id)).toBe(true);
    });
  });
});
```

## Contract Testing

### OpenAPI Validation

```javascript
// test/contract/openapi.test.js
import SwaggerParser from '@apidevtools/swagger-parser';
import { validateResponse } from 'openapi-response-validator';

describe('OpenAPI Contract Validation', () => {
  let apiSpec;

  beforeAll(async () => {
    apiSpec = await SwaggerParser.validate('docs/architecture/api-specification.yaml');
  });

  it('should validate script upload response', async () => {
    const response = await request(app)
      .post('/api/scripts')
      .attach('file', 'test/fixtures/test-script.pdf')
      .field('title', 'Test Script');

    const validator = validateResponse(apiSpec, '/api/scripts', 'post');
    const validation = validator.validate(201, response.body);

    expect(validation.errors).toHaveLength(0);
  });

  it('should validate error responses', async () => {
    const response = await request(app)
      .post('/api/scripts')
      .field('title', 'No File Script')
      .expect(400);

    const validator = validateResponse(apiSpec, '/api/scripts', 'post');
    const validation = validator.validate(400, response.body);

    expect(validation.errors).toHaveLength(0);
  });
});
```

### Dredd API Testing

```yaml
# dredd.yml
dry-run: false
language: nodejs
server: http://localhost:3001
reporter: spec
color: true
sorted: true
names: false
only: []
hookfiles: test/contract/dredd-hooks.js
blueprints: docs/architecture/api-specification.yaml
endpoint: http://localhost:3001
```

```javascript
// test/contract/dredd-hooks.js
const hooks = require('hooks');

// Set up test data before script upload test
hooks.before('/api/scripts > POST > 201', (transaction, done) => {
  // Prepare multipart form data
  const boundary = 'test-boundary';
  const fileContent = Buffer.from('Test script content');

  const body = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="file"; filename="test.txt"',
    'Content-Type: text/plain',
    '',
    fileContent.toString(),
    `--${boundary}`,
    'Content-Disposition: form-data; name="title"',
    '',
    'Test Script',
    `--${boundary}--`,
  ].join('\r\n');

  transaction.request.body = body;
  transaction.request.headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;

  done();
});

// Validate response contains UUID
hooks.after('/api/scripts > POST > 201', (transaction, done) => {
  const response = JSON.parse(transaction.real.body);
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(response.id)) {
    transaction.fail = 'Response ID is not a valid UUID';
  }

  done();
});
```

## Performance Testing

### Load Testing with Artillery

```yaml
# test/performance/load-test.yml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 120
      arrivalRate: 10
      name: "Ramp up"
    - duration: 300
      arrivalRate: 20
      name: "Sustained load"

scenarios:
  - name: "Health check"
    weight: 20
    flow:
      - get:
          url: "/health"
          expect:
            - statusCode: 200

  - name: "Script upload and retrieval"
    weight: 60
    flow:
      - post:
          url: "/api/scripts"
          formData:
            file: "@test/fixtures/test-script.pdf"
            title: "Load Test Script {{ $randomString() }}"
          capture:
            - json: "$.id"
              as: "scriptId"
          expect:
            - statusCode: 201
      - get:
          url: "/api/scripts/{{ scriptId }}"
          expect:
            - statusCode: 200

  - name: "Get scripts list"
    weight: 20
    flow:
      - get:
          url: "/api/scripts"
          expect:
            - statusCode: 200
```

### Stress Testing

```javascript
// test/performance/stress.test.js
describe('Stress Testing', () => {
  it('should handle concurrent uploads', async () => {
    const concurrentUploads = 50;
    const uploadPromises = [];

    for (let i = 0; i < concurrentUploads; i++) {
      const promise = request(app)
        .post('/api/scripts')
        .attach('file', 'test/fixtures/test-script.pdf')
        .field('title', `Concurrent Script ${i}`)
        .timeout(10000);

      uploadPromises.push(promise);
    }

    const results = await Promise.allSettled(uploadPromises);

    // Check how many succeeded vs failed
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.status === 201);
    const rateLimited = results.filter(r => r.status === 'fulfilled' && r.value.status === 429);

    console.log(`Successful: ${successful.length}, Rate Limited: ${rateLimited.length}`);

    // At least some should succeed
    expect(successful.length).toBeGreaterThan(0);
  });

  it('should handle memory pressure', async () => {
    const initialMemory = process.memoryUsage();

    // Upload many large scripts
    for (let i = 0; i < 100; i++) {
      await request(app)
        .post('/api/scripts')
        .attach('file', 'test/fixtures/large-script.pdf')
        .field('title', `Memory Test Script ${i}`);
    }

    const finalMemory = process.memoryUsage();
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

    // Memory increase should be reasonable (less than 100MB)
    expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
  });
});
```

## Security Testing

### Input Validation Tests

```javascript
describe('Security Testing', () => {
  describe('Input Validation', () => {
    it('should prevent XSS in script titles', async () => {
      const maliciousTitle = '<script>alert("xss")</script>';

      const response = await request(app)
        .post('/api/scripts')
        .attach('file', 'test/fixtures/test-script.pdf')
        .field('title', maliciousTitle)
        .expect(201);

      // Title should be sanitized
      expect(response.body.title).not.toContain('<script>');
    });

    it('should prevent SQL injection', async () => {
      const maliciousId = "'; DROP TABLE scripts; --";

      const response = await request(app)
        .get(`/api/scripts/${maliciousId}`)
        .expect(404);

      // Should not crash the application
      expect(response.body.error).toContain('Script not found');
    });

    it('should validate file types strictly', async () => {
      const response = await request(app)
        .post('/api/scripts')
        .attach('file', 'test/fixtures/malicious.exe')
        .field('title', 'Malicious File')
        .expect(400);

      expect(response.body.error).toContain('Invalid file');
    });
  });

  describe('Rate Limiting Security', () => {
    it('should prevent DoS through rapid requests', async () => {
      const rapidRequests = Array(20).fill(null).map(() =>
        request(app).get('/health')
      );

      const results = await Promise.allSettled(rapidRequests);
      const rateLimited = results.filter(r =>
        r.status === 'fulfilled' && r.value.status === 429
      );

      // Some requests should be rate limited
      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });
});
```

### CORS Testing

```javascript
describe('CORS Security', () => {
  it('should allow requests from authorized origins', async () => {
    const response = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:5173')
      .expect(200);

    expect(response.headers['access-control-allow-origin'])
      .toBe('http://localhost:5173');
  });

  it('should reject requests from unauthorized origins', async () => {
    const response = await request(app)
      .get('/health')
      .set('Origin', 'http://malicious-site.com');

    // Should not include CORS headers for unauthorized origin
    expect(response.headers['access-control-allow-origin'])
      .toBeUndefined();
  });
});
```

## Test Fixtures and Utilities

### Test Fixtures Setup

```javascript
// test/fixtures/index.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const fixtures = {
  // PDF files
  testScript: path.join(__dirname, 'test-script.pdf'),
  largeScript: path.join(__dirname, 'large-script.pdf'),
  emptyPdf: path.join(__dirname, 'empty.pdf'),

  // Text files
  textScript: path.join(__dirname, 'test-script.txt'),
  spanishScript: path.join(__dirname, 'spanish-script.txt'),

  // Invalid files
  maliciousExe: path.join(__dirname, 'malicious.exe'),
  corruptedPdf: path.join(__dirname, 'corrupted.pdf'),

  // Helper to read fixture content
  read(filename) {
    return fs.readFileSync(path.join(__dirname, filename));
  },

  // Helper to create temporary test files
  createTempFile(content, extension = '.txt') {
    const tempFile = path.join(__dirname, `temp-${Date.now()}${extension}`);
    fs.writeFileSync(tempFile, content);
    return tempFile;
  }
};
```

### Database Test Utilities

```javascript
// test/utils/database.js
export const testDatabase = {
  async setup() {
    await databaseService.query('BEGIN');
  },

  async teardown() {
    await databaseService.query('ROLLBACK');
  },

  async clearAll() {
    await databaseService.query('DELETE FROM characters');
    await databaseService.query('DELETE FROM scripts');
  },

  async insertTestScript(overrides = {}) {
    const script = createMockScript(overrides);
    await databaseService.query(
      `INSERT INTO scripts (id, user_id, title, original_text, primary_language, processing_status, file_metadata, uploaded_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        script.id,
        script.userId,
        script.title,
        script.originalText,
        script.primaryLanguage,
        script.processingStatus,
        JSON.stringify(script.fileMetadata),
        script.uploadedAt
      ]
    );
    return script;
  }
};
```

## CI/CD Integration

### GitHub Actions Test Workflow

```yaml
# .github/workflows/api-tests.yml
name: API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: scripteam_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

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
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/scripteam_test
        REDIS_URL: redis://localhost:6379

    - name: Run contract tests
      run: npm run test:contract

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

### Test Scripts (package.json)

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:contract": "dredd",
    "test:performance": "artillery run test/performance/load-test.yml",
    "test:security": "jest --testPathPattern=security",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "npm run test:unit && npm run test:integration && npm run test:contract"
  }
}
```

## Test Reports and Monitoring

### Coverage Reports

```javascript
// jest.config.js
export default {
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.test.{js,ts}',
    '!src/**/*.spec.{js,ts}',
    '!src/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Test Monitoring

```javascript
// test/utils/metrics.js
export const testMetrics = {
  async recordTestRun(testSuite, duration, passed, failed) {
    // Send metrics to monitoring service
    await fetch('https://metrics.scripteam.bigapps.dev/test-runs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testSuite,
        duration,
        passed,
        failed,
        timestamp: new Date().toISOString()
      })
    });
  }
};
```

This comprehensive testing guide provides the foundation for ensuring API quality, reliability, and security throughout the development lifecycle.