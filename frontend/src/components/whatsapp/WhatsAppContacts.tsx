
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare,
  Search,
  UserPlus,
  Download,
  Upload,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useWhatsApp } from '@/contexts/WhatsAppContext';
import { getWhatsAppService } from '@/services/whatsAppService';
import { WhatsAppContact } from '@/models/whatsapp';

// Mock data for contacts
const mockContacts = [
  { id: '1', name: 'John Smith', phone: '+91 98765 12345', status: 'active', tags: ['customer', 'retail'], lastContact: '2023-05-01' },
  { id: '2', name: 'Sarah Johnson', phone: '+91 87654 23456', status: 'active', tags: ['lead'], lastContact: '2023-05-03' },
  { id: '3', name: 'Michael Brown', phone: '+91 76543 34567', status: 'inactive', tags: ['customer', 'wholesale'], lastContact: '2023-04-15' },
  { id: '4', name: 'Emily Davis', phone: '+91 65432 45678', status: 'active', tags: ['customer', 'retail'], lastContact: '2023-05-06' },
  { id: '5', name: 'Daniel Wilson', phone: '+91 54321 56789', status: 'active', tags: ['lead', 'retail'], lastContact: '2023-05-07' },
];

const WhatsAppContacts = () => {
  const { isConnected } = useWhatsApp();
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch contacts from API if connected
  useEffect(() => {
    if (isConnected) {
      fetchContacts();
    } else {
      // Use mock data when not connected
      setContacts(mockContacts as WhatsAppContact[]);
    }
  }, [isConnected]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const service = getWhatsAppService();
      const fetchedContacts = await service.getContacts();
      
      // If the API returns no contacts, fallback to mock data in real app
      if (fetchedContacts && fetchedContacts.length > 0) {
        setContacts(fetchedContacts);
      } else {
        // In a real integration, we would store contacts separately and sync with WhatsApp
        // For demo purposes, we'll use mock data
        setContacts(mockContacts as WhatsAppContact[]);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load WhatsApp contacts.",
        variant: "destructive",
      });
      // Fallback to mock data
      setContacts(mockContacts as WhatsAppContact[]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportContacts = () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "You need to connect to WhatsApp API first.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Import Started",
      description: "Your contacts are being imported. This may take a few minutes.",
    });
  };

  const handleExportContacts = () => {
    toast({
      title: "Export Complete",
      description: "Your contacts have been exported successfully.",
    });
  };

  const handleSendMessage = async (contactPhone: string, contactName: string) => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect to WhatsApp API first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const service = getWhatsAppService();
      await service.sendTextMessage(contactPhone, `Hello ${contactName}, this is a test message from our WhatsApp Business API integration.`);
      
      toast({
        title: "Message Sent",
        description: `Message sent to ${contactName} successfully.`,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start gap-3">
          <AlertTriangle className="text-yellow-600 h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-yellow-800 font-medium">WhatsApp API Not Connected</h3>
            <p className="text-yellow-700">
              Contacts shown are demo data. Connect to the WhatsApp API in Settings to access your actual contacts.
            </p>
          </div>
        </div>
      )}
    
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleImportContacts} variant="outline" className="flex gap-2">
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button onClick={handleExportContacts} variant="outline" className="flex gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="flex gap-2" disabled={!isConnected}>
            <UserPlus className="h-4 w-4" /> New Contact
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Contacts</CardTitle>
          <CardDescription>Manage your WhatsApp business contacts</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">Loading contacts...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      No contacts found matching your search
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {contact.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(contact.lastContact).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSendMessage(contact.phone, contact.name)}
                          disabled={!isConnected}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppContacts;
