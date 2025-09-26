# Tech Stack

This is the **DEFINITIVE technology selection** for the ScripTeam project using a **two-phase approach**: Phase 1 delivers a working web PoC quickly, Phase 2 migrates to single-codebase mobile architecture for maximum long-term value.

## Architecture Strategy: React Web → Flutter Migration

**Phase 1 (Immediate - Web PoC)**: Fast validation with proven React web stack
**Phase 2 (Future - Mobile)**: Migration to Flutter for true single-codebase multiplatform

---

## Phase 1: Web PoC Technology Stack

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.0+ | Type-safe development | Shared interfaces between frontend/backend, excellent developer experience |
| Frontend Framework | React | 18.3+ | Web application framework | Mature ecosystem, fast development, team expertise |
| Build Tool | Vite | 5.0+ | Fast development & building | Lightning-fast HMR, optimized production builds |
| UI Component Library | ShadCN/UI | Latest | Modern React components | Beautiful components, customizable, accessibility-first |
| CSS Framework | Tailwind CSS | 3.4+ | Utility-first styling | Rapid UI development, consistent design system |
| State Management | React Query + Zustand | Latest | Server state + client state | Efficient API caching, simple local state management |

## Phase 2: Mobile Single-Codebase Stack (Future)

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Mobile Framework | Flutter | 3.24+ | Single codebase: iOS/Android/Web/Desktop | Best-in-class cross-platform, native performance, consistent UI |
| Language | Dart | 3.5+ | Flutter native language | Optimized for Flutter, excellent performance, null safety |
| State Management | Riverpod | 2.0+ | Flutter state management | Provider evolution, better testing, compile-time safety |
| UI Framework | Material 3 + Custom | Latest | Consistent design system | Native look-and-feel, customizable components |
---

## Shared Infrastructure (Both Phases)

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Backend Language | TypeScript | 5.0+ | Full-stack type safety | Shared types with frontend, robust API development |
| Backend Framework | Express.js | 4.18+ | Node.js web framework | Fast development, extensive middleware ecosystem |
| API Style | REST | - | HTTP APIs | Simple integration, universally compatible |
| Database | PostgreSQL | 15+ | Primary data storage | Robust relational data, JSON support, excellent performance |
| Cache | Redis | 7.0+ | Session & AI result caching | Fast data access, AI response caching |
| File Storage | Local/Cloud Storage | - | Audio files & scripts | Flexible storage solution, cost-effective |
| Voice Synthesis | ElevenLabs Flash v2.5 | v1 (Base Tier) | Primary voice generation | 75ms latency, Spain Spanish support, cost-effective MVP |
| Voice Synthesis Backup | Play.HT Play 3.0 Mini | Latest | Cost optimization & redundancy | 143ms latency, multilingual fallback service |
| Language Detection | OpenAI GPT | Latest | Script language identification | Custom Spanish/English detection, reliable API |
| Backend Testing | Jest + Supertest | Latest | API endpoint testing | Simple setup, reliable testing |
| IaC Tool | Docker Compose | Latest | Container orchestration | Development/production parity, reliable deployments |
| CI/CD | GitHub Actions | - | Automated testing & deployment | Free tier, excellent ecosystem integration |
| Monitoring | Console + Simple Logging | - | Error tracking & performance | Start simple, upgrade as needed |
| Logging | Winston | 3.8+ | Structured application logging | Node.js standard, flexible configuration |

---

## Migration Timeline

### Phase 1: Web PoC (Week 1-2) ✅ COMPLETE
- ✅ **Backend Infrastructure**: Express.js API fully functional
- ✅ **Frontend**: React web app from Lovable PoC integrated
- ✅ **Infrastructure**: Docker orchestration with hot reloading
- ✅ **Goal**: Complete foundation ready for feature development

### Phase 2: Mobile Migration (Future - TBD)
- 🔄 **Frontend**: Migrate to Flutter
- ✅ **Backend**: No changes required
- 🎯 **Goal**: Single codebase for iOS/Android/Web/Desktop

---

## Decision Rationale

### Why React Web First?
1. **⚡ Speed**: Get working version in days, not weeks
2. **💰 Cost**: Preserve existing backend investment
3. **🧪 Validation**: Test core hypothesis with users quickly
4. **🔄 Flexibility**: Easy to migrate to any mobile framework later

### Why Flutter Second?
1. **📱 Best Mobile**: Superior single-codebase solution for 2025+
2. **🎨 UI Consistency**: Pixel-perfect control across all platforms
3. **⚡ Performance**: Native-level performance on all platforms
4. **🔮 Future-Proof**: Google-backed, growing ecosystem
