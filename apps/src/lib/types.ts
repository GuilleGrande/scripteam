// ScripTeam AI Voice Practice App Types

export type FamiliarityLevel = 'first-read' | 'know-some' | 'know-most' | 'know-all';
export type SessionState = 'setup' | 'pre-processing' | 'practicing' | 'paused' | 'completed';
export type ProcessingPhase = 'analyzing' | 'extracting' | 'generating' | 'training' | 'optimizing' | 'finalizing';

export interface Character {
  id: string;
  name: string;
  traits: string[];
  voiceId: string;
  voicePreview?: string;
  personality: string;
  age?: string;
  description?: string;
  isPremium?: boolean;
}

export interface ScriptLine {
  id: string;
  character: string;
  text: string;
  lineNumber: number;
  isStageDirection?: boolean;
  cueIn?: string;
  cueOut?: string;
}

export interface Script {
  id: string;
  title: string;
  content: string;
  characters: Character[];
  lines: ScriptLine[];
  uploadedAt: Date;
  processedAt?: Date;
  estimatedDuration?: number;
}

export interface PracticeSession {
  id: string;
  scriptId: string;
  userCharacter: string;
  familiarityLevel: FamiliarityLevel;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  linesCompleted: number;
  accuracy?: number;
  state: SessionState;
}

export interface SessionResult {
  sessionId: string;
  accuracy: number;
  timing: number;
  fluency: number;
  improvements: string[];
  nextRecommendation: string;
}

export interface ProgressStats {
  totalSessions: number;
  totalPracticeTime: number; // in minutes
  averageAccuracy: number;
  currentStreak: number;
  scriptsCompleted: number;
  favoriteCharacterType: string;
  weeklyGoal?: number;
  weeklyProgress: number;
}

export interface AIProcessingProgress {
  phase: ProcessingPhase;
  progress: number; // 0-100
  message: string;
  charactersFound?: number;
  estimatedTimeRemaining?: number;
}

export interface VoiceSettings {
  speed: number; // 0.5 - 2.0
  pitch: number; // -12 to +12 semitones
  volume: number; // 0-100
  emotionalIntensity: number; // 0-100
}

export interface PracticeSettings {
  familiarityLevel: FamiliarityLevel;
  showContextLines: boolean;
  highlightCues: boolean;
  countdown: boolean;
  voiceActivation: boolean;
  autoAdvance: boolean;
}