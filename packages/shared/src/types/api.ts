// API types based on architecture/api-specification.md

import { Script, Character } from './script';
import { User } from './user';

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  provider: 'auth0' | 'google' | 'apple' | 'institutional';
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Script upload types
export interface ScriptUploadRequest {
  file: File;
  title?: string;
  expectedLanguage?: 'es' | 'en' | 'auto';
}

export interface ScriptUploadResponse {
  id: string;
  title: string;
  processingStatus: string;
  uploadedAt: string;
}

// Script processing types
export interface ScriptProcessRequest {
  confirmLanguage: 'es' | 'en';
  voicePreferences: {
    region: 'spain' | 'mexico' | 'us' | 'uk';
  };
}

export interface ScriptProcessResponse {
  workflowId: string;
  estimatedDuration: number;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId: string;
}

// Webhook types
export interface WorkflowCompleteWebhook {
  workflowId: string;
  workflowType: string;
  status: 'completed' | 'failed';
  outputData?: Record<string, any>;
  errorDetails?: string;
}