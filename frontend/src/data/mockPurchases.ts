
import { 
  Vendor, 
  Expense, 
  RecurringExpense, 
  PurchaseOrder, 
  Bill, 
  Payment, 
  RecurringBill,
  VendorCredit,
  PurchaseReturn,
  CreditNote,
  DebitNote
} from '../models/purchases';
import { v4 as uuidv4 } from 'uuid';

// Mock Vendors
const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'ABC Supplies Inc.',
    email: 'contact@abcsupplies.com',
    phone: '555-123-4567',
    address: '123 Vendor St, Supplyton, CA 90210',
    taxId: 'TAX-123456',
    paymentTerms: 30,
    creditLimit: 10000,
    status: 'active',
    created: '2023-01-15',
    lastTransaction: '2023-04-20',
    balance: 3500
  },
  {
    id: '2',
    name: 'Global Equipment Ltd.',
    email: 'sales@globalequipment.com',
    phone: '555-987-6543',
    address: '456 Manufacturer Ave, Industry City, NY 10001',
    taxId: 'TAX-789012',
    paymentTerms: 45,
    creditLimit: 25000,
    status: 'active',
    created: '2022-11-10',
    lastTransaction: '2023-05-05',
    balance: 12000
  },
  {
    id: '3',
    name: 'Tech Parts Distributors',
    email: 'orders@techparts.com',
    phone: '555-456-7890',
    address: '789 Component Blvd, Techville, TX 75001',
    taxId: 'TAX-345678',
    paymentTerms: 15,
    creditLimit: 7500,
    status: 'inactive',
    created: '2023-02-20',
    balance: 0
  },
  {
    id: '4',
    name: 'Fresh Produce Co.',
    email: 'info@freshproduce.com',
    phone: '555-789-0123',
    address: '321 Harvest Rd, Farmington, CA 95814',
    taxId: 'TAX-901234',
    paymentTerms: 7,
    creditLimit: 5000,
    status: 'active',
    created: '2022-09-05',
    lastTransaction: '2023-04-28',
    balance: 1200
  },
  {
    id: '5',
    name: 'Office Solutions Plus',
    email: 'support@officesolutions.com',
    phone: '555-234-5678',
    address: '567 Business Park, Corporate City, IL 60601',
    taxId: 'TAX-567890',
    paymentTerms: 30,
    creditLimit: 15000,
    status: 'active',
    created: '2023-03-12',
    lastTransaction: '2023-05-10',
    balance: 8750
  }
];

// Mock Expenses
const mockExpenses: Expense[] = [
  {
    id: '1',
    vendor: 'ABC Supplies Inc.',
    vendorId: '1',
    date: '2023-04-15',
    dueDate: '2023-05-15',
    category: 'Office Supplies',
    amount: 750,
    tax: 60,
    total: 810,
    status: 'processed',
    reference: 'EXP-2023-001',
    notes: 'Monthly office supply restock'
  },
  {
    id: '2',
    vendor: 'Global Equipment Ltd.',
    vendorId: '2',
    date: '2023-04-22',
    dueDate: '2023-06-06',
    category: 'Equipment Rental',
    amount: 1200,
    tax: 96,
    total: 1296,
    status: 'pending',
    reference: 'EXP-2023-002'
  },
  {
    id: '3',
    vendor: 'Fresh Produce Co.',
    vendorId: '4',
    date: '2023-05-01',
    dueDate: '2023-05-08',
    category: 'Pantry Supplies',
    amount: 350,
    tax: 28,
    total: 378,
    status: 'processed',
    reference: 'EXP-2023-003',
    notes: 'Staff kitchen supplies'
  },
  {
    id: '4',
    vendor: 'Office Solutions Plus',
    vendorId: '5',
    date: '2023-05-05',
    dueDate: '2023-06-04',
    category: 'Furniture',
    amount: 2500,
    tax: 200,
    total: 2700,
    status: 'draft',
    reference: 'EXP-2023-004',
    notes: 'New meeting room chairs'
  },
  {
    id: '5',
    vendor: 'ABC Supplies Inc.',
    vendorId: '1',
    date: '2023-05-10',
    dueDate: '2023-06-09',
    category: 'Printing Services',
    amount: 420,
    tax: 33.60,
    total: 453.60,
    status: 'pending',
    reference: 'EXP-2023-005'
  }
];

// Mock Recurring Expenses
const mockRecurringExpenses: RecurringExpense[] = [
  {
    id: '1',
    vendor: 'ABC Supplies Inc.',
    vendorId: '1',
    category: 'Office Supplies',
    amount: 500,
    tax: 40,
    total: 540,
    status: 'active',
    frequency: 'monthly',
    nextDate: '2023-06-01',
    occurrences: 5,
    reference: 'REC-EXP-2023-001',
    notes: 'Monthly office supply subscription'
  },
  {
    id: '2',
    vendor: 'Office Solutions Plus',
    vendorId: '5',
    category: 'Software Subscription',
    amount: 199.99,
    tax: 16,
    total: 215.99,
    status: 'active',
    frequency: 'monthly',
    nextDate: '2023-06-15',
    occurrences: 12,
    reference: 'REC-EXP-2023-002'
  },
  {
    id: '3',
    vendor: 'Tech Parts Distributors',
    vendorId: '3',
    category: 'Equipment Maintenance',
    amount: 1500,
    tax: 120,
    total: 1620,
    status: 'paused',
    frequency: 'quarterly',
    nextDate: '2023-07-01',
    occurrences: 3,
    reference: 'REC-EXP-2023-003',
    notes: 'Quarterly maintenance contract'
  }
];

// Mock Purchase Orders
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    vendor: 'ABC Supplies Inc.',
    vendorId: '1',
    date: '2023-05-01',
    expectedDate: '2023-05-15',
    items: [
      {
        id: '1-1',
        productId: 'P001',
        name: 'Copy Paper A4',
        quantity: 50,
        unitPrice: 4.99,
        tax: 19.96,
        discount: 0,
        total: 249.5
      },
      {
        id: '1-2',
        productId: 'P002',
        name: 'Ballpoint Pens (Box)',
        quantity: 20,
        unitPrice: 8.99,
        tax: 14.38,
        discount: 10,
        total: 169.42
      }
    ],
    subtotal: 419.8,
    tax: 34.34,
    total: 454.14,
    status: 'approved',
    reference: 'PO-2023-001',
    notes: 'Office supplies restock'
  },
  {
    id: '2',
    vendor: 'Global Equipment Ltd.',
    vendorId: '2',
    date: '2023-05-05',
    expectedDate: '2023-06-05',
    items: [
      {
        id: '2-1',
        productId: 'E001',
        name: 'Desktop Computer',
        quantity: 3,
        unitPrice: 899.99,
        tax: 215.99,
        discount: 50,
        total: 2649.97
      }
    ],
    subtotal: 2699.97,
    tax: 215.99,
    total: 2915.96,
    status: 'sent',
    reference: 'PO-2023-002'
  },
  {
    id: '3',
    vendor: 'Tech Parts Distributors',
    vendorId: '3',
    date: '2023-05-10',
    expectedDate: '2023-05-25',
    items: [
      {
        id: '3-1',
        productId: 'T001',
        name: 'Hard Drive 1TB',
        quantity: 5,
        unitPrice: 89.99,
        tax: 36,
        discount: 0,
        total: 449.95
      }
    ],
    subtotal: 449.95,
    tax: 36,
    total: 485.95,
    status: 'draft',
    reference: 'PO-2023-003',
    notes: 'IT department upgrades'
  }
];

// Mock Bills
const mockBills: Bill[] = [
  {
    id: '1',
    vendorId: '1',
    vendor: 'ABC Supplies Inc.',
    date: '2023-05-05',
    dueDate: '2023-06-04',
    items: [
      {
        id: '1-1',
        description: 'Copy Paper A4',
        quantity: 50,
        unitPrice: 4.99,
        tax: 19.96,
        discount: 0,
        total: 249.5
      },
      {
        id: '1-2',
        description: 'Ballpoint Pens (Box)',
        quantity: 20,
        unitPrice: 8.99,
        tax: 14.38,
        discount: 0,
        total: 179.8
      }
    ],
    subtotal: 429.3,
    tax: 34.34,
    total: 463.64,
    status: 'paid',
    reference: 'BILL-2023-001',
    purchaseOrderId: '1'
  },
  {
    id: '2',
    vendorId: '2',
    vendor: 'Global Equipment Ltd.',
    date: '2023-05-10',
    dueDate: '2023-06-24',
    items: [
      {
        id: '2-1',
        description: 'Desktop Computer',
        quantity: 3,
        unitPrice: 899.99,
        tax: 215.99,
        discount: 50,
        total: 2649.97
      }
    ],
    subtotal: 2699.97,
    tax: 215.99,
    total: 2915.96,
    status: 'pending',
    reference: 'BILL-2023-002',
    purchaseOrderId: '2'
  },
  {
    id: '3',
    vendorId: '5',
    vendor: 'Office Solutions Plus',
    date: '2023-05-15',
    dueDate: '2023-06-14',
    items: [
      {
        id: '3-1',
        description: 'Ergonomic Chair',
        quantity: 2,
        unitPrice: 249.99,
        tax: 40,
        discount: 0,
        total: 499.98
      }
    ],
    subtotal: 499.98,
    tax: 40,
    total: 539.98,
    status: 'overdue',
    reference: 'BILL-2023-003'
  }
];

// Mock Payments
const mockPayments: Payment[] = [
  {
    id: '1',
    vendorId: '1',
    vendor: 'ABC Supplies Inc.',
    date: '2023-05-20',
    amount: 463.64,
    method: 'bank_transfer',
    reference: 'PMT-2023-001',
    notes: 'Payment for office supplies',
    status: 'completed',
    billIds: ['1']
  },
  {
    id: '2',
    vendorId: '4',
    vendor: 'Fresh Produce Co.',
    date: '2023-05-22',
    amount: 378,
    method: 'credit_card',
    reference: 'PMT-2023-002',
    status: 'completed',
    billIds: []
  },
  {
    id: '3',
    vendorId: '5',
    vendor: 'Office Solutions Plus',
    date: '2023-05-25',
    amount: 1000,
    method: 'check',
    reference: 'PMT-2023-003',
    notes: 'Partial payment for furniture',
    status: 'pending',
    billIds: ['3']
  }
];

// Mock Recurring Bills
const mockRecurringBills: RecurringBill[] = [
  {
    id: '1',
    vendorId: '5',
    vendor: 'Office Solutions Plus',
    items: [
      {
        id: '1-1',
        description: 'Office Software Subscription',
        quantity: 10,
        unitPrice: 19.99,
        tax: 16,
        discount: 0,
        total: 199.9
      }
    ],
    subtotal: 199.9,
    tax: 16,
    total: 215.9,
    frequency: 'monthly',
    nextDate: '2023-06-01',
    occurrences: 8,
    status: 'active',
    reference: 'REC-BILL-2023-001',
    notes: 'Monthly software subscription'
  },
  {
    id: '2',
    vendorId: '1',
    vendor: 'ABC Supplies Inc.',
    items: [
      {
        id: '2-1',
        description: 'Cleaning Services',
        quantity: 1,
        unitPrice: 250,
        tax: 20,
        discount: 0,
        total: 250
      }
    ],
    subtotal: 250,
    tax: 20,
    total: 270,
    frequency: 'weekly',
    nextDate: '2023-05-27',
    occurrences: 24,
    status: 'active',
    reference: 'REC-BILL-2023-002'
  }
];

// Mock Vendor Credits
const mockVendorCredits: VendorCredit[] = [
  {
    id: '1',
    vendorId: '1',
    vendor: 'ABC Supplies Inc.',
    date: '2023-05-10',
    items: [
      {
        id: '1-1',
        description: 'Defective Staplers',
        quantity: 3,
        unitPrice: 15.99,
        tax: 3.84,
        total: 47.97
      }
    ],
    subtotal: 47.97,
    tax: 3.84,
    total: 51.81,
    status: 'approved',
    reference: 'VC-2023-001',
    notes: 'Credit for defective items',
    billId: '1'
  },
  {
    id: '2',
    vendorId: '2',
    vendor: 'Global Equipment Ltd.',
    date: '2023-05-15',
    items: [
      {
        id: '2-1',
        description: 'Overcharged Shipping',
        quantity: 1,
        unitPrice: 75,
        tax: 6,
        total: 75
      }
    ],
    subtotal: 75,
    tax: 6,
    total: 81,
    status: 'pending',
    reference: 'VC-2023-002'
  }
];

// Mock Purchase Returns
const mockPurchaseReturns: PurchaseReturn[] = [
  {
    id: '1',
    vendorId: '1',
    vendor: 'ABC Supplies Inc.',
    date: '2023-05-08',
    items: [
      {
        id: '1-1',
        productId: 'P003',
        name: 'Staplers',
        quantity: 3,
        unitPrice: 15.99,
        tax: 3.84,
        total: 47.97,
        reason: 'Defective'
      }
    ],
    subtotal: 47.97,
    tax: 3.84,
    total: 51.81,
    status: 'completed',
    reference: 'RET-2023-001',
    notes: 'Return of defective items',
    billId: '1',
    creditNoteId: '1'
  },
  {
    id: '2',
    vendorId: '5',
    vendor: 'Office Solutions Plus',
    date: '2023-05-18',
    items: [
      {
        id: '2-1',
        productId: 'F001',
        name: 'Office Chair',
        quantity: 1,
        unitPrice: 189.99,
        tax: 15.2,
        total: 189.99,
        reason: 'Wrong item delivered'
      }
    ],
    subtotal: 189.99,
    tax: 15.2,
    total: 205.19,
    status: 'pending',
    reference: 'RET-2023-002',
    notes: 'Received wrong model',
    billId: '3'
  }
];

// Mock Credit Notes
const mockCreditNotes: CreditNote[] = [
  {
    id: '1',
    vendorId: '1',
    vendor: 'ABC Supplies Inc.',
    date: '2023-05-10',
    items: [
      {
        id: '1-1',
        description: 'Staplers - Defective Return',
        quantity: 3,
        unitPrice: 15.99,
        tax: 3.84,
        total: 47.97
      }
    ],
    subtotal: 47.97,
    tax: 3.84,
    total: 51.81,
    status: 'approved',
    reference: 'CN-2023-001',
    notes: 'Credit for returned defective staplers',
    returnId: '1'
  },
  {
    id: '2',
    vendorId: '2',
    vendor: 'Global Equipment Ltd.',
    date: '2023-05-16',
    items: [
      {
        id: '2-1',
        description: 'Shipping Discount',
        quantity: 1,
        unitPrice: 75,
        tax: 6,
        total: 75
      }
    ],
    subtotal: 75,
    tax: 6,
    total: 81,
    status: 'draft',
    reference: 'CN-2023-002'
  }
];

// Mock Debit Notes
const mockDebitNotes: DebitNote[] = [
  {
    id: '1',
    vendorId: '2',
    vendor: 'Global Equipment Ltd.',
    date: '2023-05-12',
    items: [
      {
        id: '1-1',
        description: 'Missing items from order',
        quantity: 1,
        unitPrice: 120,
        tax: 9.6,
        total: 120
      }
    ],
    subtotal: 120,
    tax: 9.6,
    total: 129.6,
    status: 'pending',
    reference: 'DN-2023-001',
    notes: 'Adjustment for missing items',
    billId: '2'
  },
  {
    id: '2',
    vendorId: '5',
    vendor: 'Office Solutions Plus',
    date: '2023-05-20',
    items: [
      {
        id: '2-1',
        description: 'Price difference',
        quantity: 1,
        unitPrice: 45.5,
        tax: 3.64,
        total: 45.5
      }
    ],
    subtotal: 45.5,
    tax: 3.64,
    total: 49.14,
    status: 'draft',
    reference: 'DN-2023-002',
    billId: '3'
  }
];

// Helper functions to get data
export const getVendors = () => [...mockVendors];
export const getVendorById = (id: string) => mockVendors.find(vendor => vendor.id === id);
export const getExpenses = () => [...mockExpenses];
export const getRecurringExpenses = () => [...mockRecurringExpenses];
export const getPurchaseOrders = () => [...mockPurchaseOrders];
export const getBills = () => [...mockBills];
export const getPayments = () => [...mockPayments];
export const getRecurringBills = () => [...mockRecurringBills];
export const getVendorCredits = () => [...mockVendorCredits];
export const getPurchaseReturns = () => [...mockPurchaseReturns];
export const getCreditNotes = () => [...mockCreditNotes];
export const getDebitNotes = () => [...mockDebitNotes];

// Helper functions to create new records
export const createVendor = (vendor: Omit<Vendor, 'id'>) => {
  const newVendor = { ...vendor, id: uuidv4() };
  mockVendors.push(newVendor);
  return newVendor;
};

export const updateVendor = (id: string, updates: Partial<Vendor>) => {
  const index = mockVendors.findIndex(vendor => vendor.id === id);
  if (index !== -1) {
    mockVendors[index] = { ...mockVendors[index], ...updates };
    return mockVendors[index];
  }
  return null;
};

export const deleteVendor = (id: string) => {
  const index = mockVendors.findIndex(vendor => vendor.id === id);
  if (index !== -1) {
    mockVendors.splice(index, 1);
    return true;
  }
  return false;
};

// Similar CRUD functions for other entities
// For brevity, I'm not including all of them, but they would follow the same pattern
