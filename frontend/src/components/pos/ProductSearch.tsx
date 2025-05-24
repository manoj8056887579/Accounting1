
import React, { useState } from 'react';
import { usePOS } from '@/contexts/POSContext';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { mockProducts } from '@/data/mockProducts';
import { Product } from '@/models/pos';
import { Button } from '@/components/ui/button';
import { Check, ChevronsDown, Eye, Plus, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProductViewModal from './ProductViewModal';

const ProductSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { addToCart } = usePOS();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const filteredProducts = searchValue === "" 
    ? mockProducts 
    : mockProducts.filter(product => 
        product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.barcode?.includes(searchValue)
      );

  const handleSelectProduct = (product: Product) => {
    addToCart(product, 1);
    setOpen(false);
  };

  const handleViewProduct = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={open}
            className="w-full justify-between bg-white dark:bg-gray-950"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Products
            </span>
            <ChevronsDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[400px]" align="start">
          <Command>
            <CommandInput 
              placeholder="Search products by name, SKU or barcode..." 
              value={searchValue}
              onValueChange={setSearchValue}
              className="h-10"
            />
            <CommandList>
              <CommandEmpty>No products found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[300px]">
                  {filteredProducts.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={`${product.name}-${product.id}`}
                      onSelect={() => handleSelectProduct(product)}
                      className="flex justify-between py-3"
                    >
                      <div>
                        <span>{product.name}</span>
                        <span className="text-xs text-muted-foreground block">
                          SKU: {product.sku} {product.barcode && `• Barcode: ${product.barcode}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">${product.price.toFixed(2)}</span>
                        <Button 
                          onClick={(e) => handleViewProduct(e, product)} 
                          variant="ghost" 
                          size="sm"
                          title="View product details"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectProduct(product);
                          }} 
                          variant="ghost" 
                          size="sm"
                          title="Add to cart"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <ProductViewModal 
        product={selectedProduct} 
        open={viewModalOpen} 
        onOpenChange={setViewModalOpen} 
      />
    </>
  );
};

export default ProductSearch;
