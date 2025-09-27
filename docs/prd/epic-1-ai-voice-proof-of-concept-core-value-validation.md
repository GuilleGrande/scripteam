# Epic 1: Web PoC - Core AI Voice Value Validation

**Epic Goal:** Deliver immediate AI voice value through web-based PoC with script upload, character detection, and voice synthesis to validate core hypothesis before mobile investment within 2-4 weeks.

## Phase 1 Strategy
This epic represents Phase 1 of the two-phase architecture strategy:
- **Phase 1:** React Web PoC for immediate validation
- **Phase 2:** Flutter migration for mobile single-codebase (Epic 3)

Success criteria focus on proving core value proposition through web interface before mobile investment.

## Story 1.1 Basic Script Upload and Text Processing
As a drama student,
I want to upload a script file (PDF or text) through a web interface,
so that I can start practicing with AI scene partners.

**Acceptance Criteria**
1. User can select and upload PDF or plain text files through web interface
2. System extracts readable text from PDF files with 95%+ accuracy for standard script formats
3. Uploaded text is stored securely and displayed for user confirmation
4. Basic error handling for unsupported file types or corrupted uploads
5. File size limit of 10MB to prevent infrastructure overload during MVP

**Status:** ✅ COMPLETE

## Story 1.2 AI Character Detection and Parsing
As a drama student,
I want the system to automatically identify characters in my script,
so that I don't have to manually configure scene partners.

**Acceptance Criteria**
1. AI parsing identifies character names from standard script formats with 90%+ accuracy
2. System distinguishes between character dialogue and stage directions
3. Character list is presented to user for review and manual correction if needed
4. Handles common script formatting variations (character names in CAPS, colons, etc.)
5. Extracts basic emotional context from stage directions for voice calibration

**Status:** 📋 PLANNED (Story 2.2)

## Story 1.3 Character-Specific AI Voice Generation
As a drama student,
I want to select my character and hear other characters with distinct AI voices,
so that I can practice scenes with realistic scene partners.

**Acceptance Criteria**
1. User can select their character role from detected character list
2. System generates distinct voice profiles for each non-user character using ElevenLabs API
3. Voice characteristics vary based on character analysis (age, gender, personality cues from script)
4. Voice synthesis response time under 3 seconds for acceptable practice flow
5. Fallback to Play.HT API if ElevenLabs fails or reaches rate limits

**Status:** 📋 PLANNED (Story 2.3)

## Story 1.4 Web-Based Scene Practice with Instant Audio Playback
As a drama student,
I want to practice scenes with immediate AI character responses through my web browser,
so that I can rehearse dialogue timing without interruption or loading delays.

**Acceptance Criteria**
1. System pre-processes entire scene and generates all AI character audio files before practice session starts
2. Loading screen shows progress of voice synthesis for all character lines in selected scene
3. During practice session, AI audio plays instantly when user advances to character's turn
4. All character audio is cached locally for offline replay and repeated practice
5. Session flow is uninterrupted - no waiting for real-time synthesis during practice
6. User can navigate freely within scene (jump to specific lines) with instant audio availability

**Status:** 📋 PLANNED (Story 2.4)

## Story 1.5 Web Interface and User Experience
As a drama student,
I want a simple, functional web interface to access all core features,
so that I can quickly start practicing without technical barriers.

**Acceptance Criteria**
1. Clean, responsive web interface works on desktop and mobile browsers
2. Clear workflow: Upload → Character Detection → Character Selection → Pre-process → Practice
3. Progress indication during AI processing steps (parsing, voice generation, caching)
4. Error messages are user-friendly and actionable
5. Interface loads and responds within 2 seconds for good user experience

**Status:** ✅ COMPLETE (Story 2.1)

## Epic Success Criteria
- [ ] Complete script-to-practice workflow functional via web browser
- [ ] AI voice generation working for all character types
- [ ] Scene practice playable end-to-end
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] User feedback collected on core value proposition
- [ ] Technical foundation ready for mobile migration (Epic 3)

## Dependencies
- None (foundational epic)

## Risks & Mitigation
- **Risk:** ElevenLabs API limitations
- **Mitigation:** Play.HT fallback implementation
- **Risk:** Web performance with large scripts
- **Mitigation:** Progressive loading and caching strategy

---
*Updated for Phase 1 Web PoC Strategy - ADR-002*