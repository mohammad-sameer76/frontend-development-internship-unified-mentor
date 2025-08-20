import { Button } from "@/components/ui/button";
import { GraduationCap, User, BookOpen, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-card border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <GraduationCap className="h-8 w-8 text-education-blue" />
            <span className="text-xl font-bold text-primary">StudyCompass</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/colleges')} 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Colleges
            </button>
            <button 
              onClick={() => navigate('/test')} 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Aptitude Test
            </button>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Button variant="hero" size="sm" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/college-auth')}>
                  College Login
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                  <User className="h-4 w-4 mr-2" />
                  Student Login
                </Button>
                <Button variant="hero" size="sm" onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;