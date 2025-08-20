import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Code, Stethoscope, Calculator, Palette, Building, Gavel } from "lucide-react";

const CareerSelection = () => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const navigate = useNavigate();

  const careerFields = [
    {
      id: "engineering",
      title: "Engineering & Technology",
      description: "Build the future with technology",
      icon: Code,
      color: "bg-education-blue"
    },
    {
      id: "medical",
      title: "Medical & Healthcare",
      description: "Help save lives and improve health",
      icon: Stethoscope,
      color: "bg-education-green"
    },
    {
      id: "finance",
      title: "Finance & Economics",
      description: "Manage money and economic systems",
      icon: Calculator,
      color: "bg-education-purple"
    },
    {
      id: "arts",
      title: "Arts & Design",
      description: "Express creativity and visual communication",
      icon: Palette,
      color: "bg-warning"
    },
    {
      id: "business",
      title: "Business & Management",
      description: "Lead teams and organizations",
      icon: Building,
      color: "bg-success"
    },
    {
      id: "law",
      title: "Law & Legal Studies",
      description: "Uphold justice and legal systems",
      icon: Gavel,
      color: "bg-destructive"
    }
  ];

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleNext = () => {
    if (selectedFields.length > 0) {
      navigate("/location-selection", { state: { selectedFields } });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-primary">Select Your Career Interests</h1>
          <div></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {careerFields.map((field) => {
            const Icon = field.icon;
            const isSelected = selectedFields.includes(field.id);
            
            return (
              <Card 
                key={field.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-card-hover ${
                  isSelected ? 'ring-2 ring-education-blue shadow-card-hover' : ''
                }`}
                onClick={() => toggleField(field.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full ${field.color}/20 flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-8 w-8 text-white`} />
                  </div>
                  <CardTitle className="text-lg">{field.title}</CardTitle>
                  <CardDescription>{field.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  {isSelected && (
                    <Badge variant="secondary" className="bg-education-blue text-white">
                      Selected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedFields.length > 0 && (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              {selectedFields.length} field{selectedFields.length > 1 ? 's' : ''} selected
            </p>
            <Button onClick={handleNext} size="lg">
              Continue to Location Selection
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
        
        {selectedFields.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>Select at least one career field to continue</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerSelection;