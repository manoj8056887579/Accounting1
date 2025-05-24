
import React, { useState } from 'react';
import { 
  getDebitNotes
} from '@/data/mockPurchases';
import { DebitNote } from '@/models/purchases';
import PurchaseDocumentList from './PurchaseDocumentList';
import { FileX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Document } from './types';

const DebitNotesList = () => {
  const [debitNotes, setDebitNotes] = useState<DebitNote[]>(getDebitNotes());
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

  // Handle add new debit note
  const handleAddDebitNote = () => {
    toast({
      title: "Add Debit Note",
      description: "This would open a debit note creation form"
    });
  };

  // Handle edit debit note
  const handleEditDebitNote = (debitNote: DebitNote) => {
    toast({
      title: "Edit Debit Note",
      description: `Editing debit note ${debitNote.reference}`
    });
  };

  // Handle delete debit note
  const handleDeleteDebitNote = (debitNote: DebitNote) => {
    setDebitNotes(debitNotes.filter(dn => dn.id !== debitNote.id));
    toast({
      title: "Debit Note Deleted",
      description: `Debit note ${debitNote.reference} has been deleted`,
      variant: "destructive"
    });
  };

  // Handle view debit note details
  const handleViewDebitNote = (debitNote: DebitNote) => {
    toast({
      title: "View Debit Note Details",
      description: `Viewing details for debit note ${debitNote.reference}`
    });
  };

  // Handle approve debit note
  const handleApproveDebitNote = (debitNote: DebitNote) => {
    const updatedDebitNotes = debitNotes.map(dn =>
      dn.id === debitNote.id ? { ...dn, status: 'approved' as const } : dn
    );
    setDebitNotes(updatedDebitNotes);
    toast({
      title: "Debit Note Approved",
      description: `Debit note ${debitNote.reference} has been approved`,
      variant: "default"
    });
  };

  // Handle apply debit note
  const handleApplyDebitNote = (debitNote: DebitNote) => {
    const updatedDebitNotes = debitNotes.map(dn =>
      dn.id === debitNote.id ? { ...dn, status: 'applied' as const } : dn
    );
    setDebitNotes(updatedDebitNotes);
    toast({
      title: "Debit Note Applied",
      description: `Debit note ${debitNote.reference} has been applied`,
      variant: "default"
    });
  };

  return (
    <PurchaseDocumentList
      title="Debit Notes"
      description="Manage debit notes for vendors"
      icon={<FileX className="h-5 w-5 text-muted-foreground mr-2" />}
      documents={debitNotes as Document[]}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onAdd={handleAddDebitNote}
      onEdit={(doc) => handleEditDebitNote(doc as DebitNote)}
      onDelete={(doc) => handleDeleteDebitNote(doc as DebitNote)}
      onView={(doc) => handleViewDebitNote(doc as DebitNote)}
      additionalAction={{
        label: (doc) => (doc.status === 'approved' ? "Apply" : "Approve"),
        icon: <FileX className="h-4 w-4 text-blue-600" />,
        onClick: (doc) => {
          const debitNote = doc as DebitNote;
          return debitNote.status === 'approved' ? 
            handleApplyDebitNote(debitNote) : handleApproveDebitNote(debitNote);
        },
        showFor: (doc) => ['draft', 'pending', 'approved'].includes(doc.status)
      }}
      statusColors={statusColors}
      emptyStateMessage="No debit notes found. Create your first debit note to get started."
    />
  );
};

export default DebitNotesList;
