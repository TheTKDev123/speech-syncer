
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Plus, MoreHorizontal, Clock, Edit, Trash2, Play, LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ScriptInput from '@/components/ScriptInput';
import { useToast } from '@/hooks/use-toast';

interface Script {
  id: string;
  title: string;
  content: string;
  date: Date;
  practices: number;
}

const Dashboard = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [activeTab, setActiveTab] = useState('scripts');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Load saved scripts from localStorage on component mount
  useEffect(() => {
    const savedScripts = localStorage.getItem('speechSyncScripts');
    if (savedScripts) {
      try {
        const parsedScripts = JSON.parse(savedScripts);
        // Convert string dates back to Date objects
        const scriptsWithDates = parsedScripts.map((script: any) => ({
          ...script,
          date: new Date(script.date)
        }));
        setScripts(scriptsWithDates);
      } catch (error) {
        console.error('Error parsing saved scripts:', error);
      }
    }
  }, []);
  
  // Save scripts to localStorage whenever the scripts array changes
  useEffect(() => {
    localStorage.setItem('speechSyncScripts', JSON.stringify(scripts));
  }, [scripts]);
  
  const handleSaveScript = (title: string, content: string) => {
    const newScript: Script = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date(),
      practices: 0
    };
    
    setScripts(prev => [newScript, ...prev]);
    setActiveTab('scripts');
    
    toast({
      title: "Script saved",
      description: "Your script has been saved successfully.",
    });
  };
  
  const handleDeleteScript = (id: string) => {
    setScripts(prev => prev.filter(script => script.id !== id));
    
    toast({
      title: "Script deleted",
      description: "Your script has been deleted.",
    });
  };
  
  const handlePracticeScript = (script: Script) => {
    // Store the current script in localStorage
    localStorage.setItem('currentPracticeScript', JSON.stringify(script));
    
    // Update practices count
    setScripts(prev => 
      prev.map(s => 
        s.id === script.id 
          ? { ...s, practices: s.practices + 1 } 
          : s
      )
    );
    
    // Navigate to practice page
    navigate('/practice');
  };
  
  const handleSignOut = () => {
    // In a real app, this would handle sign out logic
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Manage and practice your speeches</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="scripts" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="scripts">My Scripts</TabsTrigger>
              <TabsTrigger value="new">New Script</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scripts" className="py-4">
              {scripts.length === 0 ? (
                <Card className="border-dashed border-2 border-border/50 bg-muted/50">
                  <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Scripts Yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Create your first script to start practicing your speech delivery.
                    </p>
                    <Button onClick={() => setActiveTab('new')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Script
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {scripts.map((script) => (
                    <Card key={script.id} className="hover-scale">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle>{script.title}</CardTitle>
                            <CardDescription>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {script.date.toLocaleDateString()}
                              </div>
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDeleteScript(script.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-3 h-14">
                          {script.content}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{script.practices} practice sessions</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => handlePracticeScript(script)}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Practice
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  <Card className="border-dashed border-2 border-border/50 bg-muted/50 flex flex-col items-center justify-center text-center p-6 h-full">
                    <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-4">Add another script</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('new')}
                    >
                      Create New
                    </Button>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="new" className="py-4">
              <ScriptInput onSaveScript={handleSaveScript} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
