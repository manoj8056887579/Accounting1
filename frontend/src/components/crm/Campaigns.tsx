import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { 
  ArrowUpRight, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  FilePlus, 
  Mail, 
  MessageSquare, 
  Search, 
  Send, 
  Users 
} from 'lucide-react';
import { mockCampaigns, mockCustomers } from '@/data/mockCRM';
import { Campaign } from '@/models/crm';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';

interface CampaignFormData {
  name: string;
  type: 'whatsapp' | 'email';
  subject?: string;
  content: string;
  target_segment: string;
  scheduled_date: Date;
}

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false);

  const form = useForm<CampaignFormData>({
    defaultValues: {
      name: '',
      type: 'email',
      subject: '',
      content: '',
      target_segment: 'all',
      scheduled_date: new Date(),
    },
  });

  const onSubmit = (data: CampaignFormData) => {
    // In a real app, we would save this to the database
    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: data.name,
      type: data.type,
      subject: data.type === 'email' ? data.subject : undefined,
      content: data.content,
      target_segment: data.target_segment,
      scheduled_date: data.scheduled_date.toISOString(),
      status: 'scheduled',
      recipients_count: getRecipientsCount(data.target_segment),
      created_at: new Date().toISOString(),
      created_by: 'Admin User',
    };
    
    setCampaigns([newCampaign, ...campaigns]);
    setIsAddCampaignOpen(false);
    form.reset();
    
    toast({
      title: 'Success',
      description: 'Campaign has been created and scheduled successfully!',
    });
  };

  // Helper function to estimate recipients count
  const getRecipientsCount = (segment: string): number => {
    switch (segment) {
      case 'all':
        return mockCustomers.length;
      case 'active':
        return mockCustomers.filter(c => c.status === 'active').length;
      case 'inactive':
        return mockCustomers.filter(c => c.status === 'inactive').length;
      case 'retail':
        return mockCustomers.filter(c => c.customer_type === 'Retail').length;
      case 'wholesale':
        return mockCustomers.filter(c => c.customer_type === 'Wholesale').length;
      case 'corporate':
        return mockCustomers.filter(c => c.customer_type === 'Corporate').length;
      case 'high_value':
        return Math.round(mockCustomers.length * 0.2); // assume 20% are high value
      case 'recent':
        return Math.round(mockCustomers.length * 0.3); // assume 30% ordered recently
      default:
        return 0;
    }
  };

  // Filter campaigns based on search and filters
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.target_segment.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  // Campaign type icon
  const getCampaignTypeIcon = (type: 'whatsapp' | 'email') => {
    return type === 'email' ? (
      <Mail className="h-4 w-4 text-blue-500" />
    ) : (
      <MessageSquare className="h-4 w-4 text-green-500" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Campaigns</CardTitle>
            <CardDescription>All marketing campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Send className="h-8 w-8 text-blue-500 mr-2" />
              <div className="text-3xl font-bold">{campaigns.length}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Audience Reach</CardTitle>
            <CardDescription>Total recipients count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500 mr-2" />
              <div className="text-3xl font-bold">
                {campaigns.reduce((sum, campaign) => sum + campaign.recipients_count, 0)}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Campaigns</CardTitle>
            <CardDescription>Scheduled for future dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-amber-500 mr-2" />
              <div className="text-3xl font-bold">
                {campaigns.filter(c => c.status === 'scheduled').length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Campaign Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isAddCampaignOpen} onOpenChange={setIsAddCampaignOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2">
              <FilePlus className="h-4 w-4" />
              <span>Create Campaign</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new marketing campaign to engage with your customers.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter campaign name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select campaign type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email Campaign</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp Campaign</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="target_segment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select target audience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Customers</SelectItem>
                            <SelectItem value="active">Active Customers</SelectItem>
                            <SelectItem value="inactive">Inactive Customers</SelectItem>
                            <SelectItem value="retail">Retail Customers</SelectItem>
                            <SelectItem value="wholesale">Wholesale Customers</SelectItem>
                            <SelectItem value="corporate">Corporate Customers</SelectItem>
                            <SelectItem value="high_value">High Value Customers</SelectItem>
                            <SelectItem value="recent">Recent Purchasers</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Estimated recipients: {getRecipientsCount(form.watch('target_segment'))}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {form.watch('type') === 'email' && (
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email subject line" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={`Enter ${form.watch('type') === 'email' ? 'email' : 'WhatsApp'} content here...`}
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        You can use {'{customer_name}'} as a placeholder to personalize messages.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="scheduled_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Scheduled Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setIsAddCampaignOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Campaign</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Campaigns</CardTitle>
          <CardDescription>Manage your email and WhatsApp campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Target Segment</TableHead>
                <TableHead className="hidden md:table-cell">Scheduled Date</TableHead>
                <TableHead className="text-right">Recipients</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No campaigns found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <TableRow 
                    key={campaign.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      {getCampaignTypeIcon(campaign.type)}
                      <span>{campaign.type === 'email' ? 'Email' : 'WhatsApp'}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        campaign.status === 'sent' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{campaign.target_segment}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(campaign.scheduled_date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-mono">{campaign.recipients_count}</span>
                        {campaign.open_rate && (
                          <span className="text-xs text-green-600 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {campaign.open_rate}%
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Campaign Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>Ready-to-use email campaign templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {['Welcome Series', 'Monthly Newsletter', 'New Product Announcement', 'Customer Feedback Request', 'Limited Time Offer'].map((template, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-blue-500 mr-2" />
                    <span>{template}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Use
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View all templates <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Templates</CardTitle>
            <CardDescription>Ready-to-use WhatsApp message templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {['Order Confirmation', 'Delivery Status', 'Payment Reminder', 'Special Promotion', 'Customer Support'].map((template, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md hover:bg-m/50 cursor-pointer">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 text-green-500 mr-2" />
                    <span>{template}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Use
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View all templates <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Campaigns;
