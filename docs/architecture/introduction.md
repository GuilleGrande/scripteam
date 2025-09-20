# Introduction

This document outlines the complete fullstack architecture for **ScripTeam**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

## Starter Template or Existing Project

**Greenfield project** leveraging modern AI-first architecture patterns. Key strategic decisions:

- **GPT-OSS integration** for self-hosted script analysis and character generation
- **Hostinger AI VPS + n8n** for rapid MVP development and AI workflow orchestration
- **React Native + Expo** for cross-platform mobile development
- **Hybrid AI approach** combining self-hosted intelligence with external voice synthesis APIs

## Core Architectural Constraint: Hybrid AI Processing Strategy

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

## Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-09-20 | v1.0 | Initial fullstack architecture with Hostinger + n8n approach | Winston (Architect) |
