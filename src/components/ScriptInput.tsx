
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Save } from 'lucide-react';

interface ScriptInputProps {
  onSaveScript: (title: string, content: string) => void;
}

const ScriptInput: React.FC<ScriptInputProps> = ({ onSaveScript }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please enter a title for your script');
      return;
    }
    
    if (!content.trim()) {
      setError('Please enter your script content');
      return;
    }
    
    onSaveScript(title, content);
    setError('');
  };

  return (
    <Card className="w-full shadow-sm border-border/40">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <CardTitle>Enter Your Script</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="script-title">Title</Label>
          <Input 
            id="script-title"
            placeholder="e.g., My Presentation, Graduation Speech, etc."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="script-content">Script Content</Label>
          <Textarea 
            id="script-content"
            placeholder="Paste or type your script here..."
            className="min-h-[200px] resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" />
          Save Script
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScriptInput;
