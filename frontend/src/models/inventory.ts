
import { Product } from './pos';

export type StockMovementType = 'purchase' | 'sale' | 'adjustment' | 'return' | 'transfer';
export type MovementReason = 'purchase' | 'sale' | 'damage' | 'correction' | 'return' | 'transfer';

export interface StockMovement {
  id: string;
  productId: string;
  date: Date;
  type: StockMovementType;
  reason: MovementReason;
  quantity: number;
  beforeQuantity: number;
  afterQuantity: number;
  reference?: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  productCount: number;
}

export interface ProductUnit {
  id: string;
  name: string;
  description?: string;
}

export interface EnhancedProduct extends Product {
  unit?: string;
  cost_price: number;
  reorder_level: number;
  status: 'active' | 'inactive';
  created_at: Date;
}

export interface ProductWithMovements extends EnhancedProduct {
  movements?: StockMovement[];
}
