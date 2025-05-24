
// Define types for razorpay integration
interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  orderId?: string;
}

interface RazorpayOptions {
  name: string;
  description?: string;
  customerInfo?: {
    name: string;
    email: string;
    contact?: string;
  };
}

interface RazorpayResponse {
  id?: string;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  status: 'success' | 'cancelled' | 'failed';
  method?: string;
}

// Create a function to load the Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      console.info("Razorpay already loaded");
      resolve(true);
      return;
    }

    console.info("Loading Razorpay script...");
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.info("Razorpay script loaded successfully");
      resolve(true);
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

// Create an order with Razorpay
export const createRazorpayOrder = async (
  orderData: {
    amount: number;
    currency: string;
    receipt: string;
    customerInfo?: {
      name: string;
      email: string;
      contact?: string;
    };
    notes?: Record<string, string>;
  }
): Promise<RazorpayOrder> => {
  try {
    console.info(`Creating Razorpay order with:`, orderData);
    
    // In a real application, you would call your backend API to create an order
    // For this demo, we'll simulate the API response
    const order: RazorpayOrder = {
      id: `order_${Date.now()}`,
      amount: orderData.amount,
      currency: orderData.currency,
      receipt: orderData.receipt,
      orderId: `order_${Date.now()}`
    };
    
    console.info('Order created:', order);
    
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error("Failed to create order");
  }
};

// Process payment with Razorpay
export const processRazorpayPayment = async (
  order: RazorpayOrder, 
  options: RazorpayOptions
): Promise<RazorpayResponse> => {
  try {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      throw new Error("Failed to load Razorpay script");
    }

    // Convert amount to paisa (1 INR = 100 paisa)
    const amountInPaise = Math.round(order.amount * 100);
    
    console.info(`Processing payment of ${order.amount} (${amountInPaise} paise)`);

    return new Promise((resolve, reject) => {
      const razorpayOptions = {
        key: "rzp_test_1DP5mmOlF5G5ag", // Replace with your actual test key
        amount: amountInPaise,
        currency: order.currency,
        name: options.name,
        description: options.description || "Payment",
        order_id: order.orderId,
        prefill: {
          name: options.customerInfo?.name || "",
          email: options.customerInfo?.email || "",
          contact: options.customerInfo?.contact || "",
        },
        handler: function(response: any) {
          console.log("Payment successful:", response);
          // This function is called when payment is successful
          resolve({
            id: order.id,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            status: 'success',
            method: 'razorpay'
          });
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed");
            resolve({
              id: order.id,
              status: 'cancelled'
            });
          },
          escape: false,
          animation: true
        },
        // Remove theme property as it's not in RazorpayOptions type
      };
      
      console.info("Razorpay options:", razorpayOptions);
      console.info("Opening Razorpay modal");
      
      try {
        const razorpay = new (window as any).Razorpay(razorpayOptions);
        razorpay.open();
        console.info("Razorpay modal opened successfully");
      } catch (error) {
        console.error("Error opening Razorpay modal:", error);
        reject(error);
      }
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
};
