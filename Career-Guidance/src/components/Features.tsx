import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, BarChart3, FileText, MapPin, DollarSign } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Search,
      title: "Smart College Search",
      description: "Find colleges that match your academic profile, interests, and career goals with our intelligent search algorithm.",
      color: "text-education-blue"
    },
    {
      icon: Filter,
      title: "Advanced Filtering",
      description: "Filter by location, fees, rankings, courses, and more to narrow down your perfect college choices.",
      color: "text-education-green"
    },
    {
      icon: BarChart3,
      title: "Aptitude Assessment",
      description: "Take comprehensive tests to evaluate your verbal, quantitative, and analytical skills for better guidance.",
      color: "text-education-purple"
    },
    {
      icon: FileText,
      title: "Detailed Information",
      description: "Access complete details about fees, eligibility, placements, facilities, and scholarships for each college.",
      color: "text-warning"
    },
    {
      icon: MapPin,
      title: "Location Flexibility",
      description: "Explore opportunities both in India and abroad with our comprehensive international college database.",
      color: "text-success"
    },
    {
      icon: DollarSign,
      title: "Fee Analysis",
      description: "Compare tuition fees, living costs, and financial aid options to make budget-conscious decisions.",
      color: "text-destructive"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Everything You Need for College Selection
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and information you need to make the best educational decisions for your future.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="p-8 shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 bg-gradient-card">
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-lg bg-muted mr-4`}>
                    <IconComponent className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {feature.description}
                </p>
                <Button variant="ghost" className="text-education-blue hover:text-education-blue">
                  Learn More →
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;