
import React from 'react';
import { Account, AccountType } from '@/models/accounting';
import { TableCell, TableRow, TableHead, TableHeader, Table, TableBody } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface AccountsTableProps {
  accounts: Account[];
  filter?: AccountType | 'all';
}

const AccountsTable: React.FC<AccountsTableProps> = ({ 
  accounts,
  filter = 'all' 
}) => {
  const filteredAccounts = filter === 'all' 
    ? accounts 
    : accounts.filter(account => account.type === filter);

  const getAccountTypeBadge = (type: AccountType) => {
    const types = {
      asset: { label: 'Asset', className: 'bg-blue-500 hover:bg-blue-600' },
      liability: { label: 'Liability', className: 'bg-red-500 hover:bg-red-600' },
      equity: { label: 'Equity', className: 'bg-green-500 hover:bg-green-600' },
      revenue: { label: 'Revenue', className: 'bg-emerald-500 hover:bg-emerald-600' },
      expense: { label: 'Expense', className: 'bg-amber-500 hover:bg-amber-600' },
    };

    return (
      <Badge className={types[type].className}>
        {types[type].label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (filteredAccounts.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No accounts found matching your criteria.
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">Code</TableHead>
            <TableHead>Account Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="w-[80px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAccounts.map((account) => (
            <TableRow key={account.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{account.code}</TableCell>
              <TableCell>{account.name}</TableCell>
              <TableCell>{getAccountTypeBadge(account.type)}</TableCell>
              <TableCell className={`text-right font-mono ${
                account.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(account.balance)}
              </TableCell>
              <TableCell className="text-center">
                <Button size="icon" variant="ghost">
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

export default AccountsTable;
