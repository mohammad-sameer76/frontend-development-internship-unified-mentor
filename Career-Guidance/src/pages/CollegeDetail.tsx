import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, MapPin, Star, Users, IndianRupee, Calendar, BookOpen, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface College {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  rating: number;
  total_students: number;
  fees_per_year: number;
  placement_rate: number;
  courses: string[];
  description: string;
  established_year: number;
  facilities: string[];
  scholarships: string[];
  eligibility: any;
  type: string;
  website_url: string | null;
}

const CollegeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (id) {
      fetchCollege();
    }
  }, [id, user, navigate]);

  const fetchCollege = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching college:', error);
        toast({
          title: "Error",
          description: "Failed to load college details",
          variant: "destructive"
        });
        navigate('/colleges');
      } else {
        setCollege(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user || !college) return;

    setApplying(true);
    try {
      const { error } = await supabase
        .from('college_applications')
        .insert([
          {
            user_id: user.id,
            college_id: college.id,
            status: 'pending'
          }
        ]);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Application Submitted!",
          description: "Your application has been submitted successfully."
        });
      }
    } catch (error) {
      console.error('Error applying:', error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading college details...</p>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">College not found</h2>
          <Button onClick={() => navigate('/colleges')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Colleges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" onClick={() => navigate('/colleges')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Colleges
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">{college.name}</h1>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{college.location}</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <Star className="h-4 w-4 text-warning mr-1" />
                      <span className="font-semibold mr-4">{college.rating}</span>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">Est. {college.established_year}</span>
                    </div>
                  </div>
                  <Badge className="bg-education-blue text-white">
                    {college.type}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {college.description}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-card rounded-lg">
                  <Users className="h-8 w-8 text-education-blue mx-auto mb-2" />
                  <div className="text-2xl font-bold">{college.total_students.toLocaleString()}+</div>
                  <div className="text-sm text-muted-foreground">Students</div>
                </div>
                <div className="text-center p-4 bg-gradient-card rounded-lg">
                  <Award className="h-8 w-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold">{college.placement_rate}%</div>
                  <div className="text-sm text-muted-foreground">Placement Rate</div>
                </div>
                <div className="text-center p-4 bg-gradient-card rounded-lg">
                  <IndianRupee className="h-8 w-8 text-education-purple mx-auto mb-2" />
                  <div className="text-2xl font-bold">{(college.fees_per_year / 100000).toFixed(1)}L</div>
                  <div className="text-sm text-muted-foreground">Annual Fees</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Courses Offered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {college.courses.map((course, idx) => (
                      <Badge key={idx} variant="secondary">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>

                {college.facilities && college.facilities.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Facilities</h3>
                    <div className="grid md:grid-cols-2 gap-2">
                      {college.facilities.map((facility, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-education-green rounded-full mr-3"></div>
                          <span>{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {college.scholarships && college.scholarships.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Scholarships</h3>
                    <div className="space-y-2">
                      {college.scholarships.map((scholarship, idx) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg">
                          <span>{scholarship}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Apply Now</h3>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Ready to start your journey at {college.name}?
                </div>
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    variant="hero"
                    onClick={() => navigate(`/college/${id}/register`)}
                  >
                    Register for Admission
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full" 
                    onClick={handleApply}
                    disabled={applying}
                  >
                    {applying ? 'Submitting...' : 'Quick Apply'}
                  </Button>
                </div>
                {college.website_url && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(college.website_url!, '_blank')}
                  >
                    Visit Website
                  </Button>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{college.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Established:</span>
                  <span className="font-medium">{college.established_year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{college.city}, {college.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating:</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-warning mr-1" />
                    <span className="font-medium">{college.rating}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollegeDetail;