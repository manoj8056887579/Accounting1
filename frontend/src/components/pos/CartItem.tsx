
import React, { useState } from 'react';
import { CartItem as CartItemType } from '@/models/pos';
import { usePOS } from '@/contexts/POSContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Percent } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CartItemProps {
  item: CartItemType;
}

const CartItemRow: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, updateDiscount, removeFromCart } = usePOS();
  const [discountPercent, setDiscountPercent] = useState(item.discount_percent);
  const [isDiscountPopoverOpen, setIsDiscountPopoverOpen] = useState(false);

  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    } else {
      removeFromCart(item.product.id);
    }
  };

  const handleQuantityIncrease = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };

  const handleApplyDiscount = () => {
    updateDiscount(item.product.id, discountPercent);
    setIsDiscountPopoverOpen(false);
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/50 text-sm">
      <td className="py-1.5 px-2">
        <div className="font-medium text-xs line-clamp-1">{item.product.name}</div>
        <div className="text-xs text-muted-foreground line-clamp-1">SKU: {item.product.sku}</div>
      </td>
      <td className="py-1.5 px-1">
        <div className="flex items-center space-x-1">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-5 w-5" 
            onClick={handleQuantityDecrease}
          >
            <Minus className="h-2.5 w-2.5" />
          </Button>
          <span className="w-5 text-center text-xs">{item.quantity}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-5 w-5" 
            onClick={handleQuantityIncrease}
            disabled={item.quantity >= item.product.stock_quantity}
          >
            <Plus className="h-2.5 w-2.5" />
          </Button>
        </div>
      </td>
      <td className="py-1.5 px-1 text-right text-xs">₹{item.unit_price.toFixed(2)}</td>
      <td className="py-1.5 px-1 text-right">
        <Popover open={isDiscountPopoverOpen} onOpenChange={setIsDiscountPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-5 w-8 p-0 text-xs">
              {item.discount_percent > 0 ? (
                <span className="text-green-600 dark:text-green-400">{item.discount_percent}%</span>
              ) : (
                <span>{item.discount_percent}%</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-3">
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label htmlFor="discount" className="text-sm">Discount (%)</Label>
                <div className="flex gap-1 items-center">
                  <Percent className="h-3 w-3 text-muted-foreground" />
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="h-7"
                  />
                </div>
              </div>
              <Button size="sm" onClick={handleApplyDiscount} className="h-7">Apply</Button>
            </div>
          </PopoverContent>
        </Popover>
      </td>
      <td className="py-1.5 px-1 text-right font-medium text-xs">₹{item.total.toFixed(2)}</td>
    </tr>
  );
};

export default CartItemRow;

