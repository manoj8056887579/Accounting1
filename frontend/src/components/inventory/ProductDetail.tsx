
import React from 'react';
import { ProductWithMovements } from '@/models/inventory';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import StockMovementsTable from './StockMovementsTable';
import { ArrowLeft, Edit, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";

interface ProductDetailProps {
  product: ProductWithMovements;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  const handleEditProduct = () => {
    toast({
      title: "Edit Product",
      description: "Product editing will be available in a future update.",
    });
  };

  const handleDeleteProduct = () => {
    toast({
      title: "Delete Product",
      description: "Product deletion will be available in a future update.",
    });
  };

  const handleAdjustStock = () => {
    toast({
      title: "Adjust Stock",
      description: "Stock adjustment will be available in a future update.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <div className="text-muted-foreground flex items-center gap-2 flex-wrap">
              <span>SKU: {product.sku}</span>
              {product.barcode && (
                <>
                  <span className="text-xs">•</span>
                  <span>Barcode: {product.barcode}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleAdjustStock}>
            <Plus className="h-4 w-4 mr-1" /> Adjust Stock
          </Button>
          <Button variant="outline" size="sm" onClick={handleEditProduct}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDeleteProduct}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stock Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-2xl font-bold">
                  {product.stock_quantity}
                </div>
                <Badge 
                  variant={
                    product.stock_quantity > product.reorder_level ? "outline" : 
                    product.stock_quantity > 0 ? "secondary" : "destructive"
                  }
                  className="mt-1"
                >
                  {product.stock_quantity > product.reorder_level ? "Well Stocked" :
                  product.stock_quantity > 0 ? "Low Stock" : "Out of Stock"}
                </Badge>
              </div>
              
              <div className="text-sm pt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reorder Level:</span>
                  <span className="font-medium">{product.reorder_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={product.status === 'active' ? 'outline' : 'secondary'}>
                    {product.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unit:</span>
                  <span className="font-medium">{product.unit || 'N/A'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-2xl font-bold">
                  ₹{product.price.toFixed(2)}
                </div>
                <span className="text-xs text-muted-foreground">
                  Selling Price
                </span>
              </div>
              
              <div className="text-sm pt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cost Price:</span>
                  <span className="font-medium">₹{product.cost_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margin:</span>
                  <span className="font-medium">
                    {((product.price - product.cost_price) / product.price * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax Rate:</span>
                  <span className="font-medium">{product.tax_rate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{product.category || "Uncategorized"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              {product.barcode && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Barcode:</span>
                  <span className="font-medium">{product.barcode}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Movement History</CardTitle>
        </CardHeader>
        <CardContent>
          <StockMovementsTable movements={product.movements || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;

