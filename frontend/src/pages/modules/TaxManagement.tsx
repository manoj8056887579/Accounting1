
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Percent } from 'lucide-react';
import TaxRates from '@/components/tax/TaxRates';
import TaxCategories from '@/components/tax/TaxCategories';
import TaxReports from '@/components/tax/TaxReports';

const TaxManagement = () => {
  const [activeTab, setActiveTab] = useState('rates');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center">
            <Percent className="h-6 w-6 mr-2 text-primary" />
            Tax Management
          </h2>
          <p className="text-muted-foreground">
            Configure tax rates, categories, and view tax reports
          </p>
        </div>
      </div>
      <Separator />
      
      <Tabs defaultValue="rates" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="rates">Tax Rates</TabsTrigger>
          <TabsTrigger value="categories">Tax Categories</TabsTrigger>
          <TabsTrigger value="reports">Tax Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Rates</CardTitle>
              <CardDescription>
                Manage your tax rates for different regions and tax types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaxRates />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Categories</CardTitle>
              <CardDescription>
                Configure tax categories for your products and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaxCategories />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Reports</CardTitle>
              <CardDescription>
                Generate and view tax reports for filing purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaxReports />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxManagement;
