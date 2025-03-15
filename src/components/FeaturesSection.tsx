
import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const FeaturesSection = () => {
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
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything You Need to Perfect Your Delivery
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive feature set makes memorizing and practicing speeches effortless
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Feature image */}
            <div className="order-2 md:order-1 animate-on-scroll">
              <div className="relative">
                <div className="aspect-video rounded-xl bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden shadow-md">
                  <div className="glass rounded-lg p-8 max-w-xs mx-auto">
                    <div className="h-4 w-3/4 bg-muted rounded mb-4"></div>
                    <div className="h-4 w-full bg-muted rounded mb-4"></div>
                    <div className="h-4 w-5/6 bg-muted rounded mb-4"></div>
                    <div className="h-4 w-4/5 bg-muted rounded mb-4"></div>
                    <div className="h-4 w-2/3 bg-primary/30 rounded mb-4"></div>
                    <div className="h-4 w-full bg-muted rounded mb-4"></div>
                    <div className="h-4 w-5/6 bg-muted rounded"></div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -bottom-6 -left-6 glass-dark rounded-lg p-4 shadow-lg animate-float">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-accent text-sm font-semibold">95%</span>
                    </div>
                    <div className="text-sm font-medium">Accuracy Score</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature list */}
            <div className="order-1 md:order-2 animate-on-scroll">
              <ul className="space-y-6">
                <FeatureItem 
                  title="Speech Recognition" 
                  description="Accurately tracks your spoken words in real-time as you practice."
                />
                <FeatureItem 
                  title="Smart Prompting" 
                  description="Get a helpful nudge with the next few words if you pause or lose your place."
                />
                <FeatureItem 
                  title="Performance Analysis" 
                  description="Detailed feedback on accuracy, missed words, and areas for improvement."
                />
                <FeatureItem 
                  title="Focused Practice" 
                  description="Work on specific sections that need more attention based on your performance."
                />
                <FeatureItem 
                  title="Progress Tracking" 
                  description="Monitor your improvement over time with comprehensive metrics."
                />
              </ul>
            </div>
          </div>
          
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Second feature block */}
            <div className="animate-on-scroll">
              <h3 className="text-2xl font-bold mb-6">Personalized Practice Experience</h3>
              <ul className="space-y-6">
                <FeatureItem 
                  title="Multiple Scripts" 
                  description="Store and practice different speeches for various occasions."
                />
                <FeatureItem 
                  title="Customizable Sessions" 
                  description="Adjust practice parameters to match your specific needs."
                />
                <FeatureItem 
                  title="Instant Feedback" 
                  description="Receive immediate insights after each practice session."
                />
                <FeatureItem 
                  title="Section Highlighting" 
                  description="Visualize your progress through the script as you speak."
                />
              </ul>
            </div>
            
            {/* Second feature image */}
            <div className="animate-on-scroll">
              <div className="relative">
                <div className="aspect-video rounded-xl bg-gradient-to-bl from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden shadow-md">
                  <div className="glass rounded-lg p-6 max-w-xs mx-auto">
                    <div className="flex justify-between items-center mb-6">
                      <div className="h-6 w-20 bg-muted rounded"></div>
                      <div className="h-8 w-8 rounded-full bg-accent/20"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 w-full bg-muted rounded"></div>
                      <div className="h-3 w-5/6 bg-muted rounded"></div>
                      <div className="h-3 w-full bg-primary/30 rounded"></div>
                      <div className="h-3 w-4/5 bg-muted rounded"></div>
                      <div className="h-3 w-full bg-muted rounded"></div>
                    </div>
                    <div className="mt-6 flex justify-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-primary/20"></div>
                      <div className="h-8 w-8 rounded-full bg-muted"></div>
                      <div className="h-8 w-8 rounded-full bg-muted"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 glass-dark rounded-lg p-3 shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="text-sm font-medium">Struggle Points: 2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ title, description }: { title: string; description: string }) => (
  <li className="flex items-start space-x-3">
    <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </li>
);

export default FeaturesSection;
