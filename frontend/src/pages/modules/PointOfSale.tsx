
import React, { useState } from 'react';
import { POSProvider } from '@/contexts/POSContext';
import BarcodeScanner from '@/components/pos/BarcodeScanner';
import ProductSearch from '@/components/pos/ProductSearch';
import Cart from '@/components/pos/Cart';
import CustomerSelect from '@/components/pos/CustomerSelect';
import PaymentSection from '@/components/pos/PaymentSection';
import HeldSales from '@/components/pos/HeldSales';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePOS } from '@/contexts/POSContext';
import { mockProducts } from '@/data/mockProducts';
import { Printer, Share, Grid2x2, Grid3x3, LayoutGrid, LayoutList, Maximize2, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CategoryProducts from '@/components/pos/CategoryProducts';
import { ScrollArea } from '@/components/ui/scroll-area';

const POSContent: React.FC = () => {
  const { addToCart, state } = usePOS();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [gridSize, setGridSize] = useState<number>(3); // 2, 3, or 4 columns
  const [isPOSView, setIsPOSView] = useState<boolean>(false);
  
  const handleProductFound = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
    }
  };
  
  const handlePrint = () => {
    toast.info("Print functionality will be implemented soon");
  };
  
  const handleShare = () => {
    toast.info("WhatsApp sharing will be implemented soon");
  };

  const togglePOSView = () => {
    setIsPOSView(!isPOSView);
    toast.info(isPOSView ? "Exited POS view mode" : "Entered POS view mode");
  };

  // Extract unique categories from products
  const categories = Array.from(new Set(mockProducts.map(product => product.category || 'Uncategorized')));
  
  return (
    <div className={`grid grid-cols-1 ${isPOSView ? '' : 'lg:grid-cols-7'} gap-6`}>
      <div className={`${isPOSView ? 'hidden' : 'lg:col-span-4'} space-y-4`}>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Point of Sale</CardTitle>
                <CardDescription>Add items to cart and process payment</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={togglePOSView}
                  className="h-8 w-8"
                  title="Toggle POS View"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? "secondary" : "ghost"} 
                  size="icon" 
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'grid' && gridSize === 2 ? "secondary" : "ghost"} 
                  size="icon" 
                  onClick={() => {setViewMode('grid'); setGridSize(2);}}
                  className="h-8 w-8"
                >
                  <Grid2x2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'grid' && gridSize === 3 ? "secondary" : "ghost"} 
                  size="icon" 
                  onClick={() => {setViewMode('grid'); setGridSize(3);}}
                  className="h-8 w-8"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'grid' && gridSize === 4 ? "secondary" : "ghost"} 
                  size="icon" 
                  onClick={() => {setViewMode('grid'); setGridSize(4);}}
                  className="h-8 w-8"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <CustomerSelect />
                </div>
                <div className="w-full md:w-1/2 flex gap-2">
                  <div className="flex-grow">
                    <BarcodeScanner onProductFound={handleProductFound} />
                  </div>
                </div>
              </div>
              <ProductSearch />
            </div>
            
            <Tabs defaultValue={categories[0]} className="w-full">
              <ScrollArea className="w-full">
                <TabsList className="mb-2 w-full justify-start overflow-x-auto">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <CategoryProducts 
                    category={category} 
                    viewMode={viewMode}
                    gridSize={gridSize}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className={`${isPOSView ? 'col-span-1' : 'lg:col-span-3'} space-y-4`}>
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Cart</CardTitle>
              <div className="flex items-center gap-2">
                {isPOSView && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={togglePOSView}
                    className="h-8 w-8"
                    title="Exit POS View"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                )}
                <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  {state.cart.length} item(s)
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Cart />
          </CardContent>
          <CardFooter className="pt-0 flex justify-end gap-2 border-t p-4">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </CardFooter>
        </Card>
        
        {!isPOSView && (
          <>
            <PaymentSection />
            <HeldSales />
          </>
        )}
      </div>
    </div>
  );
};

const PointOfSale: React.FC = () => {
  return (
    <POSProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Point of Sale</h1>
          <p className="text-muted-foreground">
            Process sales, manage inventory and handle payments
          </p>
        </div>
        <Separator />
        <POSContent />
      </div>
    </POSProvider>
  );
};

export default PointOfSale;

