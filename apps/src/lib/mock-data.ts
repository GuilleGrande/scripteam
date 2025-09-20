// Mock data for ScripTeam AI Voice Practice App

import { Character, Script, PracticeSession, ProgressStats } from './types';

export const mockCharacters: Character[] = [
  {
    id: 'romeo-1',
    name: 'ROMEO',
    traits: ['Passionate', 'Young', 'Romantic', 'Impulsive'],
    voiceId: 'voice-romeo-passionate',
    personality: 'A young lover, intense and emotional',
    age: '16-18',
    description: 'The protagonist of Shakespeare\'s Romeo and Juliet',
    isPremium: false
  },
  {
    id: 'juliet-1',
    name: 'JULIET',
    traits: ['Innocent', 'Determined', 'Clever', 'Brave'],
    voiceId: 'voice-juliet-innocent',
    personality: 'Intelligent young woman, strong-willed yet tender',
    age: '14-16',
    description: 'The female lead of Romeo and Juliet',
    isPremium: false
  },
  {
    id: 'mercutio-1',
    name: 'MERCUTIO',
    traits: ['Witty', 'Loyal', 'Hot-tempered', 'Charismatic'],
    voiceId: 'voice-mercutio-witty',
    personality: 'Romeo\'s best friend, quick with jokes and sword',
    age: '18-22',
    description: 'The comic relief with a tragic end',
    isPremium: true
  }
];

export const mockScript: Script = {
  id: 'script-romeo-juliet-balcony',
  title: 'Romeo and Juliet - Balcony Scene (Act 2, Scene 2)',
  content: `ROMEO
But soft, what light through yonder window breaks?
It is the east, and Juliet is the sun.
Arise, fair sun, and kill the envious moon,
Who is already sick and pale with grief
That thou, her maid, art far more fair than she.

JULIET
O Romeo, Romeo, wherefore art thou Romeo?
Deny thy father and refuse thy name,
Or if thou wilt not, be but sworn my love,
And I'll no longer be a Capulet.

ROMEO
Shall I hear more, or shall I speak at this?

JULIET
'Tis but thy name that is my enemy.
Thou art thyself, though not a Montague.
What's Montague? It is nor hand, nor foot,
Nor arm, nor face, nor any other part
Belonging to a man. O, be some other name!`,
  characters: mockCharacters.slice(0, 2),
  lines: [
    {
      id: 'line-1',
      character: 'ROMEO',
      text: 'But soft, what light through yonder window breaks?',
      lineNumber: 1
    },
    {
      id: 'line-2',
      character: 'ROMEO',
      text: 'It is the east, and Juliet is the sun.',
      lineNumber: 2
    },
    {
      id: 'line-3',
      character: 'ROMEO',
      text: 'Arise, fair sun, and kill the envious moon,',
      lineNumber: 3
    },
    {
      id: 'line-4',
      character: 'JULIET',
      text: 'O Romeo, Romeo, wherefore art thou Romeo?',
      lineNumber: 4
    },
    {
      id: 'line-5',
      character: 'JULIET',
      text: 'Deny thy father and refuse thy name,',
      lineNumber: 5
    }
  ],
  uploadedAt: new Date(),
  processedAt: new Date(),
  estimatedDuration: 15
};

export const mockProgressStats: ProgressStats = {
  totalSessions: 24,
  totalPracticeTime: 180, // 3 hours
  averageAccuracy: 87,
  currentStreak: 5,
  scriptsCompleted: 3,
  favoriteCharacterType: 'Romantic Lead',
  weeklyGoal: 120,
  weeklyProgress: 95
};

export const processingPhases = [
  { phase: 'analyzing', message: 'Analyzing script structure and dialogue patterns...', duration: 15 },
  { phase: 'extracting', message: 'Extracting character personalities and traits...', duration: 20 },
  { phase: 'generating', message: 'Creating voice for ROMEO (passionate, young)...', duration: 25 },
  { phase: 'training', message: 'Training AI voices with character-specific patterns...', duration: 30 },
  { phase: 'optimizing', message: 'Optimizing voice responses for natural flow...', duration: 20 },
  { phase: 'finalizing', message: 'Finalizing your scene partners and practice setup...', duration: 10 }
] as const;