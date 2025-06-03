
import React, { useState } from 'react';
import { Building, Check, ChevronsUpDown } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const TenantSelector = () => {
  const { 
    currentOrganization, 
    availableOrganizations, 
    setCurrentOrganizationId,
    isLoading 
  } = useTenant();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Button variant="outline" className="w-full justify-start opacity-70">
        <Building className="mr-2 h-4 w-4" />
        <span className="truncate">Loading...</span>
      </Button>
    );
  }

  if (!currentOrganization) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center"> 
            {currentOrganization.logo ? (
              <img 
                src={currentOrganization.logo} 
                alt={currentOrganization.name} 
                className="mr-2 h-4 w-4 rounded-full" 
              />
            ) : (
              <Building className="mr-2 h-4 w-4" />
            )}
            <span className="truncate mr-2">{currentOrganization.name}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandList>
            <CommandEmpty>No organizations found.</CommandEmpty>
            <CommandGroup>
              {availableOrganizations.map((org) => (
                <CommandItem
                  key={org.id}
                  onSelect={() => {
                    setCurrentOrganizationId(org.id);
                    setOpen(false);
                  }}
                  className="text-sm cursor-pointer"
                >
                  <div className="flex items-center">
                    {org.logo ? (
                      <img 
                        src={org.logo} 
                        alt={org.name} 
                        className="mr-2 h-4 w-4 rounded-full" 
                      />
                    ) : (
                      <Building className="mr-2 h-4 w-4" />
                    )}
                    {org.name}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentOrganization.id === org.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <div className="p-1 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm" 
              onClick={() => {
                navigate('/organizations');
                setOpen(false);
              }}
            >
              Manage Organizations
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TenantSelector;
