import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Eye, 
  CheckCircle,
  Clock,
  XCircle,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CollegeApplication {
  id: string;
  user_id: string;
  status: string;
  applied_at: string;
  documents: any;
  profiles?: {
    full_name: string | null;
    email: string | null;
    academic_score: number | null;
    preferred_field: string | null;
  } | null;
}

const CollegeDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<CollegeApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('college_applications')
        .select('*')
        .order('applied_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        setApplications([]);
        setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
        return;
      }

      // Get user profiles separately if we have applications
      if (data && data.length > 0) {
        const userIds = data.map(app => app.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, email, academic_score, preferred_field')
          .in('user_id', userIds);

        // Merge profiles with applications
        const applicationsWithProfiles = data.map(app => ({
          ...app,
          profiles: profilesData?.find(profile => profile.user_id === app.user_id) || null
        }));
        
        setApplications(applicationsWithProfiles);
        
        // Calculate stats from the merged data
        const total = applicationsWithProfiles.length;
        const pending = applicationsWithProfiles.filter(app => app.status === 'pending').length;
        const approved = applicationsWithProfiles.filter(app => app.status === 'approved').length;
        const rejected = applicationsWithProfiles.filter(app => app.status === 'rejected').length;
        
        setStats({ total, pending, approved, rejected });
      } else {
        setApplications([]);
        setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
      }
    } catch (error) {
      console.error('Error:', error);
      setApplications([]);
      setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('college_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating application:', error);
        toast({
          title: "Error",
          description: "Failed to update application status",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: `Application ${newStatus} successfully!`
      });

      fetchApplications(); // Refresh data
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleSignOut = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading college dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-primary">College Dashboard</h1>
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
            College Admin Panel
          </h2>
          <p className="text-muted-foreground">
            Manage student applications and college information.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Total Applications</h3>
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
          </Card>

          <Card className="p-6 text-center">
            <Clock className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Pending Review</h3>
            <p className="text-3xl font-bold text-warning">{stats.pending}</p>
          </Card>

          <Card className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Approved</h3>
            <p className="text-3xl font-bold text-success">{stats.approved}</p>
          </Card>

          <Card className="p-6 text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Rejected</h3>
            <p className="text-3xl font-bold text-destructive">{stats.rejected}</p>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Student Applications</h3>
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No applications received yet.
                  </p>
                ) : (
                  applications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h4 className="font-medium">
                              {application.profiles?.full_name || 'Unknown Student'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {application.profiles?.email || 'No email'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(application.status)}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Applied Date:</span>
                          <p className="font-medium">
                            {new Date(application.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Academic Score:</span>
                          <p className="font-medium">
                            {application.profiles?.academic_score || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Preferred Field:</span>
                          <p className="font-medium">
                            {application.profiles?.preferred_field || 'Not specified'}
                          </p>
                        </div>
                      </div>

                      {application.status === 'pending' && (
                        <div className="flex space-x-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateApplicationStatus(application.id, 'approved')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateApplicationStatus(application.id, 'rejected')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Application Trends</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>This Week</span>
                    <span className="font-medium">
                      {applications.filter(app => 
                        new Date(app.applied_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length} applications
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>This Month</span>
                    <span className="font-medium">
                      {applications.filter(app => 
                        new Date(app.applied_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                      ).length} applications
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Applications
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Statistics
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">College Settings</h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Update College Information
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Admissions Criteria
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Configure Application Forms
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CollegeDashboard;