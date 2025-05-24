
import React, { useState } from 'react';
import { usePOS } from '@/contexts/POSContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

const HeldSales: React.FC = () => {
  const { state, resumeSale } = usePOS();
  const [open, setOpen] = useState(false);
  
  const handleResumeSale = (saleId: string) => {
    resumeSale(saleId);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Held Sales ({state.heldSales.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Held Sales</DialogTitle>
          <DialogDescription>
            Resume a previously held sale.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px] mt-4">
          {state.heldSales.length === 0 ? (
            <p className="text-center text-muted-foreground p-4">No held sales found.</p>
          ) : (
            <div className="space-y-3">
              {state.heldSales.map(sale => (
                <div 
                  key={sale.id} 
                  className="border rounded-md p-3 hover:border-primary cursor-pointer"
                  onClick={() => handleResumeSale(sale.id)}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{sale.customer_name}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(sale.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Items: {sale.items.length}</span>
                    <span className="font-medium">${sale.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default HeldSales;
