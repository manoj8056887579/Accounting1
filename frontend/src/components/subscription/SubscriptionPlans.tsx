
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { getSubscriptionPlans, createSubscriptionOrder, processSubscriptionPayment, createSubscription } from '@/services/razorpayService';
import { SubscriptionPlan } from '@/models/subscription';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const SubscriptionPlans: React.FC = () => {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [isTrialLoading, setIsTrialLoading] = useState<Record<string, boolean>>({});
  const { currentOrganization } = useTenant();
  const { user } = useAuth();
  
  const plans = getSubscriptionPlans();
  
  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!currentOrganization) {
      toast.error("No organization selected");
      return;
    }
    
    if (!user?.email) {
      toast.error("User details not available");
      return;
    }
    
    try {
      // Set loading state for this plan
      setIsLoading(prev => ({ ...prev, [plan.id]: true }));
      
      // Create an order
      const order = await createSubscriptionOrder(currentOrganization.id, plan.id);
      
      // Process payment
      processSubscriptionPayment(
        order,
        { name: user.name || user.email, email: user.email },
        async (paymentId) => {
          try {
            // Create subscription after successful payment
            await createSubscription(currentOrganization.id, plan.id, paymentId);
            toast.success(`Successfully subscribed to ${plan.name} plan`);
          } catch (error) {
            toast.error("Failed to activate subscription");
            console.error("Subscription creation error:", error);
          } finally {
            setIsLoading(prev => ({ ...prev, [plan.id]: false }));
          }
        },
        (error) => {
          toast.error("Payment failed");
          console.error("Payment error:", error);
          setIsLoading(prev => ({ ...prev, [plan.id]: false }));
        }
      );
    } catch (error) {
      toast.error("Failed to process subscription");
      console.error("Subscription error:", error);
      setIsLoading(prev => ({ ...prev, [plan.id]: false }));
    }
  };

  const handleStartFreeTrial = async (plan: SubscriptionPlan) => {
    if (!currentOrganization) {
      toast.error("No organization selected");
      return;
    }
    
    try {
      setIsTrialLoading(prev => ({ ...prev, [plan.id]: true }));
      
      // In a real implementation, this would call an API to start a free trial
      // For now, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Your free trial of ${plan.name} plan has started!`);
      // Here you would typically redirect to the dashboard or show next steps
      
    } catch (error) {
      console.error("Free trial error:", error);
      toast.error("Failed to start free trial");
    } finally {
      setIsTrialLoading(prev => ({ ...prev, [plan.id]: false }));
    }
  };

  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    });
    return formatter.format(price);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-12 max-w-3xl mx-auto">
        <Badge variant="outline" className="px-4 py-1 text-base font-medium mb-2 bg-bizteal-50/30">
          <Sparkles className="h-4 w-4 mr-2 text-bizteal-500" /> Subscription Plans
        </Badge>
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-bizblue-500 to-bizteal-500 bg-clip-text text-transparent">
          Choose the Perfect Plan for Your Business
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get access to all the features you need to streamline your business operations. 
          Start with a free trial or subscribe to a plan that fits your requirements.
        </p>
      </div>
      
      {/* Plans Grid with Animation */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <Card 
            key={plan.id} 
            className={`relative transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden
              ${plan.isPopular ? 'border-bizteal-500 shadow-md' : 'border-border'}
            `}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {plan.isPopular && (
              <div className="absolute -right-12 top-6 bg-bizteal-500 text-white px-12 py-1 rotate-45">
                Most Popular
              </div>
            )}
            
            <AspectRatio ratio={16/3} className="bg-gradient-to-r from-bizblue-100 to-bizteal-100 dark:from-bizblue-900/20 dark:to-bizteal-900/20">
              <div className="h-full w-full flex items-center justify-center">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute rounded-full bg-bizteal-500"
                      style={{
                        width: `${Math.random() * 40 + 10}px`,
                        height: `${Math.random() * 40 + 10}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.5,
                      }}
                    />
                  ))}
                </div>
              </div>
            </AspectRatio>

            <CardHeader>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-bizblue-700 dark:text-bizblue-300">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: plan.currency,
                    minimumFractionDigits: 0
                  }).format(plan.price)}
                </span>
                <span className="text-muted-foreground ml-2">/{plan.interval}</span>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <div className="h-px bg-gradient-to-r from-transparent via-muted to-transparent mb-6"></div>
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-bizteal-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter className="flex-col space-y-3 pb-8">
              <Button 
                className={`w-full text-base py-6 ${plan.isPopular ? 'bg-bizteal-500 hover:bg-bizteal-600' : ''}`}
                onClick={() => handleSubscribe(plan)}
                disabled={isLoading[plan.id] || isTrialLoading[plan.id]}
              >
                {isLoading[plan.id] ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <CreditCard className="mr-3 h-5 w-5" />
                    Subscribe Now
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full text-base py-6 border-bizteal-200 hover:border-bizteal-300 hover:bg-bizteal-50/50 dark:hover:bg-bizteal-900/10"
                onClick={() => handleStartFreeTrial(plan)}
                disabled={isLoading[plan.id] || isTrialLoading[plan.id]}
              >
                {isTrialLoading[plan.id] ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Starting Trial...
                  </span>
                ) : (
                  <>
                    <Calendar className="mr-3 h-5 w-5" />
                    Start Free Trial
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-medium mb-3">Need help choosing the right plan?</h3>
        <p className="text-muted-foreground mb-6">
          Our team is ready to assist you in selecting the best option for your business needs.
        </p>
        <Button variant="outline" className="mx-auto">Contact Sales Team</Button>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
