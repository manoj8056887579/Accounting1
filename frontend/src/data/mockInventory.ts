
import { ProductCategory, StockMovement, StockMovementType, MovementReason } from "@/models/inventory";
import { mockProducts } from "./mockProducts";

export const mockCategories: ProductCategory[] = [
  {
    id: "1",
    name: "Electronics",
    description: "Electronic devices and gadgets",
    productCount: 5
  },
  {
    id: "2",
    name: "Accessories",
    description: "Computer and phone accessories",
    productCount: 3
  },
  {
    id: "3",
    name: "Cables",
    description: "Various cables and adapters",
    productCount: 2
  }
];

// Generate realistic stock movements for the past 30 days
export const mockStockMovements: StockMovement[] = [];

// Helper function to create a random date within the last 30 days
const getRandomDate = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
};

// Generate mock stock movements
mockProducts.forEach(product => {
  // Add 2-5 movements per product
  const movementCount = 2 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < movementCount; i++) {
    const date = getRandomDate();
    const types: StockMovementType[] = ['purchase', 'sale', 'adjustment', 'return', 'transfer'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Determine reason based on type (ensuring reason is compatible with type)
    let reason: MovementReason;
    switch (type) {
      case 'purchase':
        reason = 'purchase';
        break;
      case 'sale':
        reason = 'sale';
        break;
      case 'return':
        reason = 'return';
        break;
      case 'transfer':
        reason = 'transfer';
        break;
      case 'adjustment':
        // For adjustment, randomly pick between 'damage' and 'correction'
        reason = Math.random() > 0.5 ? 'damage' : 'correction';
        break;
      default:
        reason = 'correction'; // Fallback
    }
    
    let quantity = 0;
    if (type === 'purchase' || type === 'return') {
      quantity = 1 + Math.floor(Math.random() * 10);
    } else if (type === 'sale') {
      quantity = -(1 + Math.floor(Math.random() * 5));
    } else if (type === 'adjustment') {
      quantity = Math.random() > 0.5 ? (1 + Math.floor(Math.random() * 3)) : -(1 + Math.floor(Math.random() * 3));
    } else if (type === 'transfer') {
      quantity = Math.random() > 0.5 ? 1 : -1;
    }
    
    // Base stock level (this is just for demo data generation)
    const baseStock = 10;
    
    mockStockMovements.push({
      id: `mov-${product.id}-${i}`,
      productId: product.id,
      date,
      type,
      reason, // Add the required reason property
      quantity,
      beforeQuantity: baseStock + (i > 0 ? quantity : 0),
      afterQuantity: baseStock + quantity,
      reference: type === 'sale' ? `INV-${1000 + Math.floor(Math.random() * 9000)}` : 
                 type === 'purchase' ? `PO-${1000 + Math.floor(Math.random() * 9000)}` : undefined,
      notes: type === 'adjustment' ? 'Inventory count adjustment' : undefined,
      createdBy: 'Admin User',
      createdAt: date,
    });
  }
});

// Sort movements by date (newest first)
mockStockMovements.sort((a, b) => b.date.getTime() - a.date.getTime());

export const getProductCategories = (): ProductCategory[] => {
  return mockCategories;
}

export const getProductMovements = (productId: string): StockMovement[] => {
  return mockStockMovements.filter(movement => movement.productId === productId);
}
