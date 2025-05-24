
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Pencil, Play, Pause, Calendar } from 'lucide-react';
import { RecurringBill } from '@/models/purchases';
import { getRecurringBills } from '@/data/mockPurchases';
import { useToast } from '@/components/ui/use-toast';

const RecurringBillsList = () => {
  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>(getRecurringBills());
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Filter recurring bills based on search query
  const filteredBills = recurringBills.filter(
    bill =>
      bill.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRecurringBill = () => {
    toast({
      title: "Add Recurring Bill",
      description: "This would open a form to create a new recurring bill"
    });
  };

  const handleEditBill = (bill: RecurringBill) => {
    toast({
      title: "Edit Recurring Bill",
      description: `Editing recurring bill ${bill.reference}`
    });
  };

  const handleDeleteBill = (bill: RecurringBill) => {
    setRecurringBills(recurringBills.filter(b => b.id !== bill.id));
    toast({
      title: "Recurring Bill Deleted",
      description: `Recurring bill ${bill.reference} has been deleted`,
      variant: "destructive"
    });
  };

  const handleViewBill = (bill: RecurringBill) => {
    toast({
      title: "View Recurring Bill Details",
      description: `Viewing details for recurring bill ${bill.reference}`
    });
  };

  const toggleStatus = (bill: RecurringBill) => {
    const newStatus = bill.status === 'active' ? 'paused' : 'active';
    const updatedBills = recurringBills.map(b => 
      b.id === bill.id ? { ...b, status: newStatus as 'active' | 'paused' | 'completed' } : b
    );
    setRecurringBills(updatedBills);
    toast({
      title: `Recurring Bill ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
      description: `Recurring bill ${bill.reference} has been ${newStatus === 'active' ? 'activated' : 'paused'}`
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
            Recurring Bills
          </CardTitle>
          <CardDescription>Manage recurring bills from vendors</CardDescription>
        </div>
        <Button onClick={handleAddRecurringBill}>
          Add Recurring Bill
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search recurring bills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Next Date</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No recurring bills found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">
                      {bill.reference}
                    </TableCell>
                    <TableCell>
                      {bill.vendor}
                    </TableCell>
                    <TableCell>
                      {bill.nextDate}
                    </TableCell>
                    <TableCell className="capitalize">
                      {bill.frequency}
                    </TableCell>
                    <TableCell>
                      ${bill.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={bill.status === 'active' ? 'default' : bill.status === 'paused' ? 'outline' : 'secondary'}>
                        {bill.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(bill)}
                        >
                          {bill.status === 'active' ? 
                            <Pause className="h-4 w-4 text-amber-500" /> : 
                            <Play className="h-4 w-4 text-green-500" />
                          }
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewBill(bill)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBill(bill)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBill(bill)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecurringBillsList;
