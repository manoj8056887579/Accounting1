
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save } from 'lucide-react';

const InvoiceSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('numbering');
  
  const [numberingForm, setNumberingForm] = useState({
    invoicePrefix: 'INV-',
    nextInvoiceNumber: '0001',
    purchaseOrderPrefix: 'PO-',
    nextPurchaseOrderNumber: '0001',
    quotePrefix: 'QUOTE-',
    nextQuoteNumber: '0001',
    autoIncrement: true,
    leadingZeros: true,
    resetNumbering: 'yearly',
  });
  
  const [contentForm, setContentForm] = useState({
    defaultDueTerms: '30',
    defaultNotes: 'Thank you for your business!',
    defaultTerms: 'Payment is due within the specified terms.',
    showTaxDetails: true,
    showDiscount: true,
    showSignature: true,
    enablePartialPayments: true,
  });
  
  const [displayForm, setDisplayForm] = useState({
    primaryColor: '#3B82F6',
    logoPosition: 'left',
    companyDetails: '',
    footerText: '',
    useCustomTemplate: false,
  });
  
  const handleNumberingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setNumberingForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setContentForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };
  
  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setDisplayForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };
  
  const handleSwitchChange = (form: string) => (name: string) => (checked: boolean) => {
    if (form === 'numbering') {
      setNumberingForm(prev => ({ ...prev, [name]: checked }));
    } else if (form === 'content') {
      setContentForm(prev => ({ ...prev, [name]: checked }));
    } else if (form === 'display') {
      setDisplayForm(prev => ({ ...prev, [name]: checked }));
    }
  };
  
  const handleSelectChange = (form: string) => (name: string) => (value: string) => {
    if (form === 'numbering') {
      setNumberingForm(prev => ({ ...prev, [name]: value }));
    } else if (form === 'display') {
      setDisplayForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Invoice settings updated",
        description: "Your invoice settings have been saved successfully.",
      });
      setSaving(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="numbering">Document Numbering</TabsTrigger>
          <TabsTrigger value="content">Content & Terms</TabsTrigger>
          <TabsTrigger value="display">Display & Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="numbering" className="space-y-4 mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                <Input
                  id="invoicePrefix"
                  name="invoicePrefix"
                  value={numberingForm.invoicePrefix}
                  onChange={handleNumberingChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nextInvoiceNumber">Next Invoice Number</Label>
                <Input
                  id="nextInvoiceNumber"
                  name="nextInvoiceNumber"
                  value={numberingForm.nextInvoiceNumber}
                  onChange={handleNumberingChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchaseOrderPrefix">Purchase Order Prefix</Label>
                <Input
                  id="purchaseOrderPrefix"
                  name="purchaseOrderPrefix"
                  value={numberingForm.purchaseOrderPrefix}
                  onChange={handleNumberingChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nextPurchaseOrderNumber">Next PO Number</Label>
                <Input
                  id="nextPurchaseOrderNumber"
                  name="nextPurchaseOrderNumber"
                  value={numberingForm.nextPurchaseOrderNumber}
                  onChange={handleNumberingChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quotePrefix">Quote/Estimate Prefix</Label>
                <Input
                  id="quotePrefix"
                  name="quotePrefix"
                  value={numberingForm.quotePrefix}
                  onChange={handleNumberingChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nextQuoteNumber">Next Quote Number</Label>
                <Input
                  id="nextQuoteNumber"
                  name="nextQuoteNumber"
                  value={numberingForm.nextQuoteNumber}
                  onChange={handleNumberingChange}
                />
              </div>
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoIncrement"
                  checked={numberingForm.autoIncrement}
                  onCheckedChange={handleSwitchChange('numbering')('autoIncrement')}
                />
                <Label htmlFor="autoIncrement">Auto-increment document numbers</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="leadingZeros"
                  checked={numberingForm.leadingZeros}
                  onCheckedChange={handleSwitchChange('numbering')('leadingZeros')}
                />
                <Label htmlFor="leadingZeros">Use leading zeros in document numbers</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resetNumbering">Reset Numbering</Label>
                <Select 
                  value={numberingForm.resetNumbering} 
                  onValueChange={handleSelectChange('numbering')('resetNumbering')}
                >
                  <SelectTrigger id="resetNumbering">
                    <SelectValue placeholder="Select when to reset numbering" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
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
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4 mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultDueTerms">Default Payment Terms (Days)</Label>
                <Input
                  id="defaultDueTerms"
                  name="defaultDueTerms"
                  type="number"
                  value={contentForm.defaultDueTerms}
                  onChange={handleContentChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultNotes">Default Invoice Notes</Label>
              <Textarea
                id="defaultNotes"
                name="defaultNotes"
                value={contentForm.defaultNotes}
                onChange={handleContentChange}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultTerms">Default Terms & Conditions</Label>
              <Textarea
                id="defaultTerms"
                name="defaultTerms"
                value={contentForm.defaultTerms}
                onChange={handleContentChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showTaxDetails"
                  checked={contentForm.showTaxDetails}
                  onCheckedChange={handleSwitchChange('content')('showTaxDetails')}
                />
                <Label htmlFor="showTaxDetails">Show tax details breakdown on invoices</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="showDiscount"
                  checked={contentForm.showDiscount}
                  onCheckedChange={handleSwitchChange('content')('showDiscount')}
                />
                <Label htmlFor="showDiscount">Show discount amounts on invoices</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="showSignature"
                  checked={contentForm.showSignature}
                  onCheckedChange={handleSwitchChange('content')('showSignature')}
                />
                <Label htmlFor="showSignature">Include signature area on invoices</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="enablePartialPayments"
                  checked={contentForm.enablePartialPayments}
                  onCheckedChange={handleSwitchChange('content')('enablePartialPayments')}
                />
                <Label htmlFor="enablePartialPayments">Allow partial payments on invoices</Label>
              </div>
            </div>
            
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
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="display" className="space-y-4 mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="color"
                    value={displayForm.primaryColor}
                    onChange={handleDisplayChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    value={displayForm.primaryColor}
                    onChange={handleDisplayChange}
                    name="primaryColor"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoPosition">Logo Position</Label>
                <Select 
                  value={displayForm.logoPosition} 
                  onValueChange={handleSelectChange('display')('logoPosition')}
                >
                  <SelectTrigger id="logoPosition">
                    <SelectValue placeholder="Select logo position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyDetails">Additional Company Details</Label>
              <Textarea
                id="companyDetails"
                name="companyDetails"
                value={displayForm.companyDetails}
                onChange={handleDisplayChange}
                placeholder="Additional information to display on invoices"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="footerText">Invoice Footer Text</Label>
              <Textarea
                id="footerText"
                name="footerText"
                value={displayForm.footerText}
                onChange={handleDisplayChange}
                placeholder="Text to appear at the bottom of each invoice"
                rows={2}
              />
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="useCustomTemplate"
                  checked={displayForm.useCustomTemplate}
                  onCheckedChange={handleSwitchChange('display')('useCustomTemplate')}
                />
                <Label htmlFor="useCustomTemplate">Use custom template</Label>
              </div>
              
              {displayForm.useCustomTemplate && (
                <div className="p-4 border rounded-md bg-muted/20">
                  <p className="text-sm text-muted-foreground">
                    Contact your administrator to upload a custom invoice template.
                  </p>
                </div>
              )}
            </div>
            
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
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceSettings;
