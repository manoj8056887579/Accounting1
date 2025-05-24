
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
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Send, 
  Users, 
  FileText,
  CheckCircle,
  Calendar,
  Clock
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

interface BroadcastFormData {
  messageType: string;
  audience: string;
  message: string;
  schedule: string;
  scheduledTime?: string;
  templateName?: string;
}

const WhatsAppBroadcast = () => {
  const [broadcasts, setBroadcasts] = useState([
    { id: '1', name: 'Weekend Sale', audience: 'All Customers', sent: 124, delivered: 120, read: 98, date: '2023-05-02' },
    { id: '2', name: 'Product Launch', audience: 'Premium Customers', sent: 45, delivered: 45, read: 38, date: '2023-05-04' },
    { id: '3', name: 'Payment Reminder', audience: 'Due Invoices', sent: 28, delivered: 27, read: 24, date: '2023-05-07' },
  ]);

  const form = useForm<BroadcastFormData>({
    defaultValues: {
      messageType: 'text',
      audience: 'all',
      message: '',
      schedule: 'now',
    },
  });

  const onSubmit = (data: BroadcastFormData) => {
    toast({
      title: "Broadcast Scheduled",
      description: data.schedule === 'now' 
        ? "Your message is being sent to the selected audience." 
        : "Your message has been scheduled for delivery.",
    });
    
    // In a real app, we would send this to the API
    console.log("Broadcast data:", data);
  };

  const messageTypeOptions = [
    { value: 'text', label: 'Text Message' },
    { value: 'template', label: 'Message Template' },
    { value: 'media', label: 'Media Message' },
  ];

  const audienceOptions = [
    { value: 'all', label: 'All Contacts', count: 124 },
    { value: 'customers', label: 'Customers Only', count: 98 },
    { value: 'leads', label: 'Leads Only', count: 26 },
    { value: 'active', label: 'Active in Last 30 Days', count: 76 },
  ];

  const templateOptions = [
    { value: 'welcome', label: 'Welcome Message' },
    { value: 'order_confirmation', label: 'Order Confirmation' },
    { value: 'payment_receipt', label: 'Payment Receipt' },
    { value: 'delivery_update', label: 'Delivery Update' },
  ];

  const scheduleOptions = [
    { value: 'now', label: 'Send Now' },
    { value: 'later', label: 'Schedule for Later' },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Broadcast</CardTitle>
            <CardDescription>
              Send a message to multiple contacts at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="messageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select message type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {messageTypeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the type of message you want to send
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('messageType') === 'template' && (
                  <FormField
                    control={form.control}
                    name="templateName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {templateOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose from your approved message templates
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audience</FormLabel>
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
                          {audienceOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label} ({option.count})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose who should receive this message
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('messageType') !== 'template' && (
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Type your message here..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          You can use {'{name}'} as a placeholder for the recipient's name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Schedule</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="When to send" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {scheduleOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('schedule') === 'later' && (
                  <FormField
                    control={form.control}
                    name="scheduledTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheduled Time</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" className="w-full">
                  {form.watch('schedule') === 'now' ? (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Broadcast
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-4 w-4" /> Schedule Broadcast
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Broadcasts</CardTitle>
            <CardDescription>Your latest message broadcasts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {broadcasts.map((broadcast) => (
              <div 
                key={broadcast.id}
                className="border rounded-md p-3 hover:bg-muted/50 cursor-pointer"
              >
                <div className="font-medium">{broadcast.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{broadcast.audience}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{new Date(broadcast.date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    <span>Read: {broadcast.read}/{broadcast.sent}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" size="sm">
              View All Broadcasts
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Templates</CardTitle>
            <CardDescription>Your approved message templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {templateOptions.map((template) => (
              <div key={template.value} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>{template.label}</span>
                </div>
                <Button variant="ghost" size="sm">
                  Use
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhatsAppBroadcast;
