
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import ProductForm from './ProductForm';
import { Product } from '@/models/pos';
import { EnhancedProduct } from '@/models/inventory';

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: (product: Product) => void;
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({ 
  open, 
  onOpenChange,
  onProductAdded 
}) => {
  const handleFormSubmit = (formData: any) => {
    // Convert the form data to a Product object
    const newProduct: Product = {
      id: formData.id,
      name: formData.name,
      sku: formData.sku,
      barcode: formData.barcode || undefined,
      price: parseFloat(formData.price),
      tax_rate: parseFloat(formData.tax_rate),
      stock_quantity: parseInt(formData.stock_quantity),
      category: formData.category
    };
    
    // Pass the new product to the parent component
    onProductAdded(newProduct);
    
    // Close the dialog
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Enter product details below to add a new item to your inventory.
          </DialogDescription>
        </DialogHeader>
        <ProductForm 
          onSubmit={handleFormSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
