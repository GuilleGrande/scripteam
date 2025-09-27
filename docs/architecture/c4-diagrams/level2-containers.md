# Level 2: Container Diagram

## Overview

The Container diagram shows the high-level technology choices and how responsibilities are distributed across them. Each container represents a deployable/executable unit that forms part of the overall ScripTeam system.

## PlantUML Source

```plantuml
@startuml ScripTeam-Containers
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

LAYOUT_WITH_LEGEND()

title Container Diagram for ScripTeam

Person(student, "Acting Student", "Practices scripts with AI voices")
Person(teacher, "Drama Teacher", "Manages student assignments")
Person(actor, "Professional Actor", "Prepares for auditions")

System_Boundary(scripteam, "ScripTeam") {
    Container(web_app, "Web Application", "React, Vite, TypeScript", "Provides script upload, character analysis, voice synthesis, and practice session interfaces via web browser")

    Container(mobile_app, "Mobile Application", "React Native (Planned)", "Provides on-the-go script practice with offline capabilities and mobile-specific features")

    Container(api, "API Backend", "Express.js, TypeScript, Node.js", "Handles script processing, character analysis, voice synthesis coordination, and user session management")

    Container(ai_orchestrator, "AI Orchestration", "n8n Workflow Engine", "Coordinates complex AI processing workflows between character analysis, voice synthesis, and quality assurance")

    Container(database, "Database", "PostgreSQL", "Stores user accounts, script metadata, character profiles, practice session data, and performance analytics")

    Container(cache, "Cache Layer", "Redis", "Caches generated voices, AI analysis results, and session data for improved performance")

    Container(file_storage, "File Storage", "Local FS + CDN", "Stores uploaded scripts, generated audio files, and user recordings with global distribution")
}

System_Ext(elevenlabs, "ElevenLabs API", "AI voice synthesis service")
System_Ext(playht, "Play.HT API", "Backup voice synthesis service")
System_Ext(openai, "OpenAI API", "Character analysis and script understanding")
System_Ext(auth0, "Auth0", "Authentication service")
System_Ext(monitoring, "Monitoring", "Application observability")

Rel(student, web_app, "Uploads scripts, practices with AI voices", "HTTPS")
Rel(teacher, web_app, "Manages assignments, views student progress", "HTTPS")
Rel(actor, web_app, "Prepares auditions, analyzes characters", "HTTPS")

Rel(student, mobile_app, "Practices on mobile devices", "HTTPS")
Rel(teacher, mobile_app, "Reviews student progress on mobile", "HTTPS")

Rel(web_app, api, "Makes API calls for all backend functionality", "HTTPS/JSON")
Rel(mobile_app, api, "Makes API calls for mobile features", "HTTPS/JSON")

Rel(api, ai_orchestrator, "Triggers AI workflows for script processing", "HTTP/Webhooks")
Rel(ai_orchestrator, api, "Returns processing results and status updates", "HTTP/Webhooks")

Rel(api, database, "Reads/writes user data, scripts, analytics", "PostgreSQL Protocol")
Rel(api, cache, "Caches AI results, session data, voice files", "Redis Protocol")
Rel(api, file_storage, "Stores/retrieves scripts and audio files", "File System")

Rel(ai_orchestrator, elevenlabs, "Generates character voices", "HTTPS/REST")
Rel(ai_orchestrator, playht, "Fallback voice generation", "HTTPS/REST")
Rel(ai_orchestrator, openai, "Analyzes characters and script content", "HTTPS/REST")

Rel(api, auth0, "Authenticates users and validates tokens", "HTTPS/OAuth")
Rel(api, monitoring, "Sends metrics, logs, and error tracking", "HTTPS")

Rel(web_app, file_storage, "Downloads audio files for playback", "HTTPS/CDN")
Rel(mobile_app, file_storage, "Downloads/streams audio content", "HTTPS/CDN")

@enduml
```

## Container Responsibilities

### Web Application (React + Vite + TypeScript)
**Technology Rationale**:
- React provides mature component ecosystem for complex UI interactions
- Vite offers fast development builds and hot module replacement
- TypeScript ensures type safety across the large codebase

**Core Responsibilities**:
- Script upload interface with drag-and-drop and validation
- Character analysis visualization with interactive profiles
- Voice synthesis controls and audio preview capabilities
- Real-time practice session interface with AI interaction
- Performance feedback dashboards and progress tracking
- Teacher tools for student management and assignment creation

**Key Features**:
- **ShadCN/UI Components**: Consistent, accessible design system
- **Real-time Updates**: WebSocket integration for practice sessions
- **Offline Capability**: Service worker for cached content access
- **Responsive Design**: Optimized for desktop, tablet, and mobile browsers

### Mobile Application (React Native - Planned)
**Technology Rationale**:
- React Native enables code sharing with web application
- Native performance for audio processing and real-time interactions
- Platform-specific features like camera integration and offline storage

**Core Responsibilities**:
- Mobile-optimized practice sessions with touch interactions
- Offline practice capability with downloaded content
- Push notifications for assignments and reminders
- Camera integration for script scanning and processing
- Bluetooth headphone support for private practice

**Deployment Strategy**:
- **Phase 1**: iOS app for initial testing with teacher/student groups
- **Phase 2**: Android app for broader market access
- **Phase 3**: Advanced features like AR practice environments

### API Backend (Express.js + TypeScript + Node.js)
**Technology Rationale**:
- Express.js provides mature, well-documented web framework
- TypeScript ensures type safety and better developer experience
- Node.js enables efficient handling of concurrent AI processing requests

**Core Responsibilities**:
- **User Management**: Authentication, authorization, profile management
- **Script Processing**: File upload, text extraction, validation
- **AI Coordination**: Managing requests to character analysis and voice synthesis
- **Session Management**: Real-time practice session coordination
- **Data Persistence**: Database operations and caching strategies
- **API Gateway**: Rate limiting, request validation, error handling

**API Design Patterns**:
- RESTful endpoints for standard CRUD operations
- WebSocket connections for real-time practice sessions
- Webhook integrations with AI orchestration workflows
- GraphQL endpoint for complex data queries (future consideration)

### AI Orchestration (n8n Workflow Engine)
**Technology Rationale**:
- Visual workflow design reduces complexity for AI process management
- Built-in error handling and retry mechanisms for external services
- Webhook integration enables loose coupling with main API
- Self-hosted deployment maintains control over sensitive processing

**Core Responsibilities**:
- **Script Analysis Workflows**: Character detection → personality analysis → voice parameter mapping
- **Voice Generation Pipelines**: Provider selection → voice generation → quality validation → caching
- **Batch Processing**: Handling multiple characters and scenes efficiently
- **Error Recovery**: Automatic retry and fallback provider switching
- **Quality Assurance**: Validation of AI outputs before delivery to users

**Workflow Examples**:
```
Script Upload → Text Extraction → Language Detection → Character Analysis → Voice Parameter Mapping → Voice Generation → Quality Check → Cache Storage → User Notification
```

### Database (PostgreSQL)
**Technology Rationale**:
- ACID compliance for critical user data and financial transactions
- JSON support for flexible character profile and script metadata
- Full-text search capabilities for script content
- Mature ecosystem with excellent TypeScript integration

**Data Organization**:
- **User Data**: Accounts, profiles, preferences, subscription information
- **Script Data**: Uploaded scripts, character profiles, scene breakdowns
- **Practice Data**: Session logs, performance metrics, progress tracking
- **System Data**: Configuration, feature flags, audit logs

**Performance Optimizations**:
- Indexed queries for common access patterns
- Read replicas for analytics and reporting
- Connection pooling for efficient resource utilization
- Automated backup and point-in-time recovery

### Cache Layer (Redis)
**Technology Rationale**:
- In-memory storage for sub-millisecond access to frequently used data
- Built-in data structure support for complex caching scenarios
- Pub/sub capabilities for real-time session coordination
- Automatic expiration for managing storage usage

**Caching Strategies**:
- **Voice Files**: Generated audio cached for 7 days with LRU eviction
- **AI Analysis**: Character profiles cached per script with manual invalidation
- **Session Data**: Real-time practice session state for quick recovery
- **API Responses**: Frequently accessed data with TTL-based expiration

### File Storage (Local FS + CDN)
**Technology Rationale**:
- Local storage for cost-effective bulk storage of uploaded scripts
- CDN distribution for global low-latency audio file delivery
- Hybrid approach balances cost with performance requirements

**Storage Organization**:
- **Uploaded Scripts**: Organized by user and upload date with secure access
- **Generated Audio**: Structured by script, character, and scene for efficient retrieval
- **User Recordings**: Practice session recordings with privacy controls
- **Static Assets**: Application assets distributed globally via CDN

## Data Flow Patterns

### Script Upload and Processing Flow
1. **Web App** → **API**: Script file upload with metadata
2. **API** → **File Storage**: Store original script file
3. **API** → **AI Orchestrator**: Trigger processing workflow
4. **AI Orchestrator** → **OpenAI**: Character analysis request
5. **AI Orchestrator** → **ElevenLabs/Play.HT**: Voice generation requests
6. **AI Orchestrator** → **API**: Processing completion notification
7. **API** → **Database**: Store analysis results and voice metadata
8. **API** → **Cache**: Cache frequently accessed data
9. **API** → **Web App**: Real-time progress updates via WebSocket

### Practice Session Flow
1. **Web App** → **API**: Start practice session request
2. **API** → **Database**: Load script and character data
3. **API** → **Cache**: Retrieve cached voice files and session state
4. **API** → **Web App**: Session initialization data
5. **Web App** ↔ **API**: Real-time interaction via WebSocket
6. **API** → **File Storage**: Stream audio files during practice
7. **API** → **Database**: Log practice session data and metrics

## Deployment Architecture

### Development Environment
- **Local Development**: Docker Compose with all containers
- **Hot Reloading**: Vite for frontend, tsx for backend development
- **Local AI Services**: Mock implementations for offline development

### Production Environment
- **Container Orchestration**: Docker containers with health checks
- **Load Balancing**: Multiple API instances behind load balancer
- **Database High Availability**: Primary/replica setup with automatic failover
- **CDN Configuration**: Global distribution with edge caching

### Monitoring and Observability
- **Application Metrics**: Response times, error rates, user engagement
- **Infrastructure Metrics**: CPU, memory, disk usage, network throughput
- **Business Metrics**: User retention, feature usage, conversion rates
- **Log Aggregation**: Centralized logging with structured data

## Security Architecture

### Authentication and Authorization
- **API Gateway**: Central authentication point with JWT validation
- **Role-Based Access**: Student, teacher, admin roles with appropriate permissions
- **Session Management**: Secure session handling with automatic expiration

### Data Protection
- **Encryption at Rest**: Database and file storage encryption
- **Encryption in Transit**: HTTPS/TLS for all communications
- **API Security**: Rate limiting, input validation, CORS configuration

### Privacy Controls
- **Data Retention**: Automatic deletion of practice recordings after specified periods
- **User Consent**: Granular privacy controls for data usage
- **Audit Logging**: Complete audit trail for sensitive data access

## Performance Characteristics

### Response Time Targets
- **API Endpoints**: <200ms for data queries, <2s for AI processing initiation
- **Voice Generation**: <30s for character voice creation
- **Practice Sessions**: <100ms latency for real-time interactions

### Throughput Requirements
- **Concurrent Users**: Support 500+ simultaneous practice sessions
- **File Uploads**: Handle 100+ script uploads per minute during peak usage
- **AI Processing**: Queue and process 50+ AI workflows concurrently

### Scalability Patterns
- **Horizontal Scaling**: API and web app containers scale based on load
- **Vertical Scaling**: Database and cache layers scale with memory/CPU
- **Edge Distribution**: CDN scaling provides global performance optimization

---

*This container diagram provides the technical foundation for understanding ScripTeam's architecture, enabling informed decisions about technology choices, deployment strategies, and integration patterns.*