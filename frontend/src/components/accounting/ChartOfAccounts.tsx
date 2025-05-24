
import React, { useState } from 'react';
import { Account, AccountType } from '@/models/accounting';
import AccountsTable from './AccountsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface ChartOfAccountsProps {
  accounts: Account[];
}

const ChartOfAccounts: React.FC<ChartOfAccountsProps> = ({ accounts }) => {
  const [activeTab, setActiveTab] = useState<AccountType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(account => 
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate account totals by type
  const accountTotals = accounts.reduce((acc, account) => {
    acc.total += account.balance;
    if (account.type === 'asset') acc.assets += account.balance;
    if (account.type === 'liability') acc.liabilities += account.balance;
    if (account.type === 'equity') acc.equity += account.balance;
    if (account.type === 'revenue') acc.revenue += account.balance;
    if (account.type === 'expense') acc.expenses += account.balance;
    return acc;
  }, { total: 0, assets: 0, liabilities: 0, equity: 0, revenue: 0, expenses: 0 });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleNewAccount = () => {
    // For demonstration purposes, just show a toast
    toast({
      title: "Create Account",
      description: "Account creation form will be available in a future update.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Chart of Accounts</h2>
          <p className="text-muted-foreground">Manage your business account structure</p>
        </div>
        <Button onClick={handleNewAccount} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">New Account</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Search and filter bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search accounts by name or code..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Account Type Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SummaryCard
          title="Assets"
          value={accountTotals.assets}
          color="bg-blue-50 text-blue-800 border-blue-200"
          onClick={() => setActiveTab('asset')}
          isActive={activeTab === 'asset'}
        />
        <SummaryCard
          title="Liabilities"
          value={accountTotals.liabilities}
          color="bg-red-50 text-red-800 border-red-200"
          onClick={() => setActiveTab('liability')}
          isActive={activeTab === 'liability'}
        />
        <SummaryCard
          title="Equity"
          value={accountTotals.equity}
          color="bg-green-50 text-green-800 border-green-200"
          onClick={() => setActiveTab('equity')}
          isActive={activeTab === 'equity'}
        />
        <SummaryCard
          title="Revenue"
          value={accountTotals.revenue}
          color="bg-emerald-50 text-emerald-800 border-emerald-200"
          onClick={() => setActiveTab('revenue')}
          isActive={activeTab === 'revenue'}
        />
        <SummaryCard
          title="Expenses"
          value={accountTotals.expenses}
          color="bg-amber-50 text-amber-800 border-amber-200"
          onClick={() => setActiveTab('expense')}
          isActive={activeTab === 'expense'}
        />
      </div>
      
      {/* Account Table with Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as AccountType | 'all')}>
          <div className="px-4 pt-4 border-b">
            <TabsList className="w-full max-w-full overflow-x-auto flex justify-start gap-2 bg-transparent p-0">
              <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All Accounts
              </TabsTrigger>
              <TabsTrigger value="asset" className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Assets
              </TabsTrigger>
              <TabsTrigger value="liability" className="rounded-md data-[state=active]:bg-red-600 data-[state=active]:text-white">
                Liabilities
              </TabsTrigger>
              <TabsTrigger value="equity" className="rounded-md data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Equity
              </TabsTrigger>
              <TabsTrigger value="revenue" className="rounded-md data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                Revenue
              </TabsTrigger>
              <TabsTrigger value="expense" className="rounded-md data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                Expenses
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="p-0 pt-0">
            <AccountsTable 
              accounts={filteredAccounts} 
              filter={activeTab}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: number;
  color: string;
  onClick: () => void;
  isActive: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title, 
  value,
  color,
  onClick,
  isActive
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div 
      className={`p-4 rounded-lg border cursor-pointer transition-all ${color} ${
        isActive ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-90'
      }`}
      onClick={onClick}
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xl font-bold mt-1 font-mono">{formatCurrency(value)}</p>
    </div>
  );
};

export default ChartOfAccounts;
