import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Clock, CheckCircle, ArrowLeft, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Question {
  id: number;
  type: string;
  question: string;
  options: string[];
  correct: number;
}

interface Test {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_questions: number;
  questions: Question[];
}

const AptitudeTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchTest();
  }, [user, navigate]);

  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (testStarted && timeLeft === 0 && !testCompleted) {
      submitTest();
    }
  }, [timeLeft, testStarted, testCompleted]);

  const fetchTest = async () => {
    try {
      const { data, error } = await supabase
        .from('aptitude_tests')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching test:', error);
        toast({
          title: "Error",
          description: "Failed to load test",
          variant: "destructive"
        });
      } else if (data) {
        // Parse the questions JSON data
        const testData: Test = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          duration_minutes: data.duration_minutes,
          total_questions: data.total_questions,
          questions: Array.isArray(data.questions) ? (data.questions as unknown as Question[]) : []
        };
        setTest(testData);
        setTimeLeft(data.duration_minutes * 60);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTest = () => {
    setTestStarted(true);
  };

  const selectAnswer = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (test && currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitTest = async () => {
    if (!test || !user) return;

    let correctAnswers = 0;
    test.questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / test.questions.length) * 100);
    setScore(finalScore);
    setTestCompleted(true);

    try {
      const { error } = await supabase
        .from('test_results')
        .insert([
          {
            user_id: user.id,
            test_id: test.id,
            score: finalScore,
            answers: answers
          }
        ]);

      if (error) {
        console.error('Error saving results:', error);
      } else {
        // Store results and navigate to completion page
        localStorage.setItem('testResults', JSON.stringify({
          score: finalScore,
          totalQuestions: test.questions.length
        }));
        navigate('/test-completion');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Test Not Available</h2>
          <p className="text-muted-foreground mb-4">No aptitude test is currently available.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md w-full">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Test Completed!</h2>
          <div className="text-6xl font-bold text-primary mb-4">{score}%</div>
          <p className="text-muted-foreground mb-6">
            You answered {Math.round((score / 100) * test.questions.length)} out of {test.questions.length} questions correctly.
          </p>
          <div className="space-y-3">
            <Button className="w-full" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/colleges')}>
              Explore Colleges
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="bg-card border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-xl font-bold text-primary">Aptitude Test</h1>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <Target className="h-16 w-16 text-education-blue mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-primary mb-4">{test.title}</h2>
            <p className="text-xl text-muted-foreground mb-8">{test.description}</p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-semibold">{test.duration_minutes} Minutes</p>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
              <div className="text-center">
                <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-semibold">{test.total_questions} Questions</p>
                <p className="text-sm text-muted-foreground">Total Questions</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-semibold">Multiple Choice</p>
                <p className="text-sm text-muted-foreground">Question Type</p>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-lg mb-8">
              <h3 className="font-semibold mb-4">Instructions:</h3>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li>• Read each question carefully before selecting your answer</li>
                <li>• You can navigate between questions during the test</li>
                <li>• The test will auto-submit when time runs out</li>
                <li>• Your progress will be saved automatically</li>
              </ul>
            </div>

            <Button size="lg" onClick={startTest} className="px-8">
              Start Test Now
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const currentQ = test.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-primary">Aptitude Test</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Question {currentQuestion + 1} of {test.questions.length}
            </h2>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-8">
          <div className="mb-6">
            <div className="inline-block px-3 py-1 bg-muted rounded-full text-sm font-medium mb-4">
              {currentQ.type.charAt(0).toUpperCase() + currentQ.type.slice(1)}
            </div>
            <h3 className="text-xl font-semibold leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          <RadioGroup
            value={answers[currentQ.id]?.toString()}
            onValueChange={(value) => selectAnswer(currentQ.id, parseInt(value))}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            <div className="flex gap-3">
              {currentQuestion === test.questions.length - 1 ? (
                <Button onClick={submitTest} className="px-8">
                  Submit Test
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  Next Question
                </Button>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AptitudeTest;