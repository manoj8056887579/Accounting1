
import React from 'react';
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
import { Search, Plus, FileText, Users, Eye, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

// Simplified interface for the document structure
interface Document {
  id: string;
  number: string;
  customer: { name: string; id: string };
  date: Date;
  dueDate?: Date;
  total: number;
  status: string;
}

interface DocumentListProps {
  title: string;
  description: string;
  documents: Document[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  createButtonText: string;
  additionalButtonText?: string;
  showDueDates?: boolean;
}

const statusColors: Record<string, { bg: string, text: string }> = {
  draft: { bg: "bg-slate-100", text: "text-slate-800" },
  sent: { bg: "bg-blue-100", text: "text-blue-800" },
  viewed: { bg: "bg-yellow-100", text: "text-yellow-800" },
  approved: { bg: "bg-green-100", text: "text-green-800" },
  rejected: { bg: "bg-red-100", text: "text-red-800" },
  expired: { bg: "bg-orange-100", text: "text-orange-800" },
  paid: { bg: "bg-green-100", text: "text-green-800" },
  partially_paid: { bg: "bg-emerald-100", text: "text-emerald-800" },
  overdue: { bg: "bg-red-100", text: "text-red-800" },
  cancelled: { bg: "bg-slate-100", text: "text-slate-800" }
};

const DocumentList: React.FC<DocumentListProps> = ({
  title,
  description,
  documents,
  searchQuery,
  setSearchQuery,
  createButtonText,
  additionalButtonText,
  showDueDates = false,
}) => {
  const { toast } = useToast();
  
  const filteredDocuments = documents.filter(doc => 
    doc.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    toast({
      title: `Create ${title.slice(0, -1)}`,
      description: `Opening ${title.toLowerCase().slice(0, -1)} creation form`
    });
  };

  const handleView = (doc: Document) => {
    toast({
      title: `View ${title.slice(0, -1)}`,
      description: `Viewing ${title.toLowerCase().slice(0, -1)} ${doc.number}`
    });
  };

  const handleAdditionalAction = (doc: Document) => {
    toast({
      title: additionalButtonText || "Action",
      description: `Performing ${additionalButtonText?.toLowerCase()} for ${doc.number}`
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search ${title.toLowerCase()}...`}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> {createButtonText}
        </Button>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="bg-muted/40">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> 
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                {showDueDates && <TableHead>Due Date</TableHead>}
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        {doc.number}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="hover:text-primary cursor-pointer">
                          {doc.customer.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(doc.date, 'MMM dd, yyyy')}
                    </TableCell>
                    {showDueDates && (
                      <TableCell>
                        {doc.dueDate ? format(doc.dueDate, 'MMM dd, yyyy') : '-'}
                      </TableCell>
                    )}
                    <TableCell className="font-medium">₹{doc.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[doc.status]?.bg || 'bg-gray-100'} ${statusColors[doc.status]?.text || 'text-gray-800'}`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center"
                          onClick={() => handleView(doc)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                        {additionalButtonText && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center"
                            onClick={() => handleAdditionalAction(doc)}
                          >
                            <ArrowRight className="h-3.5 w-3.5 mr-1" />
                            {additionalButtonText.split(' ')[0]}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={showDueDates ? 7 : 6} className="text-center py-10 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-10 w-10 text-muted-foreground/50 mb-3" />
                      <p className="mb-2">No {title.toLowerCase()} found</p>
                      <p className="text-sm">Try adjusting your search or create a new {title.toLowerCase().slice(0, -1)}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentList;

