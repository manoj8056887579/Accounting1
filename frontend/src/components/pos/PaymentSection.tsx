import React, { useState, useEffect } from 'react';
import { usePOS } from '@/contexts/POSContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndianRupee, CreditCard, Percent, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { createRazorpayOrder, processRazorpayPayment, loadRazorpayScript } from '@/services/paymentService';

const PaymentSection: React.FC = () => {
  const { 
    state, 
    calculateTotal, 
    setPaymentMethod, 
    setPaymentAmount, 
    setReference, 
    completeSale, 
    holdSale 
  } = usePOS();
  
  const [showChange, setShowChange] = useState(false);
  const [changeAmount, setChangeAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  
  const totalAmount = calculateTotal();
  const { paymentMethod, cashAmount, cardAmount, upiAmount } = state;
  
  // Check if Razorpay is loaded
  useEffect(() => {
    const checkRazorpayLoaded = async () => {
      const isLoaded = await loadRazorpayScript();
      setRazorpayLoaded(isLoaded);
    };
    
    checkRazorpayLoaded();
  }, []);
  
  const handleTabChange = (value: string) => {
    setPaymentMethod(value as 'cash' | 'card' | 'upi' | 'split');
    setShowChange(false);
  };
  
  const handleCashAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPaymentAmount('cashAmount', value);
    if (paymentMethod === 'cash') {
      setChangeAmount(Math.max(0, value - totalAmount));
      setShowChange(value >= totalAmount);
    }
  };
  
  const handleCardAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentAmount('cardAmount', Number(e.target.value));
  };
  
  const handleUpiAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentAmount('upiAmount', Number(e.target.value));
  };
  
  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReference(e.target.value);
  };
  
  const handleExactAmount = () => {
    if (paymentMethod === 'cash') {
      setPaymentAmount('cashAmount', totalAmount);
      setChangeAmount(0);
      setShowChange(false);
    } else if (paymentMethod === 'card') {
      setPaymentAmount('cardAmount', totalAmount);
    } else if (paymentMethod === 'upi') {
      setPaymentAmount('upiAmount', totalAmount);
    }
  };

  // Function to handle Razorpay payment for card and UPI
  const handleOnlinePayment = async () => {
    if (totalAmount <= 0) {
      toast.error("Cannot process a zero amount payment");
      return;
    }
    
    setIsProcessing(true);
    console.log("Starting online payment process for amount:", totalAmount);
    
    try {
      // Create a Razorpay order with a sanitized amount
      const safeAmount = parseFloat(totalAmount.toFixed(2));
      
      const order = await createRazorpayOrder({
        amount: safeAmount,
        currency: "INR",
        receipt: `pos-${Date.now()}`,
        customerInfo: {
          name: state.customer?.name || "Walk-in Customer",
          email: state.customer?.email || "customer@example.com",
          contact: state.customer?.phone || ""
        },
        notes: {
          paymentType: paymentMethod,
          organizationId: "demo-org"
        }
      });
      
      console.log("Order created:", order);
      
      // Process payment with Razorpay
      const paymentResult = await processRazorpayPayment(
        order,
        {
          name: "BizSuite POS",
          description: `Payment for POS order`,
          customerInfo: {
            name: state.customer?.name || "Walk-in Customer",
            email: state.customer?.email || "customer@example.com",
            contact: state.customer?.phone || ""
          }
        }
      );
      
      console.log("Payment result:", paymentResult);
      
      if (paymentResult.status === 'success') {
        // Set payment details in the state
        if (paymentMethod === 'card') {
          setPaymentAmount('cardAmount', totalAmount);
          setReference(paymentResult.paymentId || '');
        } else if (paymentMethod === 'upi') {
          setPaymentAmount('upiAmount', totalAmount);
          setReference(paymentResult.paymentId || '');
        }
        
        toast.success("Payment successful!");
        // Complete the sale after successful payment
        handleCompleteSale();
      } else if (paymentResult.status === 'cancelled') {
        toast.info("Payment was cancelled");
      } else {
        toast.error("Payment failed");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Error processing payment: " + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCompleteSale = () => {
    let paidAmount = 0;
    
    if (paymentMethod === 'cash') {
      paidAmount = cashAmount;
    } else if (paymentMethod === 'card') {
      paidAmount = cardAmount;
    } else if (paymentMethod === 'upi') {
      paidAmount = upiAmount;
    } else if (paymentMethod === 'split') {
      paidAmount = cashAmount + cardAmount + upiAmount;
    }
    
    if (paidAmount < totalAmount) {
      toast.error(`Payment amount (₹${paidAmount.toFixed(2)}) is less than the total (₹${totalAmount.toFixed(2)})`);
      return;
    }
    
    const sale = completeSale();
    console.log("Sale completed:", sale);
    
    // Set change amount display for cash payments
    if (paymentMethod === 'cash' && cashAmount > totalAmount) {
      setShowChange(true);
    }
  };
  
  const isSplitValid = cashAmount + cardAmount + upiAmount >= totalAmount;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Payment</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </CardTitle>
        <CardDescription>Select payment method and enter amount</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={paymentMethod} 
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="cash" className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              Cash
            </TabsTrigger>
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Card
            </TabsTrigger>
            <TabsTrigger value="upi" className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              UPI
            </TabsTrigger>
            <TabsTrigger value="split" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Split
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cash">
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="cash-amount">Amount</Label>
                  <Input
                    id="cash-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={cashAmount}
                    onChange={handleCashAmountChange}
                  />
                </div>
                <Button onClick={handleExactAmount} variant="outline">Exact</Button>
              </div>
              
              {showChange && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="font-semibold text-green-800">Change: ₹{changeAmount.toFixed(2)}</div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="card">
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="card-amount">Amount</Label>
                  <Input
                    id="card-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={cardAmount}
                    onChange={handleCardAmountChange}
                  />
                </div>
                <Button onClick={handleExactAmount} variant="outline">Exact</Button>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="card-reference">Reference/Transaction ID</Label>
                <Input
                  id="card-reference"
                  placeholder="Enter card reference or transaction ID"
                  value={state.reference}
                  onChange={handleReferenceChange}
                />
              </div>
              
              <Button 
                onClick={handleOnlinePayment} 
                className="w-full" 
                disabled={isProcessing || totalAmount <= 0 || !razorpayLoaded}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : !razorpayLoaded ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Razorpay...
                  </>
                ) : (
                  "Pay Online with Razorpay"
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="upi">
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="upi-amount">Amount</Label>
                  <Input
                    id="upi-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={upiAmount}
                    onChange={handleUpiAmountChange}
                  />
                </div>
                <Button onClick={handleExactAmount} variant="outline">Exact</Button>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="upi-reference">Transaction ID/Reference</Label>
                <Input
                  id="upi-reference"
                  placeholder="Enter UPI transaction reference"
                  value={state.reference}
                  onChange={handleReferenceChange}
                />
              </div>
              
              <Button 
                onClick={handleOnlinePayment} 
                className="w-full" 
                disabled={isProcessing || totalAmount <= 0 || !razorpayLoaded}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : !razorpayLoaded ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Razorpay...
                  </>
                ) : (
                  "Pay with UPI via Razorpay"
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="split">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="split-cash">Cash Amount</Label>
                <Input
                  id="split-cash"
                  type="number"
                  min="0"
                  step="0.01"
                  value={cashAmount}
                  onChange={handleCashAmountChange}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="split-card">Card Amount</Label>
                <Input
                  id="split-card"
                  type="number"
                  min="0"
                  step="0.01"
                  value={cardAmount}
                  onChange={handleCardAmountChange}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="split-upi">UPI Amount</Label>
                <Input
                  id="split-upi"
                  type="number"
                  min="0"
                  step="0.01"
                  value={upiAmount}
                  onChange={handleUpiAmountChange}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="split-reference">Reference</Label>
                <Input
                  id="split-reference"
                  placeholder="Enter payment references"
                  value={state.reference}
                  onChange={handleReferenceChange}
                />
              </div>
              
              <div className={`p-3 rounded-md ${isSplitValid ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className={`font-semibold ${isSplitValid ? 'text-green-800' : 'text-amber-800'}`}>
                  Total Paid: ₹{(cashAmount + cardAmount + upiAmount).toFixed(2)}
                  {!isSplitValid && ` (Short: ₹${(totalAmount - cashAmount - cardAmount - upiAmount).toFixed(2)})`}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={holdSale}>
          Hold Sale
        </Button>
        <Button 
          className="flex-1" 
          onClick={paymentMethod === 'cash' ? handleCompleteSale : handleOnlinePayment}
          disabled={isProcessing || (paymentMethod !== 'cash' && !razorpayLoaded)}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (paymentMethod === 'cash' ? 'Complete Sale' : 'Process Payment')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentSection;
