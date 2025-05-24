
import React from 'react';
import { Product } from '@/models/pos';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, PackageMinus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LowStockAlertProps {
  products: Product[];
  onViewProduct: (productId: string) => void;
  expanded?: boolean;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ products, onViewProduct, expanded = false }) => {
  // Filter out products with low stock (less than or equal to 5)
  const lowStockProducts = products
    .filter(product => product.stock_quantity <= 5)
    .sort((a, b) => a.stock_quantity - b.stock_quantity);

  if (lowStockProducts.length === 0) {
    return (
      <Card className={expanded ? "" : "border-yellow-200 dark:border-yellow-900"}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <PackageMinus className="h-5 w-5 text-yellow-500" />
            <CardTitle>{expanded ? "Low Stock Products" : "Low Stock Alert"}</CardTitle>
          </div>
          <CardDescription>
            All products are well stocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6 text-center text-muted-foreground">
            <div>
              <PackageMinus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p>No products currently need restocking.</p>
              <p className="text-sm">All inventory levels are above the reorder threshold.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (expanded) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <CardTitle>Low Stock Products</CardTitle>
          </div>
          <CardDescription>
            {lowStockProducts.length} products need attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockProducts.map(product => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category || 'Uncategorized'}</TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={product.stock_quantity === 0 ? "destructive" : "secondary"}
                      className="w-12 justify-center"
                    >
                      {product.stock_quantity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onViewProduct(product.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-yellow-200 dark:border-yellow-900">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <PackageMinus className="h-5 w-5 text-yellow-500" />
          <CardTitle>Low Stock Alert</CardTitle>
        </div>
        <CardDescription>
          {lowStockProducts.length} products need attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {lowStockProducts.slice(0, 5).map((product) => (
            <div 
              key={product.id} 
              className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
            >
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  variant={product.stock_quantity === 0 ? "destructive" : "outline"}
                  className="w-12 justify-center"
                >
                  {product.stock_quantity}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onViewProduct(product.id)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
          
          {lowStockProducts.length > 5 && (
            <div className="text-sm text-muted-foreground text-center pt-1">
              And {lowStockProducts.length - 5} more products with low stock...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LowStockAlert;
