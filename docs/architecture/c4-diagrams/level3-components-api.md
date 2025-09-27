# Level 3: API Backend Components

## Overview

The Component diagram shows the internal structure of the API Backend container, breaking down its responsibilities into logical components and showing how they interact with each other and external systems.

## PlantUML Source

```plantuml
@startuml ScripTeam-API-Components
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

LAYOUT_WITH_LEGEND()

title Component Diagram for ScripTeam API Backend

Container(web_app, "Web Application", "React", "User interface")
Container(mobile_app, "Mobile App", "React Native", "Mobile interface")
Container(ai_orchestrator, "AI Orchestrator", "n8n", "AI workflow management")

System_Boundary(api, "API Backend") {
    Component(auth_controller, "Authentication Controller", "Express Router", "Handles user authentication, token validation, and session management")

    Component(scripts_controller, "Scripts Controller", "Express Router", "Manages script upload, processing status, and metadata operations")

    Component(characters_controller, "Characters Controller", "Express Router", "Handles character analysis results, voice settings, and character management")

    Component(practice_controller, "Practice Session Controller", "Express Router", "Manages real-time practice sessions and WebSocket connections")

    Component(users_controller, "Users Controller", "Express Router", "Handles user profile management, preferences, and progress tracking")

    Component(rate_limiter, "Rate Limiting Middleware", "Custom Middleware", "Protects APIs from abuse with configurable rate limits per endpoint")

    Component(auth_middleware, "Authentication Middleware", "JWT Middleware", "Validates tokens and enforces authentication requirements")

    Component(validation_middleware, "Request Validation", "Zod Schemas", "Validates request parameters, bodies, and file uploads")

    Component(script_service, "Script Processing Service", "TypeScript Service", "Orchestrates script upload, text extraction, and AI processing coordination")

    Component(character_service, "Character Analysis Service", "TypeScript Service", "Manages character detection results and personality profile generation")

    Component(voice_service, "Voice Synthesis Service", "TypeScript Service", "Coordinates voice generation, caching, and quality management")

    Component(practice_service, "Practice Session Service", "TypeScript Service", "Handles real-time practice session logic and AI interaction coordination")

    Component(user_service, "User Management Service", "TypeScript Service", "Manages user accounts, preferences, and subscription data")

    Component(file_storage_service, "File Storage Service", "TypeScript Service", "Handles file upload, storage, and retrieval with security and validation")

    Component(pdf_extractor, "PDF Text Extractor", "pdf-parse Library", "Extracts readable text from uploaded PDF script files")

    Component(ai_client, "AI Services Client", "HTTP Clients", "Manages communication with external AI services and error handling")

    Component(websocket_manager, "WebSocket Manager", "Socket.io", "Handles real-time connections for practice sessions and live updates")

    Component(database_service, "Database Service", "PostgreSQL Client", "Provides data access layer with connection pooling and transaction management")

    Component(cache_service, "Cache Service", "Redis Client", "Manages caching strategies for AI results, session data, and performance optimization")

    Component(transaction_service, "Transaction Service", "Database Wrapper", "Handles database transactions and ensures data consistency")
}

ContainerDb(database, "Database", "PostgreSQL", "Persistent data storage")
ContainerDb(cache, "Cache", "Redis", "High-speed data caching")
Container(file_storage, "File Storage", "Local FS + CDN", "File and media storage")

System_Ext(elevenlabs, "ElevenLabs", "Voice synthesis API")
System_Ext(playht, "Play.HT", "Backup voice synthesis")
System_Ext(openai, "OpenAI", "Character analysis API")
System_Ext(auth0, "Auth0", "Authentication service")

' User interactions
Rel(web_app, auth_controller, "Login, register, token refresh", "HTTPS")
Rel(web_app, scripts_controller, "Upload scripts, get processing status", "HTTPS")
Rel(web_app, characters_controller, "Get character analysis, manage voices", "HTTPS")
Rel(web_app, practice_controller, "Start practice sessions, real-time interaction", "HTTPS/WebSocket")
Rel(web_app, users_controller, "Manage profile, preferences, progress", "HTTPS")

Rel(mobile_app, auth_controller, "Mobile authentication", "HTTPS")
Rel(mobile_app, scripts_controller, "Mobile script upload", "HTTPS")
Rel(mobile_app, practice_controller, "Mobile practice sessions", "HTTPS/WebSocket")

' Middleware chain
Rel(auth_controller, rate_limiter, "Rate limiting for auth endpoints")
Rel(scripts_controller, rate_limiter, "Rate limiting for uploads")
Rel(characters_controller, auth_middleware, "Require authentication")
Rel(practice_controller, auth_middleware, "Secure practice sessions")
Rel(users_controller, auth_middleware, "Protect user data")

Rel(scripts_controller, validation_middleware, "Validate file uploads")
Rel(characters_controller, validation_middleware, "Validate character data")
Rel(practice_controller, validation_middleware, "Validate session parameters")

' Controller to Service layer
Rel(auth_controller, user_service, "User authentication logic")
Rel(scripts_controller, script_service, "Script processing orchestration")
Rel(characters_controller, character_service, "Character analysis management")
Rel(practice_controller, practice_service, "Practice session coordination")
Rel(users_controller, user_service, "User data management")

' Service layer interactions
Rel(script_service, file_storage_service, "Store uploaded scripts")
Rel(script_service, pdf_extractor, "Extract text from PDFs")
Rel(script_service, ai_client, "Trigger AI processing workflows")

Rel(character_service, database_service, "Store character profiles")
Rel(character_service, cache_service, "Cache character analysis")

Rel(voice_service, ai_client, "Request voice generation")
Rel(voice_service, cache_service, "Cache generated voices")
Rel(voice_service, file_storage_service, "Store audio files")

Rel(practice_service, websocket_manager, "Real-time session communication")
Rel(practice_service, cache_service, "Session state management")
Rel(practice_service, voice_service, "Load character voices")

Rel(user_service, database_service, "User data persistence")
Rel(user_service, transaction_service, "Atomic user operations")

' Infrastructure services
Rel(database_service, database, "SQL queries and transactions", "PostgreSQL")
Rel(cache_service, cache, "Cache operations", "Redis")
Rel(file_storage_service, file_storage, "File operations", "File System")

' External service interactions
Rel(ai_client, elevenlabs, "Voice generation requests", "HTTPS")
Rel(ai_client, playht, "Backup voice generation", "HTTPS")
Rel(ai_client, openai, "Character analysis requests", "HTTPS")
Rel(auth_middleware, auth0, "Token validation", "HTTPS")

' AI Orchestrator integration
Rel(ai_orchestrator, script_service, "Processing completion notifications", "HTTP")
Rel(script_service, ai_orchestrator, "Trigger processing workflows", "HTTP")

@enduml
```

## Component Responsibilities

### Controller Layer

#### Authentication Controller
**Purpose**: Manages all user authentication and authorization operations
**Key Functions**:
- User registration with email validation and password security
- Login with multiple authentication providers (Auth0, Google, Apple)
- JWT token generation, validation, and refresh mechanisms
- Password reset and account recovery workflows
- Session management and logout handling

**Dependencies**: User Service, Auth0, Rate Limiter
**Error Handling**: Invalid credentials, expired tokens, account lockouts

#### Scripts Controller
**Purpose**: Handles all script-related operations from upload to processing status
**Key Functions**:
- Multipart file upload with validation (PDF, TXT formats)
- Script metadata management (title, language, upload date)
- Processing status tracking and real-time updates
- Script retrieval and user script listing
- File deletion and cleanup operations

**Dependencies**: Script Service, Validation Middleware, Rate Limiter
**Error Handling**: Invalid files, upload failures, processing timeouts

#### Characters Controller
**Purpose**: Manages character analysis results and voice synthesis coordination
**Key Functions**:
- Character profile retrieval and display
- Voice parameter management and customization
- Character voice generation triggering
- Voice preview and quality assessment
- Character relationship mapping

**Dependencies**: Character Service, Voice Service, Authentication Middleware
**Error Handling**: Missing character data, voice generation failures

#### Practice Session Controller
**Purpose**: Orchestrates real-time practice sessions with AI interaction
**Key Functions**:
- Practice session initialization and configuration
- Real-time WebSocket connection management
- Session state persistence and recovery
- Performance tracking and metrics collection
- Session termination and cleanup

**Dependencies**: Practice Service, WebSocket Manager, Authentication Middleware
**Error Handling**: Connection failures, session timeouts, audio issues

#### Users Controller
**Purpose**: Handles user profile management and preference settings
**Key Functions**:
- User profile updates and customization
- Preference management (language, voice settings, accessibility)
- Progress tracking and achievement management
- Subscription and billing information
- Account deletion and data export

**Dependencies**: User Service, Authentication Middleware
**Error Handling**: Profile validation errors, permission issues

### Middleware Layer

#### Rate Limiting Middleware
**Purpose**: Protects API endpoints from abuse and ensures fair resource usage
**Configuration**:
- General API: 100 requests per minute per IP
- File uploads: 5 uploads per minute per IP
- AI processing: 10 requests per minute per user
- Practice sessions: 3 concurrent sessions per user

**Implementation**: Custom rate limiter with Redis backend for distributed rate limiting

#### Authentication Middleware
**Purpose**: Validates JWT tokens and enforces authentication requirements
**Functions**:
- JWT token validation and expiration checking
- User role and permission verification
- Request context population with user information
- Secure cookie handling for web sessions

**Integration**: Works with Auth0 for token validation and user information retrieval

#### Validation Middleware
**Purpose**: Ensures request data integrity and security
**Validation Types**:
- File upload validation (type, size, content security)
- Request parameter validation using Zod schemas
- Input sanitization and XSS prevention
- Business rule validation (e.g., script character limits)

### Service Layer

#### Script Processing Service
**Purpose**: Orchestrates the complete script processing workflow
**Workflow Steps**:
1. File validation and security scanning
2. Text extraction using PDF processor
3. Language detection and validation
4. AI processing workflow initiation
5. Progress tracking and status updates
6. Error handling and recovery

**AI Integration**: Coordinates with AI Orchestrator for complex processing workflows

#### Character Analysis Service
**Purpose**: Manages character detection results and personality profiles
**Core Functions**:
- Character profile data management and validation
- Personality trait analysis and storage
- Character relationship mapping and visualization
- Cultural context analysis for international scripts
- Character voice parameter recommendation

**Caching Strategy**: Aggressive caching of character analysis results with 7-day TTL

#### Voice Synthesis Service
**Purpose**: Coordinates voice generation and quality management
**Provider Management**:
- ElevenLabs primary integration with 75ms latency target
- Play.HT fallback integration with 143ms latency
- Automatic provider switching based on availability and cost
- Voice quality validation and retry logic

**Caching Strategy**: Generated voices cached for 7 days with intelligent cache warming

#### Practice Session Service
**Purpose**: Handles real-time practice session logic and coordination
**Session Management**:
- Session state initialization and configuration
- Real-time AI interaction coordination
- Performance metrics collection and analysis
- Session recording and playback functionality
- Multi-user session support (future feature)

**Performance Requirements**: <100ms latency for real-time interactions

#### User Management Service
**Purpose**: Comprehensive user account and preference management
**User Data**:
- Profile information and customization options
- Practice preferences and accessibility settings
- Progress tracking and achievement systems
- Subscription management and billing integration
- Privacy controls and data retention policies

### Infrastructure Layer

#### File Storage Service
**Purpose**: Secure file upload, storage, and retrieval with performance optimization
**File Types**:
- **Uploaded Scripts**: PDF and TXT files with virus scanning
- **Generated Audio**: MP3 files with compression optimization
- **User Recordings**: Practice session recordings with privacy controls
- **Static Assets**: Application assets distributed via CDN

**Security Features**: File type validation, content scanning, access control

#### PDF Text Extractor
**Purpose**: Reliable text extraction from uploaded PDF documents
**Capabilities**:
- Standard PDF text extraction with formatting preservation
- OCR fallback for scanned documents and images
- Character encoding detection and normalization
- Script structure recognition (character names, dialogue, stage directions)

**Error Handling**: Corrupted files, password-protected PDFs, image-only documents

#### AI Services Client
**Purpose**: Robust communication with external AI services
**Service Integration**:
- **ElevenLabs**: Voice synthesis with advanced error handling
- **Play.HT**: Backup voice generation with quality optimization
- **OpenAI**: Character analysis with prompt engineering
- **Circuit Breaker**: Automatic service degradation and recovery

**Reliability Features**: Retry logic, fallback providers, request queuing

#### WebSocket Manager
**Purpose**: Real-time communication for practice sessions
**Features**:
- Connection lifecycle management and heartbeat monitoring
- Room-based session organization for multi-user support
- Message queuing and delivery confirmation
- Automatic reconnection with state preservation

**Performance**: Supports 500+ concurrent connections with <100ms latency

### Data Layer

#### Database Service
**Purpose**: Robust data access layer with transaction support
**Features**:
- Connection pooling for optimal resource utilization
- Query optimization and performance monitoring
- Automatic failover to read replicas for high availability
- Data migration and schema version management

**Transaction Management**: ACID compliance for critical operations

#### Cache Service
**Purpose**: High-performance caching for frequently accessed data
**Caching Strategies**:
- **Generated Voices**: 7-day TTL with LRU eviction
- **Character Analysis**: Script-based caching with manual invalidation
- **Session Data**: Real-time practice session state
- **API Responses**: Frequently accessed data with smart TTL

#### Transaction Service
**Purpose**: Ensures data consistency across complex operations
**Use Cases**:
- Script upload with metadata and processing status
- Character analysis with voice parameter generation
- User account creation with preference initialization
- Practice session completion with progress updates

## Error Handling Patterns

### Graceful Degradation
- AI service failures fallback to cached results or alternative providers
- Database connectivity issues fallback to read-only mode with cached data
- File storage failures use temporary storage with delayed processing

### Circuit Breaker Pattern
- External service failures trigger circuit breaker to prevent cascading failures
- Automatic service health monitoring and recovery detection
- User-friendly error messages with suggested alternatives

### Retry Logic
- Exponential backoff for transient failures
- Maximum retry limits to prevent infinite loops
- Detailed logging for debugging and monitoring

## Performance Optimization

### Caching Strategies
- **Multi-level Caching**: Application, database, and CDN caching
- **Cache Warming**: Proactive caching of frequently accessed data
- **Cache Invalidation**: Smart invalidation based on data dependencies

### Database Optimization
- **Query Optimization**: Indexed queries and efficient join patterns
- **Connection Pooling**: Optimal database connection management
- **Read Replicas**: Load distribution for read-heavy operations

### Asynchronous Processing
- **Background Jobs**: Long-running AI processing moved to background
- **Event-Driven Architecture**: Loose coupling through event messaging
- **Queue Management**: Prioritized processing queues for different operation types

---

*This component diagram provides the detailed technical architecture for the API Backend, enabling developers to understand implementation patterns and make informed technical decisions about service interactions and data flow.*