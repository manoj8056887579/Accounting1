
import React from 'react';
import { Transaction } from '@/models/accounting';
import { TableCell, TableRow, TableHead, TableHeader, Table, TableBody } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface TransactionsTableProps {
  transactions: Transaction[];
  onViewTransaction?: (transaction: Transaction) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ 
  transactions,
  onViewTransaction
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate total value of a transaction
  const calculateTransactionTotal = (transaction: Transaction) => {
    // We can use either debits or credits as they should be equal in double-entry
    return transaction.entries.reduce((sum, entry) => sum + entry.debit, 0);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[130px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[120px] text-center">Status</TableHead>
            <TableHead className="w-[80px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow 
              key={transaction.id}
              className="hover:bg-muted/50"
            >
              <TableCell className="font-medium">
                {format(transaction.date, 'MMM d, yyyy')}
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.reference || '-'}</TableCell>
              <TableCell className="text-right font-mono">
                {formatCurrency(calculateTransactionTotal(transaction))}
              </TableCell>
              <TableCell className="text-center">
                {transaction.isReconciled ? (
                  <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
                    Reconciled
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50">
                    Pending
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => onViewTransaction && onViewTransaction(transaction)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
