
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, AlertTriangle, History, Settings, Plus } from 'lucide-react';
import ProductList from '@/components/inventory/ProductList';
import ProductDetail from '@/components/inventory/ProductDetail';
import LowStockAlert from '@/components/inventory/LowStockAlert';
import CategoryDistribution from '@/components/inventory/CategoryDistribution';
import StockMovementHistory from '@/components/inventory/StockMovementHistory';
import StockAdjustment from '@/components/inventory/StockAdjustment';
import AddProductDialog from '@/components/inventory/AddProductDialog';
import { mockProducts } from '@/data/mockProducts';
import { getProductMovements } from '@/data/mockInventory';
import { ProductWithMovements } from '@/models/inventory';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/models/pos';

const Inventory = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('products');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  
  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId);
  };
  
  const handleBackToProducts = () => {
    setSelectedProductId(null);
  };
  
  const handleAddNewProduct = () => {
    setAddProductDialogOpen(true);
  };
  
  const handleProductAdded = (newProduct: Product) => {
    // Add the new product to the list
    setProducts([newProduct, ...products]);
    
    // Show a success toast
    toast({
      title: "Product Added Successfully",
      description: `${newProduct.name} has been added to your inventory.`,
    });
  };
  
  const selectedProduct = selectedProductId 
    ? {
        ...products.find(p => p.id === selectedProductId)!,
        cost_price: 10.00, // mock data
        reorder_level: 5,  // mock data
        status: 'active' as const,
        created_at: new Date(),
        unit: 'each',
        movements: getProductMovements(selectedProductId)
      } as ProductWithMovements
    : null;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track products, stock levels, and movements
          </p>
        </div>
        {!selectedProduct && activeTab === 'products' && (
          <Button onClick={handleAddNewProduct} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>
      
      <Separator />
      
      {selectedProduct ? (
        <ProductDetail 
          product={selectedProduct} 
          onClose={handleBackToProducts} 
        />
      ) : (
        <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Low Stock</span>
            </TabsTrigger>
            <TabsTrigger value="movements" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Stock History</span>
            </TabsTrigger>
            <TabsTrigger value="adjustments" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Adjustments</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <LowStockAlert 
                  products={products} 
                  onViewProduct={handleViewProduct} 
                />
              </div>
              <div>
                <CategoryDistribution products={products} />
              </div>
            </div>
            
            <ProductList 
              products={products} 
              onViewProduct={handleViewProduct} 
            />
          </TabsContent>
          
          <TabsContent value="alerts">
            <LowStockAlert 
              products={products} 
              onViewProduct={handleViewProduct}
              expanded={true}
            />
          </TabsContent>
          
          <TabsContent value="movements">
            <StockMovementHistory />
          </TabsContent>
          
          <TabsContent value="adjustments">
            <StockAdjustment />
          </TabsContent>
        </Tabs>
      )}

      <AddProductDialog
        open={addProductDialogOpen}
        onOpenChange={setAddProductDialogOpen}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
};

export default Inventory;
