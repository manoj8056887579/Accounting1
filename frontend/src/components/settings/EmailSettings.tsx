
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, Mail } from 'lucide-react';
import { SMTP } from './EmailConfigirations/SMTP/SMTP';
import { emailTemplates as defaultTemplates } from './EmailConfigirations/Templates/index';

const EmailSettings = () => {

  const [activeTemplate, setActiveTemplate] = useState('invoiceCreated');
  const [templates, setTemplates] = useState(defaultTemplates);
  
  const handleTemplateChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTemplates({
      ...templates,
      [activeTemplate]: {
        ...templates[activeTemplate as keyof typeof templates],
        [field]: e.target.value,
      }
    });
  };
  
  return (
    <div className="space-y-6">      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <SMTP />
        </div>
        
        <div className="md:w-2/3">
          <form  className="space-y-4">
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
            
          
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
