
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
  Search, 
  Plus, 
  Wallet, 
  FileText, 
  Calendar, 
  Clock, 
  Users,
  IndianRupee 
} from 'lucide-react';
import { Payment } from '@/models/sales';
import { getPayments } from '@/data/mockSales';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { createRazorpayOrder, processRazorpayPayment } from '@/services/paymentService';

const paymentMethodColors: Record<string, string> = {
  cash: "bg-green-100 text-green-800",
  bank_transfer: "bg-blue-100 text-blue-800",
  credit_card: "bg-purple-100 text-purple-800",
  check: "bg-amber-100 text-amber-800",
  online: "bg-cyan-100 text-cyan-800",
  other: "bg-gray-100 text-gray-800",
  razorpay: "bg-indigo-100 text-indigo-800"
};

interface NewPaymentFormData {
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  reference: string;
  invoiceIds: string[];
}

const PaymentsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState<Payment[]>(getPayments());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newPayment, setNewPayment] = useState<NewPaymentFormData>({
    customerId: '',
    customerName: '',
    amount: 0,
    paymentMethod: 'razorpay',
    reference: '',
    invoiceIds: []
  });
  
  const filteredPayments = payments.filter(payment => 
    payment.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenPaymentDialog = () => {
    setIsDialogOpen(true);
    setNewPayment({
      customerId: '',
      customerName: '',
      amount: 0,
      paymentMethod: 'razorpay',
      reference: '',
      invoiceIds: []
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPayment(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewPayment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProcessRazorpayPayment = async () => {
    if (!newPayment.customerName || newPayment.amount <= 0) {
      toast.error("Please provide customer name and valid amount");
      return;
    }

    setIsProcessing(true);

    try {
      // Create a Razorpay order
      const order = await createRazorpayOrder({
        amount: newPayment.amount,
        currency: "INR",
        receipt: `sales-${Date.now()}`,
        customerInfo: {
          name: newPayment.customerName,
          email: "customer@example.com", // In a real app, get from form
        }
      });
      
      // Process payment with Razorpay
      const paymentResult = await processRazorpayPayment(
        order,
        {
          name: "Your Business Name",
          description: `Payment for invoice(s)`,
          customerInfo: {
            name: newPayment.customerName,
            email: "customer@example.com", // In a real app, get from form
          }
        }
      );
      
      if (paymentResult.status === 'success') {
        // Create a new payment record
        const newPaymentRecord: Payment = {
          id: `pmt-${Date.now()}`,
          customer: {
            id: newPayment.customerId || `cust-${Date.now()}`,
            name: newPayment.customerName,
            email: "customer@example.com",
            phone: "",
            address: ""
          },
          date: new Date(),
          amount: newPayment.amount,
          paymentMethod: 'razorpay',
          reference: paymentResult.paymentId || '',
          description: "Payment via Razorpay",
          invoiceIds: newPayment.invoiceIds.length ? newPayment.invoiceIds : [`inv-${Date.now()}`],
          createdBy: "current-user",
          createdAt: new Date()
        };
        
        // Add to payments list
        setPayments([newPaymentRecord, ...payments]);
        toast.success("Payment recorded successfully!");
        setIsDialogOpen(false);
      } else if (paymentResult.status === 'cancelled') {
        toast.info("Payment was cancelled");
      } else {
        toast.error("Payment failed");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Error processing payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search payments..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenPaymentDialog} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
              <DialogDescription>
                Enter payment details below or process a payment via Razorpay
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customerName" className="text-right">
                  Customer
                </Label>
                <Input
                  id="customerName"
                  name="customerName"
                  className="col-span-3"
                  value={newPayment.customerName}
                  onChange={handleInputChange}
                  placeholder="Customer name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <div className="col-span-3 flex">
                  <span className="flex items-center bg-muted px-3 border border-r-0 border-input rounded-l-md">
                    <IndianRupee className="h-4 w-4" />
                  </span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    className="rounded-l-none"
                    value={newPayment.amount}
                    onChange={handleInputChange}
                    min={0}
                    step="0.01"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentMethod" className="text-right">
                  Method
                </Label>
                <Select
                  value={newPayment.paymentMethod}
                  onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay (Online)</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reference" className="text-right">
                  Reference
                </Label>
                <Input
                  id="reference"
                  name="reference"
                  className="col-span-3"
                  value={newPayment.reference}
                  onChange={handleInputChange}
                  placeholder="Reference number (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleProcessRazorpayPayment}
                disabled={isProcessing || newPayment.amount <= 0}
              >
                {isProcessing 
                  ? "Processing..." 
                  : newPayment.paymentMethod === "razorpay" 
                    ? "Process with Razorpay" 
                    : "Record Payment"
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments Received</CardTitle>
          <CardDescription>Track and manage all payments received from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Invoices</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {format(payment.date, 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        {payment.customer.name}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">₹{payment.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={paymentMethodColors[payment.paymentMethod] || "bg-gray-100"}>
                        {payment.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.reference || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        {payment.invoiceIds.length} {payment.invoiceIds.length === 1 ? 'invoice' : 'invoices'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Receipt</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No payments found. Try adjusting your search or record a new payment.
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

export default PaymentsList;
