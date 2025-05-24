
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  description?: string;
  balance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  reference?: string;
  entries: TransactionEntry[];
  isReconciled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionEntry {
  id: string;
  transactionId: string;
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
}
