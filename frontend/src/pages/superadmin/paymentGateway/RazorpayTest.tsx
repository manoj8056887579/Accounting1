import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { IndianRupee } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: { 
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: {
    order_id: string;
    payment_id?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on?: (event: string, callback: (error: RazorpayError) => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const RazorpayTest = () => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentFailure = async (orderId: string, error: RazorpayError) => {
    try {
      await axios.post(`${API_URL}/api/superadmin/payment-gateways/payment-failure`, {
        razorpay_order_id: orderId,
        error_code: error.code,
        error_description: error.description,
        error_reason: error.reason
      });
      console.log('Payment failure recorded successfully');
    } catch (error) {
      console.error('Failed to record payment failure:', error);
    }
  };

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setIsLoading(true);

      // Create order on the server
      const response = await axios.post(`${API_URL}/api/superadmin/payment-gateways/create-order`, {
        amount: parseFloat(amount) * 100, // Convert to paisa
      });

      const { orderId, apiKey } = response.data;

      // Initialize Razorpay
      const options = {
        key: apiKey,
        amount: parseFloat(amount) * 100,
        currency: "INR",
        name: "Your Company Name",
        description: "Test Payment",
        order_id: orderId,
        handler: async function (response: RazorpayResponse) {
          try {
            // Verify payment on the server
            const verificationResponse = await axios.post(
              `${API_URL}/api/superadmin/payment-gateways/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verificationResponse.data.success) {
              toast.success('Payment successful!');
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com", 
          contact: "9999999999",
        },
        theme: {
          color: "#0C4A6E",
        },
        modal: {
          ondismiss: async function() {
            // Handle payment cancellation/dismissal
            await handlePaymentFailure(orderId, {
              code: 'PAYMENT_CANCELLED',
              description: 'Payment was cancelled by user',
              source: 'checkout',
              step: 'payment_method',
              reason: 'user_cancelled',
              metadata: {
                order_id: orderId
              }
            });
            toast.error('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Razorpay Payment</CardTitle>
        <CardDescription>
          Enter an amount to test the Razorpay payment integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₹)</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              min="1"
              step="1"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handlePayment}
          disabled={isLoading || !amount}
        >
          {isLoading ? 'Processing...' : 'Pay Now'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RazorpayTest;