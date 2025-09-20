import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Crown, CheckCircle, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Character } from '@/lib/types';
import { mockCharacters } from '@/lib/mock-data';

interface CharacterSelectionProps {
  onSelectionComplete: (userCharacter: string, practiceCharacters: Character[]) => void;
}

const CharacterSelection = ({ onSelectionComplete }: CharacterSelectionProps) => {
  const [selectedUserCharacter, setSelectedUserCharacter] = useState<string>('');
  const [playingPreview, setPlayingPreview] = useState<string>('');

  const handleVoicePreview = (characterId: string) => {
    if (playingPreview === characterId) {
      setPlayingPreview('');
      return;
    }
    
    setPlayingPreview(characterId);
    // Simulate 15-second preview
    setTimeout(() => {
      setPlayingPreview('');
    }, 3000); // Shortened for demo
  };

  const handleContinue = () => {
    if (!selectedUserCharacter) return;
    
    const practiceCharacters = mockCharacters.filter(
      char => char.name !== selectedUserCharacter
    );
    
    onSelectionComplete(selectedUserCharacter, practiceCharacters);
  };

  const availableCharacters = mockCharacters;
  const hasSelection = selectedUserCharacter !== '';

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Choose Your Character</h1>
        <p className="text-muted-foreground">
          Select who you'll be playing in this scene
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span>Your Scene Partners</span>
          <Badge variant="outline" className="text-xs">
            AI-Generated
          </Badge>
        </h2>

        {availableCharacters.map((character) => (
          <Card 
            key={character.id}
            className={cn(
              "transition-all duration-normal cursor-pointer border-2",
              selectedUserCharacter === character.name 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-border hover:border-primary/30 hover:shadow-soft"
            )}
            onClick={() => setSelectedUserCharacter(character.name)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-script text-lg">{character.name}</span>
                  {character.isPremium && (
                    <Crown className="h-4 w-4 text-secondary" />
                  )}
                </div>
                {selectedUserCharacter === character.name && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-foreground/80">
                  {character.personality}
                </p>
                {character.age && (
                  <p className="text-xs text-muted-foreground">
                    Age: {character.age}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {character.traits.map((trait) => (
                  <Badge 
                    key={trait} 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="voice"
                  size="sm"
                  className={cn(
                    "flex items-center gap-2 text-xs",
                    playingPreview === character.id && "bg-secondary text-secondary-foreground"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVoicePreview(character.id);
                  }}
                >
                  {playingPreview === character.id ? (
                    <>
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3 w-3" />
                      Voice Preview
                    </>
                  )}
                </Button>

                {character.isPremium && (
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                    Premium Voice
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
        <div className="flex items-center gap-2 text-success font-medium text-sm mb-2">
          <CheckCircle className="h-4 w-4" />
          Value Delivered
        </div>
        <p className="text-sm text-success/80">
          ✨ <strong>€120 saved</strong> vs. hiring human actors for this practice session
        </p>
      </div>

      {hasSelection && (
        <div className="space-y-3 animate-slide-up">
          <div className="bg-accent-warm rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Your Selection:</h4>
            <p className="text-sm">
              You'll be playing <strong className="font-script">{selectedUserCharacter}</strong>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              The AI will voice all other characters in the scene
            </p>
          </div>

          <Button 
            variant="practice"
            size="lg"
            className="w-full"
            onClick={handleContinue}
          >
            <Play className="h-4 w-4" />
            Start Practice Session
          </Button>
        </div>
      )}

      {!hasSelection && (
        <div className="text-center text-sm text-muted-foreground">
          Select your character to continue
        </div>
      )}
    </div>
  );
};

export default CharacterSelection;