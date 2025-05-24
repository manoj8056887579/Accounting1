
import { Product } from '@/models/pos';

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Laptop",
    sku: "LT-001",
    barcode: "123456789012",
    price: 999.99,
    tax_rate: 18,
    stock_quantity: 10,
    category: "Electronics"
  },
  {
    id: "2",
    name: "Smartphone",
    sku: "SP-001",
    barcode: "223456789012",
    price: 499.99,
    tax_rate: 18,
    stock_quantity: 15,
    category: "Electronics"
  },
  {
    id: "3",
    name: "Headphones",
    sku: "HP-001",
    barcode: "323456789012",
    price: 99.99,
    tax_rate: 18,
    stock_quantity: 20,
    category: "Electronics"
  },
  {
    id: "4",
    name: "Mouse",
    sku: "MS-001",
    barcode: "423456789012",
    price: 29.99,
    tax_rate: 18,
    stock_quantity: 30,
    category: "Accessories"
  },
  {
    id: "5",
    name: "Keyboard",
    sku: "KB-001",
    barcode: "523456789012",
    price: 49.99,
    tax_rate: 18,
    stock_quantity: 25,
    category: "Accessories"
  },
  {
    id: "6",
    name: "Monitor",
    sku: "MN-001",
    barcode: "623456789012",
    price: 249.99,
    tax_rate: 18,
    stock_quantity: 8,
    category: "Electronics"
  },
  {
    id: "7",
    name: "Tablet",
    sku: "TB-001",
    barcode: "723456789012",
    price: 349.99,
    tax_rate: 18,
    stock_quantity: 12,
    category: "Electronics"
  },
  {
    id: "8",
    name: "USB Cable",
    sku: "UC-001",
    barcode: "823456789012",
    price: 9.99,
    tax_rate: 18,
    stock_quantity: 50,
    category: "Accessories"
  },
  {
    id: "9",
    name: "Power Bank",
    sku: "PB-001",
    barcode: "923456789012",
    price: 59.99,
    tax_rate: 18,
    stock_quantity: 18,
    category: "Electronics"
  },
  {
    id: "10",
    name: "Webcam",
    sku: "WC-001",
    barcode: "023456789012",
    price: 79.99,
    tax_rate: 18,
    stock_quantity: 14,
    category: "Electronics"
  }
];

export const mockCustomers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "9876543210"
  },
  {
    id: "3",
    name: "Walk-in Customer",
    phone: ""
  }
];

// Helper function to find product by barcode or name/SKU
export function findProduct(query: string): Product | undefined {
  const searchTerm = query.toLowerCase().trim();
  
  return mockProducts.find(product => 
    product.barcode === searchTerm || 
    product.name.toLowerCase().includes(searchTerm) || 
    product.sku.toLowerCase().includes(searchTerm)
  );
}

// Generate a unique invoice number
export function generateInvoiceNumber(): string {
  const prefix = "INV";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}
