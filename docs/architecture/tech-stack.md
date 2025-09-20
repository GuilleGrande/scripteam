# Tech Stack

This is the **DEFINITIVE technology selection** for the entire project based on our Hostinger + n8n hybrid AI approach. This table serves as the single source of truth - all development must use these exact versions.

## Technology Stack Table

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
