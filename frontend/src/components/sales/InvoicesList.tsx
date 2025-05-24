
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
import { Search, Plus, FileText, Users, Eye, Wallet, Calendar } from 'lucide-react';
import { Invoice } from '@/models/sales';
import { getInvoices } from '@/data/mockSales';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Fixed statusColors mapping to ensure all payment statuses are covered
const statusColors: Record<string, { bg: string, text: string }> = {
  draft: { bg: "bg-slate-100", text: "text-slate-800" },
  sent: { bg: "bg-blue-100", text: "text-blue-800" },
  viewed: { bg: "bg-yellow-100", text: "text-yellow-800" },
  paid: { bg: "bg-green-100", text: "text-green-800" },
  partially_paid: { bg: "bg-emerald-100", text: "text-emerald-800" },
  overdue: { bg: "bg-red-100", text: "text-red-800" },
  cancelled: { bg: "bg-slate-100", text: "text-slate-800" },
  unpaid: { bg: "bg-amber-100", text: "text-amber-800" }
};

const InvoicesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const invoices = getInvoices();
  const { toast } = useToast();
  
  const filteredInvoices = invoices.filter(invoice => 
    invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateInvoice = () => {
    toast({
      title: "Create Invoice",
      description: "Opening invoice creation form"
    });
  };

  const handleViewInvoice = (invoice: Invoice) => {
    toast({
      title: "View Invoice",
      description: `Viewing invoice ${invoice.number}`
    });
  };

  const handleRecordPayment = (invoice: Invoice) => {
    toast({
      title: "Record Payment",
      description: `Recording payment for invoice ${invoice.number}`
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invoices..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto" onClick={handleCreateInvoice}>
          <Plus className="mr-2 h-4 w-4" /> Create Invoice
        </Button>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="bg-muted/40">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> 
            Invoices
          </CardTitle>
          <CardDescription>Manage your sales invoices</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        {invoice.number}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="hover:text-primary cursor-pointer">
                          {invoice.customer.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {format(invoice.date, 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center ${invoice.paymentStatus === 'overdue' ? 'text-red-600' : ''}`}>
                        <Calendar className={`h-4 w-4 mr-2 ${invoice.paymentStatus === 'overdue' ? 'text-red-600' : 'text-muted-foreground'}`} />
                        {format(invoice.dueDate || invoice.date, 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{invoice.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[invoice.paymentStatus]?.bg || "bg-gray-100"} ${statusColors[invoice.paymentStatus]?.text || "text-gray-800"}`}>
                        {invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1).replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                        {(invoice.paymentStatus !== 'paid') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center"
                            onClick={() => handleRecordPayment(invoice)}
                          >
                            <Wallet className="h-3.5 w-3.5 mr-1" />
                            Payment
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-10 w-10 text-muted-foreground/50 mb-3" />
                      <p className="mb-2">No invoices found</p>
                      <p className="text-sm">Try adjusting your search or create a new invoice</p>
                    </div>
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

export default InvoicesList;
