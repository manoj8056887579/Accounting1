
import React, { useState } from 'react';
import { 
  getPurchaseReturns
} from '@/data/mockPurchases';
import { PurchaseReturn } from '@/models/purchases';
import PurchaseDocumentList from './PurchaseDocumentList';
import { RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Document } from './types';

const PurchaseReturnsList = () => {
  const [returns, setReturns] = useState<PurchaseReturn[]>(getPurchaseReturns());
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Enhanced status colors with better visual distinction
  const statusColors = {
    'draft': { bg: 'bg-slate-100', text: 'text-slate-800' },
    'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'approved': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'completed': { bg: 'bg-green-100', text: 'text-green-800' },
    'cancelled': { bg: 'bg-red-100', text: 'text-red-800' }
  };

  // Handle add new purchase return
  const handleAddReturn = () => {
    toast({
      title: "Add Purchase Return",
      description: "This would open a purchase return creation form"
    });
  };

  // Handle edit purchase return
  const handleEditReturn = (returnItem: PurchaseReturn) => {
    toast({
      title: "Edit Purchase Return",
      description: `Editing purchase return ${returnItem.reference}`
    });
  };

  // Handle delete purchase return
  const handleDeleteReturn = (returnItem: PurchaseReturn) => {
    setReturns(returns.filter(r => r.id !== returnItem.id));
    toast({
      title: "Purchase Return Deleted",
      description: `Purchase return ${returnItem.reference} has been deleted`,
      variant: "destructive"
    });
  };

  // Handle view purchase return details
  const handleViewReturn = (returnItem: PurchaseReturn) => {
    toast({
      title: "View Purchase Return Details",
      description: `Viewing details for purchase return ${returnItem.reference}`
    });
  };

  // Handle approve purchase return
  const handleApproveReturn = (returnItem: PurchaseReturn) => {
    const updatedReturns = returns.map(r =>
      r.id === returnItem.id ? { ...r, status: 'approved' as const } : r
    );
    setReturns(updatedReturns);
    toast({
      title: "Purchase Return Approved",
      description: `Purchase return ${returnItem.reference} has been approved`,
      variant: "default"
    });
  };

  // Handle complete purchase return
  const handleCompleteReturn = (returnItem: PurchaseReturn) => {
    const updatedReturns = returns.map(r =>
      r.id === returnItem.id ? { ...r, status: 'completed' as const } : r
    );
    setReturns(updatedReturns);
    toast({
      title: "Purchase Return Completed",
      description: `Purchase return ${returnItem.reference} has been completed`,
      variant: "default"
    });
  };

  return (
    <PurchaseDocumentList
      title="Purchase Returns"
      description="Manage returns to vendors"
      icon={<RotateCcw className="h-5 w-5 text-muted-foreground mr-2" />}
      documents={returns as Document[]}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onAdd={handleAddReturn}
      onEdit={(doc) => handleEditReturn(doc as PurchaseReturn)}
      onDelete={(doc) => handleDeleteReturn(doc as PurchaseReturn)}
      onView={(doc) => handleViewReturn(doc as PurchaseReturn)}
      additionalAction={{
        label: (doc) => (doc.status === 'approved' ? "Complete" : "Approve"),
        icon: <RotateCcw className="h-4 w-4 text-blue-600" />,
        onClick: (doc) => {
          const returnItem = doc as PurchaseReturn;
          return returnItem.status === 'approved' ? 
            handleCompleteReturn(returnItem) : handleApproveReturn(returnItem);
        },
        showFor: (doc) => ['draft', 'pending', 'approved'].includes(doc.status)
      }}
      statusColors={statusColors}
      emptyStateMessage="No purchase returns found. Create your first purchase return to get started."
    />
  );
};

export default PurchaseReturnsList;
