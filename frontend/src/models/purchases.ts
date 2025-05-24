
// Define interfaces for purchase module entities

// Vendor entity type
export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  paymentTerms: number;
  creditLimit: number;
  status: 'active' | 'inactive' | 'blocked';
  created: string;
  lastTransaction?: string;
  balance: number;
}

// Expense entity type
export interface Expense {
  id: string;
  vendor: string;
  vendorId: string;
  date: string;
  dueDate: string;
  category: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'pending' | 'processed' | 'cancelled';
  reference: string;
  notes?: string;
}

// Recurring Expense entity type
export interface RecurringExpense extends Omit<Expense, 'date' | 'dueDate' | 'status'> {
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextDate: string;
  endDate?: string;
  lastProcessed?: string;
  occurrences: number;
  status: 'active' | 'paused' | 'completed';
}

// Purchase Order entity type
export interface PurchaseOrder {
  id: string;
  vendor: string;
  vendorId: string;
  date: string;
  expectedDate: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'pending' | 'approved' | 'sent' | 'received' | 'cancelled' | 'closed';
  reference: string;
  notes?: string;
}

// Purchase Order Item
export interface PurchaseOrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  total: number;
}

// Bill entity type
export interface Bill {
  id: string;
  vendorId: string;
  vendor: string;
  date: string;
  dueDate: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'pending' | 'approved' | 'paid' | 'cancelled' | 'overdue';
  reference: string;
  notes?: string;
  purchaseOrderId?: string;
}

// Bill Item
export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  total: number;
  accountId?: string;
}

// Payment entity type
export interface Payment {
  id: string;
  vendorId: string;
  vendor: string;
  date: string;
  amount: number;
  method: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'online_payment' | 'razorpay';
  reference: string;
  notes?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  billIds: string[]; // References to bills this payment covers
}

// Recurring Bill entity type
export interface RecurringBill extends Omit<Bill, 'date' | 'dueDate' | 'status'> {
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextDate: string;
  endDate?: string;
  lastProcessed?: string;
  occurrences: number;
  status: 'active' | 'paused' | 'completed';
}

// Vendor Credit entity type
export interface VendorCredit {
  id: string;
  vendorId: string;
  vendor: string;
  date: string;
  items: VendorCreditItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'pending' | 'approved' | 'applied' | 'cancelled';
  reference: string;
  notes?: string;
  billId?: string;
}

// Vendor Credit Item
export interface VendorCreditItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

// Purchase Return entity type
export interface PurchaseReturn {
  id: string;
  vendorId: string;
  vendor: string;
  date: string;
  items: PurchaseReturnItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled';
  reference: string;
  notes?: string;
  billId?: string;
  creditNoteId?: string;
}

// Purchase Return Item
export interface PurchaseReturnItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
  reason: string;
}

// Credit Note entity type - related to returns
export interface CreditNote {
  id: string;
  vendorId: string;
  vendor: string;
  date: string;
  items: CreditNoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'pending' | 'approved' | 'applied' | 'cancelled';
  reference: string;
  notes?: string;
  returnId?: string;
}

// Credit Note Item
export interface CreditNoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

// Debit Note entity type - for overpayments or corrections
export interface DebitNote {
  id: string;
  vendorId: string;
  vendor: string;
  date: string;
  items: DebitNoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'pending' | 'approved' | 'applied' | 'cancelled';
  reference: string;
  notes?: string;
  billId?: string;
}

// Debit Note Item
export interface DebitNoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}
