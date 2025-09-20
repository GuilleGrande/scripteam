# ScripTeam Fullstack Architecture Document

## Introduction

This document outlines the complete fullstack architecture for **ScripTeam**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

### Starter Template or Existing Project

**Greenfield project** leveraging modern AI-first architecture patterns. Key strategic decisions:

- **GPT-OSS integration** for self-hosted script analysis and character generation
- **Hostinger AI VPS + n8n** for rapid MVP development and AI workflow orchestration
- **React Native + Expo** for cross-platform mobile development
- **Hybrid AI approach** combining self-hosted intelligence with external voice synthesis APIs

### Core Architectural Constraint: Hybrid AI Processing Strategy

The fundamental architectural decision driving this design is the **hybrid AI processing approach** that balances innovation, cost control, and development speed:

**Self-Hosted AI (GPT-OSS via n8n):**
- Script analysis and character detection
- Emotional context mapping and relationship analysis
- Character avatar generation with unique ScripTeam style
- Complete data privacy for educational market

**External AI APIs:**
- Voice synthesis (ElevenLabs/Play.HT) for premium audio quality
- Fallback services for redundancy and cost optimization

**Pre-Processing Pipeline:**
- All AI analysis and voice generation occur before practice sessions
- Ensures <2 second response times during practice (audio playback vs. real-time synthesis)
- Enables offline practice capability once content is processed and cached
- Controls costs through batch processing and intelligent caching

**Solopreneur-Optimized Infrastructure:**
- Docker containerization ensures development/production parity and reliable deployments
- Hostinger AI VPS with Docker Compose orchestration reduces operational complexity
- n8n containerized workflows with visual builder accelerate AI pipeline development
- Container isolation and resource management minimize operational overhead
- Clear scaling path through container orchestration as revenue grows

This approach creates **proprietary AI capabilities** that competitors cannot easily replicate while maintaining sustainable costs and rapid development velocity.

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-09-20 | v1.0 | Initial fullstack architecture with Hostinger + n8n approach | Winston (Architect) |

## High Level Architecture

### Technical Summary

ScripTeam implements a **hybrid cloud architecture** optimized for AI-powered voice practice applications. The system combines **self-hosted GPT-OSS intelligence** running on Hostinger AI VPS with **n8n workflow orchestration** for rapid development, while leveraging **external voice synthesis APIs** for premium audio quality. The **React Native + Expo** frontend provides cross-platform mobile access with offline capabilities, supported by a **Node.js backend** that coordinates AI processing pipelines and real-time practice sessions.

The architecture achieves PRD goals through **pre-processing AI workflows** that analyze scripts, generate character voices, and create visual assets before practice sessions begin, ensuring responsive user experience while controlling variable AI costs. **PostgreSQL + Redis** provide robust data persistence and caching, while the **monorepo structure** enables shared TypeScript interfaces and rapid iteration across the full stack.

### Platform and Infrastructure Choice

**Selected Platform:** Hostinger AI VPS + n8n Workflow Orchestration

**Key Services:**
- **Hostinger AI VPS** (12 cores, 32GB RAM) - Docker container host with Docker Compose orchestration
- **Containerized n8n** - Visual AI workflow orchestration and GPT-OSS integration in isolated container
- **Containerized GPT-OSS** - Self-hosted AI processing with dedicated resource allocation
- **ElevenLabs/Play.HT APIs** - External voice synthesis services
- **Docker Network** - Internal service communication with nginx reverse proxy
- **Hostinger CDN** - Global content delivery for audio files and static assets

**Deployment Host and Regions:**
- **Primary:** Hostinger EU data centers (GDPR compliance)
- **CDN:** Global edge locations for optimal mobile app performance

**Rationale:** This containerized platform choice balances rapid development (Docker development parity), cost efficiency ($65/month vs $2000+ for AWS GPU), operational reliability (container isolation), and technical capabilities while maintaining clear scaling path through container orchestration as the business grows.

### Repository Structure

**Structure:** Monorepo with workspaces for shared code and AI workflow definitions

**Monorepo Tool:** npm workspaces with Docker Compose for service orchestration

**Package Organization:**
- Frontend and backend applications as separate workspaces with individual Dockerfiles
- Shared TypeScript interfaces for data models and API contracts
- n8n workflow definitions version-controlled and mounted into containers
- Docker Compose configuration for service orchestration
- Common utilities and configuration shared across all packages

### High Level Architecture Diagram

```mermaid
graph TB
    subgraph "Mobile Apps"
        A[React Native App]
        B[Expo Go Development]
    end

    subgraph "Hostinger AI VPS - Docker Network"
        subgraph "Docker Containers"
            C[API Container<br/>Node.js + Express]
            D[n8n Container<br/>Workflow Engine]
            E[GPT-OSS Container<br/>AI Processing]
            F[PostgreSQL Container<br/>Database]
            G[Redis Container<br/>Cache]
            NX[Nginx Container<br/>Reverse Proxy]
        end
        H[Docker Volumes<br/>File Storage]
    end

    subgraph "External AI Services"
        I[ElevenLabs API]
        J[Play.HT API]
    end

    subgraph "Content Delivery"
        K[Hostinger CDN]
    end

    A -->|HTTPS| NX
    NX -->|Load Balance| C
    C -->|HTTP| D
    D -->|HTTP| E
    D -->|Voice Synthesis| I
    D -->|Backup Voice| J
    C -->|SQL| F
    C -->|Cache| G
    C -->|Files| H
    H -->|Audio Delivery| K
    K -->|Cached Content| A

    style D fill:#e1f5fe
    style E fill:#f3e5f5
    style I fill:#fff3e0
    style J fill:#fff3e0
    style NX fill:#f1f8e9
```

### Architectural Patterns

- **Event-Driven AI Processing:** n8n workflows orchestrate complex AI pipelines with automatic retry and error handling - _Rationale:_ Visual workflow management reduces development complexity while providing robust error handling for AI service integration

- **Hybrid AI Architecture:** Self-hosted analysis combined with external voice synthesis APIs - _Rationale:_ Balances competitive advantages (proprietary script analysis) with practical constraints (voice quality and development speed)

- **Pre-Processing Pipeline Pattern:** All AI-intensive operations completed before user practice sessions - _Rationale:_ Ensures responsive UX while controlling variable AI costs through batch processing

- **Component-Based Mobile UI:** React Native components with progressive script familiarity levels - _Rationale:_ Enables sophisticated practice experience with shared codebase across iOS and Android platforms

- **Containerized Microservices:** Docker containers for each service with nginx reverse proxy - _Rationale:_ Provides service isolation, resource management, and reliable deployments while maintaining monolithic simplicity

- **API Gateway Pattern:** Single Node.js endpoint orchestrating n8n workflows and external services - _Rationale:_ Simplifies mobile app integration while providing centralized authentication and rate limiting

- **Caching-First Data Strategy:** Multi-layer caching from Redis to CDN for AI-generated content - _Rationale:_ Minimizes API costs and latency while supporting offline practice capability

## Tech Stack

This is the **DEFINITIVE technology selection** for the entire project based on our Hostinger + n8n hybrid AI approach. This table serves as the single source of truth - all development must use these exact versions.

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.0+ | Type-safe mobile development | Shared interfaces between frontend/backend, reduces AI integration bugs |
| Frontend Framework | React Native | 0.72+ | Cross-platform mobile apps | Single codebase for iOS/Android, extensive AI/audio library support |
| Mobile Platform | Expo | SDK 49+ | Rapid development & deployment | Over-the-air updates, simplified native module integration |
| UI Component Library | NativeBase | 3.4+ | Consistent mobile components | Accessibility-first, customizable, reduces development time |
| State Management | Zustand | 4.4+ | Lightweight state management | Simple API, perfect for mobile, no Redux complexity |
| Backend Language | TypeScript | 5.0+ | Full-stack type safety | Shared types with frontend, robust API development |
| Backend Framework | Express.js | 4.18+ | Node.js web framework | Fast development, extensive middleware ecosystem |
| AI Workflow Engine | n8n | 1.0+ | Visual AI workflow orchestration | Hostinger-managed, reduces AI pipeline development time |
| AI Processing | GPT-OSS | Latest | Self-hosted script analysis | Proprietary capabilities, data privacy, cost control |
| API Style | REST + Webhooks | - | HTTP APIs + n8n integration | Simple mobile integration, n8n webhook support |
| Database | PostgreSQL | 15+ | Primary data storage | Robust relational data, JSON support, Hostinger managed |
| Cache | Redis | 7.0+ | Session & AI result caching | Fast data access, AI response caching, Hostinger managed |
| File Storage | Hostinger Storage | - | Audio files & scripts | Integrated with CDN, cost-effective, EU compliance |
| Authentication | Auth0 | - | User authentication & SSO | Educational institution SSO, GDPR compliant, full OAuth support |
| Voice Synthesis | ElevenLabs Flash v2.5 | v1 (Base Tier) | Primary voice generation | 75ms latency, Spain Spanish support, cost-effective MVP |
| Voice Synthesis Backup | Play.HT Play 3.0 Mini | Latest | Cost optimization & redundancy | 143ms latency, multilingual fallback service |
| Language Detection | GPT-OSS + Language Models | Latest | Script language identification | Custom Spanish/English detection, privacy-first |
| Internationalization | i18next + react-i18next | Latest | Mobile app localization | Spanish/English UI translation |
| Frontend Testing | Jest + React Native Testing Library | Latest | Mobile component testing | Standard RN testing, accessibility testing |
| Backend Testing | Jest + Supertest | Latest | API endpoint testing | Simple setup, n8n workflow testing |
| E2E Testing | Detox | 20+ | Mobile end-to-end testing | React Native focused, real device testing, full automation |
| Build Tool | Expo CLI | Latest | Mobile app building | Integrated with React Native, OTA updates |
| Bundler | Metro | 0.76+ | React Native bundling | Default RN bundler, optimized performance |
| IaC Tool | Docker Compose | Latest | Container orchestration | Development/production parity, reliable deployments |
| CI/CD | GitHub Actions | - | Automated testing & deployment | Free tier, Expo integration, Detox automation |
| Monitoring | Sentry | - | Error tracking & performance | Mobile error tracking, AI workflow monitoring |
| Logging | Winston | 3.8+ | Structured application logging | Node.js standard, n8n integration |
| CSS Framework | NativeBase Theme | 3.4+ | Mobile-first styling | Consistent mobile design, accessibility support |

## Data Models

Based on the PRD requirements and the hybrid AI processing approach with comprehensive language support, here are the core data models that will be shared between frontend and backend:

### User

**Purpose:** Core user entity for authentication, progress tracking, and subscription management with Spanish/English language preferences

**Key Attributes:**
- id: string (UUID) - Unique user identifier
- email: string - Primary authentication credential
- authProvider: string - Auth0 provider (email, google, apple, institutional)
- profile: UserProfile - Extended user information
- subscription: SubscriptionTier - Current subscription level (free, premium, institutional)
- preferences: UserPreferences - Application settings including language and voice preferences
- createdAt: Date - Account creation timestamp
- lastActiveAt: Date - Last activity for engagement tracking

```typescript
interface User {
  id: string;
  email: string;
  authProvider: 'auth0' | 'google' | 'apple' | 'institutional';
  profile: UserProfile;
  subscription: SubscriptionTier;
  preferences: UserPreferences;
  createdAt: Date;
  lastActiveAt: Date;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  institution?: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  practiceGoals: string[];
  preferredLanguage: 'es' | 'en'; // Primary app language
}

interface UserPreferences {
  language: 'es' | 'en'; // App interface language
  voiceSettings: {
    playbackSpeed: number;
    volume: number;
    preferredVoiceGender: 'male' | 'female' | 'any';
    accentPreference: 'spain' | 'mexico' | 'us' | 'uk'; // Regional accent preference
  };
  practiceSettings: {
    defaultFamiliarityLevel: FamiliarityLevel;
    autoProgressDifficulty: boolean;
    practiceReminders: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReaderOptimized: boolean;
  };
}
```

### Script

**Purpose:** Uploaded script content with AI analysis results, processing status, and strict language detection

**Key Attributes:**
- id: string (UUID) - Unique script identifier
- userId: string - Owner reference
- title: string - Script title (extracted or user-provided)
- originalText: string - Raw uploaded script content
- detectedLanguage: string - GPT-OSS language detection result
- primaryLanguage: string - Confirmed language for voice generation
- processedContent: ProcessedScript - AI analysis results
- characters: Character[] - Detected characters with language-appropriate AI profiles
- uploadedAt: Date - Upload timestamp
- processingStatus: ProcessingStatus - Current AI processing state
- fileMetadata: FileMetadata - Original file information

```typescript
interface Script {
  id: string;
  userId: string;
  title: string;
  originalText: string;
  detectedLanguage: 'es' | 'en' | 'mixed' | 'unknown';
  primaryLanguage: 'es' | 'en'; // User-confirmed language for voice generation
  processedContent?: ProcessedScript;
  characters: Character[];
  uploadedAt: Date;
  processingStatus: ProcessingStatus;
  fileMetadata: FileMetadata;
}

interface ProcessedScript {
  scenes: Scene[];
  relationships: CharacterRelationship[];
  emotionalContext: EmotionalContext[];
  practiceMetadata: {
    estimatedDuration: number;
    difficultyLevel: number;
    recommendedSkillLevel: string;
    languageComplexity: number; // Language-specific complexity scoring
  };
}

interface Scene {
  id: string;
  title: string;
  startLine: number;
  endLine: number;
  characters: string[];
  dialogue: DialogueLine[];
  stageDirections: string[];
}

interface DialogueLine {
  id: string;
  character: string;
  text: string;
  lineNumber: number;
  emotionalTone?: string;
  stagingNotes?: string;
  languageNotes?: string; // Spanish-specific pronunciation or dialect notes
}

type ProcessingStatus = 'uploading' | 'analyzing' | 'language_detection' | 'generating_voices' | 'generating_avatars' | 'complete' | 'error';
```

### Character

**Purpose:** AI-detected characters with language-appropriate generated voices and visual representations

**Key Attributes:**
- id: string (UUID) - Unique character identifier
- scriptId: string - Associated script reference
- name: string - Character name from script
- aiProfile: CharacterProfile - AI-generated personality analysis
- voiceSettings: VoiceProfile - Generated voice characteristics with language matching
- avatar: CharacterAvatar - AI-generated visual representation
- relationships: CharacterRelationship[] - Character relationship analysis

```typescript
interface Character {
  id: string;
  scriptId: string;
  name: string;
  aiProfile: CharacterProfile;
  voiceSettings: VoiceProfile;
  avatar?: CharacterAvatar;
  relationships: CharacterRelationship[];
}

interface CharacterProfile {
  personality: string[];
  age: string;
  gender: string;
  emotionalRange: string[];
  speakingStyle: string;
  relationships: string;
  motivations: string[];
  culturalContext?: string; // Spanish/English cultural context
}

interface VoiceProfile {
  elevenLabsVoiceId?: string;
  playHtVoiceId?: string;
  language: 'es' | 'en'; // Must match script primary language
  region: 'spain' | 'mexico' | 'us' | 'uk'; // Regional accent
  characteristics: {
    age: 'young' | 'middle' | 'older';
    gender: 'male' | 'female' | 'neutral';
    tone: 'authoritative' | 'gentle' | 'energetic' | 'melancholic' | 'neutral';
    pace: 'slow' | 'normal' | 'fast';
  };
  generatedAt: Date;
  audioSamples: AudioSample[];
}

interface CharacterAvatar {
  imageUrl: string;
  style: 'realistic' | 'artistic' | 'minimal';
  culturalStyle?: 'spanish' | 'english' | 'neutral'; // Cultural appearance matching
  generatedAt: Date;
  prompt: string;
}

interface AudioSample {
  id: string;
  url: string;
  text: string;
  language: 'es' | 'en'; // Audio language
  duration: number;
  sceneId?: string;
  cached: boolean;
}
```

### PracticeSession

**Purpose:** User practice session tracking with performance analytics, progress measurement, and language-specific metrics

```typescript
interface PracticeSession {
  id: string;
  userId: string;
  scriptId: string;
  selectedCharacter: string;
  familiarityLevel: FamiliarityLevel;
  sessionLanguage: 'es' | 'en'; // Language of the practice session
  sessionData: SessionData;
  duration: number;
  startedAt: Date;
  completedAt?: Date;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
}

interface SessionData {
  scenesCompleted: string[];
  totalLines: number;
  userLines: number;
  accuracyMetrics: {
    timingAccuracy: number;
    lineAccuracy: number;
    overallConfidence: number;
    pronunciationAccuracy?: number; // Spanish pronunciation tracking
  };
  difficultyProgression: {
    startLevel: FamiliarityLevel;
    endLevel: FamiliarityLevel;
    progressionTriggers: string[];
  };
  voiceInteractions: VoiceInteraction[];
}

interface VoiceInteraction {
  lineId: string;
  userAudio?: string;
  aiAudioPlayed: string;
  timing: {
    expectedDuration: number;
    actualDuration: number;
    responseLatency: number;
  };
  userFeedback?: 'good' | 'too_fast' | 'too_slow' | 'repeat';
}

type FamiliarityLevel = 'first_read' | 'know_some_lines' | 'know_most_lines' | 'know_all_lines';
```

### n8nWorkflow

**Purpose:** Track AI workflow executions with language-specific processing and transparent debugging

```typescript
interface n8nWorkflow {
  id: string;
  workflowType: WorkflowType;
  relatedEntityId: string;
  language?: 'es' | 'en'; // Language context for workflow
  inputData: Record<string, any>;
  outputData?: Record<string, any>;
  status: WorkflowStatus;
  startedAt: Date;
  completedAt?: Date;
  executionTime?: number;
  errorDetails?: string;
  retryCount: number;
}

type WorkflowType =
  | 'script_analysis'
  | 'language_detection'
  | 'character_detection'
  | 'voice_generation_es'
  | 'voice_generation_en'
  | 'avatar_generation'
  | 'batch_processing';

type WorkflowStatus = 'queued' | 'running' | 'completed' | 'failed' | 'retrying';
```

**Relationships:**
- **User → Scripts:** One-to-many with language preference influence
- **Script → Characters:** One-to-many with language-matched voice generation
- **User → PracticeSessions:** One-to-many with language-specific analytics
- **Script → PracticeSessions:** One-to-many with language consistency validation
- **Character → AudioSamples:** One-to-many with strict language matching

## API Specification

Based on the REST + Webhooks API style from our Tech Stack, here's the comprehensive API specification for ScripTeam's fullstack architecture:

### REST API Specification

```yaml
openapi: 3.0.0
info:
  title: ScripTeam API
  version: 1.0.0
  description: AI-powered acting practice platform API with Spanish/English language support
servers:
  - url: https://api.scripteam.com
    description: Production server
  - url: https://staging-api.scripteam.com
    description: Staging server

paths:
  /auth/login:
    post:
      summary: User authentication via Auth0
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                password:
                  type: string
                provider:
                  type: string
                  enum: [auth0, google, apple, institutional]
      responses:
        '200':
          description: Authentication successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                  user:
                    $ref: '#/components/schemas/User'

  /scripts:
    post:
      summary: Upload and analyze script
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                title:
                  type: string
                expectedLanguage:
                  type: string
                  enum: [es, en, auto]
      responses:
        '201':
          description: Script uploaded successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Script'
        '400':
          description: Invalid file or unsupported language
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /scripts/{scriptId}/process:
    post:
      summary: Trigger AI processing workflow via n8n
      security:
        - bearerAuth: []
      parameters:
        - name: scriptId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                confirmLanguage:
                  type: string
                  enum: [es, en]
                voicePreferences:
                  type: object
                  properties:
                    region:
                      type: string
                      enum: [spain, mexico, us, uk]
      responses:
        '202':
          description: Processing started
          content:
            application/json:
              schema:
                type: object
                properties:
                  workflowId:
                    type: string
                  estimatedDuration:
                    type: number

  /scripts/{scriptId}/characters:
    get:
      summary: Get processed characters with voice profiles
      security:
        - bearerAuth: []
      parameters:
        - name: scriptId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Characters retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Character'

  /practice/sessions:
    post:
      summary: Start practice session
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                scriptId:
                  type: string
                selectedCharacter:
                  type: string
                familiarityLevel:
                  type: string
                  enum: [first_read, know_some_lines, know_most_lines, know_all_lines]
      responses:
        '201':
          description: Practice session started
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PracticeSession'

  /webhooks/n8n/workflow-complete:
    post:
      summary: n8n workflow completion webhook
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                workflowId:
                  type: string
                workflowType:
                  type: string
                status:
                  type: string
                  enum: [completed, failed]
                outputData:
                  type: object
                errorDetails:
                  type: string
      responses:
        '200':
          description: Webhook processed successfully

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        email:
          type: string
        profile:
          $ref: '#/components/schemas/UserProfile'
        preferences:
          $ref: '#/components/schemas/UserPreferences'

    UserProfile:
      type: object
      properties:
        firstName:
          type: string
        lastName:
          type: string
        institution:
          type: string
        skillLevel:
          type: string
          enum: [beginner, intermediate, advanced]
        preferredLanguage:
          type: string
          enum: [es, en]

    UserPreferences:
      type: object
      properties:
        language:
          type: string
          enum: [es, en]
        voiceSettings:
          type: object
          properties:
            playbackSpeed:
              type: number
            volume:
              type: number
            accentPreference:
              type: string
              enum: [spain, mexico, us, uk]

    Script:
      type: object
      properties:
        id:
          type: string
        title:
          type: string
        detectedLanguage:
          type: string
          enum: [es, en, mixed, unknown]
        primaryLanguage:
          type: string
          enum: [es, en]
        processingStatus:
          type: string
          enum: [uploading, analyzing, language_detection, generating_voices, generating_avatars, complete, error]

    Character:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        aiProfile:
          $ref: '#/components/schemas/CharacterProfile'
        voiceSettings:
          $ref: '#/components/schemas/VoiceProfile'

    CharacterProfile:
      type: object
      properties:
        personality:
          type: array
          items:
            type: string
        age:
          type: string
        gender:
          type: string
        speakingStyle:
          type: string

    VoiceProfile:
      type: object
      properties:
        language:
          type: string
          enum: [es, en]
        region:
          type: string
          enum: [spain, mexico, us, uk]
        elevenLabsVoiceId:
          type: string
        characteristics:
          type: object

    PracticeSession:
      type: object
      properties:
        id:
          type: string
        scriptId:
          type: string
        selectedCharacter:
          type: string
        sessionLanguage:
          type: string
          enum: [es, en]
        status:
          type: string
          enum: [active, paused, completed, abandoned]

    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: object
        timestamp:
          type: string
        requestId:
          type: string
```

## Components

Based on the architectural patterns, tech stack, and data models, here are the major logical components across the fullstack architecture:

### API Gateway Component

**Responsibility:** Central coordination of all external requests, authentication, and n8n workflow orchestration

**Key Interfaces:**
- REST API endpoints for mobile client communication
- Auth0 integration for user authentication and session management
- Webhook receivers for n8n workflow completion notifications
- Rate limiting and request validation middleware

**Dependencies:** Auth0, PostgreSQL, Redis, n8n webhook system

**Technology Stack:** Express.js with TypeScript, JWT middleware, request validation, error handling, logging integration

### n8n AI Workflow Engine

**Responsibility:** Visual orchestration of all AI processing pipelines including script analysis, language detection, and voice generation

**Key Interfaces:**
- GPT-OSS integration for script analysis and character detection
- ElevenLabs Flash v2.5 API integration for voice synthesis
- Play.HT API integration for backup voice generation
- Webhook callbacks to API Gateway for completion notifications

**Dependencies:** GPT-OSS, ElevenLabs API, Play.HT API, File Storage

**Technology Stack:** n8n workflow platform with custom nodes, JavaScript functions, HTTP request nodes, webhook triggers

### GPT-OSS Processing Component

**Responsibility:** Self-hosted AI intelligence for script analysis, character profiling, and language detection

**Key Interfaces:**
- Script text analysis and character extraction
- Language detection for Spanish/English classification
- Character personality analysis and relationship mapping
- Emotional context extraction from stage directions

**Dependencies:** Hostinger VPS compute resources, processed script storage

**Technology Stack:** GPT-OSS model running on CPU inference, custom prompt engineering, result caching

### Voice Generation Pipeline

**Responsibility:** Language-specific voice synthesis for character audio samples with pre-processing optimization

**Key Interfaces:**
- ElevenLabs Flash v2.5 API for low-latency voice generation
- Play.HT Play 3.0 Mini API for backup and cost optimization
- Audio file processing and compression for mobile delivery
- CDN integration for global audio distribution

**Dependencies:** External voice APIs, File Storage, Hostinger CDN

**Technology Stack:** HTTP API clients, audio processing libraries, file compression, CDN integration

### Mobile Application Component

**Responsibility:** Cross-platform mobile interface providing practice session management and offline capability

**Key Interfaces:**
- User authentication via Auth0 social providers
- Script upload and processing status monitoring
- Real-time practice session controls with audio playback
- Offline script and audio caching for interrupted connectivity

**Dependencies:** API Gateway, Audio files via CDN, local device storage

**Technology Stack:** React Native with Expo, NativeBase UI, Zustand state management, i18next localization

### Data Persistence Component

**Responsibility:** Structured storage of user data, scripts, processing results, and session analytics

**Key Interfaces:**
- User profiles and authentication data storage
- Script content and AI analysis results
- Practice session tracking and performance analytics
- Workflow execution history and error logging

**Dependencies:** Hostinger managed PostgreSQL, Redis cache

**Technology Stack:** PostgreSQL with TypeScript ORM, Redis for session caching, database migrations

## Docker Architecture

ScripTeam leverages Docker containerization for development/production parity, reliable deployments, and service isolation while maintaining the cost-effective Hostinger VPS approach:

### Container Strategy

**Development Benefits:**
- `docker-compose up` creates identical environment locally
- No more "works on my machine" deployment issues
- Isolated services with proper resource allocation
- Easy database resets and workflow testing

**Production Benefits:**
- One-command deployment with zero-downtime updates
- Container health checks and automatic restarts
- Resource limits prevent service interference
- Volume persistence for data and AI models

### Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  # API Gateway Container
  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    container_name: scripteam-api
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/scripteam
      - REDIS_URL=redis://redis:6379
      - N8N_BASE_URL=http://n8n:5678
      - GPT_OSS_URL=http://gpt-oss:8080
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      n8n:
        condition: service_started
    volumes:
      - upload_data:/app/uploads
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'

  # n8n Workflow Engine Container
  n8n:
    image: n8nio/n8n:latest
    container_name: scripteam-n8n
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=postgres
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_AUTH_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_AUTH_PASSWORD}
      - WEBHOOK_URL=https://api.scripteam.com
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - n8n_data:/home/node/.n8n
      - ./n8n-workflows:/import:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5678/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '2.0'

  # GPT-OSS AI Processing Container
  gpt-oss:
    build:
      context: ./infrastructure/gpt-oss
      dockerfile: Dockerfile
    container_name: scripteam-gpt-oss
    environment:
      - MODEL_PATH=/models/gpt-oss
      - MAX_TOKENS=2048
      - TEMPERATURE=0.7
      - WORKERS=2
    volumes:
      - gpt_models:/models
      - gpt_cache:/cache
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 60s
      timeout: 30s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 16G
          cpus: '8.0'
        reservations:
          memory: 8G
          cpus: '4.0'

  # PostgreSQL Database Container
  postgres:
    image: postgres:15-alpine
    container_name: scripteam-postgres
    environment:
      - POSTGRES_DB=scripteam
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=C --lc-ctype=C
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./apps/api/database/init.sql:/docker-entrypoint-initdb.d/01-init.sql
      - ./apps/api/database/extensions.sql:/docker-entrypoint-initdb.d/02-extensions.sql
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d scripteam"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '2.0'

  # Redis Cache Container
  redis:
    image: redis:7-alpine
    container_name: scripteam-redis
    volumes:
      - redis_data:/data
      - ./infrastructure/redis/redis.conf:/etc/redis/redis.conf
    command: redis-server /etc/redis/redis.conf
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'

  # Nginx Reverse Proxy Container
  nginx:
    image: nginx:alpine
    container_name: scripteam-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infrastructure/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./infrastructure/nginx/ssl:/etc/nginx/ssl:ro
      - upload_data:/var/www/uploads:ro
      - ./infrastructure/nginx/logs:/var/log/nginx
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  n8n_data:
    driver: local
  gpt_models:
    driver: local
  gpt_cache:
    driver: local
  upload_data:
    driver: local

networks:
  default:
    name: scripteam_network
    driver: bridge
```

### Container Specifications

#### API Container (Node.js)

```dockerfile
# apps/api/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Build application
RUN npm run build

FROM node:18-alpine AS runtime

WORKDIR /app

# Install production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/packages/shared ./packages/shared

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S scripteam -u 1001

# Create directories and set permissions
RUN mkdir -p /app/uploads /app/logs && \
    chown -R scripteam:nodejs /app

USER scripteam

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]
```

#### GPT-OSS Container

```dockerfile
# infrastructure/gpt-oss/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/
COPY models/ ./models/

# Create non-root user
RUN adduser --disabled-password --gecos '' --uid 1001 scripteam

# Create directories and set permissions
RUN mkdir -p /models /cache && \
    chown -R scripteam:scripteam /app /models /cache

USER scripteam

EXPOSE 8080

HEALTHCHECK --interval=60s --timeout=30s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["python", "src/server.py"]
```

### Container Network Architecture

```mermaid
graph TB
    subgraph "Docker Host - Hostinger VPS"
        subgraph "scripteam_network (bridge)"
            subgraph "External Access"
                NX[nginx:443/80<br/>Reverse Proxy]
            end

            subgraph "Application Layer"
                API[api:3000<br/>Node.js API]
                N8N[n8n:5678<br/>Workflow Engine]
            end

            subgraph "AI Processing"
                GPT[gpt-oss:8080<br/>AI Analysis]
            end

            subgraph "Data Layer"
                PG[postgres:5432<br/>Database]
                RD[redis:6379<br/>Cache]
            end
        end

        subgraph "Docker Volumes"
            V1[postgres_data]
            V2[n8n_data]
            V3[gpt_models]
            V4[upload_data]
            V5[redis_data]
        end
    end

    NX --> API
    NX --> N8N
    API --> PG
    API --> RD
    API --> N8N
    N8N --> GPT
    N8N --> PG

    PG -.-> V1
    N8N -.-> V2
    GPT -.-> V3
    API -.-> V4
    RD -.-> V5

    style NX fill:#f1f8e9
    style API fill:#e3f2fd
    style N8N fill:#e1f5fe
    style GPT fill:#f3e5f5
    style PG fill:#fff3e0
    style RD fill:#ffebee
```

### Resource Allocation Strategy

**Hostinger VPS (12 cores, 32GB RAM) Resource Distribution:**

| Container | CPU Limit | Memory Limit | Purpose |
|-----------|-----------|--------------|---------|
| GPT-OSS | 8 cores | 16GB | AI model inference requires most resources |
| PostgreSQL | 2 cores | 4GB | Database with sufficient memory for caching |
| n8n | 2 cores | 2GB | Workflow orchestration with moderate needs |
| API | 1 core | 1GB | Lightweight Node.js application |
| Redis | 0.5 cores | 1GB | Fast cache with minimal CPU needs |
| Nginx | 0.5 cores | 512MB | Reverse proxy with minimal overhead |
| **Total** | **14 cores** | **24.5GB** | **Buffer for system overhead** |

### Development Workflow Integration

#### Local Development

```bash
# Development environment with hot reload
# docker-compose.dev.yml
version: '3.8'

services:
  api:
    build:
      context: ./apps/api
      target: development
    volumes:
      - ./apps/api:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev

  # Mock GPT-OSS for faster local development
  gpt-oss-mock:
    image: wiremock/wiremock:latest
    ports:
      - "8080:8080"
    volumes:
      - ./infrastructure/mocks:/home/wiremock
```

#### Production Deployment

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Starting ScripTeam deployment..."

# Pull latest changes
git pull origin main

# Build and start containers
docker-compose down
docker-compose pull
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
docker-compose exec api npm run health-check
docker-compose exec postgres pg_isready -U postgres

# Run database migrations
echo "📊 Running database migrations..."
docker-compose exec api npm run db:migrate

# Import n8n workflows
echo "🔄 Importing n8n workflows..."
docker-compose exec n8n n8n import:workflow --input=/import

# Verify deployment
echo "✅ Verifying deployment..."
curl -f https://api.scripteam.com/health || exit 1

echo "🎉 Deployment completed successfully!"
```

### File Storage & CDN Component

**Responsibility:** Secure storage and global delivery of audio files, scripts, and character avatars

**Key Interfaces:**
- Audio file upload and compression for voice samples
- Script PDF and text file storage with encryption
- Character avatar image storage and optimization
- CDN distribution for low-latency global access

**Dependencies:** Hostinger storage infrastructure, CDN network

**Technology Stack:** Hostinger file storage, CDN integration, file compression, security encryption

### Component Diagrams

```mermaid
graph TB
    subgraph "Mobile Application"
        MA[React Native App]
        MS[Zustand State]
        MC[Audio Cache]
    end

    subgraph "API Layer"
        AG[API Gateway]
        AU[Auth0]
    end

    subgraph "AI Processing Pipeline"
        N8N[n8n Workflows]
        GPT[GPT-OSS]
        EL[ElevenLabs API]
        PH[Play.HT API]
    end

    subgraph "Data Layer"
        PG[PostgreSQL]
        RD[Redis Cache]
        FS[File Storage]
        CDN[Hostinger CDN]
    end

    MA -->|REST API| AG
    AG -->|User Auth| AU
    AG -->|Trigger Workflows| N8N
    AG -->|Data Queries| PG
    AG -->|Session Cache| RD

    N8N -->|Script Analysis| GPT
    N8N -->|Voice Generation| EL
    N8N -->|Backup Voice| PH
    N8N -->|Store Results| PG
    N8N -->|Cache Audio| FS

    FS -->|Global Delivery| CDN
    CDN -->|Audio Files| MC

    MS -->|Local State| MA
    MC -->|Offline Practice| MA

    style N8N fill:#e1f5fe
    style GPT fill:#f3e5f5
    style EL fill:#fff3e0
    style PH fill:#fff3e0
```

## Core Workflows

The following sequence diagrams illustrate key system workflows combining frontend user interactions, backend API coordination, and AI processing pipelines:

### Script Upload and AI Processing Workflow

```mermaid
sequenceDiagram
    participant User as Mobile User
    participant App as React Native App
    participant API as API Gateway
    participant N8N as n8n Workflows
    participant GPT as GPT-OSS
    participant EL as ElevenLabs API
    participant DB as PostgreSQL
    participant CDN as Hostinger CDN

    User->>App: Upload script file (PDF/TXT)
    App->>API: POST /scripts (multipart/form-data)
    API->>DB: Store script metadata
    API->>App: Script uploaded (processing queued)
    App->>User: Show "AI Magic Revelation" loading

    API->>N8N: Trigger script analysis workflow
    N8N->>GPT: Analyze script for characters
    GPT->>N8N: Character list + personalities
    N8N->>DB: Store character analysis

    N8N->>GPT: Detect script language
    GPT->>N8N: Language: 'es' (Spanish)
    N8N->>DB: Update script language

    User->>App: Confirm language selection
    App->>API: POST /scripts/{id}/process
    API->>N8N: Trigger voice generation workflow

    N8N->>EL: Generate Spanish voices for characters
    EL->>N8N: Audio files for each character
    N8N->>CDN: Store audio files
    N8N->>DB: Update processing status: complete

    N8N->>API: Webhook: workflow complete
    API->>App: Push notification: processing done
    App->>User: Show character selection screen
```

### Practice Session Workflow

```mermaid
sequenceDiagram
    participant User as Mobile User
    participant App as React Native App
    participant API as API Gateway
    participant DB as PostgreSQL
    participant CDN as Hostinger CDN
    participant Cache as Local Audio Cache

    User->>App: Select character & familiarity level
    App->>API: POST /practice/sessions
    API->>DB: Create practice session record
    API->>App: Session started with audio URLs

    App->>CDN: Download character audio files
    CDN->>Cache: Cache audio locally
    Cache->>App: Audio ready for offline play

    User->>App: Start scene practice
    App->>Cache: Play AI character audio
    Cache->>User: Audio playback (75ms latency)

    User->>App: Speak user lines
    App->>App: Record timing metrics
    App->>Cache: Play next AI character response

    User->>App: Complete scene
    App->>API: POST session analytics
    API->>DB: Store performance metrics
    API->>App: Progress updates & recommendations
    App->>User: Session completion + skill progression
```

### Language Error Handling Workflow

```mermaid
sequenceDiagram
    participant User as Mobile User
    participant App as React Native App
    participant API as API Gateway
    participant N8N as n8n Workflows
    participant GPT as GPT-OSS

    User->>App: Upload mixed language script
    App->>API: POST /scripts (expectedLanguage: auto)
    API->>N8N: Trigger language detection
    N8N->>GPT: Analyze script language
    GPT->>N8N: Result: 'mixed' (Spanish + English)
    N8N->>API: Language detection complete

    API->>App: Language selection required
    App->>User: Show language choice dialog
    User->>App: Select "Spanish" as primary
    App->>API: POST /scripts/{id}/process (confirmLanguage: es)

    API->>N8N: Trigger Spanish voice generation
    N8N->>N8N: Validate language consistency
    N8N->>API: Error: English sections detected
    API->>App: Language mismatch error
    App->>User: Show error: "Script contains English dialogue"

    User->>App: Choose to edit script or accept Spanish-only
    App->>User: Provide editing guidance or continue
```

## Database Schema

Based on our PostgreSQL selection and the comprehensive data models, here's the concrete database schema implementation:

```sql
-- Core user authentication and profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    auth_provider VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    institution VARCHAR(255),
    skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    practice_goals TEXT[],
    preferred_language VARCHAR(2) CHECK (preferred_language IN ('es', 'en'))
);

CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    language VARCHAR(2) CHECK (language IN ('es', 'en')),
    voice_settings JSONB DEFAULT '{}',
    practice_settings JSONB DEFAULT '{}',
    accessibility JSONB DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Script storage with language detection
CREATE TABLE scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    original_text TEXT NOT NULL,
    detected_language VARCHAR(10) CHECK (detected_language IN ('es', 'en', 'mixed', 'unknown')),
    primary_language VARCHAR(2) CHECK (primary_language IN ('es', 'en')),
    processing_status VARCHAR(20) DEFAULT 'uploading',
    file_metadata JSONB DEFAULT '{}',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE processed_scripts (
    script_id UUID PRIMARY KEY REFERENCES scripts(id) ON DELETE CASCADE,
    scenes JSONB NOT NULL DEFAULT '[]',
    relationships JSONB DEFAULT '[]',
    emotional_context JSONB DEFAULT '[]',
    practice_metadata JSONB DEFAULT '{}',
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Character analysis and voice profiles
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    ai_profile JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE voice_profiles (
    character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
    elevenlabs_voice_id VARCHAR(100),
    playht_voice_id VARCHAR(100),
    language VARCHAR(2) CHECK (language IN ('es', 'en')),
    region VARCHAR(10) CHECK (region IN ('spain', 'mexico', 'us', 'uk')),
    characteristics JSONB DEFAULT '{}',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE character_avatars (
    character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    style VARCHAR(20) CHECK (style IN ('realistic', 'artistic', 'minimal')),
    cultural_style VARCHAR(20) CHECK (cultural_style IN ('spanish', 'english', 'neutral')),
    prompt TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audio_samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    text TEXT NOT NULL,
    language VARCHAR(2) CHECK (language IN ('es', 'en')),
    duration INTEGER, -- milliseconds
    scene_id UUID,
    cached BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Practice session tracking
CREATE TABLE practice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
    selected_character VARCHAR(255) NOT NULL,
    familiarity_level VARCHAR(20) CHECK (familiarity_level IN ('first_read', 'know_some_lines', 'know_most_lines', 'know_all_lines')),
    session_language VARCHAR(2) CHECK (session_language IN ('es', 'en')),
    duration INTEGER DEFAULT 0, -- seconds
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE session_data (
    session_id UUID PRIMARY KEY REFERENCES practice_sessions(id) ON DELETE CASCADE,
    scenes_completed TEXT[],
    total_lines INTEGER DEFAULT 0,
    user_lines INTEGER DEFAULT 0,
    accuracy_metrics JSONB DEFAULT '{}',
    difficulty_progression JSONB DEFAULT '{}',
    voice_interactions JSONB DEFAULT '[]',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI workflow tracking
CREATE TABLE n8n_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_type VARCHAR(30) NOT NULL,
    related_entity_id UUID NOT NULL,
    language VARCHAR(2) CHECK (language IN ('es', 'en')),
    input_data JSONB DEFAULT '{}',
    output_data JSONB,
    status VARCHAR(20) DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'retrying')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    execution_time INTEGER, -- milliseconds
    error_details TEXT,
    retry_count INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_scripts_user_id ON scripts(user_id);
CREATE INDEX idx_scripts_language ON scripts(primary_language);
CREATE INDEX idx_characters_script_id ON characters(script_id);
CREATE INDEX idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_script_id ON practice_sessions(script_id);
CREATE INDEX idx_n8n_workflows_status ON n8n_workflows(status);
CREATE INDEX idx_n8n_workflows_type ON n8n_workflows(workflow_type);
CREATE INDEX idx_audio_samples_character_id ON audio_samples(character_id);
CREATE INDEX idx_audio_samples_language ON audio_samples(language);

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users SET last_active_at = CURRENT_TIMESTAMP WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_active
    AFTER INSERT ON practice_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_last_active();
```

## Frontend Architecture

The React Native frontend is designed around the voice-first practice experience with progressive script familiarity and multilingual support:

### Component Architecture

#### Component Organization

```
apps/mobile/src/
├── components/           # Reusable UI components
│   ├── common/          # Basic UI elements (Button, Input, Modal)
│   ├── practice/        # Practice session specific components
│   ├── script/          # Script display and management
│   └── character/       # Character selection and voice preview
├── screens/             # Full screen components
│   ├── auth/           # Authentication flows
│   ├── dashboard/      # Main navigation hub
│   ├── practice/       # Practice session screens
│   ├── progress/       # Analytics and progression
│   └── settings/       # User preferences and account
├── services/           # API communication layer
│   ├── api/           # REST API clients
│   ├── auth/          # Auth0 integration
│   ├── audio/         # Audio playback and caching
│   └── storage/       # Local storage management
├── hooks/             # Custom React hooks
│   ├── useAuth.ts     # Authentication state
│   ├── useAudio.ts    # Audio playback control
│   ├── useScript.ts   # Script processing state
│   └── usePractice.ts # Practice session management
├── stores/            # Zustand state management
│   ├── authStore.ts   # User authentication state
│   ├── scriptStore.ts # Script and character data
│   ├── practiceStore.ts # Active session state
│   └── settingsStore.ts # User preferences
├── types/             # Shared TypeScript interfaces
│   ├── api.ts         # API response types
│   ├── practice.ts    # Practice session types
│   └── user.ts        # User and preference types
└── utils/             # Helper functions
    ├── audio.ts       # Audio processing utilities
    ├── i18n.ts        # Internationalization setup
    └── validation.ts  # Form validation helpers
```

#### Component Template

```typescript
import React from 'react';
import { Box, Text } from 'native-base';
import { useTranslation } from 'react-i18next';

interface ScriptDisplayProps {
  script: ProcessedScript;
  familiarityLevel: FamiliarityLevel;
  currentLine: number;
  onLineSelect: (lineNumber: number) => void;
}

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({
  script,
  familiarityLevel,
  currentLine,
  onLineSelect
}) => {
  const { t } = useTranslation();

  const getLineOpacity = (lineNumber: number) => {
    switch (familiarityLevel) {
      case 'first_read': return 1.0;
      case 'know_some_lines': return lineNumber === currentLine ? 1.0 : 0.6;
      case 'know_most_lines': return lineNumber === currentLine ? 1.0 : 0.3;
      case 'know_all_lines': return lineNumber === currentLine ? 1.0 : 0.0;
      default: return 1.0;
    }
  };

  return (
    <Box flex={1} padding={4}>
      {script.scenes.map((scene) => (
        <Box key={scene.id} marginBottom={6}>
          <Text fontSize="lg" fontWeight="bold" marginBottom={2}>
            {scene.title}
          </Text>
          {scene.dialogue.map((line) => (
            <Box
              key={line.id}
              opacity={getLineOpacity(line.lineNumber)}
              onTouchEnd={() => onLineSelect(line.lineNumber)}
              padding={2}
              backgroundColor={line.lineNumber === currentLine ? 'primary.50' : 'transparent'}
            >
              <Text fontFamily="CourierPrime" fontSize="md">
                <Text fontWeight="bold">{line.character}:</Text> {line.text}
              </Text>
              {line.stagingNotes && (
                <Text fontStyle="italic" color="gray.600" fontSize="sm">
                  ({line.stagingNotes})
                </Text>
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};
```

### State Management Architecture

#### State Structure

```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

// stores/scriptStore.ts
interface ScriptState {
  scripts: Script[];
  currentScript: Script | null;
  processingStatus: ProcessingStatus;
  characters: Character[];
  uploadScript: (file: File, expectedLanguage?: 'es' | 'en') => Promise<void>;
  processScript: (scriptId: string, confirmLanguage: 'es' | 'en') => Promise<void>;
  selectScript: (scriptId: string) => void;
}

// stores/practiceStore.ts
interface PracticeState {
  activeSession: PracticeSession | null;
  currentLine: number;
  audioCache: Map<string, string>; // character audio URLs
  isPlaying: boolean;
  startSession: (config: SessionConfig) => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => Promise<void>;
  playCharacterLine: (lineId: string) => Promise<void>;
}

// stores/settingsStore.ts
interface SettingsState {
  language: 'es' | 'en';
  voiceSettings: VoiceSettings;
  practiceSettings: PracticeSettings;
  accessibility: AccessibilitySettings;
  updateLanguage: (language: 'es' | 'en') => void;
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
}
```

### Routing Architecture

#### Route Organization

```typescript
// navigation/AppNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PracticeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ScriptSelection" component={ScriptSelectionScreen} />
    <Stack.Screen name="CharacterSelection" component={CharacterSelectionScreen} />
    <Stack.Screen name="FamiliarityLevel" component={FamiliarityLevelScreen} />
    <Stack.Screen name="PracticeSession" component={PracticeSessionScreen} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Scripts"
        component={ScriptStack}
        options={{
          tabBarLabel: t('navigation.scripts'),
          tabBarIcon: ({ color }) => <Icon name="file-text" color={color} />
        }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeStack}
        options={{
          tabBarLabel: t('navigation.practice'),
          tabBarIcon: ({ color }) => <Icon name="play" color={color} />
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressStack}
        options={{
          tabBarLabel: t('navigation.progress'),
          tabBarIcon: ({ color }) => <Icon name="trending-up" color={color} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: t('navigation.profile'),
          tabBarIcon: ({ color }) => <Icon name="user" color={color} />
        }}
      />
    </Tab.Navigator>
  );
};
```

#### Protected Route Pattern

```typescript
// components/auth/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
  allowedLanguages?: ('es' | 'en')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresSubscription = false,
  allowedLanguages
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const { t } = useTranslation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (requiresSubscription && user?.subscription === 'free') {
    return (
      <UpgradePrompt
        message={t('subscription.upgradeRequired')}
        feature="premium-voices"
      />
    );
  }

  if (allowedLanguages && !allowedLanguages.includes(user?.preferences.language)) {
    return (
      <LanguageWarning
        message={t('language.notSupported')}
        supportedLanguages={allowedLanguages}
      />
    );
  }

  return <>{children}</>;
};
```

### Frontend Services Layer

#### API Client Setup

```typescript
// services/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../../stores/authStore';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth tokens
    this.client.interceptors.request.use(
      (config) => {
        const { token } = useAuthStore.getState();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
        }
        return Promise.reject(error);
      }
    );
  }

  // Script management
  async uploadScript(file: File, expectedLanguage?: 'es' | 'en'): Promise<Script> {
    const formData = new FormData();
    formData.append('file', file);
    if (expectedLanguage) {
      formData.append('expectedLanguage', expectedLanguage);
    }

    const response = await this.client.post<Script>('/scripts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async processScript(scriptId: string, confirmLanguage: 'es' | 'en'): Promise<void> {
    await this.client.post(`/scripts/${scriptId}/process`, {
      confirmLanguage,
      voicePreferences: {
        region: 'spain' // Default to Spain Spanish
      }
    });
  }

  // Practice session management
  async startPracticeSession(config: SessionConfig): Promise<PracticeSession> {
    const response = await this.client.post<PracticeSession>('/practice/sessions', config);
    return response.data;
  }

  async updateSessionProgress(sessionId: string, progress: SessionProgress): Promise<void> {
    await this.client.patch(`/practice/sessions/${sessionId}`, progress);
  }
}

export const apiClient = new ApiClient();
```

#### Service Example

```typescript
// services/script/scriptService.ts
import { apiClient } from '../api/client';
import { useScriptStore } from '../../stores/scriptStore';

export class ScriptService {
  static async uploadAndProcess(file: File, expectedLanguage?: 'es' | 'en'): Promise<Script> {
    try {
      // Upload script
      const script = await apiClient.uploadScript(file, expectedLanguage);

      // Update store
      useScriptStore.getState().addScript(script);

      // Start processing
      await apiClient.processScript(script.id, script.primaryLanguage);

      return script;
    } catch (error) {
      if (error.response?.data?.code === 'LANGUAGE_MISMATCH') {
        throw new LanguageMismatchError(error.response.data.message);
      }
      throw error;
    }
  }

  static async getCharacters(scriptId: string): Promise<Character[]> {
    try {
      const characters = await apiClient.getCharacters(scriptId);
      useScriptStore.getState().setCharacters(characters);
      return characters;
    } catch (error) {
      console.error('Failed to load characters:', error);
      throw error;
    }
  }
}
```
