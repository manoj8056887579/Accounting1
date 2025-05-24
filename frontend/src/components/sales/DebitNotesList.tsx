
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, FileText, Users, FileX, AlertCircle, Trash, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DebitNote } from '@/models/sales';
import { format } from 'date-fns';

// Import mock data
import { getDebitNotes } from '@/data/mockSales';

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  issued: "bg-blue-100 text-blue-800",
  pending: "bg-amber-100 text-amber-800",
  processed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const DebitNotesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDebitNoteId, setSelectedDebitNoteId] = useState<string>('');
  
  const debitNotes = getDebitNotes();
  
  const filteredDebitNotes = debitNotes.filter(note => 
    note.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setSelectedDebitNoteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real application, we would call an API to delete the debit note
    console.log(`Deleting debit note ${selectedDebitNoteId}`);
    setIsDeleteDialogOpen(false);
    // Refresh the list after deletion
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search debit notes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Create Debit Note
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileX className="mr-2 h-5 w-5" /> Debit Notes
          </CardTitle>
          <CardDescription>Create and manage debit notes for vendor refunds and corrections</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Purchase Invoice</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDebitNotes.length > 0 ? (
                filteredDebitNotes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        {note.number}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        {note.customer.name}
                      </div>
                    </TableCell>
                    <TableCell>{format(note.date, 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      {note.purchaseInvoiceId ? (
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {note.purchaseInvoiceId}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="truncate max-w-[150px]" title={note.reason}>
                          {note.reason}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-red-600">
                      ${note.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[note.status] || "bg-gray-100"}>
                        {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <ArrowDown className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(note.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No debit notes found. Try adjusting your search or create a new debit note.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this debit note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DebitNotesList;
