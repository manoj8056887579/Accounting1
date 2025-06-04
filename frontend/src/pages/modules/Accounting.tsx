
import React, { useState } from 'react';
import { mockAccounts, mockTransactions } from '@/data/mockAccounting';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ChartOfAccounts from '@/components/accounting/ChartOfAccounts';
import JournalEntries from '@/components/accounting/JournalEntries';
import Banks from '@/components/accounting/Banks';
import { BookOpen, FileText, BarChart3, PieChart } from 'lucide-react';

const Accounting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general-ledger');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight">Accounting</h1>
        <p className="text-muted-foreground">
          Manage your business finances with double-entry bookkeeping
        </p>
      </div>
      <Separator />
      
      <Tabs defaultValue="general-ledger" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-card rounded-lg p-1 border shadow-sm">
          <TabsList className="w-full grid grid-cols-4 h-12">
            <TabsTrigger value="general-ledger" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">General Ledger</span>
              <span className="sm:hidden">Ledger</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Journal Entries</span>
              <span className="sm:hidden">Journal</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Financial Reports</span>
              <span className="sm:hidden">Reports</span>
            </TabsTrigger>

            <TabsTrigger value="bank" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Bank</span>
              <span className="sm:hidden">Banks</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="general-ledger" className="mt-6">
          <ChartOfAccounts accounts={mockAccounts} />
        </TabsContent>
        
        <TabsContent value="journal" className="mt-6">
          <JournalEntries 
            transactions={mockTransactions}
            accounts={mockAccounts} 
          />
        </TabsContent>

        <TabsContent value="bank" className="mt-6">
          <Banks />
        </TabsContent>
        
        
        <TabsContent value="reports" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border shadow-sm p-6 bg-card text-center flex flex-col items-center justify-center gap-4 min-h-[200px]">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <PieChart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Financial Reports</h3>
                <p className="text-muted-foreground mt-2">
                  Financial reports will be available in a future update.
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border shadow-sm p-6 bg-card text-center flex flex-col items-center justify-center gap-4 min-h-[200px]">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                <p className="text-muted-foreground mt-2">
                  Business analytics will be available soon.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accounting;
