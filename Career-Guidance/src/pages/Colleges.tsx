import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, MapPin, Star, Users, IndianRupee, ArrowLeft } from 'lucide-react';
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
}

const Colleges = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedField, setSelectedField] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchColleges();
  }, [user, navigate]);

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching colleges:', error);
        toast({
          title: "Error",
          description: "Failed to load colleges",
          variant: "destructive"
        });
      } else {
        setColleges(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (collegeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('college_applications')
        .insert([
          {
            user_id: user.id,
            college_id: collegeId,
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
    }
  };

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = !selectedState || selectedState === 'all' || college.state === selectedState;
    const matchesField = !selectedField || selectedField === 'all' || college.courses.some(course => 
      course.toLowerCase().includes(selectedField.toLowerCase())
    );
    
    return matchesSearch && matchesState && matchesField;
  });

  const uniqueStates = [...new Set(colleges.map(college => college.state))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading colleges...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-xl font-bold text-primary">Colleges & Universities</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {uniqueStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger>
                <SelectValue placeholder="Field of Study" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Management">Management</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Computer">Computer Science</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredColleges.length} of {colleges.length} colleges
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {filteredColleges.map((college) => (
            <Card key={college.id} className="overflow-hidden hover:shadow-card-hover transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">{college.name}</h3>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{college.location}</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <Star className="h-4 w-4 text-warning mr-1" />
                      <span className="font-semibold mr-4">{college.rating}</span>
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{college.total_students.toLocaleString()}+ students</span>
                    </div>
                  </div>
                  <Badge className="bg-education-blue text-white">
                    Est. {college.established_year}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {college.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Annual Fees</span>
                    <div className="flex items-center font-semibold">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {(college.fees_per_year / 100000).toFixed(1)}L
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Placement Rate</span>
                    <p className="font-semibold text-success">{college.placement_rate}%</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Popular Courses:</p>
                  <div className="flex flex-wrap gap-1">
                    {college.courses.slice(0, 3).map((course, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                    {college.courses.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{college.courses.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={() => navigate(`/college/${college.id}`)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="hero"
                    onClick={() => handleApply(college.id)}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredColleges.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No colleges found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Colleges;