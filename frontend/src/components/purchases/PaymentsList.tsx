
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
import { Eye, Trash2, Wallet, Plus, IndianRupee } from 'lucide-react';
import { Payment } from '@/models/purchases';
import { getPayments } from '@/data/mockPurchases';
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
import { toast } from 'sonner';
import { createRazorpayOrder, processRazorpayPayment } from '@/services/paymentService';

const PaymentsList = () => {
  const [payments, setPayments] = useState<Payment[]>(getPayments());
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newPayment, setNewPayment] = useState({
    vendorId: '',
    vendorName: '',
    amount: 0,
    method: 'bank_transfer',
    reference: '',
    notes: '',
    billIds: [] as string[]
  });

  // Filter payments based on search query
  const filteredPayments = payments.filter(
    payment =>
      payment.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleAddPayment = () => {
    setIsDialogOpen(true);
    setNewPayment({
      vendorId: '',
      vendorName: '',
      amount: 0,
      method: 'bank_transfer',
      reference: '',
      notes: '',
      billIds: []
    });
  };

  const handleProcessRazorpayPayment = async () => {
    if (!newPayment.vendorName || newPayment.amount <= 0) {
      toast.error("Please provide vendor name and valid amount");
      return;
    }

    setIsProcessing(true);

    try {
      // Create a Razorpay order
      const order = await createRazorpayOrder({
        amount: newPayment.amount,
        currency: "INR",
        receipt: `purchase-${Date.now()}`,
        notes: {
          vendorName: newPayment.vendorName,
          purpose: "Vendor payment"
        }
      });
      
      // Process payment with Razorpay
      const paymentResult = await processRazorpayPayment(
        order,
        {
          name: "Your Business Name",
          description: `Payment to vendor: ${newPayment.vendorName}`,
          customerInfo: {
            name: "Your Business",
            email: "business@example.com", // In a real app, get from business profile
          }
        }
      );
      
      if (paymentResult.status === 'success') {
        // Add new payment to the list
        const today = new Date().toISOString().split('T')[0];
        const newPaymentRecord: Payment = {
          id: `pmt-${Date.now()}`,
          vendorId: newPayment.vendorId || `vend-${Date.now()}`,
          vendor: newPayment.vendorName,
          date: today,
          amount: newPayment.amount,
          method: 'razorpay',
          reference: paymentResult.paymentId || '',
          notes: newPayment.notes || "Paid via Razorpay",
          status: 'completed',
          billIds: newPayment.billIds.length ? newPayment.billIds : []
        };
        
        setPayments([newPaymentRecord, ...payments]);
        toast.success("Payment to vendor processed successfully!");
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

  const handleDeletePayment = (payment: Payment) => {
    setPayments(payments.filter(p => p.id !== payment.id));
    toast.error("Payment Deleted", {
      description: `Payment ${payment.reference} has been deleted`
    });
  };

  const handleViewPayment = (payment: Payment) => {
    toast.info("View Payment Details", {
      description: `Viewing details for payment ${payment.reference}`
    });
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMethod = (method: string) => {
    return method.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <CardTitle className="flex items-center">
            <Wallet className="mr-2 h-5 w-5 text-muted-foreground" />
            Payments Made
          </CardTitle>
          <CardDescription>Track payments to vendors</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddPayment}>
              <Plus className="mr-2 h-4 w-4" /> Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Make Payment to Vendor</DialogTitle>
              <DialogDescription>
                Enter vendor payment details or process with Razorpay
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendorName" className="text-right">
                  Vendor
                </Label>
                <Input
                  id="vendorName"
                  name="vendorName"
                  className="col-span-3"
                  value={newPayment.vendorName}
                  onChange={handleInputChange}
                  placeholder="Vendor name"
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
                <Label htmlFor="method" className="text-right">
                  Method
                </Label>
                <Select
                  value={newPayment.method}
                  onValueChange={(value) => handleSelectChange('method', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="online_payment">Other Online Payment</SelectItem>
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
                  placeholder="Reference number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input
                  id="notes"
                  name="notes"
                  className="col-span-3"
                  value={newPayment.notes}
                  onChange={handleInputChange}
                  placeholder="Payment notes (optional)"
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
                  : newPayment.method === "razorpay" 
                    ? "Process with Razorpay" 
                    : "Record Payment"
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search payments..."
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
                <TableHead>Date</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No payments found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.reference}
                    </TableCell>
                    <TableCell>
                      {payment.date}
                    </TableCell>
                    <TableCell>
                      {payment.vendor}
                    </TableCell>
                    <TableCell>
                      ₹{payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {formatMethod(payment.method)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeStyles(payment.status)}`}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPayment(payment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePayment(payment)}
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

export default PaymentsList;
