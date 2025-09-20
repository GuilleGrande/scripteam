# Technical Assumptions

## Repository Structure: Monorepo
Single repository containing mobile app, backend API, and AI processing services for simplified development workflow and deployment coordination under solopreneur constraints.

## Service Architecture
**Microservices within Monorepo approach:** Dedicated services for AI voice processing, script analysis, and user management that can scale independently while maintaining development simplicity. Core services include:
- **Script Analysis Service:** AI-powered parsing and character detection
- **Voice Synthesis Service:** ElevenLabs/Play.HT API integration with fallback providers
- **User Management Service:** Authentication, progress tracking, and subscription management
- **Session Orchestration Service:** Coordinates practice sessions and real-time interactions

## Testing Requirements
**Unit + Integration testing approach:** Focus on API reliability and AI service integration testing rather than comprehensive e2e testing due to resource constraints. Critical testing areas:
- Unit tests for core business logic and data processing
- Integration tests for AI API reliability and voice synthesis quality
- Load testing for concurrent user scenarios (100 → 5,000 users)
- Manual testing convenience methods for practice session flows

## Additional Technical Assumptions and Requests

**Frontend Technology:**
- **React Native** for cross-platform mobile development (single codebase, native performance, extensive AI/audio library support)
- **Expo framework** for accelerated development and over-the-air updates

**Backend Technology:**
- **Node.js with Express** for JavaScript consistency across full stack
- **TypeScript** for enhanced code reliability and developer experience

**Database Architecture:**
- **PostgreSQL** for structured user data, progress tracking, and subscription management
- **Redis** for session caching and real-time practice state management
- **AWS S3** for encrypted script file storage with EU data residency

**AI Integration Strategy:**
- **Primary:** ElevenLabs API for premium voice synthesis
- **Backup:** Play.HT API for cost optimization and redundancy
- **Script Analysis:** OpenAI GPT-4 for character detection and emotional context parsing

**Infrastructure Choices:**
- **AWS** with auto-scaling groups for variable AI processing loads
- **EU-West data centers** for GDPR compliance and target market latency
- **CloudFront CDN** for script file distribution and mobile app performance

**Cost Management Strategy:**
- **AI API usage monitoring** with automatic scaling limits to prevent cost overruns
- **Freemium tier limitations** on AI voice generation minutes to control costs
- **Caching strategies** for repeated script analysis and voice synthesis requests
