# Frontend Architecture

The React Native frontend is designed around the voice-first practice experience with progressive script familiarity and multilingual support:

## Component Architecture

### Component Organization

```
apps/mobile/src/
├── components/           # Reusable UI components
│   ├── common/          # Basic UI elements (Button, Input, Modal)
│   ├── practice/        # Practice session specific components
│   ├── script/          # Script display and management
│   └── character/       # Character selection and voice preview
├── screens/             # Full screen components
│   ├── auth/           # Authentication flows
│   ├── dashboard/      # Main navigation hub
│   ├── practice/       # Practice session screens
│   ├── progress/       # Analytics and progression
│   └── settings/       # User preferences and account
├── services/           # API communication layer
│   ├── api/           # REST API clients
│   ├── auth/          # Auth0 integration
│   ├── audio/         # Audio playback and caching
│   └── storage/       # Local storage management
├── hooks/             # Custom React hooks
│   ├── useAuth.ts     # Authentication state
│   ├── useAudio.ts    # Audio playback control
│   ├── useScript.ts   # Script processing state
│   └── usePractice.ts # Practice session management
├── stores/            # Zustand state management
│   ├── authStore.ts   # User authentication state
│   ├── scriptStore.ts # Script and character data
│   ├── practiceStore.ts # Active session state
│   └── settingsStore.ts # User preferences
├── types/             # Shared TypeScript interfaces
│   ├── api.ts         # API response types
│   ├── practice.ts    # Practice session types
│   └── user.ts        # User and preference types
└── utils/             # Helper functions
    ├── audio.ts       # Audio processing utilities
    ├── i18n.ts        # Internationalization setup
    └── validation.ts  # Form validation helpers
```

### Component Template

```typescript
import React from 'react';
import { Box, Text } from 'native-base';
import { useTranslation } from 'react-i18next';

interface ScriptDisplayProps {
  script: ProcessedScript;
  familiarityLevel: FamiliarityLevel;
  currentLine: number;
  onLineSelect: (lineNumber: number) => void;
}

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({
  script,
  familiarityLevel,
  currentLine,
  onLineSelect
}) => {
  const { t } = useTranslation();

  const getLineOpacity = (lineNumber: number) => {
    switch (familiarityLevel) {
      case 'first_read': return 1.0;
      case 'know_some_lines': return lineNumber === currentLine ? 1.0 : 0.6;
      case 'know_most_lines': return lineNumber === currentLine ? 1.0 : 0.3;
      case 'know_all_lines': return lineNumber === currentLine ? 1.0 : 0.0;
      default: return 1.0;
    }
  };

  return (
    <Box flex={1} padding={4}>
      {script.scenes.map((scene) => (
        <Box key={scene.id} marginBottom={6}>
          <Text fontSize="lg" fontWeight="bold" marginBottom={2}>
            {scene.title}
          </Text>
          {scene.dialogue.map((line) => (
            <Box
              key={line.id}
              opacity={getLineOpacity(line.lineNumber)}
              onTouchEnd={() => onLineSelect(line.lineNumber)}
              padding={2}
              backgroundColor={line.lineNumber === currentLine ? 'primary.50' : 'transparent'}
            >
              <Text fontFamily="CourierPrime" fontSize="md">
                <Text fontWeight="bold">{line.character}:</Text> {line.text}
              </Text>
              {line.stagingNotes && (
                <Text fontStyle="italic" color="gray.600" fontSize="sm">
                  ({line.stagingNotes})
                </Text>
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};
```

## State Management Architecture

### State Structure

```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

// stores/scriptStore.ts
interface ScriptState {
  scripts: Script[];
  currentScript: Script | null;
  processingStatus: ProcessingStatus;
  characters: Character[];
  uploadScript: (file: File, expectedLanguage?: 'es' | 'en') => Promise<void>;
  processScript: (scriptId: string, confirmLanguage: 'es' | 'en') => Promise<void>;
  selectScript: (scriptId: string) => void;
}

// stores/practiceStore.ts
interface PracticeState {
  activeSession: PracticeSession | null;
  currentLine: number;
  audioCache: Map<string, string>; // character audio URLs
  isPlaying: boolean;
  startSession: (config: SessionConfig) => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => Promise<void>;
  playCharacterLine: (lineId: string) => Promise<void>;
}

// stores/settingsStore.ts
interface SettingsState {
  language: 'es' | 'en';
  voiceSettings: VoiceSettings;
  practiceSettings: PracticeSettings;
  accessibility: AccessibilitySettings;
  updateLanguage: (language: 'es' | 'en') => void;
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
}
```

## Routing Architecture

### Route Organization

```typescript
// navigation/AppNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PracticeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ScriptSelection" component={ScriptSelectionScreen} />
    <Stack.Screen name="CharacterSelection" component={CharacterSelectionScreen} />
    <Stack.Screen name="FamiliarityLevel" component={FamiliarityLevelScreen} />
    <Stack.Screen name="PracticeSession" component={PracticeSessionScreen} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Scripts"
        component={ScriptStack}
        options={{
          tabBarLabel: t('navigation.scripts'),
          tabBarIcon: ({ color }) => <Icon name="file-text" color={color} />
        }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeStack}
        options={{
          tabBarLabel: t('navigation.practice'),
          tabBarIcon: ({ color }) => <Icon name="play" color={color} />
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressStack}
        options={{
          tabBarLabel: t('navigation.progress'),
          tabBarIcon: ({ color }) => <Icon name="trending-up" color={color} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: t('navigation.profile'),
          tabBarIcon: ({ color }) => <Icon name="user" color={color} />
        }}
      />
    </Tab.Navigator>
  );
};
```

### Protected Route Pattern

```typescript
// components/auth/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
  allowedLanguages?: ('es' | 'en')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresSubscription = false,
  allowedLanguages
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const { t } = useTranslation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (requiresSubscription && user?.subscription === 'free') {
    return (
      <UpgradePrompt
        message={t('subscription.upgradeRequired')}
        feature="premium-voices"
      />
    );
  }

  if (allowedLanguages && !allowedLanguages.includes(user?.preferences.language)) {
    return (
      <LanguageWarning
        message={t('language.notSupported')}
        supportedLanguages={allowedLanguages}
      />
    );
  }

  return <>{children}</>;
};
```

## Frontend Services Layer

### API Client Setup

```typescript
// services/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../../stores/authStore';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth tokens
    this.client.interceptors.request.use(
      (config) => {
        const { token } = useAuthStore.getState();
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
      (error) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
        }
        return Promise.reject(error);
      }
    );
  }

  // Script management
  async uploadScript(file: File, expectedLanguage?: 'es' | 'en'): Promise<Script> {
    const formData = new FormData();
    formData.append('file', file);
    if (expectedLanguage) {
      formData.append('expectedLanguage', expectedLanguage);
    }

    const response = await this.client.post<Script>('/scripts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async processScript(scriptId: string, confirmLanguage: 'es' | 'en'): Promise<void> {
    await this.client.post(`/scripts/${scriptId}/process`, {
      confirmLanguage,
      voicePreferences: {
        region: 'spain' // Default to Spain Spanish
      }
    });
  }

  // Practice session management
  async startPracticeSession(config: SessionConfig): Promise<PracticeSession> {
    const response = await this.client.post<PracticeSession>('/practice/sessions', config);
    return response.data;
  }

  async updateSessionProgress(sessionId: string, progress: SessionProgress): Promise<void> {
    await this.client.patch(`/practice/sessions/${sessionId}`, progress);
  }
}

export const apiClient = new ApiClient();
```

### Service Example

```typescript
// services/script/scriptService.ts
import { apiClient } from '../api/client';
import { useScriptStore } from '../../stores/scriptStore';

export class ScriptService {
  static async uploadAndProcess(file: File, expectedLanguage?: 'es' | 'en'): Promise<Script> {
    try {
      // Upload script
      const script = await apiClient.uploadScript(file, expectedLanguage);

      // Update store
      useScriptStore.getState().addScript(script);

      // Start processing
      await apiClient.processScript(script.id, script.primaryLanguage);

      return script;
    } catch (error) {
      if (error.response?.data?.code === 'LANGUAGE_MISMATCH') {
        throw new LanguageMismatchError(error.response.data.message);
      }
      throw error;
    }
  }

  static async getCharacters(scriptId: string): Promise<Character[]> {
    try {
      const characters = await apiClient.getCharacters(scriptId);
      useScriptStore.getState().setCharacters(characters);
      return characters;
    } catch (error) {
      console.error('Failed to load characters:', error);
      throw error;
    }
  }
}
```
