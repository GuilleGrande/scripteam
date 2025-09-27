# ScripTeam API Developer Guide

## Overview

The ScripTeam API provides a comprehensive set of endpoints for building AI-powered acting practice applications. This guide covers implementation details, best practices, and examples for integrating with the API.

## Quick Start

### 1. Base URLs
- **Development**: `http://localhost:3001`
- **Production**: `https://api.scripteam.bigapps.dev`
- **Staging**: `https://staging.api.scripteam.bigapps.dev`

### 2. Health Check
Always start by verifying API connectivity:

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-09-27T10:30:00.000Z"
}
```

### 3. Upload Your First Script

```bash
curl -X POST http://localhost:3001/api/scripts \
  -F "file=@script.pdf" \
  -F "title=My First Script" \
  -F "expectedLanguage=en"
```

## Authentication

**Current Status**: Authentication is in development. All endpoints currently use a demo user for testing.

**Future Implementation**: JWT-based authentication with support for:
- Auth0 integration
- Google OAuth
- Apple Sign-In
- Institutional SSO

## Rate Limiting

### Limits
- **General API**: 100 requests per minute per IP
- **File Uploads**: 5 uploads per minute per IP

### Headers
All responses include rate limiting headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2025-09-27T10:31:00.000Z
```

### Handling Rate Limits
When you hit the rate limit (HTTP 429), the response includes a `Retry-After` header:

```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Try again in 45 seconds.",
  "retryAfter": 45
}
```

## Core Workflows

### 1. Script Upload and Processing

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Storage
    participant AI

    Client->>API: POST /api/scripts (file)
    API->>Storage: Store file
    API->>AI: Start processing (async)
    API-->>Client: 201 Created (script metadata)

    Note over AI: Background processing
    AI->>AI: Extract text
    AI->>AI: Detect language
    AI->>AI: Analyze characters
    AI->>AI: Generate voices

    Client->>API: GET /api/scripts/{id}
    API-->>Client: Script with processing status
```

#### Implementation Example

```javascript
// Upload script
const uploadScript = async (file, title, language = 'auto') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('expectedLanguage', language);

  const response = await fetch('/api/scripts', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};

// Poll for processing completion
const waitForProcessing = async (scriptId) => {
  const maxAttempts = 30;
  const delay = 2000; // 2 seconds

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const script = await fetch(`/api/scripts/${scriptId}`).then(r => r.json());

    if (script.processingStatus === 'complete') {
      return script;
    }

    if (script.processingStatus === 'error') {
      throw new Error('Script processing failed');
    }

    await new Promise(resolve => setTimeout(resolve, delay));
  }

  throw new Error('Processing timeout');
};
```

### 2. Character Detection (Planned - Story 2.2)

```javascript
// Get detected characters
const getCharacters = async (scriptId) => {
  const response = await fetch(`/api/scripts/${scriptId}/characters`);

  if (response.status === 501) {
    throw new Error('Character detection not yet implemented');
  }

  return await response.json();
};
```

### 3. Voice Generation (Planned - Story 2.3)

```javascript
// Generate voices for characters
const generateVoices = async (scriptId, settings = {}) => {
  const response = await fetch(`/api/scripts/${scriptId}/voices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      provider: 'auto',
      voiceSettings: {
        region: 'us',
        quality: 'standard',
        cacheAudio: true,
        ...settings
      }
    })
  });

  return await response.json();
};

// Get voice preview
const getVoicePreview = async (characterId, text = null) => {
  const url = new URL(`/api/voices/${characterId}/preview`, window.location.origin);
  if (text) {
    url.searchParams.set('text', text);
  }

  const response = await fetch(url);

  if (response.ok) {
    return await response.blob(); // Audio file
  }

  throw new Error('Failed to get voice preview');
};
```

### 4. Practice Sessions (Planned - Story 2.4)

```javascript
// Start practice session
const startPracticeSession = async (scriptId, config) => {
  const response = await fetch(`/api/scripts/${scriptId}/practice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sceneId: config.sceneId,
      userCharacter: config.userCharacter,
      familiarityLevel: config.familiarityLevel,
      practiceMode: 'guided',
      voiceSettings: {
        playbackSpeed: 1.0,
        volume: 0.8
      }
    })
  });

  return await response.json();
};
```

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "error": "Error type",
  "message": "Human-readable description",
  "code": "ERROR_CODE",
  "timestamp": "2025-09-27T10:30:00.000Z",
  "requestId": "req_123456"
}
```

### Common HTTP Status Codes

| Status | Meaning | Action |
|--------|---------|---------|
| 200 | Success | Continue |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request parameters |
| 404 | Not Found | Resource doesn't exist |
| 413 | Payload Too Large | Reduce file size (max 10MB) |
| 422 | Unprocessable Entity | File is empty or corrupted |
| 429 | Too Many Requests | Wait and retry (see Retry-After header) |
| 500 | Internal Server Error | Retry or contact support |
| 501 | Not Implemented | Feature is planned but not available |

### Error Handling Best Practices

```javascript
const handleApiError = async (response) => {
  if (!response.ok) {
    const error = await response.json();

    switch (response.status) {
      case 429:
        // Rate limited - wait and retry
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
        throw new RateLimitError(error.message, retryAfter);

      case 413:
        // File too large
        throw new FileSizeError('File must be less than 10MB');

      case 422:
        // Unprocessable file
        throw new FileFormatError('Could not extract text from file');

      case 501:
        // Feature not implemented
        throw new NotImplementedError(error.message);

      default:
        throw new ApiError(error.message, response.status);
    }
  }

  return response;
};
```

## File Upload Guidelines

### Supported Formats
- **PDF**: Any PDF with extractable text
- **TXT**: Plain text files in UTF-8 encoding

### File Size Limits
- Maximum: 10MB per file
- Recommended: Under 5MB for faster processing

### File Validation

```javascript
const validateFile = (file) => {
  // Check file type
  const allowedTypes = ['application/pdf', 'text/plain'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only PDF and TXT files are allowed');
  }

  // Check file size
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File size must be less than 10MB');
  }

  // Check filename
  if (!file.name || file.name.trim() === '') {
    throw new Error('File must have a valid name');
  }

  return true;
};
```

## Response Caching

### Cache Headers
The API includes appropriate cache headers for static resources:

```http
Cache-Control: public, max-age=3600
ETag: "abc123"
Last-Modified: Wed, 27 Sep 2025 10:30:00 GMT
```

### Client-Side Caching Strategy

```javascript
// Cache script metadata for 5 minutes
const getCachedScript = (() => {
  const cache = new Map();
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  return async (scriptId) => {
    const cached = cache.get(scriptId);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const script = await fetch(`/api/scripts/${scriptId}`).then(r => r.json());

    cache.set(scriptId, {
      data: script,
      timestamp: Date.now()
    });

    return script;
  };
})();
```

## Development & Testing

### Local Development Setup

```bash
# Start API server
docker-compose up -d

# Verify all services are running
curl http://localhost:3001/health
curl http://localhost:5432  # PostgreSQL
curl http://localhost:6379  # Redis
```

### Testing Endpoints

```bash
# Test script upload
curl -X POST http://localhost:3001/api/scripts \
  -F "file=@test-script.pdf" \
  -F "title=Test Script" \
  -F "expectedLanguage=en"

# Test script retrieval
curl http://localhost:3001/api/scripts

# Test specific script
curl http://localhost:3001/api/scripts/{script-id}
```

### Environment Variables

```bash
# API Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/scripteam

# AI Services (for future implementation)
ELEVENLABS_API_KEY=your_key_here
PLAYHT_API_KEY=your_key_here

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB
```

## SDK and Libraries

### JavaScript/TypeScript SDK (Planned)

```bash
npm install @scripteam/sdk
```

```javascript
import { ScripTeamClient } from '@scripteam/sdk';

const client = new ScripTeamClient({
  baseUrl: 'https://api.scripteam.bigapps.dev',
  apiKey: 'your-api-key' // Future authentication
});

// Upload and process script
const script = await client.scripts.upload(file, {
  title: 'My Script',
  expectedLanguage: 'en'
});

// Wait for processing
const processed = await client.scripts.waitForProcessing(script.id);

// Get characters
const characters = await client.characters.list(script.id);
```

## Webhooks (Planned)

### Processing Complete Webhook

```json
{
  "event": "script.processing.complete",
  "scriptId": "123e4567-e89b-12d3-a456-426614174000",
  "timestamp": "2025-09-27T10:30:00.000Z",
  "data": {
    "processingStatus": "complete",
    "charactersDetected": 3,
    "voicesGenerated": 3,
    "estimatedDuration": 45
  }
}
```

### Webhook Verification

```javascript
const verifyWebhook = (payload, signature, secret) => {
  const crypto = require('crypto');
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

## Performance Optimization

### Request Optimization
- Use compression for large payloads
- Implement request deduplication
- Cache frequently accessed data
- Use HTTP/2 when available

### File Upload Optimization
- Implement chunked uploads for large files
- Show upload progress to users
- Validate files before uploading
- Compress files when possible

### Polling Best Practices
- Use exponential backoff for retries
- Implement circuit breakers
- Set reasonable timeouts
- Cache polling results

## Support and Resources

### Documentation
- **OpenAPI Spec**: `/docs/architecture/api-specification.yaml`
- **Postman Collection**: Available on request
- **GraphQL Schema**: Planned for future release

### Community
- **GitHub Issues**: Report bugs and feature requests
- **Discord**: Community discussion and support
- **Stack Overflow**: Tag questions with `scripteam-api`

### Contact
- **Email**: api-support@scripteam.bigapps.dev
- **Slack**: #api-support channel
- **Phone**: Available for enterprise customers

---

*This guide is updated regularly. Check the GitHub repository for the latest version.*