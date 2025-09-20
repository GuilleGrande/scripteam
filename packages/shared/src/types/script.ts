// Script-related types based on architecture/data-models.md

export type ProcessingStatus =
  | 'uploading'
  | 'analyzing'
  | 'language_detection'
  | 'generating_voices'
  | 'generating_avatars'
  | 'complete'
  | 'error';

export type FamiliarityLevel =
  | 'first_read'
  | 'know_some_lines'
  | 'know_most_lines'
  | 'know_all_lines';

export interface FileMetadata {
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

export interface Script {
  id: string;
  userId: string;
  title: string;
  originalText: string;
  detectedLanguage: 'es' | 'en' | 'mixed' | 'unknown';
  primaryLanguage: 'es' | 'en';
  processedContent?: ProcessedScript;
  characters: Character[];
  uploadedAt: Date;
  processingStatus: ProcessingStatus;
  fileMetadata: FileMetadata;
}

export interface ProcessedScript {
  scenes: Scene[];
  relationships: CharacterRelationship[];
  emotionalContext: EmotionalContext[];
  practiceMetadata: {
    estimatedDuration: number;
    difficultyLevel: number;
    recommendedSkillLevel: string;
    languageComplexity: number;
  };
}

export interface Scene {
  id: string;
  title: string;
  startLine: number;
  endLine: number;
  characters: string[];
  dialogue: DialogueLine[];
  stageDirections: string[];
}

export interface DialogueLine {
  id: string;
  character: string;
  text: string;
  lineNumber: number;
  emotionalTone?: string;
  stagingNotes?: string;
  languageNotes?: string;
}

export interface Character {
  id: string;
  scriptId: string;
  name: string;
  aiProfile: CharacterProfile;
  voiceSettings: VoiceProfile;
  avatar?: CharacterAvatar;
  relationships: CharacterRelationship[];
}

export interface CharacterProfile {
  personality: string[];
  age: string;
  gender: string;
  emotionalRange: string[];
  speakingStyle: string;
  relationships: string;
  motivations: string[];
  culturalContext?: string;
}

export interface VoiceProfile {
  elevenLabsVoiceId?: string;
  playHtVoiceId?: string;
  language: 'es' | 'en';
  region: 'spain' | 'mexico' | 'us' | 'uk';
  characteristics: {
    age: 'young' | 'middle' | 'older';
    gender: 'male' | 'female' | 'neutral';
    tone: 'authoritative' | 'gentle' | 'energetic' | 'melancholic' | 'neutral';
    pace: 'slow' | 'normal' | 'fast';
  };
  generatedAt: Date;
  audioSamples: AudioSample[];
}

export interface CharacterAvatar {
  imageUrl: string;
  style: 'realistic' | 'artistic' | 'minimal';
  culturalStyle?: 'spanish' | 'english' | 'neutral';
  generatedAt: Date;
  prompt: string;
}

export interface AudioSample {
  id: string;
  url: string;
  text: string;
  language: 'es' | 'en';
  duration: number;
  sceneId?: string;
  cached: boolean;
}

export interface CharacterRelationship {
  fromCharacter: string;
  toCharacter: string;
  relationshipType: string;
  description: string;
}

export interface EmotionalContext {
  sceneId: string;
  overallTone: string;
  tensions: string[];
  emotionalArc: string;
}