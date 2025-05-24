
import React, { useState } from 'react';
import { Transaction, Account } from '@/models/accounting';
import TransactionsTable from './TransactionsTable';
import TransactionModal from './TransactionModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface JournalEntriesProps {
  transactions: Transaction[];
  accounts: Account[];
}

const JournalEntries: React.FC<JournalEntriesProps> = ({ transactions, accounts }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleNewTransaction = () => {
    // For demonstration purposes, just show a toast
    toast({
      title: "Create Transaction",
      description: "Transaction creation form will be available in a future update.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Journal Entries</h2>
          <p className="text-muted-foreground">View and manage transactions in the double-entry accounting system</p>
        </div>
        <Button onClick={handleNewTransaction} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">New Transaction</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Journal Entries</CardTitle>
          </div>
          <CardDescription>
            All financial transactions recorded in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <TransactionsTable 
            transactions={transactions} 
            onViewTransaction={handleViewTransaction} 
          />
        </CardContent>
      </Card>
      
      <TransactionModal 
        transaction={selectedTransaction}
        accounts={accounts}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default JournalEntries;
