
import { Account, Transaction } from '@/models/accounting';

// Mock Chart of Accounts
export const mockAccounts: Account[] = [
  {
    id: '1000',
    code: '1000',
    name: 'Cash',
    type: 'asset',
    description: 'Cash on hand',
    balance: 10000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1100',
    code: '1100',
    name: 'Accounts Receivable',
    type: 'asset',
    description: 'Money owed by customers',
    balance: 5000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2000',
    code: '2000',
    name: 'Accounts Payable',
    type: 'liability',
    description: 'Money owed to suppliers',
    balance: 3000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3000',
    code: '3000',
    name: 'Capital',
    type: 'equity',
    description: 'Owner\'s equity',
    balance: 8000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4000',
    code: '4000',
    name: 'Sales Revenue',
    type: 'revenue',
    description: 'Income from sales',
    balance: 12000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5000',
    code: '5000',
    name: 'Cost of Goods Sold',
    type: 'expense',
    description: 'Cost of items sold',
    balance: 7000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6000',
    code: '6000',
    name: 'Rent Expense',
    type: 'expense',
    description: 'Monthly rent',
    balance: 2000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6100',
    code: '6100',
    name: 'Utilities Expense',
    type: 'expense',
    description: 'Electricity, water, etc.',
    balance: 1000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock Transactions with entries
export const mockTransactions: Transaction[] = [
  {
    id: 'T-001',
    date: new Date(2025, 4, 1),
    description: 'Initial investment',
    reference: 'INV-001',
    entries: [
      {
        id: 'E-001',
        transactionId: 'T-001',
        accountId: '1000', // Cash
        debit: 8000,
        credit: 0,
        description: 'Initial cash investment'
      },
      {
        id: 'E-002',
        transactionId: 'T-001',
        accountId: '3000', // Capital
        debit: 0,
        credit: 8000,
        description: 'Owner equity'
      }
    ],
    isReconciled: true,
    createdAt: new Date(2025, 4, 1),
    updatedAt: new Date(2025, 4, 1)
  },
  {
    id: 'T-002',
    date: new Date(2025, 4, 3),
    description: 'Purchase of inventory',
    reference: 'PO-001',
    entries: [
      {
        id: 'E-003',
        transactionId: 'T-002',
        accountId: '5000', // COGS
        debit: 2000,
        credit: 0,
        description: 'Inventory purchase'
      },
      {
        id: 'E-004',
        transactionId: 'T-002',
        accountId: '1000', // Cash
        debit: 0,
        credit: 2000,
        description: 'Payment for inventory'
      }
    ],
    isReconciled: true,
    createdAt: new Date(2025, 4, 3),
    updatedAt: new Date(2025, 4, 3)
  },
  {
    id: 'T-003',
    date: new Date(2025, 4, 5),
    description: 'Sale to customer',
    reference: 'INV-002',
    entries: [
      {
        id: 'E-005',
        transactionId: 'T-003',
        accountId: '1000', // Cash
        debit: 3000,
        credit: 0,
        description: 'Payment received'
      },
      {
        id: 'E-006',
        transactionId: 'T-003',
        accountId: '4000', // Sales Revenue
        debit: 0,
        credit: 3000,
        description: 'Sales revenue'
      }
    ],
    isReconciled: false,
    createdAt: new Date(2025, 4, 5),
    updatedAt: new Date(2025, 4, 5)
  },
  {
    id: 'T-004',
    date: new Date(2025, 4, 10),
    description: 'Rent payment',
    reference: 'RENT-001',
    entries: [
      {
        id: 'E-007',
        transactionId: 'T-004',
        accountId: '6000', // Rent Expense
        debit: 2000,
        credit: 0,
        description: 'Monthly rent'
      },
      {
        id: 'E-008',
        transactionId: 'T-004',
        accountId: '1000', // Cash
        debit: 0,
        credit: 2000,
        description: 'Rent payment'
      }
    ],
    isReconciled: true,
    createdAt: new Date(2025, 4, 10),
    updatedAt: new Date(2025, 4, 10)
  },
  {
    id: 'T-005',
    date: new Date(2025, 4, 15),
    description: 'Credit sale to customer',
    reference: 'INV-003',
    entries: [
      {
        id: 'E-009',
        transactionId: 'T-005',
        accountId: '1100', // Accounts Receivable
        debit: 5000,
        credit: 0,
        description: 'Credit sale'
      },
      {
        id: 'E-010',
        transactionId: 'T-005',
        accountId: '4000', // Sales Revenue
        debit: 0,
        credit: 5000,
        description: 'Sales revenue'
      }
    ],
    isReconciled: false,
    createdAt: new Date(2025, 4, 15),
    updatedAt: new Date(2025, 4, 15)
  }
];
