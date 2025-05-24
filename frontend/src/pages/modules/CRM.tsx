
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, User, Building2, Calendar, BarChart3, MessageSquare } from 'lucide-react';
import CustomersList from '@/components/crm/CustomersList';
import VendorsList from '@/components/crm/VendorsList';
import ActivitiesTimeline from '@/components/crm/ActivitiesTimeline';
import AIInsights from '@/components/crm/AIInsights';
import Campaigns from '@/components/crm/Campaigns';

const CRM = () => {
  const [activeTab, setActiveTab] = useState('customers');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer & Vendor Management</h1>
        <p className="text-muted-foreground">
          Manage your customers and vendors, track interactions, and leverage AI insights to improve engagement.
        </p>
      </div>

      <Tabs defaultValue="customers" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Customers
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Vendors
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Activities
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> AI Insights
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Campaigns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <CustomersList />
        </TabsContent>
        
        <TabsContent value="vendors">
          <VendorsList />
        </TabsContent>
        
        <TabsContent value="activities">
          <ActivitiesTimeline />
        </TabsContent>
        
        <TabsContent value="insights">
          <AIInsights />
        </TabsContent>
        
        <TabsContent value="campaigns">
          <Campaigns />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRM;
