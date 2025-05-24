
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Truck, ClipboardCheck, History } from 'lucide-react';

// Import the components we created
import GenerateWaybill from '@/components/e-waybill/GenerateWaybill';
import ActiveWaybills from '@/components/e-waybill/ActiveWaybills';
import ValidateWaybill from '@/components/e-waybill/ValidateWaybill';
import WaybillHistory from '@/components/e-waybill/WaybillHistory';

const EWaybill = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">E-Waybill Management</h1>
      </div>
      
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 h-auto">
          <TabsTrigger value="generate" className="flex items-center gap-2 py-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Generate</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2 py-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Active Bills</span>
          </TabsTrigger>
          <TabsTrigger value="validate" className="flex items-center gap-2 py-2">
            <ClipboardCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Validate</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 py-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate E-Waybill</CardTitle>
              <CardDescription>Create a new electronic way bill for goods transportation</CardDescription>
            </CardHeader>
            <CardContent>
              <GenerateWaybill />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active E-Waybills</CardTitle>
              <CardDescription>Monitor and manage ongoing transportation with active e-waybills</CardDescription>
            </CardHeader>
            <CardContent>
              <ActiveWaybills />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="validate" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Validate E-Waybill</CardTitle>
              <CardDescription>Check validity of e-waybill numbers</CardDescription>
            </CardHeader>
            <CardContent>
              <ValidateWaybill />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>E-Waybill History</CardTitle>
              <CardDescription>View and download past e-waybills</CardDescription>
            </CardHeader>
            <CardContent>
              <WaybillHistory />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EWaybill;
