# C4 Architecture Diagrams Overview

## Purpose

This document collection provides C4 model architecture diagrams for the ScripTeam AI-powered acting practice platform. The C4 model (Context, Containers, Components, Code) offers a hierarchical approach to software architecture documentation that serves different stakeholder needs.

## C4 Model Levels

### Level 1: System Context Diagram
**Audience**: Everyone (business stakeholders, developers, operations)
**Purpose**: Shows how ScripTeam fits into the world around it
**Focus**: People and systems that interact with ScripTeam

### Level 2: Container Diagram
**Audience**: Technical stakeholders, architects, developers
**Purpose**: Shows the high-level technology choices and system decomposition
**Focus**: Applications, databases, microservices, and their interactions

### Level 3: Component Diagram
**Audience**: Software architects, senior developers
**Purpose**: Shows internal structure of containers and their responsibilities
**Focus**: Components within each container and their relationships

### Level 4: Code Diagram (UML Class Diagrams)
**Audience**: Software developers, implementers
**Purpose**: Shows detailed implementation structure
**Focus**: Classes, interfaces, and their relationships

## ScripTeam Architecture Hierarchy

```
ScripTeam System
├── Context Diagram (Level 1)
│   ├── Users (Students, Teachers, Actors)
│   ├── External AI Services (ElevenLabs, Play.HT, OpenAI)
│   ├── Authentication Providers (Auth0, Google, Apple)
│   └── Infrastructure Services (CDN, Monitoring, Analytics)
│
├── Container Diagram (Level 2)
│   ├── Web Application (React + Vite)
│   ├── API Backend (Express.js + TypeScript)
│   ├── Database (PostgreSQL)
│   ├── Cache (Redis)
│   ├── File Storage (Local + CDN)
│   └── AI Orchestration (n8n)
│
├── Component Diagrams (Level 3)
│   ├── Web Application Components
│   ├── API Backend Components
│   ├── AI Processing Components
│   └── Data Management Components
│
└── Code Diagrams (Level 4)
    ├── Core Domain Models
    ├── Service Layer Architecture
    ├── API Layer Structure
    └── AI Integration Patterns
```

## Diagram Conventions

### Visual Elements
- **Person**: Human users of the system
- **Software System**: External systems that ScripTeam integrates with
- **Container**: Deployable/executable units (applications, databases, file systems)
- **Component**: Logical groupings of related functionality within containers

### Color Coding
- **Blue**: ScripTeam system elements
- **Gray**: External systems and services
- **Green**: Databases and data stores
- **Orange**: External AI and cloud services
- **Red**: Critical security or authentication components

### Relationship Types
- **Solid arrows**: Synchronous calls/requests
- **Dashed arrows**: Asynchronous messages/events
- **Bold arrows**: High-volume or critical data flows
- **Dotted arrows**: Configuration or management connections

## Stakeholder Views

### Business Stakeholders
**Primary Diagrams**: Context Diagram, Container Diagram
**Focus Areas**:
- User value delivery
- External service dependencies
- Cost implications of architecture choices
- Scalability and growth potential

### Product Managers
**Primary Diagrams**: Context Diagram, Container Diagram, Component Diagrams
**Focus Areas**:
- Feature delivery capabilities
- User experience touchpoints
- Performance characteristics
- Integration possibilities

### Technical Leadership
**Primary Diagrams**: All levels with emphasis on Container and Component diagrams
**Focus Areas**:
- Technical debt and architecture quality
- Scalability bottlenecks
- Security architecture
- Technology choice rationale

### Development Teams
**Primary Diagrams**: Component and Code diagrams
**Focus Areas**:
- Implementation guidance
- Interface definitions
- Code organization patterns
- Testing boundaries

### Operations Teams
**Primary Diagrams**: Container Diagram with deployment annotations
**Focus Areas**:
- Deployment topology
- Monitoring and observability points
- Failure modes and recovery
- Performance optimization opportunities

## Architecture Decision Documentation

### Key Architectural Decisions Reflected in Diagrams

1. **React Web-First Strategy (ADR-002)**
   - Container diagrams show React web app as primary user interface
   - Mobile app shown as future container with shared API backend

2. **Express.js API Backend**
   - Single API container serving all client applications
   - Clear separation between presentation and business logic

3. **AI Service Integration Pattern**
   - External AI services integrated through dedicated components
   - Fallback and redundancy patterns clearly shown

4. **Event-Driven AI Processing**
   - n8n container for orchestrating complex AI workflows
   - Asynchronous processing patterns for user experience optimization

5. **Hybrid Data Storage**
   - PostgreSQL for structured data with Redis caching
   - Local file storage with CDN distribution for media assets

## Diagram Maintenance

### Update Triggers
- New feature implementation that adds containers or components
- External service integration changes
- Performance optimization that changes architecture
- Security requirement changes
- Technology stack updates

### Review Schedule
- **Monthly**: Component diagrams reviewed during sprint retrospectives
- **Quarterly**: Container diagrams reviewed for architecture evolution
- **Bi-annually**: Context diagrams reviewed for business alignment
- **As-needed**: Code diagrams updated during major refactoring

### Approval Process
- **Component/Code Changes**: Senior developer approval
- **Container Changes**: Architecture review and approval
- **Context Changes**: Product and technical leadership approval

## Tool and Format Information

### Diagram Creation Tools
- **Primary**: PlantUML with C4 extensions for version control integration
- **Alternative**: Lucidchart for collaborative editing
- **Export Formats**: SVG for web display, PNG for documentation

### Version Control
- All diagram source files stored in `/docs/architecture/c4-diagrams/`
- Rendered images automatically generated in CI/CD pipeline
- Change history tracked through git commits

### Accessibility
- All diagrams include alternative text descriptions
- High contrast colors for accessibility compliance
- Text-based PlantUML source provides screen reader compatibility

---

*These C4 diagrams serve as the authoritative visual documentation of ScripTeam's architecture, supporting communication across all stakeholder levels and enabling informed technical decision-making.*