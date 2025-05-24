
import React from 'react';
import { Transaction, Account } from '@/models/accounting';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { TableCell, TableRow, TableHead, TableHeader, Table, TableBody, TableFooter } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Download } from 'lucide-react';

interface TransactionModalProps {
  transaction: Transaction | null;
  accounts: Account[];
  isOpen: boolean;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  accounts,
  isOpen,
  onClose
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getAccountName = (accountId: string) => {
    return accounts.find(a => a.id === accountId)?.name || 'Unknown Account';
  };
  
  if (!transaction) return null;

  // Calculate totals
  const totalDebits = transaction.entries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredits = transaction.entries.reduce((sum, entry) => sum + entry.credit, 0);
  const difference = totalDebits - totalCredits;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="space-y-3 pb-2 border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <DialogTitle className="text-xl">Transaction Details</DialogTitle>
          </div>
          <DialogDescription className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="font-medium">{transaction.description}</span>
            <Badge variant={transaction.isReconciled ? "default" : "outline"} 
              className={transaction.isReconciled 
                ? "bg-green-600 text-white font-medium" 
                : "border-amber-500 text-amber-600 bg-amber-50 font-medium"}
            >
              {transaction.isReconciled ? 'Reconciled' : 'Pending'}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="font-medium">{format(transaction.date, 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Reference</p>
              <p className="font-medium">{transaction.reference || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="font-medium">{format(transaction.createdAt, 'MMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="font-medium font-mono">{formatCurrency(totalDebits)}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Journal Entries
            </h3>
            <div className="border rounded-md overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaction.entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{getAccountName(entry.accountId)}</TableCell>
                      <TableCell>{entry.description || '-'}</TableCell>
                      <TableCell className="text-right font-mono">
                        {entry.debit > 0 ? formatCurrency(entry.debit) : ''}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {entry.credit > 0 ? formatCurrency(entry.credit) : ''}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-muted/20">
                    <TableCell colSpan={2} className="text-right font-medium">Totals</TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      {formatCurrency(totalDebits)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      {formatCurrency(totalCredits)}
                    </TableCell>
                  </TableRow>
                  <TableRow className={difference !== 0 ? "bg-red-50" : "bg-green-50"}>
                    <TableCell colSpan={2} className="text-right font-medium">Difference</TableCell>
                    <TableCell colSpan={2} className={`text-right font-mono font-bold ${
                      difference !== 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {formatCurrency(difference)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
