import { 
  Customer, 
  Estimate, 
  Invoice, 
  RetainerInvoice, 
  SalesOrder,
  DeliveryChallan,
  Payment,
  RecurringInvoice,
  CreditNote,
  SalesReturn,
  Receipt,
  DebitNote,
  SalesItem
} from '@/models/sales';
import { mockProducts } from './mockProducts';

// Mock customers data
export const mockCustomers: Customer[] = [
  {
    id: "C1001",
    name: "Acme Corporation",
    email: "accounts@acmecorp.com",
    phone: "+1-555-123-4567",
    address: "123 Business Avenue, Tech City, TC 54321"
  },
  {
    id: "C1002",
    name: "TechSolutions Inc.",
    email: "billing@techsolutions.com",
    phone: "+1-555-987-6543",
    address: "456 Innovation Drive, Digital Valley, DV 98765"
  },
  {
    id: "C1003",
    name: "Global Enterprises Ltd.",
    email: "finance@globalent.com",
    phone: "+1-555-456-7890",
    address: "789 Corporate Plaza, Business Park, BP 45678"
  },
  {
    id: "C1004",
    name: "Local Retail Shop",
    email: "manager@localretail.com",
    phone: "+1-555-234-5678",
    address: "101 Main Street, Downtown, DT 12345"
  },
  {
    id: "C1005",
    name: "Creative Studios",
    email: "accounts@creativestudios.com",
    phone: "+1-555-345-6789",
    address: "202 Art Avenue, Design District, DD 67890"
  }
];

// Helper function to create sales items
const createSalesItems = (count: number = 3): SalesItem[] => {
  const items: SalesItem[] = [];
  for (let i = 0; i < count; i++) {
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const unitPrice = product.price;
    const tax = unitPrice * 0.18; // Assuming 18% tax
    const discount = i === 0 ? unitPrice * 0.05 : 0; // 5% discount on first item
    const total = (unitPrice * quantity + tax * quantity) - discount;
    
    items.push({
      id: `ITEM-${Date.now()}-${i}`,
      product,
      description: product.name,
      quantity,
      unitPrice,
      tax,
      discount,
      total
    });
  }
  return items;
};

// Helper to calculate document totals
const calculateTotals = (items: SalesItem[]) => {
  const subtotal = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const taxTotal = items.reduce((acc, item) => acc + (item.tax * item.quantity), 0);
  const discountTotal = items.reduce((acc, item) => acc + item.discount, 0);
  const total = subtotal + taxTotal - discountTotal;
  
  return { subtotal, taxTotal, discountTotal, total };
};

// Mock Estimates
export const mockEstimates: Estimate[] = [
  {
    id: "EST1001",
    number: "EST-1001",
    customer: mockCustomers[0],
    date: new Date(2025, 3, 1), // April 1, 2025
    dueDate: new Date(2025, 3, 15), // April 15, 2025
    expiryDate: new Date(2025, 4, 1), // May 1, 2025
    items: createSalesItems(),
    ...calculateTotals(createSalesItems()),
    notes: "Project scope as discussed in our meeting.",
    termsAndConditions: "Standard terms apply.",
    status: "sent",
    isConvertedToInvoice: false,
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 1)
  },
  {
    id: "EST1002",
    number: "EST-1002",
    customer: mockCustomers[1],
    date: new Date(2025, 3, 5), // April 5, 2025
    dueDate: new Date(2025, 3, 20), // April 20, 2025
    expiryDate: new Date(2025, 4, 5), // May 5, 2025
    items: createSalesItems(2),
    ...calculateTotals(createSalesItems(2)),
    notes: "As per client requirements.",
    termsAndConditions: "Standard terms apply.",
    status: "viewed",
    isConvertedToInvoice: false,
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 5)
  }
];

// Mock Invoices
export const mockInvoices: Invoice[] = [
  {
    id: "INV1001",
    number: "INV-1001",
    customer: mockCustomers[0],
    date: new Date(2025, 3, 15), // April 15, 2025
    dueDate: new Date(2025, 4, 15), // May 15, 2025
    paymentDue: new Date(2025, 4, 15),
    paymentTerms: "Net 30",
    items: createSalesItems(),
    ...calculateTotals(createSalesItems()),
    notes: "Thank you for your business.",
    termsAndConditions: "Payment due within 30 days.",
    status: "sent",
    paymentStatus: "unpaid",
    amountPaid: 0,
    balanceDue: calculateTotals(createSalesItems()).total,
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 15)
  },
  {
    id: "INV1002",
    number: "INV-1002",
    customer: mockCustomers[1],
    date: new Date(2025, 3, 20), // April 20, 2025
    dueDate: new Date(2025, 4, 20), // May 20, 2025
    paymentDue: new Date(2025, 4, 20),
    paymentTerms: "Net 30",
    items: createSalesItems(4),
    ...calculateTotals(createSalesItems(4)),
    notes: "Thank you for your business.",
    termsAndConditions: "Payment due within 30 days.",
    status: "paid",
    paymentStatus: "paid",
    amountPaid: calculateTotals(createSalesItems(4)).total,
    balanceDue: 0,
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 20)
  }
];

// Mock RetainerInvoices
export const mockRetainerInvoices: RetainerInvoice[] = [
  {
    id: "RET1001",
    number: "RET-1001",
    customer: mockCustomers[2],
    date: new Date(2025, 3, 1), // April 1, 2025
    dueDate: new Date(2025, 3, 15), // April 15, 2025
    paymentDue: new Date(2025, 3, 15),
    paymentTerms: "Net 15",
    items: createSalesItems(1),
    ...calculateTotals(createSalesItems(1)),
    notes: "Monthly retainer for consulting services.",
    termsAndConditions: "Retainer terms apply.",
    status: "paid",
    paymentStatus: "paid",
    amountPaid: calculateTotals(createSalesItems(1)).total,
    balanceDue: 0,
    retainerPeriod: {
      startDate: new Date(2025, 3, 1), // April 1, 2025
      endDate: new Date(2025, 3, 30), // April 30, 2025
    },
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 1)
  }
];

// Mock Sales Orders
export const mockSalesOrders: SalesOrder[] = [
  {
    id: "SO1001",
    number: "SO-1001",
    customer: mockCustomers[0],
    date: new Date(2025, 3, 5), // April 5, 2025
    items: createSalesItems(3),
    ...calculateTotals(createSalesItems(3)),
    notes: "Please fulfill as soon as possible.",
    status: "approved",
    isFulfilled: false,
    fulfillmentStatus: "unfulfilled",
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 5)
  }
];

// Mock Delivery Challans
export const mockDeliveryChallans: DeliveryChallan[] = [
  {
    id: "DC1001",
    number: "DC-1001",
    customer: mockCustomers[0],
    date: new Date(2025, 3, 10), // April 10, 2025
    items: createSalesItems(3),
    ...calculateTotals(createSalesItems(3)),
    notes: "Please handle with care.",
    status: "sent",
    isBillable: true,
    salesOrderId: "SO1001",
    vehicleNumber: "TRK-1234",
    driverName: "John Driver",
    transporterName: "Swift Transport",
    deliveryDate: new Date(2025, 3, 12), // April 12, 2025
    deliveryAddress: "123 Business Avenue, Tech City, TC 54321",
    deliveryStatus: "delivered",
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 10)
  },
  {
    id: "DC1002",
    number: "DC-1002",
    customer: mockCustomers[1],
    date: new Date(2025, 3, 15), // April 15, 2025
    items: createSalesItems(2),
    ...calculateTotals(createSalesItems(2)),
    notes: "Fragile items inside.",
    status: "sent",
    isBillable: false,
    vehicleNumber: "TRK-5678",
    driverName: "Mike Smith",
    transporterName: "City Logistics",
    deliveryDate: new Date(2025, 3, 17), // April 17, 2025
    deliveryAddress: "456 Innovation Drive, Digital Valley, DV 98765",
    deliveryStatus: "in_transit",
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 15)
  },
  {
    id: "DC1003",
    number: "DC-1003",
    customer: mockCustomers[2],
    date: new Date(2025, 3, 18), // April 18, 2025
    items: createSalesItems(4),
    ...calculateTotals(createSalesItems(4)),
    notes: "Priority delivery.",
    status: "sent",
    isBillable: true,
    salesOrderId: "SO1002",
    vehicleNumber: "TRK-9012",
    driverName: "David Johnson",
    transporterName: "Express Delivery",
    deliveryDate: new Date(2025, 3, 19), // April 19, 2025
    deliveryAddress: "789 Corporate Plaza, Business Park, BP 45678",
    deliveryStatus: "pending",
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 18)
  }
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: "PAY1001",
    customer: mockCustomers[0],
    date: new Date(2025, 3, 20), // April 20, 2025
    amount: 2500.00,
    paymentMethod: "bank_transfer",
    reference: "TRF98765432",
    description: "Payment for Invoice INV-1001",
    invoiceIds: ["INV1001"],
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 20)
  },
  {
    id: "PAY1002",
    customer: mockCustomers[1],
    date: new Date(2025, 3, 25), // April 25, 2025
    amount: 1750.50,
    paymentMethod: "credit_card",
    reference: "CC-AUTH-12345",
    description: "Credit card payment",
    invoiceIds: ["INV1002"],
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 25)
  },
  {
    id: "PAY1003",
    customer: mockCustomers[2],
    date: new Date(2025, 4, 1), // May 1, 2025
    amount: 3000.00,
    paymentMethod: "cash",
    description: "Cash payment for monthly retainer",
    invoiceIds: ["RET1001"],
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 1)
  },
  {
    id: "PAY1004",
    customer: mockCustomers[3],
    date: new Date(2025, 4, 5), // May 5, 2025
    amount: 500.00,
    paymentMethod: "online",
    reference: "PAYPAL-87654321",
    description: "Online payment via PayPal",
    invoiceIds: ["INV1005"],
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 5)
  },
  {
    id: "PAY1005",
    customer: mockCustomers[4],
    date: new Date(2025, 4, 10), // May 10, 2025
    amount: 1250.75,
    paymentMethod: "check",
    reference: "CHECK #4567",
    description: "Check payment for creative services",
    invoiceIds: ["INV1006", "INV1007"],
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 10)
  }
];

// Mock Recurring Invoices
export const mockRecurringInvoices: RecurringInvoice[] = [
  {
    id: "REC1001",
    number: "REC-1001",
    customer: mockCustomers[0],
    date: new Date(2025, 3, 1), // April 1, 2025
    dueDate: new Date(2025, 3, 15), // April 15, 2025
    paymentDue: new Date(2025, 3, 15),
    paymentTerms: "Net 15",
    items: createSalesItems(2),
    ...calculateTotals(createSalesItems(2)),
    notes: "Monthly subscription service",
    termsAndConditions: "Standard terms apply",
    paymentStatus: "unpaid",
    amountPaid: 0,
    balanceDue: calculateTotals(createSalesItems(2)).total,
    recurrenceInterval: "monthly",
    nextGenerationDate: new Date(2025, 4, 1), // May 1, 2025
    remainingOccurrences: 11, // For a 12-month contract
    isActive: true,
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 1)
  },
  {
    id: "REC1002",
    number: "REC-1002",
    customer: mockCustomers[1],
    date: new Date(2025, 3, 5), // April 5, 2025
    dueDate: new Date(2025, 3, 20), // April 20, 2025
    paymentDue: new Date(2025, 3, 20),
    paymentTerms: "Net 15",
    items: createSalesItems(1),
    ...calculateTotals(createSalesItems(1)),
    notes: "Weekly maintenance service",
    termsAndConditions: "Standard terms apply",
    paymentStatus: "unpaid",
    amountPaid: 0,
    balanceDue: calculateTotals(createSalesItems(1)).total,
    recurrenceInterval: "weekly",
    nextGenerationDate: new Date(2025, 3, 12), // April 12, 2025
    remainingOccurrences: 51, // For a year of weekly services
    isActive: true,
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 5)
  },
  {
    id: "REC1003",
    number: "REC-1003",
    customer: mockCustomers[2],
    date: new Date(2025, 3, 10), // April 10, 2025
    dueDate: new Date(2025, 4, 10), // May 10, 2025
    paymentDue: new Date(2025, 4, 10),
    paymentTerms: "Net 30",
    items: createSalesItems(3),
    ...calculateTotals(createSalesItems(3)),
    notes: "Quarterly consulting services",
    termsAndConditions: "Standard terms apply",
    paymentStatus: "unpaid",
    amountPaid: 0,
    balanceDue: calculateTotals(createSalesItems(3)).total,
    recurrenceInterval: "quarterly",
    nextGenerationDate: new Date(2025, 6, 10), // July 10, 2025
    remainingOccurrences: 0, // Unlimited occurrences
    isActive: false, // Currently paused
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 10)
  },
  {
    id: "REC1004",
    number: "REC-1004",
    customer: mockCustomers[3],
    date: new Date(2025, 3, 15), // April 15, 2025
    dueDate: new Date(2025, 4, 15), // May 15, 2025
    paymentDue: new Date(2025, 4, 15),
    paymentTerms: "Net 30",
    items: createSalesItems(2),
    ...calculateTotals(createSalesItems(2)),
    notes: "Yearly subscription",
    termsAndConditions: "Standard terms apply",
    paymentStatus: "unpaid",
    amountPaid: 0,
    balanceDue: calculateTotals(createSalesItems(2)).total,
    recurrenceInterval: "yearly",
    nextGenerationDate: new Date(2026, 3, 15), // April 15, 2026
    remainingOccurrences: 2, // 3-year contract
    isActive: true,
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 15)
  }
];

// Mock Credit Notes
export const mockCreditNotes: CreditNote[] = [
  {
    id: "CN1001",
    number: "CN-1001",
    customer: mockCustomers[0],
    date: new Date(2025, 3, 25), // April 25, 2025
    dueDate: undefined,
    items: createSalesItems(1),
    ...calculateTotals(createSalesItems(1)),
    reason: "Product returned due to manufacturing defect",
    invoiceId: "INV1001",
    status: "processed",
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 25)
  },
  {
    id: "CN1002",
    number: "CN-1002",
    customer: mockCustomers[1],
    date: new Date(2025, 4, 5), // May 5, 2025
    dueDate: undefined,
    items: createSalesItems(2),
    ...calculateTotals(createSalesItems(2)),
    reason: "Service cancellation",
    invoiceId: "INV1002",
    status: "pending",
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 5)
  },
  {
    id: "CN1003",
    number: "CN-1003",
    customer: mockCustomers[2],
    date: new Date(2025, 4, 10), // May 10, 2025
    dueDate: undefined,
    items: createSalesItems(1),
    ...calculateTotals(createSalesItems(1)),
    reason: "Pricing adjustment",
    status: "issued",
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 10)
  }
];

// Mock Sales Returns
export const mockSalesReturns: SalesReturn[] = [
  {
    id: "SR1001",
    number: "SR-1001",
    customer: mockCustomers[0],
    date: new Date(2025, 3, 28), // April 28, 2025
    dueDate: undefined,
    items: createSalesItems(1),
    ...calculateTotals(createSalesItems(1)),
    reason: "Product arrived damaged in transit",
    invoiceId: "INV1001",
    returnCondition: "damaged",
    restockStatus: "disposed",
    status: "processed",
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 28)
  },
  {
    id: "SR1002",
    number: "SR-1002",
    customer: mockCustomers[1],
    date: new Date(2025, 4, 8), // May 8, 2025
    dueDate: undefined,
    items: createSalesItems(2),
    ...calculateTotals(createSalesItems(2)),
    reason: "Wrong items were shipped",
    invoiceId: "INV1002",
    returnCondition: "wrong_item",
    restockStatus: "restocked",
    status: "processed",
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 8)
  },
  {
    id: "SR1003",
    number: "SR-1003",
    customer: mockCustomers[2],
    date: new Date(2025, 4, 12), // May 12, 2025
    dueDate: undefined,
    items: createSalesItems(1),
    ...calculateTotals(createSalesItems(1)),
    reason: "Item does not match description",
    invoiceId: "INV1005",
    returnCondition: "not_as_described",
    restockStatus: "pending",
    status: "pending",
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 12)
  },
  {
    id: "SR1004",
    number: "SR-1004",
    customer: mockCustomers[3],
    date: new Date(2025, 4, 15), // May 15, 2025
    dueDate: undefined,
    items: createSalesItems(3),
    ...calculateTotals(createSalesItems(3)),
    reason: "Customer ordered wrong size",
    invoiceId: "INV1006",
    returnCondition: "other",
    restockStatus: "restocked",
    status: "pending",
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 15)
  }
];

// Mock Receipts
export const mockReceipts: Receipt[] = [
  {
    id: "RCP1001",
    number: "RCP-1001",
    customer: mockCustomers[0],
    date: new Date(2025, 3, 20), // April 20, 2025
    paymentId: "PAY1001",
    amount: 2500.00,
    paymentMethod: "bank_transfer",
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 20)
  },
  {
    id: "RCP1002",
    number: "RCP-1002",
    customer: mockCustomers[1],
    date: new Date(2025, 3, 25), // April 25, 2025
    paymentId: "PAY1002",
    amount: 1750.50,
    paymentMethod: "credit_card",
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 25)
  },
  {
    id: "RCP1003",
    number: "RCP-1003",
    customer: mockCustomers[2],
    date: new Date(2025, 4, 1), // May 1, 2025
    paymentId: "PAY1003",
    amount: 3000.00,
    paymentMethod: "cash",
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 1)
  },
  {
    id: "RCP1004",
    number: "RCP-1004",
    customer: mockCustomers[3],
    date: new Date(2025, 4, 5), // May 5, 2025
    paymentId: "PAY1004",
    amount: 500.00,
    paymentMethod: "online",
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 5)
  },
  {
    id: "RCP1005",
    number: "RCP-1005",
    customer: mockCustomers[4],
    date: new Date(2025, 4, 10), // May 10, 2025
    paymentId: "PAY1005",
    amount: 1250.75,
    paymentMethod: "check",
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 10)
  }
];

// Mock Debit Notes
export const mockDebitNotes: DebitNote[] = [
  {
    id: "DN1001",
    number: "DN-1001",
    customer: mockCustomers[0],
    date: new Date(2025, 3, 25), // April 25, 2025
    dueDate: undefined,
    items: createSalesItems(1),
    ...calculateTotals(createSalesItems(1)),
    reason: "Overcharged for services",
    purchaseInvoiceId: "PINV1001",
    status: "processed",
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 25)
  },
  {
    id: "DN1002",
    number: "DN-1002",
    customer: mockCustomers[1],
    date: new Date(2025, 4, 5), // May 5, 2025
    dueDate: undefined,
    items: createSalesItems(2),
    ...calculateTotals(createSalesItems(2)),
    reason: "Billing adjustment for incorrect pricing",
    purchaseInvoiceId: "PINV1002",
    status: "pending",
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 5)
  },
  {
    id: "DN1003",
    number: "DN-1003",
    customer: mockCustomers[2],
    date: new Date(2025, 4, 10), // May 10, 2025
    dueDate: undefined,
    items: createSalesItems(1),
    ...calculateTotals(createSalesItems(1)),
    reason: "Defective product replacement",
    status: "issued",
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 10)
  },
  {
    id: "DN1004",
    number: "DN-1004",
    customer: mockCustomers[3],
    date: new Date(2025, 4, 15), // May 15, 2025
    dueDate: undefined,
    items: createSalesItems(3),
    ...calculateTotals(createSalesItems(3)),
    reason: "Tax calculation error correction",
    purchaseInvoiceId: "PINV1003",
    status: "draft",
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 15)
  }
];

// Export functions to access mock data
export const getCustomers = () => mockCustomers;
export const getEstimates = () => mockEstimates;
export const getInvoices = () => mockInvoices;
export const getRetainerInvoices = () => mockRetainerInvoices;
export const getSalesOrders = () => mockSalesOrders;
export const getDeliveryChallans = () => mockDeliveryChallans;
export const getPayments = () => mockPayments;
export const getRecurringInvoices = () => mockRecurringInvoices;

// Export function for credit notes
export const getCreditNotes = () => mockCreditNotes;

// Export function for sales returns
export const getSalesReturns = () => mockSalesReturns;

// Export function for receipts
export const getReceipts = () => mockReceipts;

// Export function for debit notes
export const getDebitNotes = () => mockDebitNotes;

// Additional export functions for other document types would be defined here
