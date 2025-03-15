
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, ChevronRight, Clock, Target, AlertCircle } from 'lucide-react';
import { AnalysisResult, StrugglePoint } from '@/utils/scriptAnalysis';

interface AnalysisResultsProps {
  results: AnalysisResult;
  onPracticeSection: (section: string) => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  results, 
  onPracticeSection 
}) => {
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handlePracticePoint = (strugglePoint: StrugglePoint) => {
    onPracticeSection(strugglePoint.text);
  };
  
  return (
    <Card className="shadow-sm border-border/40">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BarChart2 className="h-5 w-5 text-primary" />
          </div>
          <CardTitle>Practice Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
              <Target className="h-4 w-4" />
              <span>Accuracy</span>
            </div>
            <div className="text-2xl font-bold">{results.accuracy}%</div>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span>Duration</span>
            </div>
            <div className="text-2xl font-bold">{formatTime(results.duration)}</div>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
              <AlertCircle className="h-4 w-4" />
              <span>Struggle Points</span>
            </div>
            <div className="text-2xl font-bold">{results.strugglePoints.length}</div>
          </div>
        </div>
        
        {/* Struggle points */}
        {results.strugglePoints.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Areas to Focus On</h3>
            <div className="space-y-3">
              {results.strugglePoints.map((point, index) => (
                <div 
                  key={index}
                  className="border border-border/50 rounded-lg p-4 hover:border-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium mb-1">Point {index + 1}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Paused for {(point.pauseDuration / 1000).toFixed(1)} seconds
                      </p>
                      <p className="text-sm bg-secondary/50 p-2 rounded">
                        &ldquo;{point.text}&rdquo;
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handlePracticePoint(point)}
                      className="shrink-0"
                    >
                      Practice
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Additional metrics */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Missed Words</p>
              {results.missedWords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {results.missedWords.slice(0, 10).map((word, index) => (
                    <span key={index} className="px-2 py-1 bg-destructive/10 text-destructive text-sm rounded">
                      {word}
                    </span>
                  ))}
                  {results.missedWords.length > 10 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-sm rounded">
                      +{results.missedWords.length - 10} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm">No missed words detected!</p>
              )}
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Added Words</p>
              {results.addedWords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {results.addedWords.slice(0, 10).map((word, index) => (
                    <span key={index} className="px-2 py-1 bg-accent/10 text-accent text-sm rounded">
                      {word}
                    </span>
                  ))}
                  {results.addedWords.length > 10 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-sm rounded">
                      +{results.addedWords.length - 10} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm">No added words detected!</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResults;
