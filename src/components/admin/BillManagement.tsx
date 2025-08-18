import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/useFirestore';

export function BillManagement() {
  const { data: bills, loading, addItem, updateItem } = useFirestore('bills');
  const { data: members } = useFirestore('members');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    memberEmail: '',
    amount: '',
    dueDate: '',
    description: ''
  });

  const handleCreateBill = async () => {
    if (!formData.memberEmail || !formData.amount || !formData.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedMember = members.find(m => m.email === formData.memberEmail);
    if (!selectedMember) {
      toast({
        title: "Error", 
        description: "Selected member not found",
        variant: "destructive"
      });
      return;
    }

    try {
      await addItem({
        memberEmail: formData.memberEmail,
        memberName: selectedMember.name,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        status: 'pending',
        description: formData.description,
        receiptNumber: `GYM${String(bills.length + 1).padStart(3, '0')}`
      });

      setFormData({ memberEmail: '', amount: '', dueDate: '', description: '' });
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Bill created successfully"
      });
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  };

  const handleMarkPaid = async (billId: string) => {
    try {
      await updateItem(billId, { 
        status: 'paid', 
        paidDate: new Date().toISOString().split('T')[0] 
      });
      
      toast({
        title: "Success",
        description: "Bill marked as paid"
      });
    } catch (error) {
      console.error('Error updating bill:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Bill Management</CardTitle>
            <CardDescription>Create and manage member bills</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Bill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Bill</DialogTitle>
                <DialogDescription>Enter bill details below</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="memberEmail">Select Member *</Label>
                  <Select onValueChange={(value) => setFormData({...formData, memberEmail: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.email}>
                          {member.name} ({member.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter bill description"
                  />
                </div>
                <Button onClick={handleCreateBill} className="w-full">
                  Create Bill
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
              <TableHead>Receipt #</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="font-medium">{bill.receiptNumber}</TableCell>
                <TableCell>{bill.memberName}</TableCell>
                <TableCell>₹{bill.amount}</TableCell>
                <TableCell>{bill.dueDate}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(bill.status)}`}>
                    {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{bill.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {bill.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMarkPaid(bill.id)}
                      >
                        Mark Paid
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Receipt className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}