
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Mail, Phone, Edit, Eye, UserPlus, Users } from 'lucide-react';
import { Customer } from '@/models/sales';
import { getCustomers } from '@/data/mockSales';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import AddCustomerDialog from './AddCustomerDialog';

const CustomersList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>(getCustomers());
  const [addCustomerDialogOpen, setAddCustomerDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (customer: Customer) => {
    toast({
      title: "View Customer",
      description: `Viewing details for ${customer.name}`
    });
  };

  const handleEdit = (customer: Customer) => {
    toast({
      title: "Edit Customer",
      description: `Editing details for ${customer.name}`
    });
  };

  const handleAddCustomer = () => {
    setAddCustomerDialogOpen(true);
  };

  const handleCustomerAdded = (newCustomer: Customer) => {
    // Add the new customer to the list
    setCustomers([newCustomer, ...customers]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto" onClick={handleAddCustomer}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="bg-muted/40">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Customers
          </CardTitle>
          <CardDescription>Manage your customer information</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{customer.name}</span>
                        <Badge variant="outline" className="w-fit mt-1">Customer</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-muted-foreground" /> 
                          <a href={`mailto:${customer.email}`} className="hover:text-primary hover:underline">
                            {customer.email}
                          </a>
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1 text-muted-foreground" /> 
                          <a href={`tel:${customer.phone}`} className="hover:text-primary hover:underline">
                            {customer.phone}
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {customer.address}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center"
                          onClick={() => handleView(customer)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center"
                          onClick={() => handleEdit(customer)}
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="h-10 w-10 text-muted-foreground/50 mb-3" />
                      <p className="mb-2">No customers found</p>
                      <p className="text-sm">Try adjusting your search or add a new customer</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddCustomerDialog
        open={addCustomerDialogOpen}
        onOpenChange={setAddCustomerDialogOpen}
        onCustomerAdded={handleCustomerAdded}
      />
    </div>
  );
};

export default CustomersList;
