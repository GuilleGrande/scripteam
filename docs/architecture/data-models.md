# Data Models

Based on the PRD requirements and the hybrid AI processing approach with comprehensive language support, here are the core data models that will be shared between frontend and backend:

## User

**Purpose:** Core user entity for authentication, progress tracking, and subscription management with Spanish/English language preferences

**Key Attributes:**
- id: string (UUID) - Unique user identifier
- email: string - Primary authentication credential
- authProvider: string - Auth0 provider (email, google, apple, institutional)
- profile: UserProfile - Extended user information
- subscription: SubscriptionTier - Current subscription level (free, premium, institutional)
- preferences: UserPreferences - Application settings including language and voice preferences
- createdAt: Date - Account creation timestamp
- lastActiveAt: Date - Last activity for engagement tracking

```typescript
interface User {
  id: string;
  email: string;
  authProvider: 'auth0' | 'google' | 'apple' | 'institutional';
  profile: UserProfile;
  subscription: SubscriptionTier;
  preferences: UserPreferences;
  createdAt: Date;
  lastActiveAt: Date;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  institution?: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  practiceGoals: string[];
  preferredLanguage: 'es' | 'en'; // Primary app language
}

interface UserPreferences {
  language: 'es' | 'en'; // App interface language
  voiceSettings: {
    playbackSpeed: number;
    volume: number;
    preferredVoiceGender: 'male' | 'female' | 'any';
    accentPreference: 'spain' | 'mexico' | 'us' | 'uk'; // Regional accent preference
  };
  practiceSettings: {
    defaultFamiliarityLevel: FamiliarityLevel;
    autoProgressDifficulty: boolean;
    practiceReminders: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReaderOptimized: boolean;
  };
}
```

## Script

**Purpose:** Uploaded script content with AI analysis results, processing status, and strict language detection

**Key Attributes:**
- id: string (UUID) - Unique script identifier
- userId: string - Owner reference
- title: string - Script title (extracted or user-provided)
- originalText: string - Raw uploaded script content
- detectedLanguage: string - GPT-OSS language detection result
- primaryLanguage: string - Confirmed language for voice generation
- processedContent: ProcessedScript - AI analysis results
- characters: Character[] - Detected characters with language-appropriate AI profiles
- uploadedAt: Date - Upload timestamp
- processingStatus: ProcessingStatus - Current AI processing state
- fileMetadata: FileMetadata - Original file information

```typescript
interface Script {
  id: string;
  userId: string;
  title: string;
  originalText: string;
  detectedLanguage: 'es' | 'en' | 'mixed' | 'unknown';
  primaryLanguage: 'es' | 'en'; // User-confirmed language for voice generation
  processedContent?: ProcessedScript;
  characters: Character[];
  uploadedAt: Date;
  processingStatus: ProcessingStatus;
  fileMetadata: FileMetadata;
}

interface ProcessedScript {
  scenes: Scene[];
  relationships: CharacterRelationship[];
  emotionalContext: EmotionalContext[];
  practiceMetadata: {
    estimatedDuration: number;
    difficultyLevel: number;
    recommendedSkillLevel: string;
    languageComplexity: number; // Language-specific complexity scoring
  };
}

interface Scene {
  id: string;
  title: string;
  startLine: number;
  endLine: number;
  characters: string[];
  dialogue: DialogueLine[];
  stageDirections: string[];
}

interface DialogueLine {
  id: string;
  character: string;
  text: string;
  lineNumber: number;
  emotionalTone?: string;
  stagingNotes?: string;
  languageNotes?: string; // Spanish-specific pronunciation or dialect notes
}

type ProcessingStatus = 'uploading' | 'analyzing' | 'language_detection' | 'generating_voices' | 'generating_avatars' | 'complete' | 'error';
```

## Character

**Purpose:** AI-detected characters with language-appropriate generated voices and visual representations

**Key Attributes:**
- id: string (UUID) - Unique character identifier
- scriptId: string - Associated script reference
- name: string - Character name from script
- aiProfile: CharacterProfile - AI-generated personality analysis
- voiceSettings: VoiceProfile - Generated voice characteristics with language matching
- avatar: CharacterAvatar - AI-generated visual representation
- relationships: CharacterRelationship[] - Character relationship analysis

```typescript
interface Character {
  id: string;
  scriptId: string;
  name: string;
  aiProfile: CharacterProfile;
  voiceSettings: VoiceProfile;
  avatar?: CharacterAvatar;
  relationships: CharacterRelationship[];
}

interface CharacterProfile {
  personality: string[];
  age: string;
  gender: string;
  emotionalRange: string[];
  speakingStyle: string;
  relationships: string;
  motivations: string[];
  culturalContext?: string; // Spanish/English cultural context
}

interface VoiceProfile {
  elevenLabsVoiceId?: string;
  playHtVoiceId?: string;
  language: 'es' | 'en'; // Must match script primary language
  region: 'spain' | 'mexico' | 'us' | 'uk'; // Regional accent
  characteristics: {
    age: 'young' | 'middle' | 'older';
    gender: 'male' | 'female' | 'neutral';
    tone: 'authoritative' | 'gentle' | 'energetic' | 'melancholic' | 'neutral';
    pace: 'slow' | 'normal' | 'fast';
  };
  generatedAt: Date;
  audioSamples: AudioSample[];
}

interface CharacterAvatar {
  imageUrl: string;
  style: 'realistic' | 'artistic' | 'minimal';
  culturalStyle?: 'spanish' | 'english' | 'neutral'; // Cultural appearance matching
  generatedAt: Date;
  prompt: string;
}

interface AudioSample {
  id: string;
  url: string;
  text: string;
  language: 'es' | 'en'; // Audio language
  duration: number;
  sceneId?: string;
  cached: boolean;
}
```

## PracticeSession

**Purpose:** User practice session tracking with performance analytics, progress measurement, and language-specific metrics

```typescript
interface PracticeSession {
  id: string;
  userId: string;
  scriptId: string;
  selectedCharacter: string;
  familiarityLevel: FamiliarityLevel;
  sessionLanguage: 'es' | 'en'; // Language of the practice session
  sessionData: SessionData;
  duration: number;
  startedAt: Date;
  completedAt?: Date;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
}

interface SessionData {
  scenesCompleted: string[];
  totalLines: number;
  userLines: number;
  accuracyMetrics: {
    timingAccuracy: number;
    lineAccuracy: number;
    overallConfidence: number;
    pronunciationAccuracy?: number; // Spanish pronunciation tracking
  };
  difficultyProgression: {
    startLevel: FamiliarityLevel;
    endLevel: FamiliarityLevel;
    progressionTriggers: string[];
  };
  voiceInteractions: VoiceInteraction[];
}

interface VoiceInteraction {
  lineId: string;
  userAudio?: string;
  aiAudioPlayed: string;
  timing: {
    expectedDuration: number;
    actualDuration: number;
    responseLatency: number;
  };
  userFeedback?: 'good' | 'too_fast' | 'too_slow' | 'repeat';
}

type FamiliarityLevel = 'first_read' | 'know_some_lines' | 'know_most_lines' | 'know_all_lines';
```

## n8nWorkflow

**Purpose:** Track AI workflow executions with language-specific processing and transparent debugging

```typescript
interface n8nWorkflow {
  id: string;
  workflowType: WorkflowType;
  relatedEntityId: string;
  language?: 'es' | 'en'; // Language context for workflow
  inputData: Record<string, any>;
  outputData?: Record<string, any>;
  status: WorkflowStatus;
  startedAt: Date;
  completedAt?: Date;
  executionTime?: number;
  errorDetails?: string;
  retryCount: number;
}

type WorkflowType =
  | 'script_analysis'
  | 'language_detection'
  | 'character_detection'
  | 'voice_generation_es'
  | 'voice_generation_en'
  | 'avatar_generation'
  | 'batch_processing';

type WorkflowStatus = 'queued' | 'running' | 'completed' | 'failed' | 'retrying';
```

**Relationships:**
- **User → Scripts:** One-to-many with language preference influence
- **Script → Characters:** One-to-many with language-matched voice generation
- **User → PracticeSessions:** One-to-many with language-specific analytics
- **Script → PracticeSessions:** One-to-many with language consistency validation
- **Character → AudioSamples:** One-to-many with strict language matching
