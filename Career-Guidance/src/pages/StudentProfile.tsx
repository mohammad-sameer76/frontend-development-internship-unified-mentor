import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, GraduationCap, Trophy, FileText, Edit3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const StudentProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    preferred_field: "",
    preferred_location: "",
    academic_score: null as number | null,
    entrance_exam_score: null as number | null,
    budget_max: null as number | null
  });

  const [applications, setApplications] = useState([]);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchProfile();
    fetchApplications();
    fetchTestResults();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          date_of_birth: data.date_of_birth || "",
          preferred_field: data.preferred_field || "",
          preferred_location: data.preferred_location || "",
          academic_score: data.academic_score,
          entrance_exam_score: data.entrance_exam_score,
          budget_max: data.budget_max
        });
      } else {
        setProfile(prev => ({ ...prev, email: user.email || "" }));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchApplications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('college_applications')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }

      setApplications(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchTestResults = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching test results:', error);
        return;
      }

      setTestResults(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...profile
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setEditing(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-primary">Student Profile</h1>
          <Button 
            variant={editing ? "default" : "outline"} 
            onClick={editing ? handleSave : () => setEditing(true)}
            disabled={loading}
          >
            {editing ? (
              loading ? "Saving..." : "Save Changes"
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="academic">Academic Info</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="tests">Test Results</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Manage your personal details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    disabled={!editing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!editing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    disabled={!editing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={profile.date_of_birth}
                    onChange={(e) => setProfile({...profile, date_of_birth: e.target.value})}
                    disabled={!editing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred_field">Preferred Field</Label>
                  <Input
                    id="preferred_field"
                    value={profile.preferred_field}
                    onChange={(e) => setProfile({...profile, preferred_field: e.target.value})}
                    disabled={!editing}
                    placeholder="e.g., Engineering, Medicine, Arts"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred_location">Preferred Location</Label>
                  <Input
                    id="preferred_location"
                    value={profile.preferred_location}
                    onChange={(e) => setProfile({...profile, preferred_location: e.target.value})}
                    disabled={!editing}
                    placeholder="e.g., Mumbai, Delhi, Bangalore"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Academic Information
                </CardTitle>
                <CardDescription>
                  Your academic achievements and scores
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academic_score">Academic Score (%)</Label>
                  <Input
                    id="academic_score"
                    type="number"
                    min="0"
                    max="100"
                    value={profile.academic_score?.toString() || ""}
                    onChange={(e) => setProfile({...profile, academic_score: e.target.value ? parseFloat(e.target.value) : null})}
                    disabled={!editing}
                    placeholder="Class 12 percentage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entrance_exam_score">Entrance Exam Score</Label>
                  <Input
                    id="entrance_exam_score"
                    type="number"
                    value={profile.entrance_exam_score?.toString() || ""}
                    onChange={(e) => setProfile({...profile, entrance_exam_score: e.target.value ? parseFloat(e.target.value) : null})}
                    disabled={!editing}
                    placeholder="JEE/NEET/Other exam score"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget_max">Maximum Budget (₹)</Label>
                  <Input
                    id="budget_max"
                    type="number"
                    value={profile.budget_max?.toString() || ""}
                    onChange={(e) => setProfile({...profile, budget_max: e.target.value ? parseInt(e.target.value) : null})}
                    disabled={!editing}
                    placeholder="Annual fee budget"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  College Applications
                </CardTitle>
                <CardDescription>
                  Track your college application status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Application #{app.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            Applied on {new Date(app.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          variant={app.status === 'approved' ? 'default' : 
                                   app.status === 'rejected' ? 'destructive' : 'secondary'}
                        >
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No applications yet. <Button variant="link" onClick={() => navigate("/colleges")}>Browse colleges</Button>
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Aptitude Test Results
                </CardTitle>
                <CardDescription>
                  Your aptitude test performance history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {testResults.length > 0 ? (
                  <div className="space-y-4">
                    {testResults.map((result: any) => (
                      <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Aptitude Test</p>
                          <p className="text-sm text-muted-foreground">
                            Completed on {new Date(result.completed_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="default">
                          Score: {result.score}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No test results yet. <Button variant="link" onClick={() => navigate("/test")}>Take aptitude test</Button>
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentProfile;