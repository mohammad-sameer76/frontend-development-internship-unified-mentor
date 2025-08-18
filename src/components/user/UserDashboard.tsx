import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, User, Phone, Mail, Calendar } from 'lucide-react';

export function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Mock data for gym records
  const [records, setRecords] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      membershipType: 'Premium',
      joinDate: '2024-01-15',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 9876543211',
      membershipType: 'Basic',
      joinDate: '2024-02-01',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+91 9876543212',
      membershipType: 'VIP',
      joinDate: '2023-12-10',
      status: 'Inactive'
    }
  ]);

  const [userDetails] = useState({
    name: 'Guest User',
    email: 'user@gym.com',
    role: 'User',
    accessLevel: 'Read Only'
  });

  const filteredRecords = records.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.phone.includes(searchTerm) ||
    record.membershipType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>

      {/* User Details Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
          <CardDescription>Your account details and access level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{userDetails.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{userDetails.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{userDetails.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Search className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Access Level</p>
                <p className="font-medium">{userDetails.accessLevel}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Records */}
      <Card>
        <CardHeader>
          <CardTitle>Search Gym Records</CardTitle>
          <CardDescription>Search and view gym member information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, or membership type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.email}</TableCell>
                      <TableCell>{record.phone}</TableCell>
                      <TableCell>{record.membershipType}</TableCell>
                      <TableCell>{record.joinDate}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            record.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No records found matching your search.' : 'No records to display.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredRecords.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredRecords.length} of {records.length} records
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}