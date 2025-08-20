import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users, GraduationCap, IndianRupee } from "lucide-react";

const CollegeShowcase = () => {
  const featuredColleges = [
    {
      name: "Indian Institute of Technology, Delhi",
      location: "New Delhi, India",
      rating: 4.8,
      students: "8,000+",
      courses: ["Computer Science", "Mechanical", "Electrical", "Chemical"],
      fees: "₹2.5L/year",
      placement: "98%",
      badge: "Top Ranked",
      badgeColor: "bg-education-blue"
    },
    {
      name: "National Institute of Technology, Trichy",
      location: "Tiruchirappalli, Tamil Nadu",
      rating: 4.6,
      students: "9,500+",
      courses: ["Engineering", "Management", "Science"],
      fees: "₹1.8L/year",
      placement: "95%",
      badge: "Premier Institute",
      badgeColor: "bg-education-green"
    },
    {
      name: "Birla Institute of Technology and Science",
      location: "Pilani, Rajasthan",
      rating: 4.7,
      students: "12,000+",
      courses: ["Engineering", "Pharmacy", "Sciences"],
      fees: "₹4.2L/year",
      placement: "92%",
      badge: "Private Excellence",
      badgeColor: "bg-education-purple"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Featured Colleges & Universities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore some of the top-rated institutions in our database with detailed information and insights.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {featuredColleges.map((college, index) => (
            <Card key={index} className="overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-2 bg-card">
              <div className="h-48 bg-gradient-hero relative">
                <div className="absolute top-4 left-4">
                  <Badge className={`${college.badgeColor} text-white`}>
                    {college.badge}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-2">{college.name}</h3>
                  <div className="flex items-center text-white/90">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{college.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-warning mr-1" />
                    <span className="font-semibold">{college.rating}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">{college.students}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Annual Fees:</span>
                    <span className="font-semibold">{college.fees}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Placement Rate:</span>
                    <span className="font-semibold text-success">{college.placement}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Popular Courses:</p>
                  <div className="flex flex-wrap gap-1">
                    {college.courses.map((course, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="default" className="flex-1" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Compare
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="hero" size="lg">
            Explore All Colleges
            <GraduationCap className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CollegeShowcase;