
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
import SubscriptionDetails from '@/components/subscription/SubscriptionDetails';
import { Card, CardContent } from '@/components/ui/card';

const SubscriptionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('current');
  
  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage your subscription and explore available plans for your organization
        </p>
      </div>
      
      <Card className="overflow-hidden border-0 shadow-md">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-bizblue-50 to-bizteal-50 dark:from-bizblue-950/20 dark:to-bizteal-950/20 p-4">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
                <TabsTrigger 
                  value="current"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Current Subscription
                </TabsTrigger>
                <TabsTrigger 
                  value="plans"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Available Plans
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="p-6">
            <TabsContent value="current" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <SubscriptionDetails />
            </TabsContent>
            
            <TabsContent value="plans" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <SubscriptionPlans />
            </TabsContent>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPage;
