
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Play, Pause, StopCircle, Book } from 'lucide-react';

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
  const [progress, setProgress] = useState(0);
  const [lastActivity, setLastActivity] = useState(0);
  
  // Update practice status
  useEffect(() => {
    // User is practicing if they're listening or paused
    setIsPracticing(isListening || isPaused);
  }, [isListening, isPaused]);
  
  // Handle practice start/stop
  const handleTogglePractice = () => {
    if (isPracticing) {
      setIsPracticing(false);
      onStop();
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
    onReset();
  };
  
  // Calculate progress based on spoken words
  useEffect(() => {
    if (!isPracticing || !transcript) return;
    
    // Update last activity time when new transcript is detected
    setLastActivity(Date.now());
    
    // Calculate rough progress (very simplified)
    const scriptWords = script.split(/\s+/).filter(Boolean).length;
    const transcriptWords = transcript.split(/\s+/).filter(Boolean).length;
    const newProgress = Math.min(100, Math.round((transcriptWords / scriptWords) * 100));
    setProgress(newProgress);
  }, [isPracticing, transcript, script]);
  
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
