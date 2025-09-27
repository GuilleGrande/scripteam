# Level 4: Code Examples and Implementation Patterns

## Overview

The Code level provides concrete implementation examples and patterns used throughout the ScripTeam codebase. These examples demonstrate how the components from Level 3 are actually implemented and how they interact with each other.

## Core Domain Models

### Script and Character Domain Models

```typescript
// packages/shared/src/types/script.ts

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

export interface Character {
  id: string;
  scriptId: string;
  name: string;
  aiProfile: CharacterProfile;
  voiceSettings: VoiceProfile;
  avatar?: CharacterAvatar;
  relationships: CharacterRelationship[];
}

export interface VoiceProfile {
  elevenLabsVoiceId?: string;
  playHtVoiceId?: string;
  language: 'es' | 'en';
  region: 'spain' | 'mexico' | 'us' | 'uk';
  characteristics: VoiceCharacteristics;
  generatedAt: Date;
  audioSamples: AudioSample[];
}

// Domain validation using Zod
import { z } from 'zod';

export const ScriptUploadSchema = z.object({
  title: z.string().min(1).max(200),
  expectedLanguage: z.enum(['es', 'en', 'auto']).optional(),
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB
    'File size must be less than 10MB'
  ).refine(
    (file) => ['application/pdf', 'text/plain'].includes(file.mimetype),
    'Only PDF and TXT files are allowed'
  )
});
```

### Service Layer Pattern

```typescript
// apps/api/src/services/scriptService.ts

import { Script, ProcessingStatus } from '@scripteam/shared/types/script';
import { databaseService } from './database';
import { pdfExtractorService } from './pdfExtractorService';
import { aiOrchestrationService } from './aiOrchestrationService';

export class ScriptService {
  private scriptsCache = new Map<string, Script>();

  async createScript(params: CreateScriptParams): Promise<Script> {
    const script: Script = {
      id: randomUUID(),
      userId: params.userId,
      title: params.title,
      originalText: '',
      detectedLanguage: 'unknown',
      primaryLanguage: params.expectedLanguage === 'auto' ? 'en' : params.expectedLanguage,
      characters: [],
      uploadedAt: new Date(),
      processingStatus: 'uploading',
      fileMetadata: params.fileMetadata,
    };

    try {
      // Use transaction for atomicity
      await this.withTransaction(async (transaction) => {
        await this.persistScript(script, transaction);

        // Extract text based on file type
        if (params.fileMetadata.mimeType === 'application/pdf') {
          script.originalText = await pdfExtractorService.extractText(params.fileBuffer);
        } else {
          script.originalText = params.fileBuffer.toString('utf-8');
        }

        await this.updateScript(script.id, { originalText: script.originalText }, transaction);
      });

      // Start async AI processing
      this.startProcessing(script.id).catch(error => {
        console.error(`Processing failed for script ${script.id}:`, error);
      });

      return script;
    } catch (error) {
      // Fallback to in-memory storage
      this.scriptsCache.set(script.id, script);
      console.warn('Using in-memory storage - script will not persist');
      return script;
    }
  }

  async startProcessing(scriptId: string): Promise<void> {
    await this.updateProcessingStatus(scriptId, 'analyzing');

    // Trigger AI orchestration workflow
    await aiOrchestrationService.triggerScriptAnalysis({
      scriptId,
      callbackUrl: `${process.env.API_BASE_URL}/webhooks/script-processing`
    });
  }

  private async withTransaction<T>(
    operation: (transaction: DatabaseTransaction) => Promise<T>
  ): Promise<T> {
    const transaction = await databaseService.beginTransaction();
    try {
      const result = await operation(transaction);
      await databaseService.commitTransaction(transaction);
      return result;
    } catch (error) {
      await databaseService.rollbackTransaction(transaction);
      throw error;
    }
  }
}

export const scriptService = new ScriptService();
```

## API Layer Implementation

### Express.js Controller Pattern

```typescript
// apps/api/src/routes/scripts.ts

import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import { scriptService } from '../services/scriptService';
import { authenticateUser } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { uploadRateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'application/pdf'];
    cb(null, allowedTypes.includes(file.mimetype));
  },
});

// Request validation schema
const uploadScriptSchema = z.object({
  title: z.string().optional(),
  expectedLanguage: z.enum(['es', 'en', 'auto']).optional(),
});

// POST /scripts - Upload and process script
router.post('/',
  uploadRateLimiter.middleware(),
  authenticateUser,
  upload.single('file'),
  validateRequest({ body: uploadScriptSchema }),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
          message: 'Please upload a PDF or TXT file'
        });
      }

      const { title, expectedLanguage } = req.body;

      const script = await scriptService.createScript({
        userId: req.user.id,
        title: title || req.file.originalname.replace(/\.[^/.]+$/, ''),
        expectedLanguage: expectedLanguage || 'auto',
        fileBuffer: req.file.buffer,
        fileMetadata: {
          originalName: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype,
          uploadedAt: new Date(),
        },
      });

      res.status(201).json({
        id: script.id,
        title: script.title,
        processingStatus: script.processingStatus,
        uploadedAt: script.uploadedAt,
        fileMetadata: script.fileMetadata,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /scripts/:id - Get script details
router.get('/:id',
  authenticateUser,
  async (req, res, next) => {
    try {
      const script = await scriptService.getScript(req.params.id);

      if (!script) {
        return res.status(404).json({ error: 'Script not found' });
      }

      // Check ownership
      if (script.userId !== req.user.id && !req.user.isTeacher) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(script);
    } catch (error) {
      next(error);
    }
  }
);

export { router as scriptsRouter };
```

### Middleware Implementation Patterns

```typescript
// apps/api/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userService } from '../services/userService';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    isTeacher: boolean;
  };
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

    const user = await userService.getUserById(decoded.sub!);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    (req as AuthenticatedRequest).user = {
      id: user.id,
      email: user.email,
      role: user.role,
      isTeacher: user.role === 'teacher' || user.role === 'admin',
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    next(error);
  }
};

// Rate limiting middleware
export class RateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>();

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.getKey(req);
      const now = Date.now();

      let entry = this.store.get(key);
      if (!entry || now > entry.resetTime) {
        entry = { count: 0, resetTime: now + this.windowMs };
        this.store.set(key, entry);
      }

      if (entry.count >= this.maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

        res.set({
          'X-RateLimit-Limit': this.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
          'Retry-After': retryAfter.toString()
        });

        return res.status(429).json({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter
        });
      }

      entry.count++;
      res.set({
        'X-RateLimit-Limit': this.maxRequests.toString(),
        'X-RateLimit-Remaining': (this.maxRequests - entry.count).toString(),
        'X-RateLimit-Reset': new Date(entry.resetTime).toISOString()
      });

      next();
    };
  }

  private getKey(req: Request): string {
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
}
```

## Frontend React Implementation

### Component Architecture Pattern

```typescript
// apps/web/src/components/ScriptUpload.tsx

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '../store/useStore';
import { apiClient } from '../lib/api';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { ScriptUploadSchema } from '@scripteam/shared/types/script';

interface ScriptUploadProps {
  onUploadComplete?: (scriptId: string) => void;
}

export const ScriptUpload: React.FC<ScriptUploadProps> = ({ onUploadComplete }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [expectedLanguage, setExpectedLanguage] = useState<'es' | 'en' | 'auto'>('auto');

  const queryClient = useQueryClient();
  const { addNotification } = useStore();

  const uploadMutation = useMutation({
    mutationFn: async (data: { file: File; title: string; expectedLanguage: string }) => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('title', data.title);
      formData.append('expectedLanguage', data.expectedLanguage);

      return apiClient.post('/scripts', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });
    },
    onSuccess: (response) => {
      addNotification({
        type: 'success',
        message: 'Script uploaded successfully!',
      });

      // Invalidate scripts query to refetch list
      queryClient.invalidateQueries({ queryKey: ['scripts'] });

      onUploadComplete?.(response.data.id);
      setUploadProgress(0);
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Upload failed',
      });
      setUploadProgress(0);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file using shared schema
    const validation = ScriptUploadSchema.safeParse({
      file,
      title: title || file.name.replace(/\.[^/.]+$/, ''),
      expectedLanguage,
    });

    if (!validation.success) {
      addNotification({
        type: 'error',
        message: validation.error.issues[0].message,
      });
      return;
    }

    // Auto-generate title from filename if not provided
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    uploadMutation.mutate({
      file,
      title: title || file.name.replace(/\.[^/.]+$/, ''),
      expectedLanguage,
    });
  }, [title, expectedLanguage, uploadMutation, addNotification]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploadMutation.isPending ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />

        {uploadMutation.isPending ? (
          <div className="space-y-2">
            <p>Uploading script...</p>
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
          </div>
        ) : (
          <>
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2">
              {isDragActive
                ? 'Drop your script here...'
                : 'Drag and drop your script, or click to browse'
              }
            </p>
            <p className="text-sm text-gray-500">PDF or TXT files only, max 10MB</p>
          </>
        )}
      </div>

      {fileRejections.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            {fileRejections[0].errors[0].message}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Script Title (optional)
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter script title..."
          disabled={uploadMutation.isPending}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="language" className="block text-sm font-medium">
          Expected Language
        </label>
        <select
          id="language"
          value={expectedLanguage}
          onChange={(e) => setExpectedLanguage(e.target.value as 'es' | 'en' | 'auto')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled={uploadMutation.isPending}
        >
          <option value="auto">Auto-detect</option>
          <option value="es">Spanish</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );
};
```

### State Management Pattern

```typescript
// apps/web/src/store/useStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  autoRemove?: boolean;
}

interface StoreState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;

  // UI State
  notifications: Notification[];
  isLoading: boolean;

  // Practice Session State
  currentSession: {
    scriptId: string | null;
    characterId: string | null;
    isActive: boolean;
  };
}

interface StoreActions {
  // Authentication actions
  setUser: (user: User | null) => void;
  logout: () => void;

  // Notification actions
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;

  // UI actions
  setLoading: (loading: boolean) => void;

  // Practice session actions
  startPracticeSession: (scriptId: string, characterId: string) => void;
  endPracticeSession: () => void;
}

export const useStore = create<StoreState & StoreActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      notifications: [],
      isLoading: false,
      currentSession: {
        scriptId: null,
        characterId: null,
        isActive: false,
      },

      // Authentication actions
      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
      }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
        currentSession: {
          scriptId: null,
          characterId: null,
          isActive: false,
        },
      }),

      // Notification actions
      addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = { ...notification, id };

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-remove success notifications after 5 seconds
        if (notification.autoRemove !== false && notification.type === 'success') {
          setTimeout(() => {
            get().removeNotification(id);
          }, 5000);
        }
      },

      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),

      // UI actions
      setLoading: (loading) => set({ isLoading: loading }),

      // Practice session actions
      startPracticeSession: (scriptId, characterId) => set({
        currentSession: {
          scriptId,
          characterId,
          isActive: true,
        },
      }),

      endPracticeSession: () => set({
        currentSession: {
          scriptId: null,
          characterId: null,
          isActive: false,
        },
      }),
    }),
    {
      name: 'scripteam-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Don't persist notifications or loading state
      }),
    }
  )
);
```

### API Client Implementation

```typescript
// apps/web/src/lib/api.ts

import axios, { AxiosInstance, AxiosError } from 'axios';
import { useStore } from '../store/useStore';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const { addNotification, logout } = useStore.getState();

        // Handle authentication errors
        if (error.response?.status === 401) {
          logout();
          addNotification({
            type: 'error',
            message: 'Session expired. Please log in again.',
          });
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          addNotification({
            type: 'warning',
            message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
          });
        }

        // Handle server errors
        if (error.response?.status >= 500) {
          addNotification({
            type: 'error',
            message: 'Server error. Please try again later.',
          });
        }

        return Promise.reject(error);
      }
    );
  }

  // Script management
  async uploadScript(formData: FormData) {
    return this.client.post('/scripts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getScript(id: string) {
    return this.client.get(`/scripts/${id}`);
  }

  async getUserScripts() {
    return this.client.get('/scripts');
  }

  // Character management
  async getCharacters(scriptId: string) {
    return this.client.get(`/scripts/${scriptId}/characters`);
  }

  async generateVoices(scriptId: string, options: any) {
    return this.client.post(`/scripts/${scriptId}/voices`, options);
  }

  // Practice sessions
  async startPracticeSession(scriptId: string, config: any) {
    return this.client.post(`/scripts/${scriptId}/practice`, config);
  }

  async getPerformanceFeedback(sessionId: string) {
    return this.client.get(`/practice/${sessionId}/feedback`);
  }
}

export const apiClient = new ApiClient();
```

## Error Handling Patterns

### Global Error Boundary

```typescript
// apps/web/src/components/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);

    // Send to error tracking service
    if (import.meta.env.PROD) {
      // Sentry.captureException(error, { extra: errorInfo });
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                Something went wrong. Please try refreshing the page or contact support if the problem persists.
              </AlertDescription>
            </Alert>

            <div className="flex space-x-2">
              <Button onClick={this.handleRetry} variant="outline">
                Try Again
              </Button>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 p-4 bg-gray-100 rounded text-sm">
                <summary className="cursor-pointer font-medium">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Testing Patterns

### API Route Testing

```typescript
// apps/api/src/__tests__/scripts.test.ts

import request from 'supertest';
import { app } from '../index';
import { scriptService } from '../services/scriptService';
import { createTestUser } from './helpers/testUser';

describe('Scripts API', () => {
  let testUser: any;
  let authToken: string;

  beforeEach(async () => {
    testUser = await createTestUser();
    authToken = testUser.token;
  });

  describe('POST /api/scripts', () => {
    it('should upload script successfully', async () => {
      const response = await request(app)
        .post('/api/scripts')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', 'test/fixtures/test-script.pdf')
        .field('title', 'Test Script')
        .field('expectedLanguage', 'en')
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        title: 'Test Script',
        processingStatus: 'uploading',
        uploadedAt: expect.any(String),
      });

      // Verify script was created in database
      const script = await scriptService.getScript(response.body.id);
      expect(script).toBeTruthy();
      expect(script?.userId).toBe(testUser.id);
    });

    it('should reject files larger than 10MB', async () => {
      const response = await request(app)
        .post('/api/scripts')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', 'test/fixtures/large-file.pdf')
        .expect(413);

      expect(response.body).toMatchObject({
        error: 'File too large',
        message: 'File size must be less than 10MB',
      });
    });

    it('should enforce rate limiting', async () => {
      // Make 5 requests (the limit)
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/scripts')
          .set('Authorization', `Bearer ${authToken}`)
          .attach('file', 'test/fixtures/test-script.pdf')
          .expect(201);
      }

      // 6th request should be rate limited
      const response = await request(app)
        .post('/api/scripts')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', 'test/fixtures/test-script.pdf')
        .expect(429);

      expect(response.body.error).toBe('Too many requests');
      expect(response.headers).toHaveProperty('retry-after');
    });
  });
});
```

### React Component Testing

```typescript
// apps/web/src/components/__tests__/ScriptUpload.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ScriptUpload } from '../ScriptUpload';
import { apiClient } from '../../lib/api';

// Mock API client
jest.mock('../../lib/api');
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

// Test wrapper with providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('ScriptUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render upload interface', () => {
    render(<ScriptUpload />, { wrapper: createWrapper() });

    expect(screen.getByText(/drag and drop your script/i)).toBeInTheDocument();
    expect(screen.getByText(/pdf or txt files only/i)).toBeInTheDocument();
  });

  it('should upload file successfully', async () => {
    const user = userEvent.setup();
    const mockOnUploadComplete = jest.fn();

    mockApiClient.post.mockResolvedValue({
      data: { id: 'script-123', title: 'Test Script' },
    });

    render(<ScriptUpload onUploadComplete={mockOnUploadComplete} />, {
      wrapper: createWrapper(),
    });

    const file = new File(['test content'], 'test-script.txt', {
      type: 'text/plain',
    });

    const input = screen.getByLabelText(/drag and drop/i, { selector: 'input' });
    await user.upload(input, file);

    await waitFor(() => {
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/scripts',
        expect.any(FormData),
        expect.any(Object)
      );
    });

    await waitFor(() => {
      expect(mockOnUploadComplete).toHaveBeenCalledWith('script-123');
    });
  });

  it('should show error for invalid file type', async () => {
    const user = userEvent.setup();

    render(<ScriptUpload />, { wrapper: createWrapper() });

    const file = new File(['test content'], 'test-script.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    const input = screen.getByLabelText(/drag and drop/i, { selector: 'input' });
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/file type not accepted/i)).toBeInTheDocument();
    });

    expect(mockApiClient.post).not.toHaveBeenCalled();
  });
});
```

---

*These code examples demonstrate the implementation patterns and best practices used throughout the ScripTeam codebase, providing concrete guidance for developers working on the system.*