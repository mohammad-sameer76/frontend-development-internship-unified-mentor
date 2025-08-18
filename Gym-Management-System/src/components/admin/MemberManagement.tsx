import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useFirestore } from '@/hooks/useFirestore';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  feePackage: string;
  joinDate: string;
  isActive: boolean;
  createdAt: string;
  userId?: string;
}

export function MemberManagement() {
  const { data: members, loading, addItem, updateItem, deleteItem } = useFirestore<Member>('members');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipType: '',
    feePackage: '',
    password: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      membershipType: '',
      feePackage: '',
      password: ''
    });
  };

  const handleAddMember = async () => {
    if (!formData.name || !formData.email || !formData.membershipType || !formData.password) {
      return;
    }

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: formData.name
      });

      // Save user data to Firestore users collection
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: formData.email,
        name: formData.name,
        role: 'member',
        phone: formData.phone,
        membershipType: formData.membershipType,
        feePackage: formData.feePackage,
        joinDate: new Date(),
        isActive: true
      });

      // Save member data to members collection
      await addItem({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        membershipType: formData.membershipType,
        feePackage: formData.feePackage,
        joinDate: new Date().toISOString().split('T')[0],
        isActive: true,
        userId: user.uid
      } as Omit<Member, 'id'>);

      resetForm();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error('Error adding member:', error);
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/email-already-in-use') {
        alert('Email is already registered. Please use a different email.');
      } else {
        alert('Failed to create member account. Please try again.');
      }
    }
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      membershipType: member.membershipType,
      feePackage: member.feePackage || '',
      password: ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMember = async () => {
    if (!editingMember || !formData.name || !formData.email || !formData.membershipType) {
      return;
    }

    try {
      await updateItem(editingMember.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        membershipType: formData.membershipType,
        feePackage: formData.feePackage
      });

      resetForm();
      setIsEditDialogOpen(false);
      setEditingMember(null);
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await deleteItem(id);
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  if (loading) {
    return <div>Loading members...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Member Management</CardTitle>
            <CardDescription>Add, update, and manage gym members</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogDescription>Enter member details below</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="membershipType">Membership Type *</Label>
                  <Select onValueChange={(value) => setFormData({...formData, membershipType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select membership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter password for member login"
                  />
                </div>
                <Button onClick={handleAddMember} className="w-full">
                  Add Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Membership</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.membershipType}</TableCell>
                <TableCell>{member.joinDate}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditMember(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>Update member details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="edit-membershipType">Membership Type *</Label>
              <Select value={formData.membershipType} onValueChange={(value) => setFormData({...formData, membershipType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select membership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-feePackage">Fee Package</Label>
              <Select value={formData.feePackage} onValueChange={(value) => setFormData({...formData, feePackage: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fee package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly Basic">Monthly Basic - ₹1500</SelectItem>
                  <SelectItem value="Monthly Premium">Monthly Premium - ₹2500</SelectItem>
                  <SelectItem value="Yearly Basic">Yearly Basic - ₹15000</SelectItem>
                  <SelectItem value="Yearly Premium">Yearly Premium - ₹25000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdateMember} className="w-full">
              Update Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}