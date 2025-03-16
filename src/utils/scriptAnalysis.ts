
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
  let totalChecked = 0;
  
  // Improved word-by-word comparison
  const originalWordCounts = countWords(originalWords);
  const spokenWordCounts = countWords(spokenWords);
  
  // Compare word frequencies
  for (const [word, count] of Object.entries(originalWordCounts)) {
    const spokenCount = spokenWordCounts[word] || 0;
    correctWords += Math.min(count, spokenCount);
    totalChecked += count;
  }
  
  return Math.round((correctWords / totalChecked) * 100);
}

// Count occurrences of each word
function countWords(words: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  
  for (const word of words) {
    counts[word] = (counts[word] || 0) + 1;
  }
  
  return counts;
}

// Find missed and added words
function findWordDifferences(originalWords: string[], spokenWords: string[]): {
  missedWords: string[];
  addedWords: string[];
} {
  const missedWords: string[] = [];
  const addedWords: string[] = [];
  
  // Compare word frequencies
  const originalWordCounts = countWords(originalWords);
  const spokenWordCounts = countWords(spokenWords);
  
  // Find words in original that are missing or underrepresented in spoken
  for (const [word, count] of Object.entries(originalWordCounts)) {
    const spokenCount = spokenWordCounts[word] || 0;
    if (spokenCount < count) {
      // Add the word to missedWords for each missing occurrence
      for (let i = 0; i < count - spokenCount; i++) {
        missedWords.push(word);
      }
    }
  }
  
  // Find words in spoken that aren't in original or are overrepresented
  for (const [word, count] of Object.entries(spokenWordCounts)) {
    const originalCount = originalWordCounts[word] || 0;
    if (originalCount < count) {
      // Add the word to addedWords for each extra occurrence
      for (let i = 0; i < count - originalCount; i++) {
        addedWords.push(word);
      }
    }
  }
  
  return { missedWords, addedWords };
}

// Identify points where the user struggled (paused)
function identifyStrugglePoints(
  originalScript: string,
  pauses: { index: number, duration: number }[]
): StrugglePoint[] {
  const strugglePoints: StrugglePoint[] = [];
  const words = originalScript.split(/\s+/);
  
  // Group nearby pauses together
  const significantPauses = pauses
    .filter(pause => pause.duration >= 5000) // Only consider pauses of 5+ seconds
    .sort((a, b) => a.index - b.index);
  
  if (significantPauses.length === 0) {
    return strugglePoints;
  }
  
  // Combine pauses that are close to each other
  let currentGroup: { index: number, duration: number }[] = [significantPauses[0]];
  const pauseGroups: { index: number, duration: number }[][] = [currentGroup];
  
  for (let i = 1; i < significantPauses.length; i++) {
    const currentPause = significantPauses[i];
    const lastPause = currentGroup[currentGroup.length - 1];
    
    // If this pause is within 5 words of the last one, add to current group
    if (currentPause.index - lastPause.index <= 5) {
      currentGroup.push(currentPause);
    } else {
      // Start a new group
      currentGroup = [currentPause];
      pauseGroups.push(currentGroup);
    }
  }
  
  // Convert pause groups to struggle points
  pauseGroups.forEach((group) => {
    // Use the middle of the group as the center
    const totalDuration = group.reduce((sum, pause) => sum + pause.duration, 0);
    const middleIndex = Math.floor(group.length / 2);
    const centerIndex = group[middleIndex].index;
    
    // Get a context window of words
    const contextSize = 5; // words before and after
    const startIndex = Math.max(0, centerIndex - contextSize);
    const endIndex = Math.min(words.length, centerIndex + contextSize);
    
    const text = words.slice(startIndex, endIndex).join(' ');
    
    strugglePoints.push({
      index: centerIndex,
      text,
      pauseDuration: totalDuration
    });
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
