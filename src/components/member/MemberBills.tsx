import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Receipt, DollarSign } from 'lucide-react';
import { useFirestore } from '@/hooks/useFirestore';
import { useAuth } from '@/hooks/useAuth';

export function MemberBills() {
  const { userData } = useAuth();
  const { data: bills, loading } = useFirestore('bills');
  
  // Filter bills for current member
  const memberBills = bills.filter(bill => bill.memberEmail === userData?.email);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div>Loading bills...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          My Bills & Receipts
        </CardTitle>
        <CardDescription>View your billing history and payment status</CardDescription>
      </CardHeader>
      <CardContent>
        {memberBills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No bills found for your account.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt #</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Paid Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.receiptNumber}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    ₹{bill.amount}
                  </TableCell>
                  <TableCell>{bill.dueDate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(bill.status)}`}>
                      {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{bill.description}</TableCell>
                  <TableCell>{bill.paidDate || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}