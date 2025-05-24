
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Barcode, Search } from 'lucide-react';
import { usePOS } from '@/contexts/POSContext';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  onProductFound: (productId: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onProductFound }) => {
  const [query, setQuery] = useState('');
  const { findProductBySearch } = usePOS();

  const handleSearch = () => {
    if (!query.trim()) {
      toast.error('Please enter a barcode or product name');
      return;
    }

    const product = findProductBySearch(query);
    if (product) {
      onProductFound(product.id);
      setQuery('');
      toast.success(`Added: ${product.name}`);
    } else {
      toast.error('Product not found');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex space-x-2">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Barcode className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 bg-white dark:bg-gray-950"
          placeholder="Scan barcode or search product"
          autoComplete="off"
        />
      </div>
      <Button onClick={handleSearch}>
        <Search className="h-4 w-4 mr-2" />
        Find
      </Button>
    </div>
  );
};

export default BarcodeScanner;
