import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Target, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-education-blue/80" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Find Your Perfect
              <span className="block text-education-green">College Match</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Navigate your educational journey with confidence. Get personalized college recommendations, 
              take aptitude tests, and make informed decisions about your future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                variant="gradient" 
                size="lg" 
                className="text-lg px-8"
                onClick={() => window.location.href = '/auth'}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => window.location.href = '/colleges'}
              >
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-card-hover transform hover:scale-105 transition-all duration-300">
              <BookOpen className="h-10 w-10 text-education-blue mb-4" />
              <h3 className="font-semibold text-lg mb-2">1000+ Colleges</h3>
              <p className="text-muted-foreground">Comprehensive database of institutions</p>
            </Card>
            
            <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-card-hover transform hover:scale-105 transition-all duration-300">
              <Target className="h-10 w-10 text-education-green mb-4" />
              <h3 className="font-semibold text-lg mb-2">Smart Matching</h3>
              <p className="text-muted-foreground">AI-powered recommendations</p>
            </Card>
            
            <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-card-hover transform hover:scale-105 transition-all duration-300">
              <Users className="h-10 w-10 text-education-purple mb-4" />
              <h3 className="font-semibold text-lg mb-2">Expert Guidance</h3>
              <p className="text-muted-foreground">Professional career counseling</p>
            </Card>
            
            <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-card-hover transform hover:scale-105 transition-all duration-300">
              <Award className="h-10 w-10 text-warning mb-4" />
              <h3 className="font-semibold text-lg mb-2">Aptitude Tests</h3>
              <p className="text-muted-foreground">Assess your strengths</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;