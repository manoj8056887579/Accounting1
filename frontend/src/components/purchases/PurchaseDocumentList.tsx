
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, FileText, Search, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Generic interface for documents
interface Document {
  id: string;
  reference: string;
  vendor?: string;
  date: string;
  dueDate?: string;
  status: string;
  total: number;
}

interface PurchaseDocumentListProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  documents: Document[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAdd: () => void;
  onEdit: (document: Document) => void;
  onDelete: (document: Document) => void;
  onView?: (document: Document) => void;
  additionalAction?: {
    label: ((document: Document) => string) | string;
    icon: ((document: Document) => React.ReactNode) | React.ReactNode;
    onClick: (document: Document) => void;
    showFor?: (document: Document) => boolean;
  };
  statusColors: {
    [key: string]: {
      bg: string;
      text: string;
    };
  };
  emptyStateMessage?: string;
}

const PurchaseDocumentList: React.FC<PurchaseDocumentListProps> = ({
  title,
  description,
  icon,
  documents,
  searchQuery,
  setSearchQuery,
  onAdd,
  onEdit,
  onDelete,
  onView,
  additionalAction,
  statusColors,
  emptyStateMessage = "No documents found. Try adjusting your search.",
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const { toast } = useToast();

  // Filter documents based on search query
  const filteredDocuments = documents.filter(
    doc =>
      doc.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.vendor && doc.vendor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete
  const handleConfirmDelete = () => {
    if (documentToDelete) {
      onDelete(documentToDelete);
      toast({
        title: "Document Deleted",
        description: `${documentToDelete.reference} has been removed.`,
        variant: "destructive"
      });
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Helper function to get label text
  const getActionLabel = (doc: Document) => {
    if (!additionalAction) return '';
    return typeof additionalAction.label === 'function' 
      ? additionalAction.label(doc) 
      : additionalAction.label;
  };

  // Helper function to get icon
  const getActionIcon = (doc: Document) => {
    if (!additionalAction) return null;
    return typeof additionalAction.icon === 'function'
      ? additionalAction.icon(doc)
      : additionalAction.icon;
  };

  return (
    <div className="space-y-4">
      <Card className="border-t-4 border-t-primary shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0 pb-4">
          <div className="flex items-center">
            {icon}
            <div>
              <CardTitle className="text-xl font-bold">{title}</CardTitle>
              <CardDescription className="text-sm">{description}</CardDescription>
            </div>
          </div>
          <Button onClick={onAdd} className="bg-primary hover:bg-primary/90 transition-colors">
            <Plus className="mr-2 h-4 w-4" /> Add {title.slice(0, -1)}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 max-w-sm transition-all focus-within:max-w-md"
            />
          </div>

          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Reference</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    {documents.some(doc => doc.dueDate) && (
                      <TableHead className="hidden md:table-cell">Due Date</TableHead>
                    )}
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center py-8 text-muted-foreground">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="text-muted-foreground/60 border border-dashed border-muted-foreground/20 rounded-full p-6">
                            <FileText className="h-8 w-8"/>
                          </div>
                          <div className="text-sm font-medium">{emptyStateMessage}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <span>{doc.reference}</span>
                            {onView && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => onView(doc)} 
                                className="ml-2 h-6 w-6 p-0"
                              >
                                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{doc.vendor}</TableCell>
                        <TableCell className="hidden md:table-cell">{doc.date}</TableCell>
                        {documents.some(d => d.dueDate) && (
                          <TableCell className="hidden md:table-cell">{doc.dueDate || '-'}</TableCell>
                        )}
                        <TableCell className="font-mono">{formatCurrency(doc.total)}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              statusColors[doc.status]
                                ? `${statusColors[doc.status].bg} ${statusColors[doc.status].text}`
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {doc.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            {additionalAction && 
                             (!additionalAction.showFor || additionalAction.showFor(doc)) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => additionalAction.onClick(doc)}
                                title={getActionLabel(doc)}
                                className="h-8 w-8 p-0"
                              >
                                {getActionIcon(doc)}
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(doc)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDocumentToDelete(doc);
                                setDeleteDialogOpen(true);
                              }}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-4 text-xs text-muted-foreground text-right">
            Total: {filteredDocuments.length} {filteredDocuments.length === 1 ? title.slice(0, -1).toLowerCase() : title.toLowerCase()}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{documentToDelete?.reference}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
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

export default PurchaseDocumentList;
