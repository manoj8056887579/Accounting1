
import { 
  Customer, 
  Vendor, 
  CRMActivity, 
  AILeadScore,
  Campaign
} from '@/models/crm';
import { generateId } from '@/lib/utils';

// Helper function to generate dates
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: generateId(),
    name: 'Acme Corporation',
    email: 'john@acmecorp.com',
    phone: '555-123-4567',
    address: '123 Business Ave, New York, NY 10001',
    gst_number: 'GST12345678',
    customer_type: 'Corporate',
    credit_limit: 50000,
    opening_balance: 0,
    status: 'active',
    created_at: daysAgo(90),
    last_order_date: daysAgo(5),
    total_orders: 12,
    total_spent: 45678.90
  },
  {
    id: generateId(),
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    address: '456 Main St, Chicago, IL 60601',
    customer_type: 'Retail',
    credit_limit: 1000,
    opening_balance: 0,
    status: 'active',
    created_at: daysAgo(60),
    last_order_date: daysAgo(1),
    total_orders: 8,
    total_spent: 1256.75
  },
  {
    id: generateId(),
    name: 'Metro Wholesalers',
    email: 'orders@metrowholesale.com',
    phone: '555-456-7890',
    address: '789 Distribution Blvd, Los Angeles, CA 90023',
    gst_number: 'GST98765432',
    customer_type: 'Wholesale',
    credit_limit: 100000,
    opening_balance: 12000,
    status: 'active',
    created_at: daysAgo(120),
    last_order_date: daysAgo(3),
    total_orders: 36,
    total_spent: 187432.56
  },
  {
    id: generateId(),
    name: 'Tech Solutions Inc.',
    email: 'contact@techsolutions.com',
    phone: '555-789-0123',
    address: '101 Innovation Way, San Francisco, CA 94105',
    gst_number: 'GST45678901',
    customer_type: 'Corporate',
    credit_limit: 75000,
    opening_balance: 0,
    status: 'active',
    created_at: daysAgo(75),
    last_order_date: daysAgo(12),
    total_orders: 9,
    total_spent: 34567.89
  },
  {
    id: generateId(),
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    phone: '555-234-5678',
    address: '202 Park Ave, Miami, FL 33101',
    customer_type: 'Retail',
    credit_limit: 2000,
    opening_balance: 500,
    status: 'inactive',
    created_at: daysAgo(150),
    last_order_date: daysAgo(60),
    total_orders: 3,
    total_spent: 875.25
  },
  {
    id: generateId(),
    name: 'Global Traders LLC',
    email: 'info@globaltraders.com',
    phone: '555-345-6789',
    address: '303 International Dr, Atlanta, GA 30306',
    gst_number: 'GST56789012',
    customer_type: 'Wholesale',
    credit_limit: 80000,
    opening_balance: 15000,
    status: 'active',
    created_at: daysAgo(110),
    last_order_date: daysAgo(7),
    total_orders: 24,
    total_spent: 142789.67
  },
  {
    id: generateId(),
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    phone: '555-456-7890',
    address: '404 Residential Lane, Dallas, TX 75201',
    customer_type: 'Retail',
    credit_limit: 1500,
    opening_balance: 0,
    status: 'active',
    created_at: daysAgo(30),
    last_order_date: daysAgo(2),
    total_orders: 5,
    total_spent: 2345.50
  }
];

// Mock Vendors
export const mockVendors: Vendor[] = [
  {
    id: generateId(),
    name: 'Global Supplies Co.',
    email: 'orders@globalsupplies.com',
    phone: '555-111-2222',
    address: '100 Supplier Rd, Chicago, IL 60602',
    gst_number: 'GST11223344',
    opening_balance: 0,
    status: 'active',
    created_at: daysAgo(180),
    last_order_date: daysAgo(8),
    total_orders: 15,
    total_spent: 78900.45
  },
  {
    id: generateId(),
    name: 'Quality Electronics Ltd.',
    email: 'sales@qualityelectronics.com',
    phone: '555-222-3333',
    address: '200 Component Ave, San Jose, CA 95112',
    gst_number: 'GST22334455',
    opening_balance: 5000,
    status: 'active',
    created_at: daysAgo(150),
    last_order_date: daysAgo(3),
    total_orders: 22,
    total_spent: 134567.89
  },
  {
    id: generateId(),
    name: 'Fresh Produce Distributors',
    email: 'orders@freshproduce.com',
    phone: '555-333-4444',
    address: '300 Harvest Rd, Orlando, FL 32801',
    gst_number: 'GST33445566',
    opening_balance: 0,
    status: 'active',
    created_at: daysAgo(210),
    last_order_date: daysAgo(1),
    total_orders: 45,
    total_spent: 67890.12
  },
  {
    id: generateId(),
    name: 'Packaging Solutions Inc.',
    email: 'info@packagingsolutions.com',
    phone: '555-444-5555',
    address: '400 Box Lane, Seattle, WA 98101',
    gst_number: 'GST44556677',
    opening_balance: 2000,
    status: 'inactive',
    created_at: daysAgo(120),
    last_order_date: daysAgo(90),
    total_orders: 8,
    total_spent: 23456.78
  },
  {
    id: generateId(),
    name: 'Industrial Parts Manufacturing',
    email: 'orders@industrialparts.com',
    phone: '555-555-6666',
    address: '500 Factory Blvd, Detroit, MI 48201',
    gst_number: 'GST55667788',
    opening_balance: 10000,
    status: 'active',
    created_at: daysAgo(240),
    last_order_date: daysAgo(15),
    total_orders: 18,
    total_spent: 98765.43
  }
];

// Mock CRM Activities
export const mockActivities: CRMActivity[] = [
  {
    id: generateId(),
    type: 'call',
    subject: 'Quarterly Review Call',
    notes: 'Discussed upcoming product needs and addressed recent delivery issues.',
    related_id: mockCustomers[0].id,
    related_name: mockCustomers[0].name,
    related_type: 'customer',
    assigned_to: 'user123',
    assigned_to_name: 'Alex Johnson',
    status: 'completed',
    due_date: daysAgo(5),
    created_at: daysAgo(10)
  },
  {
    id: generateId(),
    type: 'email',
    subject: 'New Product Catalog',
    notes: 'Sent updated product catalog with special pricing for wholesale customers.',
    related_id: mockCustomers[2].id,
    related_name: mockCustomers[2].name,
    related_type: 'customer',
    assigned_to: 'user456',
    assigned_to_name: 'Maria Garcia',
    status: 'completed',
    due_date: daysAgo(8),
    created_at: daysAgo(8)
  },
  {
    id: generateId(),
    type: 'meeting',
    subject: 'Contract Negotiation',
    notes: 'Meeting scheduled to discuss terms for annual supply contract.',
    related_id: mockVendors[1].id,
    related_name: mockVendors[1].name,
    related_type: 'vendor',
    assigned_to: 'user789',
    assigned_to_name: 'David Wilson',
    status: 'scheduled',
    due_date: daysAgo(-3), // Future date
    created_at: daysAgo(2)
  },
  {
    id: generateId(),
    type: 'whatsapp',
    subject: 'Order Status Update',
    notes: 'Sent WhatsApp message regarding shipping status of recent order.',
    related_id: mockCustomers[6].id,
    related_name: mockCustomers[6].name,
    related_type: 'customer',
    assigned_to: 'user123',
    assigned_to_name: 'Alex Johnson',
    status: 'completed',
    due_date: daysAgo(1),
    created_at: daysAgo(1)
  },
  {
    id: generateId(),
    type: 'task',
    subject: 'Credit Limit Review',
    notes: 'Review credit history and consider increasing limit based on payment history.',
    related_id: mockCustomers[3].id,
    related_name: mockCustomers[3].name,
    related_type: 'customer',
    assigned_to: 'user456',
    assigned_to_name: 'Maria Garcia',
    status: 'open',
    due_date: daysAgo(-2), // Future date
    created_at: daysAgo(4)
  },
  {
    id: generateId(),
    type: 'call',
    subject: 'Payment Follow-up',
    notes: 'Call to remind about overdue payment for invoice #INV-2023-05678.',
    related_id: mockCustomers[5].id,
    related_name: mockCustomers[5].name,
    related_type: 'customer',
    assigned_to: 'user789',
    assigned_to_name: 'David Wilson',
    status: 'open',
    due_date: daysAgo(0), // Today
    created_at: daysAgo(3)
  },
  {
    id: generateId(),
    type: 'meeting',
    subject: 'Quality Control Discussion',
    notes: 'Meeting to address recent quality issues with supplied components.',
    related_id: mockVendors[4].id,
    related_name: mockVendors[4].name,
    related_type: 'vendor',
    assigned_to: 'user123',
    assigned_to_name: 'Alex Johnson',
    status: 'scheduled',
    due_date: daysAgo(-5), // Future date
    created_at: daysAgo(2)
  }
];

// Mock AI Lead Scores
export const mockLeadScores: AILeadScore[] = [
  {
    id: generateId(),
    customer_id: mockCustomers[0].id,
    customer_name: mockCustomers[0].name,
    score: 85,
    reason: 'High-value corporate client with consistent ordering pattern',
    purchase_frequency_score: 80,
    order_value_score: 90,
    recency_score: 95,
    communication_score: 75,
    generated_on: daysAgo(1)
  },
  {
    id: generateId(),
    customer_id: mockCustomers[1].id,
    customer_name: mockCustomers[1].name,
    score: 75,
    reason: 'Regular retail customer with recent purchases',
    purchase_frequency_score: 70,
    order_value_score: 60,
    recency_score: 100,
    communication_score: 70,
    generated_on: daysAgo(1)
  },
  {
    id: generateId(),
    customer_id: mockCustomers[2].id,
    customer_name: mockCustomers[2].name,
    score: 95,
    reason: 'Top-tier wholesale client with high volume and frequency',
    purchase_frequency_score: 100,
    order_value_score: 95,
    recency_score: 90,
    communication_score: 85,
    generated_on: daysAgo(1)
  },
  {
    id: generateId(),
    customer_id: mockCustomers[3].id,
    customer_name: mockCustomers[3].name,
    score: 65,
    reason: 'Corporate client with declining order frequency',
    purchase_frequency_score: 50,
    order_value_score: 85,
    recency_score: 60,
    communication_score: 65,
    generated_on: daysAgo(1)
  },
  {
    id: generateId(),
    customer_id: mockCustomers[4].id,
    customer_name: mockCustomers[4].name,
    score: 35,
    reason: 'Inactive retail customer, no recent orders',
    purchase_frequency_score: 20,
    order_value_score: 40,
    recency_score: 10,
    communication_score: 70,
    generated_on: daysAgo(1)
  },
  {
    id: generateId(),
    customer_id: mockCustomers[5].id,
    customer_name: mockCustomers[5].name,
    score: 80,
    reason: 'Wholesale client with good order value but payment delays',
    purchase_frequency_score: 75,
    order_value_score: 90,
    recency_score: 80,
    communication_score: 65,
    generated_on: daysAgo(1)
  },
  {
    id: generateId(),
    customer_id: mockCustomers[6].id,
    customer_name: mockCustomers[6].name,
    score: 70,
    reason: 'New retail customer with promising initial order pattern',
    purchase_frequency_score: 60,
    order_value_score: 65,
    recency_score: 95,
    communication_score: 80,
    generated_on: daysAgo(1)
  }
];

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: generateId(),
    name: 'Summer Sale Promotion',
    type: 'email',
    subject: 'Special Summer Discounts Inside! Limited Time Offer',
    content: 'Dear {customer_name},\n\nSummer is here and so are our amazing discounts! Enjoy up to 30% off on all our seasonal products. Order now to avoid missing out!\n\nBest regards,\nYour Company',
    target_segment: 'All Active Customers',
    scheduled_date: daysAgo(-5), // Future date
    status: 'scheduled',
    recipients_count: 150,
    created_at: daysAgo(2),
    created_by: 'Admin User'
  },
  {
    id: generateId(),
    name: 'Inactive Customer Re-engagement',
    type: 'email',
    subject: 'We Miss You! Come Back for a Special Offer',
    content: 'Hello {customer_name},\n\nIt\'s been a while since your last order. We\'d love to welcome you back with a special 15% discount on your next purchase. Simply use code WELCOME15 at checkout.\n\nRegards,\nCustomer Service Team',
    target_segment: 'Inactive Customers (60+ days)',
    scheduled_date: daysAgo(-2), // Future date
    status: 'scheduled',
    recipients_count: 45,
    created_at: daysAgo(3),
    created_by: 'Marketing Manager'
  },
  {
    id: generateId(),
    name: 'New Product Announcement',
    type: 'whatsapp',
    content: 'Hi {customer_name}! We\'re excited to announce our newest product line is now available. Check it out at our store or order online at [website]. Reply for more info!',
    target_segment: 'Premium Customers',
    scheduled_date: daysAgo(5),
    status: 'sent',
    recipients_count: 75,
    open_rate: 68,
    created_at: daysAgo(10),
    created_by: 'Product Manager'
  },
  {
    id: generateId(),
    name: 'Wholesale Price Update',
    type: 'email',
    subject: 'Important: Updated Wholesale Price List',
    content: 'Dear {customer_name},\n\nPlease find attached our updated wholesale price list effective from next month. Please note some changes due to global supply chain adjustments.\n\nFor any questions, contact your account manager.\n\nRegards,\nSales Team',
    target_segment: 'Wholesale Customers',
    scheduled_date: daysAgo(15),
    status: 'completed',
    recipients_count: 28,
    open_rate: 92,
    created_at: daysAgo(20),
    created_by: 'Sales Director'
  },
  {
    id: generateId(),
    name: 'Holiday Greetings',
    type: 'whatsapp',
    content: 'Season\'s Greetings {customer_name}! The entire team at [Company] wishes you happy holidays and a prosperous New Year. We\'re closed from Dec 24-26 and will resume normal operations on Dec 27.',
    target_segment: 'All Customers',
    scheduled_date: daysAgo(-30), // Future date
    status: 'draft',
    recipients_count: 200,
    created_at: daysAgo(2),
    created_by: 'Admin User'
  }
];

// Function to get lead score for a customer
export const getLeadScoreForCustomer = (customerId: string): AILeadScore | undefined => {
  return mockLeadScores.find(score => score.customer_id === customerId);
};

// Function to get activities for a customer or vendor
export const getActivitiesForEntity = (id: string, type: 'customer' | 'vendor'): CRMActivity[] => {
  return mockActivities.filter(activity => activity.related_id === id && activity.related_type === type);
};
