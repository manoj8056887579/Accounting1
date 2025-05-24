
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Subscription, SubscriptionPlan } from '@/models/subscription';
import { useTenant } from '@/contexts/TenantContext';
import { getActiveSubscription, getSubscriptionPlans, cancelSubscription } from '@/services/razorpayService';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const SubscriptionDetails: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const { currentOrganization } = useTenant();
  
  const fetchSubscription = async () => {
    if (!currentOrganization) return;
    
    setIsLoading(true);
    try {
      const sub = await getActiveSubscription(currentOrganization.id);
      setSubscription(sub);
      
      if (sub) {
        const plans = getSubscriptionPlans();
        const planDetails = plans.find(p => p.id === sub.planId) || null;
        setPlan(planDetails);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      toast.error("Failed to load subscription details");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSubscription();
  }, [currentOrganization?.id]);
  
  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    try {
      const success = await cancelSubscription(subscription.id);
      if (success) {
        setSubscription(prev => prev ? {...prev, cancelAtPeriodEnd: true} : null);
        toast.success("Subscription cancelled successfully. You'll have access until the current period ends.");
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setCancelDialogOpen(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!subscription || !plan) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>You don't have an active subscription for this organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground opacity-50" />
          </div>
          <p className="text-center text-muted-foreground">
            Subscribe to a plan to get access to premium features.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button>View Plans</Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Current Subscription</h2>
        <p className="text-muted-foreground mt-2">
          View and manage your subscription details
        </p>
      </div>
      
      <Card className="border-primary">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                {plan.name} Plan
              </CardTitle>
              <CardDescription className="mt-1">{plan.description}</CardDescription>
            </div>
            <Badge variant={subscription.cancelAtPeriodEnd ? "outline" : "default"}>
              {subscription.cancelAtPeriodEnd ? "Cancelling" : "Active"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="font-medium">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: plan.currency,
                  currencyDisplay: 'narrowSymbol'
                }).format(plan.price)}/{plan.interval}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Status</span>
              <div className="flex items-center">
                {subscription.status === 'active' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">Active</span>
                  </>
                ) : (
                  <span className="capitalize font-medium">{subscription.status}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Current Period Started</span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{format(new Date(subscription.currentPeriodStart), 'PPP')}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Current Period Ends</span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{format(new Date(subscription.currentPeriodEnd), 'PPP')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Features</span>
            <ul className="grid grid-cols-2 gap-2 mt-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {subscription.cancelAtPeriodEnd && (
            <div className="p-3 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
              <p className="text-sm">
                Your subscription will be cancelled at the end of the current billing period on{" "}
                {format(new Date(subscription.currentPeriodEnd), 'PPP')}.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!subscription.cancelAtPeriodEnd && (
            <Button 
              variant="outline" 
              className="text-destructive hover:bg-destructive/10" 
              onClick={() => setCancelDialogOpen(true)}
            >
              Cancel Subscription
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll continue to have access until the end of the current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>Keep Subscription</Button>
            <Button variant="destructive" onClick={handleCancelSubscription}>
              Yes, Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionDetails;

