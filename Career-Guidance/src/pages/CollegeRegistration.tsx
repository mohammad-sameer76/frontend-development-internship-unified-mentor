import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, FileText, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CollegeRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: ""
    },
    academicInfo: {
      class12Percentage: "",
      entranceExamScore: "",
      preferredCourse: "",
      previousEducation: ""
    },
    documents: {
      class10Certificate: null,
      class12Certificate: null,
      entranceExamScorecard: null,
      identityProof: null
    },
    statement: ""
  });

  const requiredDocuments = [
    { key: "class10Certificate", label: "Class 10 Certificate", icon: FileText },
    { key: "class12Certificate", label: "Class 12 Certificate", icon: FileText },
    { key: "entranceExamScorecard", label: "Entrance Exam Scorecard", icon: FileText },
    { key: "identityProof", label: "Identity Proof", icon: FileText }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate registration submission
    setTimeout(() => {
      toast({
        title: "Application Submitted!",
        description: "Your college application has been submitted successfully. You will receive updates via email."
      });
      navigate("/dashboard");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate(`/college/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to College Details
          </Button>
          <h1 className="text-2xl font-bold text-primary">College Application</h1>
          <div></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Provide your basic personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, firstName: e.target.value }
                  })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, lastName: e.target.value }
                  })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, email: e.target.value }
                  })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.personalInfo.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, phone: e.target.value }
                  })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, dateOfBirth: e.target.value }
                  })}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.personalInfo.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, address: e.target.value }
                  })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Academic Information
              </CardTitle>
              <CardDescription>
                Share your academic background and achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class12Percentage">Class 12 Percentage *</Label>
                <Input
                  id="class12Percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.academicInfo.class12Percentage}
                  onChange={(e) => setFormData({
                    ...formData,
                    academicInfo: { ...formData.academicInfo, class12Percentage: e.target.value }
                  })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entranceExamScore">Entrance Exam Score</Label>
                <Input
                  id="entranceExamScore"
                  value={formData.academicInfo.entranceExamScore}
                  onChange={(e) => setFormData({
                    ...formData,
                    academicInfo: { ...formData.academicInfo, entranceExamScore: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredCourse">Preferred Course *</Label>
                <Input
                  id="preferredCourse"
                  value={formData.academicInfo.preferredCourse}
                  onChange={(e) => setFormData({
                    ...formData,
                    academicInfo: { ...formData.academicInfo, preferredCourse: e.target.value }
                  })}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="previousEducation">Previous Education Details</Label>
                <Textarea
                  id="previousEducation"
                  value={formData.academicInfo.previousEducation}
                  onChange={(e) => setFormData({
                    ...formData,
                    academicInfo: { ...formData.academicInfo, previousEducation: e.target.value }
                  })}
                  placeholder="Include details about your school, board, subjects, etc."
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Document Upload
              </CardTitle>
              <CardDescription>
                Upload required documents for your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {requiredDocuments.map((doc) => {
                const Icon = doc.icon;
                return (
                  <div key={doc.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{doc.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Required</Badge>
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Statement of Purpose */}
          <Card>
            <CardHeader>
              <CardTitle>Statement of Purpose</CardTitle>
              <CardDescription>
                Tell us why you want to join this college (Optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.statement}
                onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                placeholder="Describe your goals, interests, and why you chose this college..."
                rows={5}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Submitting Application..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollegeRegistration;