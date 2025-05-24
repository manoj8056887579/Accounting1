
import React from 'react';
import { Product } from '@/models/pos';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usePOS } from '@/contexts/POSContext';
import { Plus, Minus } from 'lucide-react';

interface ProductViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductViewModal: React.FC<ProductViewModalProps> = ({
  product,
  open,
  onOpenChange,
}) => {
  const { addToCart } = usePOS();
  const [quantity, setQuantity] = React.useState(1);

  // Reset quantity when product changes
  React.useEffect(() => {
    if (product) setQuantity(1);
  }, [product]);

  if (!product) return null;

  const handleIncreaseQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>SKU: {product.sku}</span>
            {product.barcode && <span>• Barcode: {product.barcode}</span>}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-2xl font-semibold mb-2">
                ₹{product.price.toFixed(2)}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={product.stock_quantity > 0 ? "outline" : "destructive"}>
                  {product.stock_quantity > 0 ? `In Stock: ${product.stock_quantity}` : "Out of Stock"}
                </Badge>
                {product.category && (
                  <Badge variant="secondary">{product.category}</Badge>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground mb-4">
                <span>Tax Rate: {product.tax_rate}%</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleDecreaseQuantity} 
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-16 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleIncreaseQuantity} 
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleAddToCart} 
                disabled={product.stock_quantity <= 0}
              >
                Add to Cart
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="max-h-40 object-contain"
              />
            ) : (
              <div className="text-muted-foreground text-sm flex flex-col items-center p-4">
                <span className="text-4xl mb-2">📦</span>
                <span>No image available</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductViewModal;

