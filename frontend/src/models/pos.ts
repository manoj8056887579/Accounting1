
// POS Data Models
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  tax_rate: number;
  stock_quantity: number;
  category?: string;
  image_url?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
}

export interface SalesOrder {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  items: CartItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: 'cash' | 'card' | 'upi' | 'split';
  payment_details: {
    cash_amount?: number;
    card_amount?: number;
    upi_amount?: number;
    reference?: string;
  };
  paid_amount: number;
  due_amount: number;
  status: 'paid' | 'partially_paid' | 'hold';
  created_by: string;
  created_at: string;
}

export interface Receipt {
  id: string;
  order_id: string;
  amount: number;
  payment_mode: string;
  received_by: string;
  received_at: string;
}

export interface DaySummary {
  date: string;
  total_sales: number;
  cash_sales: number;
  card_sales: number;
  upi_sales: number;
  total_items_sold: number;
  total_orders: number;
  total_discounts: number;
  total_taxes: number;
}
