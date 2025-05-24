
import { Product } from './pos';

// Customer type in sales module
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Common status types
export type DocumentStatus = 
  | 'draft' 
  | 'sent' 
  | 'viewed' 
  | 'approved' 
  | 'rejected' 
  | 'expired' 
  | 'paid' 
  | 'partially_paid' 
  | 'overdue' 
  | 'cancelled'
  | 'issued'
  | 'pending'
  | 'processed';

// Base interface for sales documents
interface SalesDocumentBase {
  id: string;
  number: string;
  customer: Customer;
  date: Date;
  dueDate?: Date;
  items: SalesItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  notes?: string;
  termsAndConditions?: string;
  status: DocumentStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Item in a sales document
export interface SalesItem {
  id: string;
  product: Product;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  total: number;
}

// Estimate
export interface Estimate extends SalesDocumentBase {
  expiryDate: Date;
  isConvertedToInvoice: boolean;
  convertedInvoiceId?: string;
}

// Invoice
export interface Invoice extends SalesDocumentBase {
  paymentTerms?: string;
  paymentDue: Date;
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid' | 'overdue';
  amountPaid: number;
  balanceDue: number;
}

// Retainer Invoice
export interface RetainerInvoice extends Invoice {
  retainerPeriod: {
    startDate: Date;
    endDate: Date;
  };
}

// Sales Order
export interface SalesOrder extends SalesDocumentBase {
  isFulfilled: boolean;
  fulfillmentStatus: 'unfulfilled' | 'partially_fulfilled' | 'fulfilled';
  invoiceId?: string;
}

// Delivery Challan
export interface DeliveryChallan extends SalesDocumentBase {
  isBillable: boolean;
  salesOrderId?: string;
  vehicleNumber?: string;
  driverName?: string;
  transporterName?: string;
  deliveryDate?: Date;
  deliveryAddress: string;
  deliveryStatus: 'pending' | 'in_transit' | 'delivered' | 'returned';
}

// Payment
export interface Payment {
  id: string;
  customer: Customer;
  date: Date;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'credit_card' | 'check' | 'online' | 'other' | 'razorpay';
  reference?: string;
  description?: string;
  invoiceIds: string[]; // Invoices this payment applies to
  createdBy: string;
  createdAt: Date;
}

// Recurring Invoice
export interface RecurringInvoice extends Omit<Invoice, 'status'> {
  recurrenceInterval: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextGenerationDate: Date;
  remainingOccurrences: number;
  isActive: boolean;
}

// Credit Note
export interface CreditNote extends SalesDocumentBase {
  reason: string;
  invoiceId?: string;
  refundStatus?: 'pending' | 'processed' | 'cancelled';
}

// Sales Return
export interface SalesReturn extends SalesDocumentBase {
  reason: string;
  invoiceId: string;
  returnCondition: 'damaged' | 'wrong_item' | 'not_as_described' | 'other';
  restockStatus: 'pending' | 'restocked' | 'disposed';
}

// Receipt
export interface Receipt {
  id: string;
  number: string;
  customer: Customer;
  date: Date;
  paymentId: string;
  amount: number;
  paymentMethod: string;
  createdBy: string;
  createdAt: Date;
}

// Debit Note
export interface DebitNote extends SalesDocumentBase {
  reason: string;
  purchaseInvoiceId?: string;
}
