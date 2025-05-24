
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, Mail } from 'lucide-react';

const emailTemplates = {
  invoiceCreated: {
    subject: 'New Invoice #{invoice_number} from {company_name}',
    body: `Dear {customer_name},

We hope this message finds you well.

Please find attached Invoice #{invoice_number} for {total_amount} due on {due_date}.

Invoice details:
- Invoice Number: {invoice_number}
- Issue Date: {issue_date}
- Due Date: {due_date}
- Total Amount: {total_amount}

You can view and pay your invoice online by clicking the link below:
{invoice_link}

If you have any questions regarding this invoice, please don't hesitate to contact us.

Thank you for your business!

Best regards,
{company_name}
{company_email}
{company_phone}`,
    enabled: true,
  },
  paymentReceived: {
    subject: 'Payment Confirmation for Invoice #{invoice_number}',
    body: `Dear {customer_name},

Thank you for your payment of {payment_amount} for Invoice #{invoice_number}.

Payment details:
- Payment Amount: {payment_amount}
- Payment Date: {payment_date}
- Payment Method: {payment_method}
- Invoice Number: {invoice_number}

If you have any questions, please don't hesitate to contact us.

Best regards,
{company_name}
{company_email}
{company_phone}`,
    enabled: true,
  },
  orderConfirmation: {
    subject: 'Order Confirmation #{order_number}',
    body: `Dear {customer_name},

Thank you for your order!

We're writing to confirm that we've received your order #{order_number} and are processing it now.

Order details:
- Order Number: {order_number}
- Order Date: {order_date}
- Total Amount: {order_total}

You can track your order status here: {order_tracking_link}

If you have any questions about your order, please contact us.

Best regards,
{company_name}
{company_email}
{company_phone}`,
    enabled: true,
  },
  quoteCreated: {
    subject: 'New Quote #{quote_number} from {company_name}',
    body: `Dear {customer_name},

Thank you for your interest in our products/services.

Please find attached Quote #{quote_number} for your review.

Quote details:
- Quote Number: {quote_number}
- Issue Date: {issue_date}
- Valid Until: {valid_until}
- Total Amount: {total_amount}

You can view and accept this quote online by clicking the link below:
{quote_link}

If you have any questions or would like to discuss this quote further, please don't hesitate to contact us.

Best regards,
{company_name}
{company_email}
{company_phone}`,
    enabled: true,
  }
};

const EmailSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState('invoiceCreated');
  const [templates, setTemplates] = useState(emailTemplates);
  
  const handleTemplateChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTemplates({
      ...templates,
      [activeTemplate]: {
        ...templates[activeTemplate as keyof typeof templates],
        [field]: e.target.value,
      }
    });
  };
  
  const handleToggleTemplate = (templateKey: string) => (checked: boolean) => {
    setTemplates({
      ...templates,
      [templateKey]: {
        ...templates[templateKey as keyof typeof templates],
        enabled: checked,
      }
    });
  };
  
  const handleSendTest = () => {
    toast({
      title: "Test email sent",
      description: "A test email has been sent to your email address.",
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Email templates updated",
        description: "Your email templates have been saved successfully.",
      });
      setSaving(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card className="p-4 h-full">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Email Templates</h3>
              <p className="text-sm text-muted-foreground">Select a template to edit</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="invoiceCreated" className="cursor-pointer">Invoice Notifications</Label>
                  <Switch
                    id="invoiceCreated"
                    checked={templates.invoiceCreated.enabled}
                    onCheckedChange={handleToggleTemplate('invoiceCreated')}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="paymentReceived" className="cursor-pointer">Payment Confirmations</Label>
                  <Switch
                    id="paymentReceived"
                    checked={templates.paymentReceived.enabled}
                    onCheckedChange={handleToggleTemplate('paymentReceived')}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="orderConfirmation" className="cursor-pointer">Order Confirmations</Label>
                  <Switch
                    id="orderConfirmation"
                    checked={templates.orderConfirmation.enabled}
                    onCheckedChange={handleToggleTemplate('orderConfirmation')}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="quoteCreated" className="cursor-pointer">Quote Notifications</Label>
                  <Switch
                    id="quoteCreated"
                    checked={templates.quoteCreated.enabled}
                    onCheckedChange={handleToggleTemplate('quoteCreated')}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs value={activeTemplate} onValueChange={setActiveTemplate}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="invoiceCreated">Invoice</TabsTrigger>
                <TabsTrigger value="paymentReceived">Payment</TabsTrigger>
                <TabsTrigger value="orderConfirmation">Order</TabsTrigger>
                <TabsTrigger value="quoteCreated">Quote</TabsTrigger>
              </TabsList>
              
              {Object.keys(templates).map((templateKey) => (
                <TabsContent key={templateKey} value={templateKey} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`${templateKey}-subject`}>Email Subject</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleSendTest}
                        className="text-xs"
                      >
                        <Mail className="h-3 w-3 mr-1" /> Send Test
                      </Button>
                    </div>
                    <Input
                      id={`${templateKey}-subject`}
                      value={templates[templateKey as keyof typeof templates].subject}
                      onChange={handleTemplateChange('subject')}
                      placeholder="Email subject line"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`${templateKey}-body`}>Email Body</Label>
                    <Textarea
                      id={`${templateKey}-body`}
                      value={templates[templateKey as keyof typeof templates].body}
                      onChange={handleTemplateChange('body')}
                      placeholder="Email body content"
                      rows={12}
                    />
                  </div>
                  
                  <div className="p-3 bg-muted rounded-md">
                    <h4 className="text-sm font-medium mb-2">Available Variables</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      <code>{'{company_name}'}</code>
                      <code>{'{company_email}'}</code>
                      <code>{'{company_phone}'}</code>
                      <code>{'{customer_name}'}</code>
                      <code>{'{invoice_number}'}</code>
                      <code>{'{issue_date}'}</code>
                      <code>{'{due_date}'}</code>
                      <code>{'{total_amount}'}</code>
                      <code>{'{payment_amount}'}</code>
                      <code>{'{payment_date}'}</code>
                      <code>{'{invoice_link}'}</code>
                      <code>{'{order_number}'}</code>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="flex items-center">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Templates
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
