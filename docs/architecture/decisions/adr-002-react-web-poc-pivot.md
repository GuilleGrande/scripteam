# ADR-002: Pivot to React Web PoC with Flutter Migration Path

## Status
**ACCEPTED** - 2025-09-26

## Context

Following the implementation of ADR-001 (Expo + React Native Web Migration), we encountered fundamental compatibility issues that prevented successful deployment:

### Technical Issues Identified
- **React 19 + Expo SDK Incompatibility**: Development tooling conflicts causing render failures
- **Complex Debugging**: Multiple compatibility layers making issue resolution difficult
- **No Working Version**: Despite extensive troubleshooting, frontend remains non-functional
- **Time Investment**: Significant development time spent without deliverable results

### Strategic Reassessment
- **Business Priority**: Need working PoC for user validation immediately
- **Mobile Requirements**: Still need single-codebase mobile solution long-term
- **Resource Optimization**: Preserve existing API backend investment
- **Risk Mitigation**: Reduce technical complexity for Phase 1 delivery

## Decision

**We will pivot to a two-phase architecture strategy:**

### Phase 1: React Web PoC (Immediate)
- **Frontend**: Standard React 18 + Vite + TypeScript + ShadCN/UI
- **Backend**: Keep existing Express.js API (no changes required)
- **Goal**: Working ScriptUpload functionality for user testing within days

### Phase 2: Flutter Migration (Future)
- **Frontend**: Migrate to Flutter for true single-codebase (iOS/Android/Web/Desktop)
- **Backend**: No changes required (API remains compatible)
- **Goal**: Best-in-class mobile solution with optimal long-term architecture

## Implementation Strategy

### Phase 1 Technical Approach
```bash
# Create clean React application
npx create-vite apps/web-v2 --template react-ts

# Reuse proven technologies
- React 18.3+ (stable, mature ecosystem)
- TypeScript 5.0+ (excellent developer experience)
- ShadCN/UI (beautiful, accessible components)
- Tailwind CSS (rapid UI development)
- React Query (server state management)
```

### Migration Advantages
1. **⚡ Immediate Results**: Working version in 2-3 days vs weeks
2. **💰 Cost Efficiency**: Reuse existing API, database, Docker setup
3. **🧪 Fast Validation**: Test core hypothesis with users quickly
4. **🔄 Strategic Flexibility**: Evaluate mobile frameworks based on user feedback
5. **📈 Risk Reduction**: Proven technology stack with team expertise

## Consequences

### Positive Outcomes
- ✅ **Immediate Working Solution**: React web PoC deployed quickly
- ✅ **Preserved Investment**: All backend infrastructure remains unchanged
- ✅ **User Validation**: Can test core ScriptUpload functionality immediately
- ✅ **Strategic Options**: Flutter migration provides best long-term mobile path
- ✅ **Reduced Risk**: Simple, proven technology reduces complexity

### Accepted Trade-offs
- ⚠️ **Temporary Web-Only**: Phase 1 doesn't include mobile platforms
- ⚠️ **Migration Work**: Future Flutter migration requires frontend rewrite
- ⚠️ **Team Learning**: Eventually need to learn Dart/Flutter for Phase 2

### Risk Mitigation
- **Preserve API Compatibility**: Backend design supports any frontend framework
- **Documentation**: Comprehensive React implementation for Flutter migration reference
- **Incremental Approach**: Can evaluate Flutter alternatives based on Phase 1 feedback

## Success Criteria

### Phase 1 Technical Validation
- [ ] React web application successfully deployed
- [ ] ScriptUpload component working with existing API
- [ ] File upload, processing, and display functionality operational
- [ ] User testing possible with core features
- [ ] Performance acceptable for PoC validation

### Phase 1 Business Validation
- [ ] Core value proposition testable by users
- [ ] User feedback collected on ScriptUpload workflow
- [ ] Technical architecture validated for mobile migration
- [ ] Development velocity improved vs Expo approach

### Phase 2 Migration Readiness
- [ ] API architecture confirmed mobile-framework agnostic
- [ ] Business requirements validated through Phase 1 user testing
- [ ] Flutter vs alternatives evaluation completed
- [ ] Migration timeline and resource requirements defined

## Technology Comparison: Why Flutter for Phase 2

| Framework | Single Codebase | Performance | UI Consistency | Learning Curve | Ecosystem |
|-----------|----------------|-------------|----------------|---------------|-----------|
| **Flutter** | ✅ iOS/Android/Web/Desktop | ⭐⭐⭐⭐⭐ Native | ⭐⭐⭐⭐⭐ Pixel Perfect | Medium (Dart) | Growing Fast |
| React Native | ❌ Requires RN Web | ⭐⭐⭐⭐ Good | ⭐⭐⭐ Platform Differences | Low (JS) | Mature |
| PWA | ✅ Universal Browser | ⭐⭐ Limited | ⭐⭐ Browser Dependent | Low (Web) | Web Standard |

**Flutter selected for superior single-codebase support and UI consistency**

## Related Documents
- `docs/architecture/tech-stack.md` - Updated two-phase architecture
- `docs/architecture/decisions/adr-001-expo-rn-web-migration.md` - Previous failed approach
- `docs/stories/1.2.expo-rn-web-architecture-migration.md` - Migration attempt analysis

## Timeline

### Phase 1: React Web PoC
- **Start Date**: 2025-09-26 (immediately)
- **Target Completion**: 2025-09-30 (4 development days)
- **Deliverable**: Working web PoC for user testing

### Phase 2: Flutter Migration (Future)
- **Start Date**: TBD (based on Phase 1 user validation)
- **Duration**: ~2-3 weeks (frontend migration)
- **Deliverable**: Single-codebase mobile application

## Review and Approval
- **Author**: BMad Orchestrator + Quinn (Test Architect)
- **Technical Rationale**: Proven React stack vs experimental Expo compatibility
- **Business Rationale**: Working PoC needed immediately for user validation
- **Strategic Rationale**: Flutter provides best long-term single-codebase solution
- **Implementation Priority**: HIGH - Unblocks development immediately

---
**Decision Date**: 2025-09-26
**Implementation Status**: Approved - Execute Immediately
**Supersedes**: ADR-001 (Expo migration approach abandoned)