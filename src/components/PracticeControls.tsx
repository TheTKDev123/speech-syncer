
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Play, Pause, StopCircle, Book } from 'lucide-react';
import { getPromptText } from '@/utils/scriptAnalysis';

interface PracticeControlsProps {
  script: string;
  isListening: boolean;
  transcript: string;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  isPaused?: boolean;
}

const PracticeControls: React.FC<PracticeControlsProps> = ({
  script,
  isListening,
  transcript,
  onStart,
  onStop,
  onPause,
  onResume,
  onReset,
  isPaused = false
}) => {
  const [isPracticing, setIsPracticing] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [progress, setProgress] = useState(0);
  const [lastActivity, setLastActivity] = useState(0);
  const promptTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear any existing timeouts when unmounting
  useEffect(() => {
    return () => {
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle practice start/stop
  const handleTogglePractice = () => {
    if (isPracticing) {
      setIsPracticing(false);
      onStop();
      setShowPrompt(false);
    } else {
      setIsPracticing(true);
      onStart();
      setLastActivity(Date.now());
    }
  };
  
  // Handle pausing
  const handlePause = () => {
    if (isPaused) {
      onResume();
    } else {
      onPause();
    }
  };
  
  // Reset everything
  const handleReset = () => {
    setIsPracticing(false);
    setShowPrompt(false);
    setProgress(0);
    onReset();
  };
  
  // Check for pauses and update progress
  useEffect(() => {
    if (!isPracticing) return;
    
    // Update last activity time when new transcript is detected
    if (transcript) {
      setLastActivity(Date.now());
      setShowPrompt(false);
      
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
        promptTimeoutRef.current = null;
      }
      
      // Calculate rough progress (very simplified - would be more sophisticated in real app)
      const scriptWords = script.split(/\s+/).filter(Boolean).length;
      const transcriptWords = transcript.split(/\s+/).filter(Boolean).length;
      const newProgress = Math.min(100, Math.round((transcriptWords / scriptWords) * 100));
      setProgress(newProgress);
    }
    
    // Check for pauses
    const pauseCheckInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      
      // If paused for more than 10 seconds, show a prompt
      if (timeSinceLastActivity > 10000 && !showPrompt) {
        // Find where in the script the user might be
        const transcriptWords = transcript.split(/\s+/).filter(Boolean);
        const lastWordIndex = transcriptWords.length;
        
        // Get the next few words as a prompt
        const nextPrompt = getPromptText(script, lastWordIndex);
        setPromptText(nextPrompt);
        setShowPrompt(true);
      }
    }, 1000);
    
    return () => clearInterval(pauseCheckInterval);
  }, [isPracticing, transcript, script, lastActivity, showPrompt]);
  
  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Prompt card */}
      {showPrompt && (
        <Card className="p-4 bg-accent/10 border border-accent/20 animate-pulse-soft">
          <div className="flex items-start space-x-3">
            <Book className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">Need a hint?</p>
              <p className="text-sm text-muted-foreground">&ldquo;{promptText}&rdquo;</p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Control buttons */}
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        <Button
          onClick={handleTogglePractice}
          variant={isPracticing ? "destructive" : "default"}
          size="lg"
          className="flex-1 sm:flex-none"
        >
          {isPracticing ? (
            <>
              <StopCircle className="mr-2 h-5 w-5" />
              End Practice
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Start Practice
            </>
          )}
        </Button>
        
        {isPracticing && (
          <>
            <Button 
              onClick={handlePause} 
              variant="outline" 
              size="lg"
              className="flex-1 sm:flex-none"
            >
              {isPaused ? (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleReset} 
              variant="outline" 
              size="lg"
              className="flex-1 sm:flex-none"
            >
              Reset
            </Button>
          </>
        )}
      </div>
      
      {/* Listening indicator */}
      {isPracticing && (
        <div className="flex items-center mt-4 text-sm">
          {isListening ? (
            <>
              <Mic className="h-4 w-4 text-green-500 mr-2 animate-pulse" />
              <span>Listening...</span>
            </>
          ) : (
            <>
              <MicOff className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-muted-foreground">Microphone inactive</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeControls;
