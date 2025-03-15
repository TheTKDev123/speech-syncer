
export interface AnalysisResult {
  accuracy: number;
  missedWords: string[];
  addedWords: string[];
  strugglePoints: StrugglePoint[];
  duration: number;
}

export interface StrugglePoint {
  index: number;
  text: string;
  pauseDuration: number;
}

export function analyzeScript(
  originalScript: string,
  spokenScript: string,
  pauses: { index: number, duration: number }[]
): AnalysisResult {
  // Normalize scripts (lowercase, remove punctuation, etc.)
  const normalizedOriginal = normalizeText(originalScript);
  const normalizedSpoken = normalizeText(spokenScript);
  
  // Split into arrays of words
  const originalWords = normalizedOriginal.split(/\s+/).filter(Boolean);
  const spokenWords = normalizedSpoken.split(/\s+/).filter(Boolean);
  
  // Calculate accuracy
  const accuracy = calculateAccuracy(originalWords, spokenWords);
  
  // Find missed and added words
  const { missedWords, addedWords } = findWordDifferences(originalWords, spokenWords);
  
  // Identify struggle points
  const strugglePoints = identifyStrugglePoints(originalScript, pauses);
  
  return {
    accuracy,
    missedWords,
    addedWords,
    strugglePoints,
    duration: 0 // This should be calculated during practice and passed in
  };
}

// Helper function to normalize text
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Calculate accuracy percentage
function calculateAccuracy(originalWords: string[], spokenWords: string[]): number {
  if (originalWords.length === 0) return 0;
  
  let correctWords = 0;
  
  // Simple word-by-word comparison
  for (let i = 0; i < Math.min(originalWords.length, spokenWords.length); i++) {
    if (originalWords[i] === spokenWords[i]) {
      correctWords++;
    }
  }
  
  return Math.round((correctWords / originalWords.length) * 100);
}

// Find missed and added words
function findWordDifferences(originalWords: string[], spokenWords: string[]) {
  const missedWords: string[] = [];
  const addedWords: string[] = [];
  
  // This is a simplified approach - in a real app, you would want to use
  // a more sophisticated algorithm like Levenshtein distance or Smith-Waterman
  
  // Find words in original that aren't in spoken
  originalWords.forEach(word => {
    if (!spokenWords.includes(word)) {
      missedWords.push(word);
    }
  });
  
  // Find words in spoken that aren't in original
  spokenWords.forEach(word => {
    if (!originalWords.includes(word)) {
      addedWords.push(word);
    }
  });
  
  return { missedWords, addedWords };
}

// Identify points where the user struggled (paused)
function identifyStrugglePoints(
  originalScript: string,
  pauses: { index: number, duration: number }[]
): StrugglePoint[] {
  const strugglePoints: StrugglePoint[] = [];
  
  // Convert pauses into struggle points
  pauses.forEach(pause => {
    if (pause.duration >= 3000) { // 3 seconds or more
      // Get the context (some words before and after the pause)
      const words = originalScript.split(/\s+/);
      const pauseIndex = pause.index;
      
      // Get up to 3 words before and after the pause point
      const startIndex = Math.max(0, pauseIndex - 3);
      const endIndex = Math.min(words.length - 1, pauseIndex + 3);
      
      const text = words.slice(startIndex, endIndex + 1).join(' ');
      
      strugglePoints.push({
        index: pauseIndex,
        text,
        pauseDuration: pause.duration
      });
    }
  });
  
  return strugglePoints;
}

// Function to get prompt text when user pauses
export function getPromptText(script: string, lastSpokenIndex: number): string {
  const words = script.split(/\s+/);
  
  // Get the next few words after where the user left off
  const nextWordsCount = 5;
  const endIndex = Math.min(words.length, lastSpokenIndex + nextWordsCount);
  
  return words.slice(lastSpokenIndex, endIndex).join(' ');
}

// Function to extract a practice section based on a struggle point
export function extractPracticeSection(script: string, strugglePoint: StrugglePoint): string {
  const words = script.split(/\s+/);
  
  // Get a reasonable section around the struggle point
  const contextSize = 15; // words before and after
  const startIndex = Math.max(0, strugglePoint.index - contextSize);
  const endIndex = Math.min(words.length, strugglePoint.index + contextSize);
  
  return words.slice(startIndex, endIndex).join(' ');
}
