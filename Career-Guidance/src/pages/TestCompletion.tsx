import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, CheckCircle, Home, RotateCcw, Share2 } from "lucide-react";

const TestCompletion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Get test results from location state or localStorage
    const testResults = location.state || JSON.parse(localStorage.getItem('testResults') || '{}');
    
    if (testResults.score !== undefined) {
      setScore(testResults.score);
      setTotalQuestions(testResults.totalQuestions || 20);
      
      // Generate recommendations based on score
      generateRecommendations(testResults.score);
    } else {
      // If no results found, redirect to test page
      navigate("/test");
    }
  }, [location.state, navigate]);

  const generateRecommendations = (scorePercentage: number) => {
    const recs = [];
    
    if (scorePercentage >= 80) {
      recs.push("Engineering - You show strong analytical and problem-solving skills");
      recs.push("Computer Science - Your logical thinking is excellent");
      recs.push("Mathematics - Your quantitative abilities are outstanding");
    } else if (scorePercentage >= 60) {
      recs.push("Business Administration - Good strategic thinking abilities");
      recs.push("Psychology - Strong understanding of human behavior");
      recs.push("Communications - Excellent reasoning skills");
    } else if (scorePercentage >= 40) {
      recs.push("Liberal Arts - Diverse interests and creativity");
      recs.push("Social Work - Strong empathy and people skills");
      recs.push("Education - Good teaching and mentoring potential");
    } else {
      recs.push("Vocational Training - Practical skills development");
      recs.push("Foundation Courses - Build strong academic base");
      recs.push("Skill Development Programs - Focus on specific competencies");
    }
    
    setRecommendations(recs);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Needs Improvement";
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My StudyCompass Aptitude Test Results',
        text: `I scored ${score}% on the StudyCompass aptitude test!`,
        url: window.location.origin
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`I scored ${score}% on the StudyCompass aptitude test! Check it out at ${window.location.origin}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-card-hover">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center">
              <Trophy className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Test Completed!</CardTitle>
          <CardDescription className="text-lg">
            Congratulations on completing your aptitude test
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Score Section */}
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {getPerformanceLevel(score)}
            </Badge>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Your Score</span>
                <span>{score}%</span>
              </div>
              <Progress value={score} className="h-3" />
            </div>
          </div>

          {/* Detailed Results */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{Math.round(totalQuestions * (score / 100))}</div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">Total Questions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Recommended Fields of Study
            </h3>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-card border rounded-lg">
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate("/dashboard")} className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button onClick={() => navigate("/test")} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Test
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => navigate("/colleges")} 
              variant="default" 
              size="lg"
              className="bg-gradient-primary hover:opacity-90"
            >
              Explore Colleges Based on Your Results
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestCompletion;