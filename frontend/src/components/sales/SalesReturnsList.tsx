
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, 
  Plus, 
  FileText, 
  Users, 
  FileX, 
  RefreshCcw,
  Package,
  Trash
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SalesReturn } from '@/models/sales';
import { format } from 'date-fns';

// Mock function to get sales returns
import { getSalesReturns } from '@/data/mockSales';

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-amber-100 text-amber-800",
  processed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const conditionColors: Record<string, string> = {
  damaged: "bg-red-100 text-red-800",
  wrong_item: "bg-amber-100 text-amber-800",
  not_as_described: "bg-blue-100 text-blue-800",
  other: "bg-gray-100 text-gray-800",
};

const restockStatusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  restocked: "bg-green-100 text-green-800",
  disposed: "bg-red-100 text-red-800",
};

const SalesReturnsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReturnId, setSelectedReturnId] = useState<string>('');
  
  const salesReturns = getSalesReturns();
  
  const filteredReturns = salesReturns.filter(returnItem => 
    returnItem.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    returnItem.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    returnItem.invoiceId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setSelectedReturnId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real application, we would call an API to delete the return
    console.log(`Deleting return ${selectedReturnId}`);
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
            placeholder="Search returns..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Create Return
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCcw className="mr-2 h-5 w-5" /> Sales Returns
          </CardTitle>
          <CardDescription>Process and manage returned items from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Return #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Restock Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReturns.length > 0 ? (
                filteredReturns.map((returnItem) => (
                  <TableRow key={returnItem.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        {returnItem.number}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        {returnItem.customer.name}
                      </div>
                    </TableCell>
                    <TableCell>{format(returnItem.date, 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {returnItem.invoiceId}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="truncate max-w-[150px]" title={returnItem.reason}>
                        {returnItem.reason}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={conditionColors[returnItem.returnCondition] || "bg-gray-100"}>
                        {returnItem.returnCondition.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      ${returnItem.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[returnItem.status] || "bg-gray-100"}>
                        {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={restockStatusColors[returnItem.restockStatus] || "bg-gray-100"}>
                        {returnItem.restockStatus.charAt(0).toUpperCase() + returnItem.restockStatus.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(returnItem.id)}
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
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No returns found. Try adjusting your search or create a new return.
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
              Are you sure you want to delete this return? This action cannot be undone.
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

export default SalesReturnsList;
