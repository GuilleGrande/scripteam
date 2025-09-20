# Components

Based on the architectural patterns, tech stack, and data models, here are the major logical components across the fullstack architecture:

## API Gateway Component

**Responsibility:** Central coordination of all external requests, authentication, and n8n workflow orchestration

**Key Interfaces:**
- REST API endpoints for mobile client communication
- Auth0 integration for user authentication and session management
- Webhook receivers for n8n workflow completion notifications
- Rate limiting and request validation middleware

**Dependencies:** Auth0, PostgreSQL, Redis, n8n webhook system

**Technology Stack:** Express.js with TypeScript, JWT middleware, request validation, error handling, logging integration

## n8n AI Workflow Engine

**Responsibility:** Visual orchestration of all AI processing pipelines including script analysis, language detection, and voice generation

**Key Interfaces:**
- GPT-OSS integration for script analysis and character detection
- ElevenLabs Flash v2.5 API integration for voice synthesis
- Play.HT API integration for backup voice generation
- Webhook callbacks to API Gateway for completion notifications

**Dependencies:** GPT-OSS, ElevenLabs API, Play.HT API, File Storage

**Technology Stack:** n8n workflow platform with custom nodes, JavaScript functions, HTTP request nodes, webhook triggers

## GPT-OSS Processing Component

**Responsibility:** Self-hosted AI intelligence for script analysis, character profiling, and language detection

**Key Interfaces:**
- Script text analysis and character extraction
- Language detection for Spanish/English classification
- Character personality analysis and relationship mapping
- Emotional context extraction from stage directions

**Dependencies:** Hostinger VPS compute resources, processed script storage

**Technology Stack:** GPT-OSS model running on CPU inference, custom prompt engineering, result caching

## Voice Generation Pipeline

**Responsibility:** Language-specific voice synthesis for character audio samples with pre-processing optimization

**Key Interfaces:**
- ElevenLabs Flash v2.5 API for low-latency voice generation
- Play.HT Play 3.0 Mini API for backup and cost optimization
- Audio file processing and compression for mobile delivery
- CDN integration for global audio distribution

**Dependencies:** External voice APIs, File Storage, Hostinger CDN

**Technology Stack:** HTTP API clients, audio processing libraries, file compression, CDN integration

## Mobile Application Component

**Responsibility:** Cross-platform mobile interface providing practice session management and offline capability

**Key Interfaces:**
- User authentication via Auth0 social providers
- Script upload and processing status monitoring
- Real-time practice session controls with audio playback
- Offline script and audio caching for interrupted connectivity

**Dependencies:** API Gateway, Audio files via CDN, local device storage

**Technology Stack:** React Native with Expo, NativeBase UI, Zustand state management, i18next localization

## Data Persistence Component

**Responsibility:** Structured storage of user data, scripts, processing results, and session analytics

**Key Interfaces:**
- User profiles and authentication data storage
- Script content and AI analysis results
- Practice session tracking and performance analytics
- Workflow execution history and error logging

**Dependencies:** Hostinger managed PostgreSQL, Redis cache

**Technology Stack:** PostgreSQL with TypeScript ORM, Redis for session caching, database migrations
