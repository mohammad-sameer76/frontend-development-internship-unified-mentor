import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, MapPin, Building2, FileText, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  status: string;
  applied_at: string;
  college_id: string;
  documents: any;
  colleges?: {
    name: string;
    location: string;
    city: string;
    state: string;
    fees_per_year: number;
    rating: number;
  };
}

const Applications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchApplications();
  }, [user, navigate]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('college_applications')
        .select(`
          *,
          colleges (
            name,
            location,
            city,
            state,
            fees_per_year,
            rating
          )
        `)
        .eq('user_id', user?.id)
        .order('applied_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: "Error",
          description: "Failed to load applications",
          variant: "destructive",
        });
        return;
      }

      setApplications(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">My Applications</h1>
              <p className="text-muted-foreground">Track your college application status</p>
            </div>
          </div>
          <Button onClick={() => navigate('/colleges')} variant="outline">
            <Building2 className="h-4 w-4 mr-2" />
            Browse More Colleges
          </Button>
        </div>

        {applications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't applied to any colleges yet. Start by exploring colleges that match your interests.
              </p>
              <Button onClick={() => navigate('/colleges')}>
                <Building2 className="h-4 w-4 mr-2" />
                Explore Colleges
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary">
                        {application.colleges?.name || 'Unknown College'}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {application.colleges?.city}, {application.colleges?.state}
                      </CardDescription>
                    </div>
                    <Badge 
                      className={`${getStatusColor(application.status)} capitalize`}
                      variant="outline"
                    >
                      {application.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Applied Date</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(application.applied_at)}
                        </p>
                      </div>
                    </div>
                    {application.colleges?.fees_per_year && (
                      <div>
                        <p className="text-sm font-medium">Annual Fees</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{application.colleges.fees_per_year.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {application.colleges?.rating && (
                      <div>
                        <p className="text-sm font-medium">Rating</p>
                        <p className="text-sm text-muted-foreground">
                          ⭐ {application.colleges.rating}/5
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Application ID: {application.id.slice(0, 8)}...
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/college/${application.college_id}`)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View College
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Applications;