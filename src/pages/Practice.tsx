
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mic, MicOff, Pause, Play, SkipForward } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

interface Script {
  id: string;
  title: string;
  content: string;
  date: Date;
  practices: number;
}

const Practice = () => {
  const [currentScript, setCurrentScript] = useState<Script | null>(null);
  const [practicingPart, setPracticingPart] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [lastWordsIndex, setLastWordsIndex] = useState(0);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { transcript, listening, startListening, stopListening, resetTranscript, error } = useSpeechRecognition();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Load current practice script from localStorage
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
      // No script found, redirect to dashboard
      navigate('/dashboard');
    }
  }, [navigate, toast]);
  
  // Start listening when component mounts
  useEffect(() => {
    if (currentScript && !listening && !isPaused) {
      startListening();
    }
    
    return () => {
      stopListening();
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, [currentScript, listening, isPaused, startListening, stopListening]);
  
  // Check for pause in speech
  useEffect(() => {
    if (error) {
      toast({
        title: "Speech Recognition Error",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    if (listening && currentScript) {
      // Clear existing timer
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
      
      // Set new timer for 10 seconds
      pauseTimerRef.current = setTimeout(() => {
        // Show prompt if user has paused
        if (listening && currentScript) {
          // Find where the user is in the script and provide the next few words
          const scriptContent = practicingPart || currentScript.content;
          const words = scriptContent.split(' ');
          
          // Find rough position in script based on spoken words
          // This is a simplified version, in a real app you'd use a more sophisticated algorithm
          const transcriptWords = transcript.toLowerCase().split(' ');
          let matchIndex = 0;
          
          // Find last matched word in script
          for (let i = 0; i < words.length; i++) {
            const scriptWord = words[i].toLowerCase().replace(/[.,!?;:]/g, '');
            const lastTranscriptWords = transcriptWords.slice(-15);
            
            if (lastTranscriptWords.includes(scriptWord)) {
              matchIndex = i;
            }
          }
          
          // Get the next few words as a prompt
          const promptWords = words.slice(matchIndex + 1, matchIndex + 5).join(' ');
          setPrompt(promptWords);
          setPromptVisible(true);
          
          // Hide prompt after 5 seconds
          setTimeout(() => {
            setPromptVisible(false);
          }, 5000);
        }
      }, 10000);
    }
    
    return () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, [transcript, listening, currentScript, practicingPart, error, toast]);
  
  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      startListening();
    } else {
      setIsPaused(true);
      stopListening();
    }
  };
  
  const handleEndPractice = () => {
    stopListening();
    
    // In a real app, this would save the practice data and do analysis
    toast({
      title: "Practice session ended",
      description: "Your practice data has been saved.",
    });
    
    navigate('/dashboard');
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
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">{currentScript.title}</h1>
            <p className="text-muted-foreground">Practice mode</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Your Script</CardTitle>
                </CardHeader>
                <CardContent className="overflow-auto max-h-[600px]">
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line">{currentScript.content}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Practice Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    {listening ? (
                      <div className="animate-pulse">
                        <Mic className="h-12 w-12 mx-auto text-primary" />
                        <p className="mt-2">Listening...</p>
                      </div>
                    ) : (
                      <div>
                        <MicOff className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="mt-2">Paused</p>
                      </div>
                    )}
                  </div>
                  
                  {promptVisible && (
                    <Card className="mb-4 bg-muted/50 border-primary/20">
                      <CardContent className="py-3 text-center">
                        <p className="text-sm font-medium">Need a hint?</p>
                        <p className="text-lg">"...{prompt}"</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={handlePauseResume} 
                      className="w-full"
                      variant={isPaused ? "default" : "outline"}
                    >
                      {isPaused ? (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Resume
                        </>
                      ) : (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </>
                      )}
                    </Button>
                    
                    <Button onClick={handleEndPractice} variant="secondary" className="w-full">
                      <SkipForward className="mr-2 h-4 w-4" />
                      End Practice
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Speech</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[300px] overflow-auto bg-muted/30 p-3 rounded-md mb-4">
                    <p className="whitespace-pre-line">{transcript || "Start speaking..."}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={resetTranscript} 
                    variant="outline" 
                    className="w-full"
                  >
                    Clear Speech
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Practice;
