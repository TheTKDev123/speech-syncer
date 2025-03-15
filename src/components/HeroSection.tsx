
import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight, Mic, BarChart2, BookOpen } from 'lucide-react';

const HeroSection = () => {
  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      animatedElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);
  
  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-0 bg-gradient-to-b from-secondary/60 to-transparent -z-10"></div>
      <div className="absolute -top-48 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
        <div className="max-w-5xl mx-auto">
          {/* Hero content */}
          <div className="text-center space-y-8 animate-on-scroll">
            <div className="inline-block mb-6">
              <div className="rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                Master Your Speech
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Memorize Your Scripts 
              <span className="text-accent"> Without Stress</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Practice speeches with real-time feedback and intelligent prompting. 
              Perfect for presentations, performances, or any speaking engagement.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link to="/auth?register=true">
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 mt-20">
            <div className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm border border-border/50 hover-scale animate-on-scroll">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Recognition</h3>
              <p className="text-muted-foreground">
                Advanced speech recognition technology that follows along as you practice.
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm border border-border/50 hover-scale animate-on-scroll" style={{ animationDelay: '0.1s' }}>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Prompting</h3>
              <p className="text-muted-foreground">
                Get a gentle reminder when you pause or forget what comes next.
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-sm border border-border/50 hover-scale animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Analysis</h3>
              <p className="text-muted-foreground">
                Detailed feedback on accuracy and identification of struggle points.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
