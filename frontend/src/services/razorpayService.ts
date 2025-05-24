
import { SubscriptionOrder, Subscription, SubscriptionPlan } from "@/models/subscription";
import { toast } from "sonner";

// Mock subscription plans for demo purposes
const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for small organizations",
    price: 999,
    currency: "INR",
    interval: "monthly",
    features: ["5 users", "Basic reporting", "Email support"],
    isActive: true
  },
  {
    id: "pro",
    name: "Professional",
    description: "For growing organizations",
    price: 2499,
    currency: "INR",
    interval: "monthly",
    features: ["20 users", "Advanced reporting", "Priority support", "API access"],
    isPopular: true,
    isActive: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    price: 4999,
    currency: "INR",
    interval: "monthly",
    features: ["Unlimited users", "Custom reporting", "Dedicated support", "API access", "White labeling"],
    isActive: true
  }
];

// This would be loaded from your environment variables or configuration
const getRazorpayConfig = () => {
  // In a real app, these would be fetched from your secure storage or state
  return {
    keyId: "rzp_test_1DP5mmOlF5G5ag", // Updated to match keyId in paymentService
    apiBaseUrl: "/api/razorpay" // API proxy path
  };
};

// Create order for subscription initial payment
export const createSubscriptionOrder = async (
  organizationId: string,
  planId: string
): Promise<SubscriptionOrder> => {
  try {
    // In a real app, this would be an API call to your backend
    // which would then call Razorpay API to create an order
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) throw new Error("Subscription plan not found");
    
    // Mock server response
    const order: SubscriptionOrder = {
      id: `ord_${Math.random().toString(36).substring(2, 15)}`,
      organizationId,
      planId,
      amount: plan.price,
      currency: plan.currency,
      receipt: `rcpt_${Date.now()}`,
      status: 'created',
      createdAt: new Date().toISOString(),
    };
    
    return order;
  } catch (error) {
    console.error("Error creating subscription order:", error);
    toast.error("Failed to create subscription order");
    throw error;
  }
};

// Process payment using Razorpay checkout
export const processSubscriptionPayment = (
  order: SubscriptionOrder,
  customerInfo: { name: string; email: string },
  onSuccess: (paymentId: string) => void,
  onFailure: (error: any) => void
) => {
  // Load Razorpay script if not already loaded
  if (!(window as any).Razorpay) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }
  
  const { keyId } = getRazorpayConfig();
  
  // Configure Razorpay options
  const options = {
    key: keyId,
    amount: Math.round(order.amount * 100), // Razorpay amount in paise (rounded to avoid decimal issues)
    currency: order.currency,
    name: "Your App Name",
    description: `Subscription for ${customerInfo.name}`,
    order_id: order.orderId,
    prefill: {
      name: customerInfo.name,
      email: customerInfo.email,
    },
    handler: (response: any) => {
      // This function is called when payment is successful
      const paymentId = response.razorpay_payment_id;
      console.log("Subscription payment successful:", response);
      onSuccess(paymentId);
    },
    modal: {
      ondismiss: () => {
        console.log("Subscription checkout form closed");
        toast.info("Subscription payment cancelled");
      },
    },
    theme: {
      color: "#4f46e5", // Indigo color matching your theme
    },
  };

  try {
    // Initialize Razorpay checkout
    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Razorpay initialization error:", error);
    onFailure(error);
  }
};

// Get subscription plans
export const getSubscriptionPlans = (): SubscriptionPlan[] => {
  return subscriptionPlans;
};

// Create a new subscription after successful payment
export const createSubscription = async (
  organizationId: string,
  planId: string,
  paymentId: string
): Promise<Subscription> => {
  // In a real app, this would be an API call to your backend
  try {
    // Mock server response for creating a subscription
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) throw new Error("Subscription plan not found");
    
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // For monthly subscription
    
    const subscription: Subscription = {
      id: `sub_${Math.random().toString(36).substring(2, 15)}`,
      organizationId,
      planId,
      razorpaySubscriptionId: `rzp_sub_${Math.random().toString(36).substring(2, 15)}`,
      status: 'active',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: endDate.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    
    // Here you would normally update your database and Razorpay
    toast.success(`Subscription to ${plan.name} plan activated`);
    return subscription;
  } catch (error) {
    console.error("Error creating subscription:", error);
    toast.error("Failed to create subscription");
    throw error;
  }
};

// Get active subscription for an organization
export const getActiveSubscription = async (organizationId: string): Promise<Subscription | null> => {
  try {
    // In a real app, this would be an API call to your backend
    // Mock response - 50% chance of having a subscription
    if (Math.random() > 0.5) return null;
    
    const planId = subscriptionPlans[Math.floor(Math.random() * subscriptionPlans.length)].id;
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    return {
      id: `sub_${Math.random().toString(36).substring(2, 15)}`,
      organizationId,
      planId,
      razorpaySubscriptionId: `rzp_sub_${Math.random().toString(36).substring(2, 15)}`,
      status: 'active',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: endDate.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      updatedAt: now.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    toast.error("Failed to fetch subscription details");
    return null;
  }
};

// Cancel a subscription
export const cancelSubscription = async (subscriptionId: string): Promise<boolean> => {
  try {
    // In a real app, this would be an API call to your backend
    // which would then call Razorpay API to cancel the subscription
    
    // Mock success response
    toast.success("Subscription cancelled successfully");
    return true;
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    toast.error("Failed to cancel subscription");
    return false;
  }
};
