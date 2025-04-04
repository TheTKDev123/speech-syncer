
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, Mic, MicOff, Pause, Play, SkipForward } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import AudioWaveform from '@/components/AudioWaveform';
import AnalysisResults from '@/components/AnalysisResults';
import { analyzeScript } from '@/utils/scriptAnalysis';
import PracticeControls from '@/components/PracticeControls';

interface Script {
  id: string;
  title: string;
  content: string;
  date: Date;
  practices: number;
}

interface PauseData {
  index: number;
  duration: number;
}

const Practice = () => {
  const [currentScript, setCurrentScript] = useState<Script | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [lastRecordedTime, setLastRecordedTime] = useState(0);
  const [practiceDuration, setPracticeDuration] = useState(0);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [pauseData, setPauseData] = useState<PauseData[]>([]);
  const [showFullScript, setShowFullScript] = useState(false);
  const [confirmEndDialogOpen, setConfirmEndDialogOpen] = useState(false);
  const [debugPromptTimer, setDebugPromptTimer] = useState<number>(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const practiceStartTimeRef = useRef<number>(0);
  const lastWordIndexRef = useRef<number>(0);
  const promptTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { transcript, listening, startListening, stopListening, resetTranscript, error } = useSpeechRecognition();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Load script from localStorage
  useEffect(() => {
    const savedScript = localStorage.getItem('currentPracticeScript');
    if (savedScript) {
      try {
        const parsedScript = JSON.parse(savedScript);
        setCurrentScript({
          ...parsedScript,
          date: new Date(parsedScript.date)
        });
      } catch (error) {
        console.error('Error parsing script:', error);
        toast({
          title: "Error loading script",
          description: "There was a problem loading your script. Please try again.",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  }, [navigate, toast]);
  
  // Practice duration timer
  useEffect(() => {
    if (currentScript && !practiceComplete) {
      practiceStartTimeRef.current = Date.now();
      
      timerRef.current = setInterval(() => {
        if (!isPaused) {
          setPracticeDuration(Date.now() - practiceStartTimeRef.current);
        }
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentScript, isPaused, practiceComplete]);
  
  // Start/stop speech recognition
  useEffect(() => {
    if (currentScript && !listening && !isPaused && !practiceComplete) {
      console.log("Starting listening...");
      startListening();
      setLastRecordedTime(Date.now());
    }
    
    return () => {
      stopListening();
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
      if (promptTimerRef.current) {
        clearTimeout(promptTimerRef.current);
      }
    };
  }, [currentScript, listening, isPaused, practiceComplete, startListening, stopListening]);
  
  // Handle transcript updates and prompt display
  useEffect(() => {
    // Clear any existing prompt timers
    if (promptTimerRef.current) {
      clearTimeout(promptTimerRef.current);
      promptTimerRef.current = null;
    }
    
    if (error) {
      toast({
        title: "Speech Recognition Error",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    if (listening && currentScript && !practiceComplete) {
      // Update last recorded time when we get transcript
      if (transcript) {
        setLastRecordedTime(Date.now());
        setPromptVisible(false);
      }
      
      // Set a timer to check for silence and show prompt if needed
      promptTimerRef.current = setTimeout(() => {
        const currentTime = Date.now();
        const timeSinceLastActivity = currentTime - lastRecordedTime;
        
        console.log(`Time since last activity: ${timeSinceLastActivity}ms`);
        setDebugPromptTimer(timeSinceLastActivity);
        
        // If 5 seconds (5000ms) of silence detected, show the prompt
        if (timeSinceLastActivity >= 5000 && !promptVisible) {
          console.log("Showing prompt due to silence...");
          const scriptContent = currentScript.content;
          const words = scriptContent.split(/\s+/);
          
          const transcriptWords = transcript.toLowerCase().split(/\s+/);
          let matchIndex = 0;
          
          // Find where in the script the user might be
          for (let i = 0; i < words.length; i++) {
            const scriptWord = words[i].toLowerCase().replace(/[.,!?;:]/g, '');
            const lastFewWords = transcriptWords.slice(-20);
            
            if (lastFewWords.includes(scriptWord)) {
              matchIndex = Math.max(matchIndex, i);
            }
          }
          
          // Store pause data
          const newPauseData = [...pauseData, {
            index: matchIndex,
            duration: timeSinceLastActivity
          }];
          setPauseData(newPauseData);
          
          // Create prompt text - next few words after their last recognized word
          const nextIndex = matchIndex + 1;
          lastWordIndexRef.current = nextIndex;
          const promptWords = words.slice(nextIndex, nextIndex + 5).join(' ');
          setPrompt(promptWords);
          setPromptVisible(true);
        }
      }, 5000); // Check every 5 seconds
    }
    
    return () => {
      if (promptTimerRef.current) {
        clearTimeout(promptTimerRef.current);
        promptTimerRef.current = null;
      }
    };
  }, [transcript, listening, currentScript, lastRecordedTime, pauseData, error, toast, practiceComplete, promptVisible]);
  
  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      startListening();
      setLastRecordedTime(Date.now());
      setPromptVisible(false);
    } else {
      setIsPaused(true);
      stopListening();
    }
  };
  
  const handleEndPractice = () => {
    setConfirmEndDialogOpen(true);
  };
  
  const confirmEndPractice = () => {
    stopListening();
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (promptTimerRef.current) {
      clearTimeout(promptTimerRef.current);
    }
    
    setPracticeComplete(true);
    setConfirmEndDialogOpen(false);
    setPromptVisible(false);
    
    if (currentScript) {
      const scripts = JSON.parse(localStorage.getItem('scripts') || '[]');
      const updatedScripts = scripts.map((script: Script) => {
        if (script.id === currentScript.id) {
          return {
            ...script,
            practices: (script.practices || 0) + 1
          };
        }
        return script;
      });
      
      localStorage.setItem('scripts', JSON.stringify(updatedScripts));
      
      setAnalysisVisible(true);
    }
  };
  
  const handleStartNewPractice = () => {
    resetTranscript();
    setPauseData([]);
    setPracticeComplete(false);
    setAnalysisVisible(false);
    setPracticeDuration(0);
    practiceStartTimeRef.current = Date.now();
    lastWordIndexRef.current = 0;
    setPromptVisible(false);
    
    startListening();
  };
  
  const handlePracticeSection = (section: string) => {
    toast({
      title: "Section practice",
      description: "Focusing on problematic section",
    });
  };
  
  if (!currentScript) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading script...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
          </div>
          
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight">{currentScript.title}</h1>
            <p className="text-muted-foreground">
              {practiceComplete 
                ? "Practice completed" 
                : isPaused 
                  ? "Practice paused" 
                  : "Practice mode"}
            </p>
          </div>
          
          {practiceComplete && analysisVisible ? (
            <div className="grid grid-cols-1 gap-6">
              <AnalysisResults 
                results={analyzeScript(
                  currentScript.content,
                  transcript,
                  pauseData
                )}
                onPracticeSection={handlePracticeSection}
              />
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={handleStartNewPractice}>
                  Start New Practice
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-8">
              <div className="w-full max-w-2xl mx-auto">
                <AudioWaveform isListening={listening && !isPaused} />
              </div>
              
              <div className="w-full max-w-2xl mx-auto">
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle>Your Speech</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[200px] overflow-auto bg-muted/30 p-3 rounded-md mb-4">
                      <p className="whitespace-pre-line text-center">{transcript || "Start speaking..."}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {showFullScript && (
                <div className="w-full max-w-2xl mx-auto mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Your Script</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowFullScript(false)}
                    >
                      Hide Script
                    </Button>
                  </div>
                  <div className="prose prose-sm max-w-none border border-border/50 rounded-md p-4 bg-secondary/20">
                    <p className="whitespace-pre-line text-center">{currentScript.content}</p>
                  </div>
                </div>
              )}
              
              <div className="w-full max-w-xl mx-auto py-4 fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/50">
                <div className="container mx-auto px-4">
                  <PracticeControls 
                    script={currentScript.content}
                    isListening={listening}
                    transcript={transcript}
                    onStart={startListening}
                    onStop={handleEndPractice}
                    onPause={handlePauseResume}
                    onResume={handlePauseResume}
                    onReset={resetTranscript}
                    isPaused={isPaused}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Prompt overlay - Improved with strong backdrop filter and larger text */}
      {promptVisible && !practiceComplete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center" 
          style={{ 
            backgroundColor: 'rgba(26, 31, 44, 0.85)', 
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="text-center p-8 max-w-4xl mx-auto animate-in fade-in-0 zoom-in-95 duration-300">
            <p className="text-4xl font-bold mb-6 text-white">{prompt}</p>
            <p className="text-sm text-white/70">Speak these words to continue</p>
            <p className="text-xs text-white/50 mt-4">{debugPromptTimer}ms since last detected speech</p>
          </div>
        </div>
      )}
      
      <AlertDialog open={confirmEndDialogOpen} onOpenChange={setConfirmEndDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Practice Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will end your current practice session and show the analysis of your performance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEndPractice}>End Practice</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Practice;
