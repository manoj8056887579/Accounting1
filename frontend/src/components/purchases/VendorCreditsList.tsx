
import React, { useState } from 'react';
import { 
  getVendorCredits
} from '@/data/mockPurchases';
import { VendorCredit } from '@/models/purchases';
import PurchaseDocumentList from './PurchaseDocumentList';
import { FileMinus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Document } from './types';

const VendorCreditsList = () => {
  const [credits, setCredits] = useState<VendorCredit[]>(getVendorCredits());
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Enhanced status colors with better visual distinction
  const statusColors = {
    'draft': { bg: 'bg-slate-100', text: 'text-slate-800' },
    'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'approved': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'applied': { bg: 'bg-green-100', text: 'text-green-800' },
    'cancelled': { bg: 'bg-red-100', text: 'text-red-800' }
  };

  // Handle add new vendor credit
  const handleAddCredit = () => {
    toast({
      title: "Add Vendor Credit",
      description: "This would open a vendor credit creation form"
    });
  };

  // Handle edit vendor credit
  const handleEditCredit = (credit: VendorCredit) => {
    toast({
      title: "Edit Vendor Credit",
      description: `Editing vendor credit ${credit.reference}`
    });
  };

  // Handle delete vendor credit
  const handleDeleteCredit = (credit: VendorCredit) => {
    setCredits(credits.filter(c => c.id !== credit.id));
    toast({
      title: "Vendor Credit Deleted",
      description: `Vendor credit ${credit.reference} has been deleted`,
      variant: "destructive"
    });
  };

  // Handle view vendor credit details
  const handleViewCredit = (credit: VendorCredit) => {
    toast({
      title: "View Vendor Credit Details",
      description: `Viewing details for vendor credit ${credit.reference}`
    });
  };

  // Handle approve vendor credit
  const handleApproveCredit = (credit: VendorCredit) => {
    const updatedCredits = credits.map(c =>
      c.id === credit.id ? { ...c, status: 'approved' as const } : c
    );
    setCredits(updatedCredits);
    toast({
      title: "Vendor Credit Approved",
      description: `Vendor credit ${credit.reference} has been approved`,
      variant: "default"
    });
  };

  return (
    <PurchaseDocumentList
      title="Vendor Credits"
      description="Manage credits from vendors"
      icon={<FileMinus className="h-5 w-5 text-muted-foreground mr-2" />}
      documents={credits as Document[]}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onAdd={handleAddCredit}
      onEdit={(doc) => handleEditCredit(doc as VendorCredit)}
      onDelete={(doc) => handleDeleteCredit(doc as VendorCredit)}
      onView={(doc) => handleViewCredit(doc as VendorCredit)}
      additionalAction={{
        label: "Approve",
        icon: <FileMinus className="h-4 w-4 text-green-600" />,
        onClick: (doc) => handleApproveCredit(doc as VendorCredit),
        showFor: (doc) => (doc.status === 'draft' || doc.status === 'pending')
      }}
      statusColors={statusColors}
      emptyStateMessage="No vendor credits found. Create your first vendor credit to get started."
    />
  );
};

export default VendorCreditsList;
