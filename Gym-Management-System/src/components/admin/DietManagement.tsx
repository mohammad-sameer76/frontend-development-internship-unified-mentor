import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/useFirestore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function DietManagement() {
  const { data: dietPlans, loading, addItem } = useFirestore('dietPlans');
  const { data: members } = useFirestore('members');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    memberEmail: '',
    goal: '',
    breakfast: '',
    lunch: '',
    dinner: '',
    snacks: '',
    notes: ''
  });

  const handleCreateDietPlan = async () => {
    if (!formData.memberEmail || !formData.goal) {
      toast({
        title: "Error",
        description: "Please select member and enter goal",
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
        goal: formData.goal,
        breakfast: formData.breakfast,
        lunch: formData.lunch,
        dinner: formData.dinner,
        snacks: formData.snacks,
        notes: formData.notes
      });

      setFormData({
        memberEmail: '', goal: '', breakfast: '', lunch: '', 
        dinner: '', snacks: '', notes: ''
      });
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Diet plan created successfully"
      });
    } catch (error) {
      console.error('Error creating diet plan:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Diet Plan Management</CardTitle>
              <CardDescription>Create and manage personalized diet plans for members</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Diet Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Diet Plan</DialogTitle>
                  <DialogDescription>Design a personalized diet plan for a member</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                      <Label htmlFor="goal">Fitness Goal *</Label>
                      <Input
                        id="goal"
                        value={formData.goal}
                        onChange={(e) => setFormData({...formData, goal: e.target.value})}
                        placeholder="e.g., Weight Loss, Muscle Gain"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="breakfast">Breakfast</Label>
                    <Textarea
                      id="breakfast"
                      value={formData.breakfast}
                      onChange={(e) => setFormData({...formData, breakfast: e.target.value})}
                      placeholder="Enter breakfast recommendations"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lunch">Lunch</Label>
                    <Textarea
                      id="lunch"
                      value={formData.lunch}
                      onChange={(e) => setFormData({...formData, lunch: e.target.value})}
                      placeholder="Enter lunch recommendations"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dinner">Dinner</Label>
                    <Textarea
                      id="dinner"
                      value={formData.dinner}
                      onChange={(e) => setFormData({...formData, dinner: e.target.value})}
                      placeholder="Enter dinner recommendations"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="snacks">Snacks</Label>
                    <Textarea
                      id="snacks"
                      value={formData.snacks}
                      onChange={(e) => setFormData({...formData, snacks: e.target.value})}
                      placeholder="Enter snack recommendations"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Enter any additional notes or instructions"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleCreateDietPlan} className="w-full">
                    Create Diet Plan
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
                <TableHead>Member</TableHead>
                <TableHead>Goal</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dietPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.memberName}</TableCell>
                  <TableCell>{plan.goal}</TableCell>
                  <TableCell>{plan.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Diet Plan - {plan.memberName}</DialogTitle>
                            <DialogDescription>Goal: {plan.goal}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label className="font-semibold">Breakfast</Label>
                              <p className="text-sm text-muted-foreground mt-1">{plan.breakfast || 'Not specified'}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Lunch</Label>
                              <p className="text-sm text-muted-foreground mt-1">{plan.lunch || 'Not specified'}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Dinner</Label>
                              <p className="text-sm text-muted-foreground mt-1">{plan.dinner || 'Not specified'}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Snacks</Label>
                              <p className="text-sm text-muted-foreground mt-1">{plan.snacks || 'Not specified'}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Notes</Label>
                              <p className="text-sm text-muted-foreground mt-1">{plan.notes || 'No additional notes'}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}