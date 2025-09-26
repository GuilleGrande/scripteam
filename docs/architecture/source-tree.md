# Source Tree Documentation

This document describes the directory structure and organization of the ScripTeam POC project, a monorepo containing multiple applications and shared packages.

## Project Overview

ScripTeam is organized as a **monorepo** using npm workspaces, containing mobile applications, API backend, and shared utilities for an AI-powered acting practice platform with Spanish/English language support.

## Root Directory Structure

```
scripteam-poc/
├── apps/                          # Application packages
│   ├── api/                       # Backend API service
│   └── mobile/                    # React Native mobile app
├── packages/                      # Shared packages
│   └── shared/                    # Shared types and utilities
├── docs/                          # Documentation
│   ├── architecture/              # Architecture documentation
│   ├── prd/                       # Product Requirements Documents
│   ├── qa/                        # Quality Assurance documentation
│   └── stories/                   # Development stories
├── n8n/                          # n8n workflow configurations
├── nginx/                        # Nginx configuration files
├── logs/                         # Application logs
├── .bmad-core/                   # BMad Method framework files
├── .claude/                      # Claude Code configuration
├── .vscode/                      # VS Code workspace settings
├── docker-compose.yml            # Docker composition for services
├── package.json                  # Root package.json with workspaces
└── README.md                     # Project overview
```

## Application Packages (`apps/`)

### API Backend (`apps/api/`)

Express.js backend service providing REST APIs and AI workflow integration.

```
apps/api/
├── src/                          # Source code
│   ├── index.ts                  # Application entry point
│   ├── routes/                   # API route definitions
│   ├── middleware/               # Express middleware
│   ├── services/                 # Business logic services
│   ├── models/                   # Data models
│   └── utils/                    # Utility functions
├── database/                     # Database schemas and migrations
├── uploads/                      # File upload directory
├── dist/                         # Compiled JavaScript output
├── package.json                  # API-specific dependencies
├── tsconfig.json                 # TypeScript configuration
└── jest.config.js                # Jest test configuration
```

**Key Dependencies:**
- Express.js 4.18+ (web framework)
- PostgreSQL with `pg` (database)
- TypeScript 5.1+ (type safety)
- Zod (schema validation)
- Multer (file uploads)
- PDF-parse (document processing)

**Scripts:**
- `npm run dev` - Development server with hot reload
- `npm run build` - TypeScript compilation
- `npm run test` - Jest testing
- `npm run lint` - ESLint code linting

### Mobile Application (`apps/mobile/`)

React Native + Expo application for cross-platform mobile development.

```
apps/mobile/
├── src/                          # Source code
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Base UI components
│   │   └── feature/              # Feature-specific components
│   ├── screens/                  # Screen components
│   ├── navigation/               # Navigation configuration
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API and external services
│   ├── store/                    # State management (Zustand)
│   ├── utils/                    # Utility functions
│   └── types/                    # TypeScript type definitions
├── assets/                       # Static assets (images, fonts)
├── .expo/                        # Expo configuration and cache
├── coverage/                     # Test coverage reports
├── dist/                         # Build output
├── app.json                      # Expo configuration
├── package.json                  # Mobile app dependencies
├── tsconfig.json                 # TypeScript configuration
└── jest.config.js                # Jest test configuration
```

**Key Dependencies:**
- Expo SDK 54+ (development platform)
- React Native 0.81+ (mobile framework)
- React 19.1+ (UI library)
- NativeBase 3.4+ (UI components)
- React Navigation 7+ (navigation)
- TanStack React Query 5+ (data fetching)

**Scripts:**
- `npm run dev` - Expo development server
- `npm run web` - Web development
- `npm run build:web` - Web production build
- `npm run test` - Jest testing with React Native Testing Library

## Shared Packages (`packages/`)

### Shared Package (`packages/shared/`)

Common types, interfaces, and utilities shared across applications.

```
packages/shared/
├── src/                          # Source code
│   ├── types/                    # Shared TypeScript types
│   │   ├── api.ts                # API request/response types
│   │   ├── user.ts               # User-related types
│   │   └── script.ts             # Script processing types
│   ├── schemas/                  # Zod validation schemas
│   ├── utils/                    # Shared utility functions
│   └── index.ts                  # Package exports
├── dist/                         # Compiled output
├── package.json                  # Package configuration
└── tsconfig.json                 # TypeScript configuration
```

**Purpose:**
- Type safety across frontend/backend
- Shared validation schemas
- Common utility functions
- API contract definitions

## Documentation (`docs/`)

### Architecture Documentation (`docs/architecture/`)

Technical architecture and design documentation.

```
docs/architecture/
├── coding-standards.md           # Development coding standards
├── source-tree.md               # This file - project structure
├── tech-stack.md                # Technology stack definitions
└── decisions/                   # Architecture Decision Records (ADRs)
    ├── 001-technology-selection.md
    └── 002-mobile-architecture.md
```

### Product Documentation (`docs/prd/`)

Product Requirements Documents and specifications.

```
docs/prd/
├── epic-1-core-functionality.md  # Core feature requirements
├── epic-2-ai-integration.md      # AI workflow requirements
└── epic-3-user-experience.md     # UX/UI requirements
```

### Quality Assurance (`docs/qa/`)

Testing documentation and quality gates.

```
docs/qa/
├── assessments/                  # QA assessment reports
└── gates/                        # Quality gate definitions
```

### Development Stories (`docs/stories/`)

Implementation stories and development tasks.

```
docs/stories/
├── 1.1.basic-script-upload-and-text-processing.md
├── 1.2.expo-rn-web-architecture-migration.md
└── [story-number].[story-name].md
```

## Infrastructure and Configuration

### n8n Workflows (`n8n/`)

AI workflow automation configurations.

```
n8n/
└── workflows/                    # n8n workflow definitions
    ├── script-processing.json    # Script analysis workflows
    └── voice-generation.json     # TTS workflows
```

### Nginx Configuration (`nginx/`)

Web server and reverse proxy configuration.

```
nginx/
├── nginx.conf                   # Main nginx configuration
└── sites-available/             # Site-specific configurations
```

### Development Tools

#### BMad Framework (`.bmad-core/`)

BMad Method framework for project management and development workflows.

```
.bmad-core/
├── agents/                      # AI agent configurations
├── checklists/                  # Quality checklists
├── tasks/                       # Automated tasks
├── templates/                   # Document templates
└── core-config.yaml            # BMad configuration
```

#### Claude Code Configuration (`.claude/`)

Claude Code IDE integration settings.

```
.claude/
├── commands/                    # Custom commands
│   └── BMad/                    # BMad-specific commands
└── settings.local.json          # Local settings
```

## File Naming Conventions

### Components and Files
- **Components**: PascalCase (`UserProfile.tsx`, `ScriptUpload.tsx`)
- **Files**: kebab-case (`user-profile.service.ts`, `script-utils.ts`)
- **Directories**: kebab-case (`user-profile/`, `script-processing/`)
- **Types**: PascalCase interfaces (`User`, `ScriptData`)

### Documentation
- **Stories**: `[number].[kebab-case-title].md`
- **ADRs**: `[number]-[kebab-case-title].md`
- **General Docs**: `kebab-case-title.md`

## Build and Development Workflow

### Workspace Commands (from root)

```bash
# Development
npm run dev                      # Start mobile app
npm run dev:web                  # Start web version
npm run dev:mobile              # Start mobile app
npm run dev:api                 # Start API server

# Building
npm run build                   # Build all workspaces
npm run build --workspace=apps/mobile

# Testing
npm run test                    # Test all workspaces
npm run test --workspace=apps/api

# Code Quality
npm run lint                    # Lint all workspaces
npm run typecheck              # TypeScript checking
```

### Individual Package Commands

Each package has its own scripts defined in their respective `package.json` files:

- **API**: `dev`, `build`, `start`, `lint`, `typecheck`, `test`
- **Mobile**: `start`, `web`, `build:web`, `test`, `typecheck`
- **Shared**: `build`, `dev`, `typecheck`, `clean`

## Technology Stack Integration

This source tree supports the full technology stack as defined in `tech-stack.md`:

- **Frontend**: React Native + Expo + TypeScript + NativeBase
- **Backend**: Express.js + TypeScript + PostgreSQL + Redis
- **AI**: n8n + GPT-OSS + ElevenLabs/Play.HT
- **Testing**: Jest + React Native Testing Library + Detox
- **Infrastructure**: Docker Compose + GitHub Actions

## Development Guidelines

### Adding New Features

1. **Create Story**: Add development story in `docs/stories/`
2. **Shared Types**: Define in `packages/shared/src/types/`
3. **API Endpoints**: Implement in `apps/api/src/routes/`
4. **Mobile Components**: Create in `apps/mobile/src/components/`
5. **Testing**: Add tests in respective `__tests__/` directories

### File Organization Principles

- **Feature-based**: Group related files by feature/domain
- **Layer Separation**: Clear separation between UI, business logic, and data
- **Shared First**: Common code goes in shared package
- **Documentation Driven**: Document before implementing

This source tree structure supports rapid development, clear separation of concerns, and maintainable code organization for the ScripTeam platform.