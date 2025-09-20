# ScripTeam AI Voice Practice App - Frontend Generation Prompt

## High-Level Goal
Create a React Native mobile application for ScripTeam - an AI-powered acting practice app that enables drama students to practice scenes with character-specific AI voices. Focus on mobile-first design with typewriter font authenticity and voice-first interaction patterns.

## Detailed, Step-by-Step Instructions

1. **Set up the React Native project structure:**
   - Create main navigation using bottom tabs: Scripts, Practice, Progress, Profile
   - Implement stack navigation for detailed screens within each tab
   - Set up TypeScript configuration for type safety
   - Configure audio handling libraries for voice interaction

2. **Create the Script Upload & AI Processing screen:**
   - Design drag-drop upload area with file format guidance (PDF, TXT support)
   - Build 6-phase AI processing animation sequence (90-120 seconds)
   - Show progressive character discovery with personality trait reveals
   - Display value communication overlay: "€120 saved vs. human actors"
   - Add engaging copy during processing: "Creating voice for ROMEO (passionate, young)"

3. **Build the Character Selection interface:**
   - Create character cards with auto-generated personality traits
   - Add voice preview buttons with 15-second sample dialogue
   - Implement "Your Scene Partners" heading to reinforce value
   - Design user character selection with role confirmation
   - Include premium voice options teaser with upgrade path

4. **Implement the Practice Session interface (CRITICAL COMPONENT):**
   - Use Courier Prime/Courier New for script text (typewriter authenticity)
   - Create adaptive script visibility system: "First read" → "Know all my lines"
   - Build character avatar system showing speaking order (A → You → B → You)
   - Add real-time waveform display during recording/AI response
   - Implement turn anticipation with 3-2-1 countdown and cue highlighting
   - Design floating practice controls for one-handed operation
   - Add voice-activated emergency controls ("Hey ScripTeam, pause")

5. **Create Progress Dashboard:**
   - Design script familiarity progression indicators
   - Build session streak counters and achievement badges
   - Add performance analytics with timing accuracy display
   - Implement next practice session recommendations

6. **Apply consistent styling throughout:**
   - Primary: #2C3E50, Secondary: #E67E22, Success: #27AE60
   - Dual typography: Courier Prime for scripts, Inter for UI
   - 8px base spacing system with 44px minimum touch targets
   - WCAG AAA contrast compliance for all text combinations

## Code Examples, Data Structures & Constraints

### Technology Stack
```typescript
// Use these exact dependencies
"react-native": "latest",
"@react-navigation/native": "^6.0",
"@react-navigation/bottom-tabs": "^6.0",
"react-native-sound": "^0.11", // Audio handling
"react-native-document-picker": "^8.0", // File upload
"@react-native-voice/voice": "^3.0" // Voice recognition
```

### Script Display Component Structure
```typescript
interface ScriptDisplayProps {
  familiarityLevel: 'first-read' | 'know-some' | 'know-most' | 'know-all';
  currentLine: string;
  contextLines: string[];
  userCharacter: string;
  currentSpeaker: string;
}
```

### Typography Configuration
```typescript
const fonts = {
  script: 'Courier Prime', // FOR SCRIPT CONTENT ONLY
  ui: 'Inter', // FOR ALL UI ELEMENTS
};

const textSizes = {
  scriptText: 16, // Mobile-optimized script reading
  h1: 32,
  h2: 24,
  body: 16,
};
```

### Voice Practice Session Flow
```typescript
// Session states for voice interaction
type SessionState = 'setup' | 'pre-processing' | 'practicing' | 'paused' | 'completed';
type FamiliarityLevel = 'first-read' | 'know-some' | 'know-most' | 'know-all';
```

### Design Constraints - CRITICAL REQUIREMENTS
- **DO NOT** use generic fonts for script content - MUST use Courier Prime/Courier New
- **DO NOT** create complex animations that drain battery during practice
- **DO NOT** add unnecessary UI elements during active voice practice
- **DO NOT** use bright colors that cause eye strain during extended reading
- **DO NOT** make touch targets smaller than 44px for practice controls
- **DO NOT** add features that require constant internet - core practice must work offline

### API Integration Points
```typescript
// AI service integration structure
interface AIService {
  analyzeScript: (text: string) => Promise<Character[]>;
  generateVoice: (text: string, character: Character) => Promise<AudioFile>;
  processSession: (session: PracticeSession) => Promise<SessionResult>;
}
```

## Define a Strict Scope

### Create These Files ONLY:
1. `src/screens/ScriptUpload.tsx` - Upload and AI processing screen
2. `src/screens/CharacterSelection.tsx` - Character and voice selection
3. `src/screens/PracticeSession.tsx` - Main practice interface with script display
4. `src/screens/ProgressDashboard.tsx` - Progress tracking and analytics
5. `src/components/ScriptDisplay.tsx` - Custom script component with typewriter fonts
6. `src/components/VoicePracticeControls.tsx` - Floating practice controls
7. `src/components/CharacterAvatars.tsx` - Speaking order visual system
8. `src/navigation/AppNavigator.tsx` - Bottom tab navigation setup

### DO NOT Modify:
- Any existing configuration files
- Authentication/login systems (out of scope for this prompt)
- Backend/API implementation files
- Database schemas or data models
- CI/CD or build configuration files

### Mobile-First Responsive Approach:
- Design for iPhone 12/13 (390x844) as primary breakpoint
- Ensure touch targets work for one-handed operation
- Test layouts on Android (360x640) for compatibility
- Use Flexbox for responsive layouts, avoid fixed positioning
- Optimize for portrait orientation (landscape is secondary)

### Accessibility Requirements:
- All interactive elements must have accessibility labels
- Support for screen readers with semantic structure
- High contrast mode compatibility
- Voice command alternatives for all practice controls
- Reduced motion support for animations

### Performance Constraints:
- Keep bundle size under 100MB total
- Optimize images for mobile (WebP format preferred)
- Lazy load non-critical components
- Use React.memo for expensive script rendering
- Implement efficient audio buffer management

---
