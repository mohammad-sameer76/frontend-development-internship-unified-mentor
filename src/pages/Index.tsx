import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Users, Receipt, Search } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Dumbbell className="h-16 w-16 text-primary mr-4" />
            <h1 className="text-5xl font-bold text-gray-900">GYM Management System</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your gym operations with our comprehensive management solution. 
            Digital receipts, member management, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/login')}>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>
                Manage members, create bills, handle notifications, and export reports
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Add & manage members</li>
                <li>• Create & track bills</li>
                <li>• Send notifications</li>
                <li>• Export reports</li>
                <li>• Manage supplements</li>
                <li>• Create diet plans</li>
              </ul>
              <Button className="w-full">Access Admin Portal</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/login')}>
            <CardHeader className="text-center">
              <Receipt className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Member Portal</CardTitle>
              <CardDescription>
                View your bills, receipts, and stay updated with gym notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• View bill receipts</li>
                <li>• Download payment receipts</li>
                <li>• Check notifications</li>
                <li>• Track membership status</li>
                <li>• Pay bills online</li>
              </ul>
              <Button variant="secondary" className="w-full">Access Member Portal</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/login')}>
            <CardHeader className="text-center">
              <Search className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">User Portal</CardTitle>
              <CardDescription>
                Search and view gym records with read-only access
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Search member records</li>
                <li>• View member details</li>
                <li>• Access gym information</li>
                <li>• Read-only access</li>
              </ul>
              <Button variant="outline" className="w-full">Access User Portal</Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Solving the problem of paper receipts and manual gym management
          </p>
          <Button onClick={() => navigate('/login')} size="lg">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
