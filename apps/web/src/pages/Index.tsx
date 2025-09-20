import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  TrendingUp, 
  BookOpen, 
  Sparkles, 
  Clock,
  Target,
  Crown,
  Play
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import ScriptUpload from '@/components/ScriptUpload';
import CharacterSelection from '@/components/CharacterSelection';
import { Character } from '@/lib/types';
import { mockProgressStats } from '@/lib/mock-data';

type AppState = 'upload' | 'character-selection' | 'practice' | 'dashboard';

const Index = () => {
  const [activeTab, setActiveTab] = useState('scripts');
  const [appState, setAppState] = useState<AppState>('upload');
  const [selectedCharacters, setSelectedCharacters] = useState<{
    user: string;
    practice: Character[];
  } | null>(null);

  const handleUploadComplete = () => {
    setAppState('character-selection');
  };

  const handleCharacterSelection = (userCharacter: string, practiceCharacters: Character[]) => {
    setSelectedCharacters({
      user: userCharacter,
      practice: practiceCharacters
    });
    setAppState('practice');
    setActiveTab('practice');
  };

  const renderMainContent = () => {
    if (activeTab === 'scripts') {
      if (appState === 'upload') {
        return <ScriptUpload onUploadComplete={handleUploadComplete} />;
      }
      if (appState === 'character-selection') {
        return <CharacterSelection onSelectionComplete={handleCharacterSelection} />;
      }
    }

    if (activeTab === 'practice') {
      return (
        <div className="max-w-md mx-auto p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-gradient-secondary rounded-full flex items-center justify-center">
              <Mic className="h-8 w-8 text-secondary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Practice Session</h1>
            {selectedCharacters && (
              <p className="text-muted-foreground">
                Playing as <span className="font-script font-semibold">{selectedCharacters.user}</span>
              </p>
            )}
          </div>

          <Card className="border-primary/20 bg-gradient-warm">
            <CardHeader>
              <CardTitle className="font-script text-lg">Romeo and Juliet - Balcony Scene</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="script-text p-4 rounded-md font-script text-sm leading-relaxed">
                <div className="space-y-3">
                  <div className="text-script-text/60">
                    <strong>ROMEO</strong><br />
                    But soft, what light through yonder window breaks?
                  </div>
                  <div className="cue-highlight p-2 rounded">
                    <strong>JULIET</strong><br />
                    O Romeo, Romeo, wherefore art thou Romeo?
                  </div>
                  <div className="text-script-text/40">
                    <strong>ROMEO</strong><br />
                    Shall I hear more, or shall I speak at this?
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="practice" size="lg" className="shadow-warm">
                  <Play className="h-4 w-4" />
                  Start Practice
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            🎭 AI voices ready • Tap to begin scene
          </div>
        </div>
      );
    }

    if (activeTab === 'progress') {
      const stats = mockProgressStats;
      return (
        <div className="max-w-md mx-auto p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Your Progress</h1>
            <p className="text-muted-foreground">
              Track your acting practice journey
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
                <div className="text-xs text-muted-foreground">Practice Sessions</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-secondary">{stats.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-success">{stats.averageAccuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{Math.floor(stats.totalPracticeTime / 60)}h</div>
                <div className="text-xs text-muted-foreground">Practice Time</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5" />
                Weekly Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>{stats.weeklyProgress} minutes</span>
                <span className="text-muted-foreground">{stats.weeklyGoal} minutes</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-secondary h-2 rounded-full transition-all"
                  style={{ width: `${(stats.weeklyProgress / stats.weeklyGoal) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.weeklyGoal - stats.weeklyProgress} minutes to reach your goal
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-warm border-secondary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <Crown className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Favorite Character Type</div>
                  <div className="text-secondary text-sm font-medium">{stats.favoriteCharacterType}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'profile') {
      return (
        <div className="max-w-md mx-auto p-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary-foreground">DR</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Drama Student</h1>
              <p className="text-muted-foreground">Aspiring Actor</p>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Practice Streak</span>
                  <Badge className="bg-secondary/10 text-secondary">
                    {mockProgressStats.currentStreak} days
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Scripts Completed</span>
                  <span className="text-muted-foreground">{mockProgressStats.scriptsCompleted}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Practice Time</span>
                  <span className="text-muted-foreground">
                    {Math.floor(mockProgressStats.totalPracticeTime / 60)}h {mockProgressStats.totalPracticeTime % 60}m
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4 border-t border-border">
            <Button variant="outline" className="w-full">
              Settings & Preferences
            </Button>
          </div>
        </div>
      );
    }

    // Default welcome screen
    return (
      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto animate-bounce-in">
            <Sparkles className="h-10 w-10 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ScripTeam
            </h1>
            <p className="text-muted-foreground">
              AI-Powered Voice Practice for Actors
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-primary/20 bg-gradient-warm">
            <CardContent className="p-6 text-center space-y-3">
              <BookOpen className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">Upload & Practice</h3>
              <p className="text-sm text-muted-foreground">
                Upload any script and get AI scene partners in minutes
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <CardContent className="p-4 space-y-2">
                <Mic className="h-6 w-6 text-secondary mx-auto" />
                <div className="text-sm font-medium">Voice Training</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4 space-y-2">
                <TrendingUp className="h-6 w-6 text-success mx-auto" />
                <div className="text-sm font-medium">Track Progress</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <Button 
            variant="practice" 
            size="lg" 
            className="w-full shadow-warm"
            onClick={() => setActiveTab('scripts')}
          >
            <BookOpen className="h-4 w-4" />
            Get Started
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ScripTeam
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        {renderMainContent()}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
