
import React, { useState } from 'react';
import { usePOS } from '@/contexts/POSContext';
import { mockCustomers } from '@/data/mockProducts';
import { Customer as POSCustomer } from '@/models/pos';
import { Customer as SalesCustomer } from '@/models/sales';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsDown, User, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import CustomerForm from '../sales/CustomerForm';
import { v4 as uuidv4 } from 'uuid';

const CustomerSelect: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { state, setCustomer } = usePOS();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<POSCustomer[]>(mockCustomers);

  const handleSelectCustomer = (customer: POSCustomer) => {
    setCustomer(customer);
    setOpen(false);
  };

  const handleAddNewCustomer = () => {
    setOpen(false);
    setAddDialogOpen(true);
  };

  const handleCustomerAdded = (formData: any) => {
    // Create a new customer with a unique ID
    const newCustomer: POSCustomer = {
      id: `C${uuidv4().substring(0, 5)}`, // Create a short unique ID starting with C
      name: formData.name,
      email: formData.email || undefined, // Make sure email is undefined if not provided
      phone: formData.phone || undefined, // Make sure phone is undefined if not provided
      address: formData.address || undefined // Make sure address is undefined if not provided
    };
    
    // Add the new customer to the list
    setCustomers([newCustomer, ...customers]);
    
    // Select the new customer
    setCustomer(newCustomer);
    
    // Show a success toast
    toast({
      title: "Customer Added",
      description: `${newCustomer.name} has been added successfully.`,
    });
    
    // Close the dialog
    setAddDialogOpen(false);
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {state.customer ? state.customer.name : "Select Customer"}
            </div>
            <ChevronsDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search customer..." />
            <CommandList>
              <CommandEmpty>No customer found.</CommandEmpty>
              <CommandGroup heading="Customers">
                {customers.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={customer.name}
                    onSelect={() => handleSelectCustomer(customer)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        state.customer?.id === customer.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div>
                      <span>{customer.name}</span>
                      {customer.phone && (
                        <span className="text-xs text-muted-foreground block">{customer.phone}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <CommandItem onSelect={handleAddNewCustomer}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Customer
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter customer details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm 
            onSubmit={handleCustomerAdded}
            onCancel={() => setAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerSelect;
