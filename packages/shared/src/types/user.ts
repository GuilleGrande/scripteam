// User-related types based on architecture/data-models.md

export type SubscriptionTier = 'free' | 'premium' | 'institutional';

export interface User {
  id: string;
  email: string;
  authProvider: 'auth0' | 'google' | 'apple' | 'institutional';
  profile: UserProfile;
  subscription: SubscriptionTier;
  preferences: UserPreferences;
  createdAt: Date;
  lastActiveAt: Date;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  institution?: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  practiceGoals: string[];
  preferredLanguage: 'es' | 'en';
}

export interface UserPreferences {
  language: 'es' | 'en';
  voiceSettings: {
    playbackSpeed: number;
    volume: number;
    preferredVoiceGender: 'male' | 'female' | 'any';
    accentPreference: 'spain' | 'mexico' | 'us' | 'uk';
  };
  practiceSettings: {
    defaultFamiliarityLevel: import('./script').FamiliarityLevel;
    autoProgressDifficulty: boolean;
    practiceReminders: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReaderOptimized: boolean;
  };
}