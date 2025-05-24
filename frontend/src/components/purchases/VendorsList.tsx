
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Vendor } from '@/models/purchases';
import { getVendors, deleteVendor } from '@/data/mockPurchases';
import VendorForm from './VendorForm';
import { useToast } from '@/components/ui/use-toast';

const VendorsList = () => {
  const [vendors, setVendors] = useState<Vendor[]>(getVendors());
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
  const { toast } = useToast();

  // Filter vendors based on search query
  const filteredVendors = vendors.filter(
    vendor => 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle creating/updating vendors
  const handleFormSubmit = (vendor: Vendor) => {
    if (isEditFormOpen && currentVendor) {
      // Update existing vendor
      const updatedVendors = vendors.map(v => 
        v.id === vendor.id ? vendor : v
      );
      setVendors(updatedVendors);
      toast({
        title: "Vendor Updated",
        description: `${vendor.name} has been updated successfully.`
      });
    } else {
      // Add new vendor
      setVendors([...vendors, vendor]);
      toast({
        title: "Vendor Added",
        description: `${vendor.name} has been added successfully.`
      });
    }
    
    setIsAddFormOpen(false);
    setIsEditFormOpen(false);
    setCurrentVendor(null);
  };

  // Handle delete vendor
  const handleDeleteVendor = () => {
    if (vendorToDelete) {
      const updatedVendors = vendors.filter(v => v.id !== vendorToDelete.id);
      setVendors(updatedVendors);
      deleteVendor(vendorToDelete.id);
      toast({
        title: "Vendor Deleted",
        description: `${vendorToDelete.name} has been removed.`,
        variant: "destructive"
      });
      setDeleteDialogOpen(false);
      setVendorToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Vendors</CardTitle>
            <CardDescription>
              Manage your vendor list and their information
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Vendor
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Payment Terms</TableHead>
                  <TableHead className="hidden lg:table-cell">Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No vendors found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">
                        {vendor.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {vendor.email}<br />
                        <span className="text-muted-foreground text-xs">{vendor.phone}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {vendor.paymentTerms} days
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        ${vendor.balance.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vendor.status === 'active' ? 'bg-green-100 text-green-800' :
                          vendor.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {vendor.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setCurrentVendor(vendor);
                              setIsEditFormOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setVendorToDelete(vendor);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Form Dialog */}
      {(isAddFormOpen || isEditFormOpen) && (
        <VendorForm
          vendor={currentVendor || undefined}
          isOpen={isAddFormOpen || isEditFormOpen}
          onClose={() => {
            setIsAddFormOpen(false);
            setIsEditFormOpen(false);
            setCurrentVendor(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the vendor "{vendorToDelete?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVendor}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VendorsList;
