import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";

const LocationSelection = () => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedFields } = location.state || {};

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Mumbai"
  ];

  const toggleState = (state: string) => {
    setSelectedStates(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  const handleNext = () => {
    if (selectedStates.length > 0) {
      navigate("/colleges", { 
        state: { 
          selectedFields, 
          selectedStates,
          fromSelection: true 
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/career-selection")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-primary">Select Preferred Locations</h1>
          <div></div>
        </div>

        <div className="mb-6 text-center">
          <p className="text-muted-foreground">
            Choose the states where you'd like to study
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {indianStates.map((state) => {
            const isSelected = selectedStates.includes(state);
            
            return (
              <Card 
                key={state}
                className={`cursor-pointer transition-all duration-200 hover:shadow-card-hover ${
                  isSelected ? 'ring-2 ring-education-blue shadow-card-hover bg-education-blue/5' : ''
                }`}
                onClick={() => toggleState(state)}
              >
                <CardHeader className="text-center p-4">
                  <div className="flex items-center justify-center mb-2">
                    <MapPin className={`h-5 w-5 ${isSelected ? 'text-education-blue' : 'text-muted-foreground'}`} />
                  </div>
                  <CardTitle className="text-sm font-medium">{state}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {selectedStates.length > 0 && (
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {selectedStates.map((state) => (
                <Badge key={state} variant="secondary" className="bg-education-blue text-white">
                  {state}
                </Badge>
              ))}
            </div>
            <p className="text-muted-foreground mb-4">
              {selectedStates.length} location{selectedStates.length > 1 ? 's' : ''} selected
            </p>
            <Button onClick={handleNext} size="lg">
              Find Colleges
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
        
        {selectedStates.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>Select at least one location to continue</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelection;