
// CRM Data Models
export type CustomerType = 'Retail' | 'Wholesale' | 'Corporate';
export type Status = 'active' | 'inactive';
export type ActivityType = 'call' | 'email' | 'whatsapp' | 'meeting' | 'task';
export type ActivityStatus = 'open' | 'completed' | 'scheduled';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gst_number?: string;
  customer_type: CustomerType;
  credit_limit: number;
  opening_balance: number;
  status: Status;
  created_at: string;
  last_order_date?: string;
  total_orders?: number;
  total_spent?: number;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gst_number: string;
  opening_balance: number;
  status: Status;
  created_at: string;
  last_order_date?: string;
  total_orders?: number;
  total_spent?: number;
}

export interface CRMActivity {
  id: string;
  type: ActivityType;
  subject: string;
  notes: string;
  related_id: string; // customer_id or vendor_id
  related_name: string; // customer or vendor name
  related_type: 'customer' | 'vendor';
  assigned_to: string; // user_id
  assigned_to_name: string; // user name
  status: ActivityStatus;
  due_date: string;
  created_at: string;
}

export interface AILeadScore {
  id: string;
  customer_id: string;
  customer_name: string;
  score: number; // 0-100
  reason: string;
  purchase_frequency_score: number;
  order_value_score: number;
  recency_score: number;
  communication_score: number;
  generated_on: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'whatsapp' | 'email';
  subject?: string;
  content: string;
  target_segment: string;
  scheduled_date: string;
  status: 'draft' | 'scheduled' | 'sent' | 'completed';
  recipients_count: number;
  open_rate?: number;
  created_at: string;
  created_by: string;
}
