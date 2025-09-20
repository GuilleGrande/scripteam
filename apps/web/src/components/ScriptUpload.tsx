import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIProcessingProgress, ProcessingPhase } from '@/lib/types';
import { processingPhases } from '@/lib/mock-data';

interface ScriptUploadProps {
  onUploadComplete: () => void;
}

const ScriptUpload = ({ onUploadComplete }: ScriptUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<AIProcessingProgress | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    const validTypes = ['text/plain', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or TXT file');
      return;
    }
    
    setUploadedFile(file);
    startProcessing();
  };

  const startProcessing = () => {
    setIsProcessing(true);
    let currentPhaseIndex = 0;
    let currentProgress = 0;

    const processPhase = () => {
      if (currentPhaseIndex >= processingPhases.length) {
        setProgress({
          phase: 'finalizing',
          progress: 100,
          message: '✨ Your scene partners are ready! €120 saved vs. human actors',
          charactersFound: 3
        });
        
        setTimeout(() => {
          setIsProcessing(false);
          onUploadComplete();
        }, 2000);
        return;
      }

      const phase = processingPhases[currentPhaseIndex];
      const phaseProgress = 100 / processingPhases.length;
      const startProgress = currentPhaseIndex * phaseProgress;

      setProgress({
        phase: phase.phase as ProcessingPhase,
        progress: startProgress,
        message: phase.message,
        charactersFound: currentPhaseIndex >= 1 ? Math.min(3, currentPhaseIndex) : undefined,
        estimatedTimeRemaining: processingPhases.slice(currentPhaseIndex).reduce((acc, p) => acc + p.duration, 0)
      });

      // Animate progress within the phase
      const interval = setInterval(() => {
        currentProgress += 2;
        if (currentProgress >= phaseProgress) {
          clearInterval(interval);
          currentPhaseIndex++;
          setTimeout(processPhase, 500);
        } else {
          setProgress(prev => prev ? {
            ...prev,
            progress: startProgress + currentProgress
          } : null);
        }
      }, (phase.duration * 1000) / (phaseProgress / 2));
    };

    setTimeout(processPhase, 1000);
  };

  if (isProcessing && progress) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-gradient-secondary rounded-full flex items-center justify-center animate-pulse-soft">
            <Sparkles className="h-8 w-8 text-secondary-foreground" />
          </div>
          <h2 className="text-xl font-semibold">AI Processing Your Script</h2>
          <p className="text-sm text-muted-foreground">
            Creating your personalized practice experience
          </p>
        </div>

        <Card className="border-secondary/20 bg-gradient-warm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium capitalize">{progress.phase.replace('-', ' ')}</span>
              <span className="text-muted-foreground">{Math.round(progress.progress)}%</span>
            </div>
            
            <Progress 
              value={progress.progress} 
              className="h-2"
            />
            
            <p className="text-sm text-foreground/80 leading-relaxed">
              {progress.message}
            </p>

            {progress.charactersFound && (
              <div className="flex items-center gap-2 text-sm text-success font-medium">
                <CheckCircle className="h-4 w-4" />
                {progress.charactersFound} characters discovered
              </div>
            )}

            {progress.estimatedTimeRemaining && (
              <div className="text-xs text-muted-foreground">
                Estimated time remaining: {progress.estimatedTimeRemaining}s
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
            Processing with AI technology
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Upload Your Script</h1>
        <p className="text-muted-foreground">
          Get AI-powered scene partners in minutes
        </p>
      </div>

      <Card 
        className={cn(
          "border-2 border-dashed transition-all duration-normal cursor-pointer",
          isDragOver 
            ? "border-secondary bg-secondary/5 shadow-warm" 
            : "border-border hover:border-secondary/50 hover:bg-accent/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-accent rounded-lg flex items-center justify-center">
            <Upload className="h-8 w-8 text-accent-foreground" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Drop your script here</h3>
            <p className="text-sm text-muted-foreground">
              or click to browse files
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              PDF
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              TXT
            </span>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelection(file);
        }}
      />

      <div className="bg-accent-warm rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-sm">What happens next?</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <div className="w-4 h-4 bg-secondary rounded-full flex items-center justify-center text-xs text-secondary-foreground font-bold mt-0.5">1</div>
            AI analyzes your script and characters
          </li>
          <li className="flex items-start gap-2">
            <div className="w-4 h-4 bg-secondary rounded-full flex items-center justify-center text-xs text-secondary-foreground font-bold mt-0.5">2</div>
            Creates unique voices for each character
          </li>
          <li className="flex items-start gap-2">
            <div className="w-4 h-4 bg-secondary rounded-full flex items-center justify-center text-xs text-secondary-foreground font-bold mt-0.5">3</div>
            Ready to practice in 90-120 seconds
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ScriptUpload;