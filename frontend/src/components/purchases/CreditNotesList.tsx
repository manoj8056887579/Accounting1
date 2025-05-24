
import React, { useState } from 'react';
import { 
  getCreditNotes
} from '@/data/mockPurchases';
import { CreditNote } from '@/models/purchases';
import PurchaseDocumentList from './PurchaseDocumentList';
import { FilePlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Document } from './types';

const CreditNotesList = () => {
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>(getCreditNotes());
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

  // Handle add new credit note
  const handleAddCreditNote = () => {
    toast({
      title: "Add Credit Note",
      description: "This would open a credit note creation form"
    });
  };

  // Handle edit credit note
  const handleEditCreditNote = (creditNote: CreditNote) => {
    toast({
      title: "Edit Credit Note",
      description: `Editing credit note ${creditNote.reference}`
    });
  };

  // Handle delete credit note
  const handleDeleteCreditNote = (creditNote: CreditNote) => {
    setCreditNotes(creditNotes.filter(cn => cn.id !== creditNote.id));
    toast({
      title: "Credit Note Deleted",
      description: `Credit note ${creditNote.reference} has been deleted`,
      variant: "destructive"
    });
  };

  // Handle view credit note details
  const handleViewCreditNote = (creditNote: CreditNote) => {
    toast({
      title: "View Credit Note Details",
      description: `Viewing details for credit note ${creditNote.reference}`
    });
  };

  // Handle approve credit note
  const handleApproveCreditNote = (creditNote: CreditNote) => {
    const updatedCreditNotes = creditNotes.map(cn =>
      cn.id === creditNote.id ? { ...cn, status: 'approved' as const } : cn
    );
    setCreditNotes(updatedCreditNotes);
    toast({
      title: "Credit Note Approved",
      description: `Credit note ${creditNote.reference} has been approved`,
      variant: "default"
    });
  };

  // Handle apply credit note
  const handleApplyCreditNote = (creditNote: CreditNote) => {
    const updatedCreditNotes = creditNotes.map(cn =>
      cn.id === creditNote.id ? { ...cn, status: 'applied' as const } : cn
    );
    setCreditNotes(updatedCreditNotes);
    toast({
      title: "Credit Note Applied",
      description: `Credit note ${creditNote.reference} has been applied`,
      variant: "default"
    });
  };

  return (
    <PurchaseDocumentList
      title="Credit Notes"
      description="Manage credit notes from vendors"
      icon={<FilePlus className="h-5 w-5 text-muted-foreground mr-2" />}
      documents={creditNotes as Document[]}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onAdd={handleAddCreditNote}
      onEdit={(doc) => handleEditCreditNote(doc as CreditNote)}
      onDelete={(doc) => handleDeleteCreditNote(doc as CreditNote)}
      onView={(doc) => handleViewCreditNote(doc as CreditNote)}
      additionalAction={{
        label: (doc) => (doc.status === 'approved' ? "Apply" : "Approve"),
        icon: <FilePlus className="h-4 w-4 text-blue-600" />,
        onClick: (doc) => {
          const creditNote = doc as CreditNote;
          return creditNote.status === 'approved' ? 
            handleApplyCreditNote(creditNote) : handleApproveCreditNote(creditNote);
        },
        showFor: (doc) => ['draft', 'pending', 'approved'].includes(doc.status)
      }}
      statusColors={statusColors}
      emptyStateMessage="No credit notes found. Create your first credit note to get started."
    />
  );
};

export default CreditNotesList;
