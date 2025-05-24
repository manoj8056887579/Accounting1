
import React, { createContext, useContext, useReducer, useState } from 'react';
import { CartItem, Customer, Product, SalesOrder } from '@/models/pos';
import { toast } from 'sonner';
import { findProduct, generateInvoiceNumber, mockCustomers } from '@/data/mockProducts';

// Define the state interface
interface POSState {
  cart: CartItem[];
  customer: Customer | null;
  globalDiscount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'split';
  cashAmount: number;
  cardAmount: number;
  upiAmount: number;
  reference: string;
  heldSales: SalesOrder[];
}

// Define the action types
type POSAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'UPDATE_ITEM_DISCOUNT'; payload: { productId: string; discountPercent: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'SET_CUSTOMER'; payload: { customer: Customer | null } }
  | { type: 'SET_GLOBAL_DISCOUNT'; payload: { amount: number } }
  | { type: 'SET_PAYMENT_METHOD'; payload: { method: 'cash' | 'card' | 'upi' | 'split' } }
  | { type: 'SET_PAYMENT_AMOUNT'; payload: { field: 'cashAmount' | 'cardAmount' | 'upiAmount', value: number } }
  | { type: 'SET_REFERENCE'; payload: { value: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'HOLD_SALE'; payload: { sale: SalesOrder } }
  | { type: 'RESUME_SALE'; payload: { saleId: string } };

// Initial state
const initialState: POSState = {
  cart: [],
  customer: mockCustomers[2], // Default to walk-in customer
  globalDiscount: 0,
  paymentMethod: 'cash',
  cashAmount: 0,
  cardAmount: 0,
  upiAmount: 0,
  reference: '',
  heldSales: []
};

// Helper functions for calculations
function calculateItemTotal(item: CartItem): number {
  const priceAfterDiscount = item.unit_price * (1 - item.discount_percent / 100);
  const taxAmount = priceAfterDiscount * (item.tax_rate / 100);
  return (priceAfterDiscount + taxAmount) * item.quantity;
}

function recalculateCartItem(item: CartItem): CartItem {
  const priceAfterDiscount = item.unit_price * (1 - item.discount_percent / 100);
  const taxAmount = priceAfterDiscount * (item.tax_rate / 100);
  
  return {
    ...item,
    discount_amount: (item.unit_price * item.discount_percent / 100) * item.quantity,
    tax_amount: taxAmount * item.quantity,
    total: (priceAfterDiscount + taxAmount) * item.quantity
  };
}

// Reducer function
function posReducer(state: POSState, action: POSAction): POSState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.cart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex > -1) {
        // Update existing item
        const updatedCart = [...state.cart];
        const item = updatedCart[existingItemIndex];
        const newQuantity = item.quantity + quantity;
        
        if (newQuantity > product.stock_quantity) {
          toast.error(`Cannot add more than available stock (${product.stock_quantity})`);
          return state;
        }
        
        updatedCart[existingItemIndex] = recalculateCartItem({
          ...item,
          quantity: newQuantity
        });
        
        return { ...state, cart: updatedCart };
      } else {
        // Add new item
        if (quantity > product.stock_quantity) {
          toast.error(`Cannot add more than available stock (${product.stock_quantity})`);
          return state;
        }
        
        const newItem: CartItem = {
          product,
          quantity,
          unit_price: product.price,
          discount_percent: 0,
          discount_amount: 0,
          tax_rate: product.tax_rate,
          tax_amount: (product.price * product.tax_rate / 100) * quantity,
          total: (product.price + (product.price * product.tax_rate / 100)) * quantity
        };
        
        return { ...state, cart: [...state.cart, newItem] };
      }
    }
    
    case 'UPDATE_ITEM_QUANTITY': {
      const { productId, quantity } = action.payload;
      const updatedCart = state.cart.map(item => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock_quantity) {
            toast.error(`Cannot add more than available stock (${item.product.stock_quantity})`);
            return item;
          }
          return recalculateCartItem({ ...item, quantity });
        }
        return item;
      });
      
      return { ...state, cart: updatedCart };
    }
    
    case 'UPDATE_ITEM_DISCOUNT': {
      const { productId, discountPercent } = action.payload;
      
      if (discountPercent < 0 || discountPercent > 100) {
        toast.error('Discount must be between 0 and 100%');
        return state;
      }
      
      const updatedCart = state.cart.map(item => {
        if (item.product.id === productId) {
          return recalculateCartItem({ ...item, discount_percent: discountPercent });
        }
        return item;
      });
      
      return { ...state, cart: updatedCart };
    }
    
    case 'REMOVE_FROM_CART': {
      const { productId } = action.payload;
      const updatedCart = state.cart.filter(item => item.product.id !== productId);
      
      return { ...state, cart: updatedCart };
    }
    
    case 'SET_CUSTOMER': {
      return { ...state, customer: action.payload.customer };
    }
    
    case 'SET_GLOBAL_DISCOUNT': {
      const { amount } = action.payload;
      
      if (amount < 0 || amount > 100) {
        toast.error('Discount must be between 0 and 100%');
        return state;
      }
      
      return { ...state, globalDiscount: amount };
    }
    
    case 'SET_PAYMENT_METHOD': {
      return { ...state, paymentMethod: action.payload.method };
    }
    
    case 'SET_PAYMENT_AMOUNT': {
      const { field, value } = action.payload;
      return { ...state, [field]: value };
    }
    
    case 'SET_REFERENCE': {
      return { ...state, reference: action.payload.value };
    }
    
    case 'CLEAR_CART': {
      return { 
        ...state, 
        cart: [], 
        globalDiscount: 0, 
        paymentMethod: 'cash',
        cashAmount: 0,
        cardAmount: 0,
        upiAmount: 0,
        reference: '',
        customer: mockCustomers[2] // Reset to walk-in customer
      };
    }
    
    case 'HOLD_SALE': {
      return { ...state, heldSales: [...state.heldSales, action.payload.sale] };
    }
    
    case 'RESUME_SALE': {
      const { saleId } = action.payload;
      const sale = state.heldSales.find(s => s.id === saleId);
      const remainingHeldSales = state.heldSales.filter(s => s.id !== saleId);
      
      if (!sale) {
        toast.error('Sale not found');
        return state;
      }
      
      const customer = sale.customer_id 
        ? mockCustomers.find(c => c.id === sale.customer_id) || null
        : mockCustomers[2]; // walk-in customer
      
      return {
        ...state,
        cart: sale.items,
        customer,
        globalDiscount: (sale.discount_amount / sale.subtotal) * 100,
        heldSales: remainingHeldSales
      };
    }
    
    default:
      return state;
  }
}

// Create context
interface POSContextType {
  state: POSState;
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateDiscount: (productId: string, discountPercent: number) => void;
  removeFromCart: (productId: string) => void;
  setCustomer: (customer: Customer | null) => void;
  setGlobalDiscount: (amount: number) => void;
  setPaymentMethod: (method: 'cash' | 'card' | 'upi' | 'split') => void;
  setPaymentAmount: (field: 'cashAmount' | 'cardAmount' | 'upiAmount', value: number) => void;
  setReference: (value: string) => void;
  clearCart: () => void;
  holdSale: () => void;
  resumeSale: (saleId: string) => void;
  completeSale: () => void;
  findProductBySearch: (query: string) => Product | undefined;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateDiscount: () => number;
  calculateTotal: () => number;
  calculateTotalItems: () => number;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

// Provider component
export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(posReducer, initialState);
  const [salesHistory, setSalesHistory] = useState<SalesOrder[]>([]);
  
  const addToCart = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { productId, quantity } });
  };
  
  const updateDiscount = (productId: string, discountPercent: number) => {
    dispatch({ type: 'UPDATE_ITEM_DISCOUNT', payload: { productId, discountPercent } });
  };
  
  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };
  
  const setCustomer = (customer: Customer | null) => {
    dispatch({ type: 'SET_CUSTOMER', payload: { customer } });
  };
  
  const setGlobalDiscount = (amount: number) => {
    dispatch({ type: 'SET_GLOBAL_DISCOUNT', payload: { amount } });
  };
  
  const setPaymentMethod = (method: 'cash' | 'card' | 'upi' | 'split') => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: { method } });
  };
  
  const setPaymentAmount = (field: 'cashAmount' | 'cardAmount' | 'upiAmount', value: number) => {
    dispatch({ type: 'SET_PAYMENT_AMOUNT', payload: { field, value } });
  };
  
  const setReference = (value: string) => {
    dispatch({ type: 'SET_REFERENCE', payload: { value } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const findProductBySearch = (query: string): Product | undefined => {
    return findProduct(query);
  };
  
  const calculateSubtotal = (): number => {
    return state.cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  };
  
  const calculateTax = (): number => {
    return state.cart.reduce((sum, item) => sum + item.tax_amount, 0);
  };
  
  const calculateDiscount = (): number => {
    const itemDiscounts = state.cart.reduce((sum, item) => sum + item.discount_amount, 0);
    const subtotal = calculateSubtotal();
    const globalDiscountAmount = (subtotal - itemDiscounts) * (state.globalDiscount / 100);
    return itemDiscounts + globalDiscountAmount;
  };
  
  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const discount = calculateDiscount();
    return subtotal - discount + tax;
  };
  
  const calculateTotalItems = (): number => {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
  };
  
  const holdSale = () => {
    if (state.cart.length === 0) {
      toast.error('Cannot hold an empty cart');
      return;
    }
    
    const subtotal = calculateSubtotal();
    const taxAmount = calculateTax();
    const discountAmount = calculateDiscount();
    const totalAmount = calculateTotal();
    
    const sale: SalesOrder = {
      id: `hold-${Date.now()}`,
      order_number: generateInvoiceNumber(),
      customer_id: state.customer?.id,
      customer_name: state.customer?.name || 'Walk-in Customer',
      items: state.cart,
      subtotal,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      payment_method: state.paymentMethod,
      payment_details: {
        cash_amount: state.cashAmount,
        card_amount: state.cardAmount,
        upi_amount: state.upiAmount,
        reference: state.reference
      },
      paid_amount: 0,
      due_amount: totalAmount,
      status: 'hold',
      created_by: 'current-user', // In a real app, get from auth context
      created_at: new Date().toISOString()
    };
    
    dispatch({ type: 'HOLD_SALE', payload: { sale } });
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Sale put on hold successfully');
  };
  
  const resumeSale = (saleId: string) => {
    dispatch({ type: 'RESUME_SALE', payload: { saleId } });
  };
  
  const completeSale = () => {
    if (state.cart.length === 0) {
      toast.error('Cannot complete an empty cart');
      return;
    }
    
    const subtotal = calculateSubtotal();
    const taxAmount = calculateTax();
    const discountAmount = calculateDiscount();
    const totalAmount = calculateTotal();
    
    let paidAmount = 0;
    
    if (state.paymentMethod === 'cash') {
      paidAmount = state.cashAmount;
    } else if (state.paymentMethod === 'card') {
      paidAmount = state.cardAmount;
    } else if (state.paymentMethod === 'upi') {
      paidAmount = state.upiAmount;
    } else if (state.paymentMethod === 'split') {
      paidAmount = state.cashAmount + state.cardAmount + state.upiAmount;
    }
    
    if (paidAmount < totalAmount) {
      toast.error('Payment amount is less than the total');
      return;
    }
    
    const sale: SalesOrder = {
      id: `sale-${Date.now()}`,
      order_number: generateInvoiceNumber(),
      customer_id: state.customer?.id,
      customer_name: state.customer?.name || 'Walk-in Customer',
      items: state.cart,
      subtotal,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      payment_method: state.paymentMethod,
      payment_details: {
        cash_amount: state.cashAmount,
        card_amount: state.cardAmount,
        upi_amount: state.upiAmount,
        reference: state.reference
      },
      paid_amount: paidAmount,
      due_amount: totalAmount - paidAmount,
      status: paidAmount >= totalAmount ? 'paid' : 'partially_paid',
      created_by: 'current-user', // In a real app, get from auth context
      created_at: new Date().toISOString()
    };
    
    setSalesHistory(prev => [...prev, sale]);
    clearCart();
    toast.success('Sale completed successfully');
    return sale;
  };
  
  return (
    <POSContext.Provider value={{
      state,
      addToCart,
      updateQuantity,
      updateDiscount,
      removeFromCart,
      setCustomer,
      setGlobalDiscount,
      setPaymentMethod,
      setPaymentAmount,
      setReference,
      clearCart,
      holdSale,
      resumeSale,
      completeSale,
      findProductBySearch,
      calculateSubtotal,
      calculateTax,
      calculateDiscount,
      calculateTotal,
      calculateTotalItems
    }}>
      {children}
    </POSContext.Provider>
  );
};

// Custom hook to use the POS context
export const usePOS = () => {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
