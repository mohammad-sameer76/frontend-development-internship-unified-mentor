import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, Target, Award, Users, LogOut, Search, CheckCircle, Clock, FileText } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  academic_score: number | null;
  preferred_field: string | null;
  budget_max: number | null;
  entrance_exam_score: number | null;
  phone: string | null;
  date_of_birth: string | null;
}

interface Application {
  id: string;
  status: string;
  applied_at: string;
  college_id: string;
  colleges?: {
    name: string;
    location: string;
  };
}

interface TestResult {
  id: string;
  score: number;
  completed_at: string;
  test_id: string;
  aptitude_tests?: {
    title: string;
  };
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    profileCompletion: 0,
    totalApplications: 0,
    testsTaken: 0,
    recentActivity: [] as any[]
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      } else if (profileData) {
        setProfile(profileData);
      }

      // Fetch applications
      const { data: applicationsData, error: appsError } = await supabase
        .from('college_applications')
        .select(`
          *,
          colleges (name, location)
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (appsError) {
        console.error('Error fetching applications:', appsError);
      } else if (applicationsData) {
        setApplications(applicationsData);
      }

      // Fetch test results
      const { data: testData, error: testError } = await supabase
        .from('test_results')
        .select(`
          *,
          aptitude_tests (title)
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(5);

      if (testError) {
        console.error('Error fetching test results:', testError);
      } else if (testData) {
        setTestResults(testData);
      }

      // Calculate dashboard stats
      calculateDashboardStats(profileData, applicationsData || [], testData || []);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDashboardStats = (profile: Profile | null, apps: Application[], tests: TestResult[]) => {
    // Calculate profile completion percentage
    const fields = [
      profile?.full_name,
      profile?.email,
      profile?.academic_score,
      profile?.preferred_field,
      profile?.budget_max,
      profile?.phone,
      profile?.date_of_birth
    ];
    const completedFields = fields.filter(field => field !== null && field !== undefined).length;
    const profileCompletion = Math.round((completedFields / fields.length) * 100);

    // Recent activity
    const recentActivity = [
      ...apps.map(app => ({
        type: 'application',
        title: `Applied to ${app.colleges?.name || 'College'}`,
        date: app.applied_at,
        status: app.status
      })),
      ...tests.map(test => ({
        type: 'test',
        title: `Completed ${test.aptitude_tests?.title || 'Test'}`,
        date: test.completed_at,
        score: test.score
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    setDashboardStats({
      profileCompletion,
      totalApplications: apps.length,
      testsTaken: tests.length,
      recentActivity
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-primary">Dashboard</h1>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Welcome back, {profile?.full_name || user?.email || 'Student'}!
          </h2>
          <p className="text-muted-foreground">
            Continue your educational journey with personalized recommendations.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profile Completion</p>
                <p className="text-2xl font-bold">{dashboardStats.profileCompletion}%</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <Progress value={dashboardStats.profileCompletion} className="mt-3" />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">{dashboardStats.totalApplications}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tests Taken</p>
                <p className="text-2xl font-bold">{dashboardStats.testsTaken}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recent Activity</p>
                <p className="text-2xl font-bold">{dashboardStats.recentActivity.length}</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center hover:shadow-card-hover transition-shadow">
            <BookOpen className="h-12 w-12 text-education-blue mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Explore Colleges</h3>
            <p className="text-muted-foreground mb-4">Browse and search through our database</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/colleges')}
              className="w-full"
            >
              <Search className="h-4 w-4 mr-2" />
              Browse
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-card-hover transition-shadow">
            <Target className="h-12 w-12 text-education-green mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Take Aptitude Test</h3>
            <p className="text-muted-foreground mb-4">Assess your skills and abilities</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/test')}
              className="w-full"
            >
              <Award className="h-4 w-4 mr-2" />
              Start Test
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-card-hover transition-shadow">
            <Users className="h-12 w-12 text-education-purple mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Profile Setup</h3>
            <p className="text-muted-foreground mb-4">Complete your academic profile</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/profile')}
              className="w-full"
            >
              Update Profile
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-card-hover transition-shadow">
            <Award className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">My Applications</h3>
            <p className="text-muted-foreground mb-4">Track your college applications</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/applications')}
              className="w-full"
            >
              View Status
            </Button>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {dashboardStats.recentActivity.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No recent activity. Start by completing your profile or taking a test!
                </p>
              ) : (
                dashboardStats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {activity.type === 'application' ? (
                        <FileText className="h-5 w-5 text-primary" />
                      ) : (
                        <Target className="h-5 w-5 text-success" />
                      )}
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {activity.status && (
                        <Badge variant={activity.status === 'approved' ? 'default' : 'secondary'}>
                          {activity.status}
                        </Badge>
                      )}
                      {activity.score && (
                        <Badge variant="outline">
                          {activity.score}%
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-3">Quick Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/profile')}
                  className="justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/career-selection')}
                  className="justify-start"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Select Career
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/test')}
                  className="justify-start"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Take Test
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Profile Summary</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Email</span>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Name</span>
                  <p className="font-medium">{profile?.full_name || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Academic Score</span>
                  <p className="font-medium">{profile?.academic_score || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Preferred Field</span>
                  <p className="font-medium">{profile?.preferred_field || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Budget</span>
                  <p className="font-medium">
                    {profile?.budget_max ? `₹${profile.budget_max.toLocaleString()}` : 'Not set'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">My Applications</h3>
              <div className="space-y-3">
                {applications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No applications yet</p>
                ) : (
                  applications.slice(0, 3).map((app) => (
                    <div key={app.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{app.colleges?.name}</p>
                        <p className="text-xs text-muted-foreground">{app.colleges?.location}</p>
                      </div>
                      <Badge variant={app.status === 'approved' ? 'default' : 'secondary'} className="text-xs">
                        {app.status}
                      </Badge>
                    </div>
                  ))
                )}
                {applications.length > 3 && (
                  <Button variant="ghost" size="sm" onClick={() => navigate('/applications')} className="w-full">
                    View All ({applications.length})
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;