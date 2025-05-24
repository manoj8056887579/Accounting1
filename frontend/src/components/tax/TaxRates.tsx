
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

// Mock tax rates data
const initialTaxRates = [
  { id: '1', name: 'Standard GST', rate: 18, country: 'India', isActive: true },
  { id: '2', name: 'Reduced GST', rate: 12, country: 'India', isActive: true },
  { id: '3', name: 'Low GST', rate: 5, country: 'India', isActive: true },
  { id: '4', name: 'VAT Standard', rate: 20, country: 'UK', isActive: true },
  { id: '5', name: 'VAT Reduced', rate: 5, country: 'UK', isActive: true },
  { id: '6', name: 'US Sales Tax', rate: 8.25, country: 'USA', isActive: true },
];

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  country: string;
  isActive: boolean;
}

const TaxRates = () => {
  const [taxRates, setTaxRates] = useState<TaxRate[]>(initialTaxRates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTaxRate, setEditingTaxRate] = useState<TaxRate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    country: '',
    isActive: true,
  });

  const { toast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTaxRates = taxRates.filter(tax => 
    tax.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tax.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      rate: '',
      country: '',
      isActive: true,
    });
    setEditingTaxRate(null);
  };

  const openDialog = (taxRate?: TaxRate) => {
    if (taxRate) {
      setEditingTaxRate(taxRate);
      setFormData({
        name: taxRate.name,
        rate: taxRate.rate.toString(),
        country: taxRate.country,
        isActive: taxRate.isActive,
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

  const handleSubmit = () => {
    if (!formData.name || !formData.rate || !formData.country) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingTaxRate) {
      // Update existing tax rate
      setTaxRates(taxRates.map(tax => 
        tax.id === editingTaxRate.id ? 
        { ...tax, name: formData.name, rate: parseFloat(formData.rate), country: formData.country, isActive: formData.isActive } : 
        tax
      ));
      toast({
        title: "Tax rate updated",
        description: `${formData.name} has been updated successfully`,
      });
    } else {
      // Add new tax rate
      const newTaxRate = {
        id: Date.now().toString(),
        name: formData.name,
        rate: parseFloat(formData.rate),
        country: formData.country,
        isActive: formData.isActive,
      };
      setTaxRates([...taxRates, newTaxRate]);
      toast({
        title: "Tax rate added",
        description: `${formData.name} has been added successfully`,
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setTaxRates(taxRates.filter(tax => tax.id !== id));
    toast({
      title: "Tax rate deleted",
      description: "The tax rate has been deleted successfully",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search tax rates..."
          className="max-w-xs"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Tax Rate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTaxRate ? 'Edit Tax Rate' : 'Add New Tax Rate'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Standard GST"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rate" className="text-right">Rate (%)</Label>
                <Input
                  id="rate"
                  name="rate"
                  type="number"
                  step="0.01"
                  value={formData.rate}
                  onChange={handleInputChange}
                  placeholder="e.g. 18"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="e.g. India"
                  className="col-span-3"
                />
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
                {editingTaxRate ? 'Update' : 'Add'} Tax Rate
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
              <TableHead>Rate (%)</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTaxRates.length > 0 ? (
              filteredTaxRates.map((taxRate) => (
                <TableRow key={taxRate.id}>
                  <TableCell className="font-medium">{taxRate.name}</TableCell>
                  <TableCell>{taxRate.rate}%</TableCell>
                  <TableCell>{taxRate.country}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${taxRate.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {taxRate.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDialog(taxRate)}
                        title="Edit tax rate"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(taxRate.id)}
                        title="Delete tax rate"
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
                  No tax rates found. {searchQuery && 'Try a different search term.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaxRates;
