
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
import { Pencil, Trash2, Play, Pause } from 'lucide-react';
import { RecurringExpense } from '@/models/purchases';
import { getRecurringExpenses } from '@/data/mockPurchases';
import { useToast } from '@/components/ui/use-toast';

const RecurringExpensesList = () => {
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>(getRecurringExpenses());
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Filter recurring expenses based on search query
  const filteredExpenses = recurringExpenses.filter(
    expense =>
      expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRecurringExpense = () => {
    toast({
      title: "Add Recurring Expense",
      description: "This would open a form to create a new recurring expense"
    });
  };

  const handleEditExpense = (expense: RecurringExpense) => {
    toast({
      title: "Edit Recurring Expense",
      description: `Editing recurring expense ${expense.reference}`
    });
  };

  const handleDeleteExpense = (expense: RecurringExpense) => {
    setRecurringExpenses(recurringExpenses.filter(e => e.id !== expense.id));
    toast({
      title: "Recurring Expense Deleted",
      description: `Recurring expense ${expense.reference} has been removed`
    });
  };

  const toggleStatus = (expense: RecurringExpense) => {
    const newStatus = expense.status === 'active' ? 'paused' : 'active';
    const updatedExpenses = recurringExpenses.map(e => 
      e.id === expense.id ? { ...e, status: newStatus as 'active' | 'paused' | 'completed' } : e
    );
    setRecurringExpenses(updatedExpenses);
    toast({
      title: `Recurring Expense ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
      description: `Recurring expense ${expense.reference} has been ${newStatus === 'active' ? 'activated' : 'paused'}`
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <CardTitle>Recurring Expenses</CardTitle>
          <CardDescription>Manage your recurring expenses</CardDescription>
        </div>
        <Button onClick={handleAddRecurringExpense}>
          Add Recurring Expense
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search recurring expenses..."
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
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Next Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No recurring expenses found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">
                      {expense.reference}
                    </TableCell>
                    <TableCell>{expense.vendor}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {expense.category}
                    </TableCell>
                    <TableCell>
                      {expense.nextDate}
                    </TableCell>
                    <TableCell>
                      ${expense.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="capitalize">
                      {expense.frequency}
                    </TableCell>
                    <TableCell>
                      <Badge variant={expense.status === 'active' ? 'default' : expense.status === 'paused' ? 'outline' : 'secondary'}>
                        {expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(expense)}
                        >
                          {expense.status === 'active' ? 
                            <Pause className="h-4 w-4 text-amber-500" /> : 
                            <Play className="h-4 w-4 text-green-500" />
                          }
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditExpense(expense)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense)}
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

export default RecurringExpensesList;
