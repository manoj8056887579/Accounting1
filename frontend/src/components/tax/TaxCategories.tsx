
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock tax categories data
const initialTaxCategories = [
  { id: '1', name: 'Standard Goods', description: 'Regular taxable goods', applicableTaxRate: 'Standard GST', isActive: true },
  { id: '2', name: 'Essential Goods', description: 'Essential commodities', applicableTaxRate: 'Reduced GST', isActive: true },
  { id: '3', name: 'Luxury Items', description: 'Luxury and premium products', applicableTaxRate: 'Standard GST', isActive: true },
  { id: '4', name: 'Services', description: 'General services', applicableTaxRate: 'Standard GST', isActive: true },
  { id: '5', name: 'Export', description: 'Goods for export', applicableTaxRate: 'Zero Rated', isActive: true },
  { id: '6', name: 'Books & Education', description: 'Educational materials', applicableTaxRate: 'Low GST', isActive: true },
];

const taxRateOptions = [
  'Standard GST',
  'Reduced GST',
  'Low GST',
  'Zero Rated',
  'Exempt',
  'VAT Standard',
  'VAT Reduced',
  'US Sales Tax'
];

interface TaxCategory {
  id: string;
  name: string;
  description: string;
  applicableTaxRate: string;
  isActive: boolean;
}

const TaxCategories = () => {
  const [categories, setCategories] = useState<TaxCategory[]>(initialTaxCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TaxCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    applicableTaxRate: 'Standard GST',
    isActive: true,
  });

  const { toast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.applicableTaxRate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      applicableTaxRate: 'Standard GST',
      isActive: true,
    });
    setEditingCategory(null);
  };

  const openDialog = (category?: TaxCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        applicableTaxRate: category.applicableTaxRate,
        isActive: category.isActive,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleTaxRateChange = (value: string) => {
    setFormData({
      ...formData,
      applicableTaxRate: value,
    });
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please provide a category name",
        variant: "destructive",
      });
      return;
    }

    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? 
        { 
          ...cat, 
          name: formData.name, 
          description: formData.description, 
          applicableTaxRate: formData.applicableTaxRate, 
          isActive: formData.isActive 
        } : cat
      ));
      toast({
        title: "Tax category updated",
        description: `${formData.name} has been updated successfully`,
      });
    } else {
      // Add new category
      const newCategory = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        applicableTaxRate: formData.applicableTaxRate,
        isActive: formData.isActive,
      };
      setCategories([...categories, newCategory]);
      toast({
        title: "Tax category added",
        description: `${formData.name} has been added successfully`,
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    toast({
      title: "Tax category deleted",
      description: "The tax category has been deleted successfully",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search tax categories..."
          className="max-w-xs"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Tax Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Tax Category' : 'Add New Tax Category'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Standard Goods"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g. Regular taxable goods"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="taxRate" className="text-right">Tax Rate</Label>
                <div className="col-span-3">
                  <Select 
                    value={formData.applicableTaxRate} 
                    onValueChange={handleTaxRateChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tax rate" />
                    </SelectTrigger>
                    <SelectContent>
                      {taxRateOptions.map(rate => (
                        <SelectItem key={rate} value={rate}>
                          {rate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">Active</Label>
                <Input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="col-span-3 w-6 h-6"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>
                {editingCategory ? 'Update' : 'Add'} Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Applicable Tax Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.applicableTaxRate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDialog(category)}
                        title="Edit category"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
                        title="Delete category"
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No tax categories found. {searchQuery && 'Try a different search term.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaxCategories;
