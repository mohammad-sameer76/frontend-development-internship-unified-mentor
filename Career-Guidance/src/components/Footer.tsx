import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-education-green" />
              <span className="text-2xl font-bold">StudyCompass</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Empowering students to make informed decisions about their educational journey. 
              Find the perfect college match for your future success.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@studycompass.edu</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-education-green transition-colors">College Search</a></li>
              <li><a href="#" className="hover:text-education-green transition-colors">Aptitude Test</a></li>
              <li><a href="#" className="hover:text-education-green transition-colors">Career Guidance</a></li>
              <li><a href="#" className="hover:text-education-green transition-colors">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-education-green transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-education-green transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-education-green transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-education-green transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2024 StudyCompass. All rights reserved. Built with passion for education.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;