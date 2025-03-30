import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  const isHome = location.pathname === '/';
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHome || isMobileMenuOpen ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-tight">
            <span className="text-accent">Emery</span>
            
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-medium transition-colors hover:text-accent ${location.pathname === '/' ? 'text-accent' : 'text-foreground/80'}`}>
              Home
            </Link>
            <Link to="/dashboard" className={`text-sm font-medium transition-colors hover:text-accent ${location.pathname.includes('/dashboard') ? 'text-accent' : 'text-foreground/80'}`}>
              Dashboard
            </Link>
            <Link to="/auth" className={`text-sm font-medium transition-colors hover:text-accent ${location.pathname.includes('/auth') ? 'text-accent' : 'text-foreground/80'}`}>
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/auth?register=true">
              <Button variant="default" size="sm">
                Get Started
              </Button>
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden flex items-center p-2" aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && <div className="md:hidden absolute top-16 inset-x-0 bg-white/90 backdrop-blur-md shadow-lg animate-slide-down">
          <div className="px-4 py-6 space-y-4">
            <Link to="/" className={`block py-2 text-base font-medium transition-colors hover:text-accent ${location.pathname === '/' ? 'text-accent' : 'text-foreground/80'}`}>
              Home
            </Link>
            <Link to="/dashboard" className={`block py-2 text-base font-medium transition-colors hover:text-accent ${location.pathname.includes('/dashboard') ? 'text-accent' : 'text-foreground/80'}`}>
              Dashboard
            </Link>
            <Link to="/auth" className={`block py-2 text-base font-medium transition-colors hover:text-accent ${location.pathname.includes('/auth') ? 'text-accent' : 'text-foreground/80'}`}>
              Sign In
            </Link>
            <Link to="/auth?register=true" className="block">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>}
    </header>;
};
export default Navbar;