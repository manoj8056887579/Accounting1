
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { File } from 'lucide-react';
import GSTInvoiceUpload from '@/components/gst/GSTInvoiceUpload';
import GSTFilingStatus from '@/components/gst/GSTFilingStatus';
import GSTReturns from '@/components/gst/GSTReturns';
import GSTReconciliation from '@/components/gst/GSTReconciliation';

const GSTEFiling = () => {
  const [activeTab, setActiveTab] = useState('upload');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center">
            <File className="h-6 w-6 mr-2 text-primary" />
            GST E-Filing
          </h2>
          <p className="text-muted-foreground">
            Manage GST invoices, returns filing and reconciliation for India
          </p>
        </div>
      </div>
      <Separator />
      
      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Invoice Upload</TabsTrigger>
          <TabsTrigger value="status">Filing Status</TabsTrigger>
          <TabsTrigger value="returns">GST Returns</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Upload</CardTitle>
              <CardDescription>
                Upload invoice data for GST filing in the required format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GSTInvoiceUpload />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filing Status</CardTitle>
              <CardDescription>
                Check status of your GST filings and submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GSTFilingStatus />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GST Returns</CardTitle>
              <CardDescription>
                Manage and file your GSTR-1, GSTR-3B, and other GST returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GSTReturns />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reconciliation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reconciliation</CardTitle>
              <CardDescription>
                Reconcile your books with GSTN portal data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GSTReconciliation />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GSTEFiling;
