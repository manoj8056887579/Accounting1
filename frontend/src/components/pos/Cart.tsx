
import React from 'react';
import { usePOS } from '@/contexts/POSContext';
import CartItemRow from './CartItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const Cart: React.FC = () => {
  const { 
    state, 
    clearCart,
    calculateSubtotal,
    calculateTax,
    calculateDiscount,
    calculateTotal,
    setGlobalDiscount
  } = usePOS();

  const { cart, globalDiscount } = state;
  
  const handleGlobalDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setGlobalDiscount(value);
  };

  if (cart.length === 0) {
    return (
      <div className="h-[320px] flex items-center justify-center border-2 border-dashed rounded-md bg-gray-50 dark:bg-gray-800/30">
        <div className="text-center">
          <ShoppingBag className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground font-medium">Cart is empty</p>
          <p className="text-xs text-muted-foreground mt-1">
            Search for products or scan a barcode to add items
          </p>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const discount = calculateDiscount();
  const total = calculateTotal();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow border rounded-md overflow-hidden bg-white dark:bg-gray-950">
        <ScrollArea className="h-[320px]">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-muted sticky top-0 z-10">
              <tr className="text-xs">
                <th className="py-2 px-2 text-left font-medium uppercase tracking-wider">
                  Product
                </th>
                <th className="py-2 px-1 text-left font-medium uppercase tracking-wider w-16">
                  Qty
                </th>
                <th className="py-2 px-1 text-right font-medium uppercase tracking-wider w-14">
                  Price
                </th>
                <th className="py-2 px-1 text-right font-medium uppercase tracking-wider w-12">
                  Disc
                </th>
                <th className="py-2 px-1 text-right font-medium uppercase tracking-wider w-16">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
              {cart.map((item) => (
                <CartItemRow key={item.product.id} item={item} />
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>
      
      <div className="mt-3 space-y-2 bg-white dark:bg-gray-950 p-3 rounded-md border">
        <div className="flex justify-between items-center">
          <Label htmlFor="globalDiscount" className="text-sm">Discount (%)</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="globalDiscount"
              type="number"
              min="0"
              max="100"
              value={globalDiscount}
              onChange={handleGlobalDiscountChange}
              className="w-16 h-7 bg-white dark:bg-gray-950 text-sm"
            />
            <span className="text-sm">%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-1 text-xs py-1">
          <div>Subtotal:</div>
          <div className="text-right">₹{subtotal.toFixed(2)}</div>
          
          <div>Tax:</div>
          <div className="text-right">₹{tax.toFixed(2)}</div>
          
          <div>Discount:</div>
          <div className="text-right text-red-500">-₹{discount.toFixed(2)}</div>
          
          <div className="font-bold text-sm">Total:</div>
          <div className="text-right font-bold text-sm">₹{total.toFixed(2)}</div>
        </div>
        
        <div className="pt-1">
          <Button variant="outline" size="sm" onClick={clearCart} className="w-full text-xs h-7">
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

