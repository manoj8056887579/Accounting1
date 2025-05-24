
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
import { Search, Plus, FileText, Users, FileMinus, AlertCircle } from 'lucide-react';
import { CreditNote } from '@/models/sales';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

// Mock function to get credit notes
import { getCreditNotes } from '@/data/mockSales';

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  issued: "bg-blue-100 text-blue-800",
  pending: "bg-amber-100 text-amber-800",
  processed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const CreditNotesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const creditNotes = getCreditNotes();
  
  const filteredCreditNotes = creditNotes.filter(note => 
    note.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search credit notes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Issue Credit Note
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileMinus className="mr-2 h-5 w-5" /> Credit Notes
          </CardTitle>
          <CardDescription>Manage refunds and credits for customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Original Invoice</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCreditNotes.length > 0 ? (
                filteredCreditNotes.map((note) => (
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
                      {note.invoiceId ? (
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {note.invoiceId}
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
                    <TableCell className="font-medium text-green-600">
                      ${note.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[note.status] || "bg-gray-100"}>
                        {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Print</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No credit notes found. Try adjusting your search or issue a new credit note.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditNotesList;
