
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  FileMinus, 
  FilePlus, 
  FileX, 
  Truck, 
  ShoppingCart, 
  Calendar, 
  Wallet,
  Repeat
} from 'lucide-react';

// Import our sales components
import CustomersList from '@/components/sales/CustomersList';
import EstimatesList from '@/components/sales/EstimatesList';
import InvoicesList from '@/components/sales/InvoicesList';
import DocumentList from '@/components/sales/DocumentList';
import DeliveryChallansList from '@/components/sales/DeliveryChallansList';
import PaymentsList from '@/components/sales/PaymentsList';
import RecurringInvoicesList from '@/components/sales/RecurringInvoicesList';
import CreditNotesList from '@/components/sales/CreditNotesList';
import SalesReturnsList from '@/components/sales/SalesReturnsList';
import { getRetainerInvoices, getSalesOrders } from '@/data/mockSales';

// Tab interface for structured tab data
interface SalesTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const Sales = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('customers');
  
  // State for each tab's search query
  const [retainerSearchQuery, setRetainerSearchQuery] = useState('');
  const [ordersSearchQuery, setOrdersSearchQuery] = useState('');
  
  const retainerInvoices = getRetainerInvoices();
  const salesOrders = getSalesOrders();

  // Define all sales tabs with icons - removed receipts and debits tabs
  const salesTabs: SalesTab[] = [
    { id: 'customers', label: 'Customers', icon: <Users className="h-4 w-4" /> },
    { id: 'estimates', label: 'Estimates', icon: <FileText className="h-4 w-4" /> },
    // { id: 'retainer', label: 'Retainer', icon: <Calendar className="h-4 w-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart className="h-4 w-4" /> },
    { id: 'challans', label: 'Challans', icon: <Truck className="h-4 w-4" /> },
    { id: 'invoices', label: 'Invoices', icon: <FileText className="h-4 w-4" /> },
    { id: 'payments', label: 'Payments', icon: <Wallet className="h-4 w-4" /> },
    { id: 'recurring', label: 'Recurring', icon: <Repeat className="h-4 w-4" /> },
    { id: 'credits', label: 'Credit Notes', icon: <FilePlus className="h-4 w-4" /> },
    { id: 'returns', label: 'Returns', icon: <FileX className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Sales Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage your sales documents, customers and related transactions
        </p>
      </div>
      
      <Separator className="my-4" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-muted/30 rounded-lg p-1 overflow-x-auto">
          <TabsList className="inline-flex min-w-full h-auto bg-transparent p-0 gap-1">
            {salesTabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 px-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                {tab.icon}
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <div className="mt-6">
          <TabsContent value="customers">
            <CustomersList />
          </TabsContent>
          
          <TabsContent value="estimates">
            <EstimatesList />
          </TabsContent>
          
          <TabsContent value="retainer">
            <DocumentList
              title="Retainer Invoices"
              description="Manage retainer invoices for regular clients"
              documents={retainerInvoices}
              searchQuery={retainerSearchQuery}
              setSearchQuery={setRetainerSearchQuery}
              createButtonText="Create Retainer Invoice"
              showDueDates={true}
              additionalButtonText="Record Payment"
            />
          </TabsContent>
          
          <TabsContent value="orders">
            <DocumentList
              title="Sales Orders"
              description="Create and track sales orders"
              documents={salesOrders}
              searchQuery={ordersSearchQuery}
              setSearchQuery={setOrdersSearchQuery}
              createButtonText="Create Sales Order"
              additionalButtonText="Convert to Invoice"
            />
          </TabsContent>
          
          <TabsContent value="challans">
            <DeliveryChallansList />
          </TabsContent>
          
          <TabsContent value="invoices">
            <InvoicesList />
          </TabsContent>
          
          <TabsContent value="payments">
            <PaymentsList />
          </TabsContent>
          
          <TabsContent value="recurring">
            <RecurringInvoicesList />
          </TabsContent>
          
          <TabsContent value="credits">
            <CreditNotesList />
          </TabsContent>
          
          <TabsContent value="returns">
            <SalesReturnsList />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Sales;
