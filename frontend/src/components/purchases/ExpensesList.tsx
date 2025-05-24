
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Expense } from '@/models/purchases';
import { getExpenses } from '@/data/mockPurchases';
import { useToast } from '@/components/ui/use-toast';
import ExpenseForm from './ExpenseForm';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState<Expense[]>(getExpenses());
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const { toast } = useToast();

  // Filter expenses based on search query
  const filteredExpenses = expenses.filter(
    expense =>
      expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle creating/updating expenses
  const handleFormSubmit = (expense: Expense) => {
    if (isEditFormOpen && currentExpense) {
      // Update existing expense
      const updatedExpenses = expenses.map(e =>
        e.id === expense.id ? expense : e
      );
      setExpenses(updatedExpenses);
      toast({
        title: "Expense Updated",
        description: `Reference ${expense.reference} has been updated successfully.`
      });
    } else {
      // Add new expense
      setExpenses([...expenses, expense]);
      toast({
        title: "Expense Added",
        description: `New expense has been added successfully.`
      });
    }
    
    setIsAddFormOpen(false);
    setIsEditFormOpen(false);
    setCurrentExpense(null);
  };

  // Handle delete expense
  const handleDeleteExpense = () => {
    if (expenseToDelete) {
      const updatedExpenses = expenses.filter(e => e.id !== expenseToDelete.id);
      setExpenses(updatedExpenses);
      toast({
        title: "Expense Deleted",
        description: `Expense ${expenseToDelete.reference} has been removed.`,
        variant: "destructive"
      });
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    }
  };

  // Process expense (change status to processed)
  const handleProcessExpense = (expense: Expense) => {
    const updatedExpenses = expenses.map(e =>
      e.id === expense.id ? { ...e, status: 'processed' as const } : e
    );
    setExpenses(updatedExpenses);
    toast({
      title: "Expense Processed",
      description: `Expense ${expense.reference} has been processed.`,
      variant: "default"
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>
              Manage your business expenses
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search expenses..."
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
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No expenses found. Try adjusting your search.
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
                      <TableCell className="hidden md:table-cell">
                        {expense.date}
                      </TableCell>
                      <TableCell>
                        ${expense.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          expense.status === 'processed' ? 'bg-green-100 text-green-800' :
                          expense.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          expense.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {expense.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {expense.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleProcessExpense(expense)}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentExpense(expense);
                              setIsEditFormOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setExpenseToDelete(expense);
                              setDeleteDialogOpen(true);
                            }}
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

      {/* Expense Form Dialog */}
      {(isAddFormOpen || isEditFormOpen) && (
        <ExpenseForm
          expense={currentExpense || undefined}
          isOpen={isAddFormOpen || isEditFormOpen}
          onClose={() => {
            setIsAddFormOpen(false);
            setIsEditFormOpen(false);
            setCurrentExpense(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete expense "{expenseToDelete?.reference}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExpense}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpensesList;
