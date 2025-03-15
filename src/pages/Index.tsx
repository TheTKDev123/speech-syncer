
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';

const Index = () => {
  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);
    
    // Add intersection observer for animate-on-scroll elements
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        
        {/* Testimonials (simplified) */}
        <section className="py-24 bg-secondary/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto text-center animate-on-scroll">
              <h2 className="text-3xl font-bold tracking-tight mb-16">
                Trusted by Public Speakers and Performers
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index} 
                    className="glass rounded-xl p-6 animate-on-scroll"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 -z-10"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-3xl -z-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6 animate-on-scroll">
                Ready to Get Started?
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 animate-on-scroll">
                Memorize Your Speech <span className="text-accent">with Confidence</span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 animate-on-scroll">
                Join thousands of speakers who have perfected their delivery using our intelligent speech practice tool.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-on-scroll">
                <Link to="/auth?register=true">
                  <Button size="lg" className="group">
                    Start Practicing Now
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
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-8 md:mb-0">
                <div className="flex items-center space-x-2 text-2xl font-bold tracking-tight">
                  <span className="text-accent">Speech</span>
                  <span>Sync</span>
                </div>
                <p className="text-muted-foreground mt-2">Perfect your delivery, every time.</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16">
                <div>
                  <h3 className="font-medium mb-3">Product</h3>
                  <ul className="space-y-2">
                    <li><Link to="/" className="text-muted-foreground hover:text-accent transition-colors text-sm">Features</Link></li>
                    <li><Link to="/" className="text-muted-foreground hover:text-accent transition-colors text-sm">Pricing</Link></li>
                    <li><Link to="/" className="text-muted-foreground hover:text-accent transition-colors text-sm">FAQ</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Company</h3>
                  <ul className="space-y-2">
                    <li><Link to="/" className="text-muted-foreground hover:text-accent transition-colors text-sm">About</Link></li>
                    <li><Link to="/" className="text-muted-foreground hover:text-accent transition-colors text-sm">Blog</Link></li>
                    <li><Link to="/" className="text-muted-foreground hover:text-accent transition-colors text-sm">Contact</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Legal</h3>
                  <ul className="space-y-2">
                    <li><Link to="/" className="text-muted-foreground hover:text-accent transition-colors text-sm">Privacy</Link></li>
                    <li><Link to="/" className="text-muted-foreground hover:text-accent transition-colors text-sm">Terms</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border/30 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
                &copy; {new Date().getFullYear()} SpeechSync. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <Link to="/" className="text-muted-foreground hover:text-accent transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link to="/" className="text-muted-foreground hover:text-accent transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Testimonial data
const testimonials = [
  {
    quote: "This app helped me memorize my TEDx talk in record time. The real-time feedback was invaluable.",
    name: "Alex Johnson",
    role: "Public Speaker"
  },
  {
    quote: "I've been using this for my theater performances. It's like having a personal coach with you at all times.",
    name: "Sophia Martinez",
    role: "Theater Performer"
  },
  {
    quote: "As someone who gets nervous during presentations, this tool has been a game-changer for my confidence.",
    name: "Michael Chen",
    role: "Business Professional"
  }
];

export default Index;
