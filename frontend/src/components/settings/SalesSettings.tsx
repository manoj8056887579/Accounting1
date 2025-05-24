
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save } from 'lucide-react';

const SalesSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    defaultPaymentTerm: 'net30',
    invoicePrefix: 'INV-',
    quotePrefix: 'QT-',
    orderPrefix: 'ORD-',
    invoiceStartNumber: 1001,
    quoteStartNumber: 5001,
    orderStartNumber: 3001,
    enableDiscounts: true,
    discountApprovalRequired: true,
    displayTaxes: true,
    requireShipping: true,
    requirePaymentBeforeShipping: false,
    autoApplyCredits: true,
    defaultSalesTax: 18
  });
  
  const handleInputChange = (name: string, value: any) => {
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your sales settings have been updated successfully.",
      });
      setSaving(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Invoice Settings</h4>
          <Separator />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
            <Input 
              id="invoice-prefix" 
              value={settings.invoicePrefix}
              onChange={(e) => handleInputChange('invoicePrefix', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoice-start">Invoice Start Number</Label>
            <Input 
              id="invoice-start" 
              type="number" 
              value={settings.invoiceStartNumber}
              onChange={(e) => handleInputChange('invoiceStartNumber', parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quote-prefix">Quote Number Prefix</Label>
            <Input 
              id="quote-prefix" 
              value={settings.quotePrefix}
              onChange={(e) => handleInputChange('quotePrefix', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quote-start">Quote Start Number</Label>
            <Input 
              id="quote-start" 
              type="number" 
              value={settings.quoteStartNumber}
              onChange={(e) => handleInputChange('quoteStartNumber', parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="order-prefix">Order Number Prefix</Label>
            <Input 
              id="order-prefix" 
              value={settings.orderPrefix}
              onChange={(e) => handleInputChange('orderPrefix', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="order-start">Order Start Number</Label>
            <Input 
              id="order-start" 
              type="number" 
              value={settings.orderStartNumber}
              onChange={(e) => handleInputChange('orderStartNumber', parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Payment Terms</h4>
          <Separator />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="default-payment-term">Default Payment Term</Label>
            <Select 
              value={settings.defaultPaymentTerm}
              onValueChange={(value) => handleInputChange('defaultPaymentTerm', value)}
            >
              <SelectTrigger id="default-payment-term">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Due Immediately</SelectItem>
                <SelectItem value="net7">Net 7 Days</SelectItem>
                <SelectItem value="net15">Net 15 Days</SelectItem>
                <SelectItem value="net30">Net 30 Days</SelectItem>
                <SelectItem value="net60">Net 60 Days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="default-sales-tax">Default Sales Tax (%)</Label>
            <Input 
              id="default-sales-tax" 
              type="number" 
              value={settings.defaultSalesTax}
              onChange={(e) => handleInputChange('defaultSalesTax', parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="space-y-2 pt-2">
          <h4 className="text-sm font-medium">Sales Options</h4>
          <Separator />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-discounts" className="flex flex-col">
              <span>Enable Discounts</span>
              <span className="font-normal text-muted-foreground text-xs">
                Allow discounts on sales documents
              </span>
            </Label>
            <Switch 
              id="enable-discounts" 
              checked={settings.enableDiscounts}
              onCheckedChange={(checked) => handleInputChange('enableDiscounts', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="discount-approval" className="flex flex-col">
              <span>Require Approval for Discounts</span>
              <span className="font-normal text-muted-foreground text-xs">
                Require manager approval for discounts above threshold
              </span>
            </Label>
            <Switch 
              id="discount-approval" 
              checked={settings.discountApprovalRequired}
              onCheckedChange={(checked) => handleInputChange('discountApprovalRequired', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="display-taxes" className="flex flex-col">
              <span>Display Taxes on Invoices</span>
              <span className="font-normal text-muted-foreground text-xs">
                Show tax breakdowns on customer invoices
              </span>
            </Label>
            <Switch 
              id="display-taxes" 
              checked={settings.displayTaxes}
              onCheckedChange={(checked) => handleInputChange('displayTaxes', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-apply-credits" className="flex flex-col">
              <span>Auto-Apply Customer Credits</span>
              <span className="font-normal text-muted-foreground text-xs">
                Automatically apply available credits to new invoices
              </span>
            </Label>
            <Switch 
              id="auto-apply-credits" 
              checked={settings.autoApplyCredits}
              onCheckedChange={(checked) => handleInputChange('autoApplyCredits', checked)}
            />
          </div>
        </div>
        
        <div className="space-y-2 pt-2">
          <h4 className="text-sm font-medium">Shipping Settings</h4>
          <Separator />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="require-shipping" className="flex flex-col">
              <span>Enable Shipping</span>
              <span className="font-normal text-muted-foreground text-xs">
                Track shipping information for orders
              </span>
            </Label>
            <Switch 
              id="require-shipping" 
              checked={settings.requireShipping}
              onCheckedChange={(checked) => handleInputChange('requireShipping', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="payment-before-shipping" className="flex flex-col">
              <span>Require Payment Before Shipping</span>
              <span className="font-normal text-muted-foreground text-xs">
                Only allow shipping after payment is received
              </span>
            </Label>
            <Switch 
              id="payment-before-shipping" 
              checked={settings.requirePaymentBeforeShipping}
              onCheckedChange={(checked) => handleInputChange('requirePaymentBeforeShipping', checked)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving} className="flex items-center">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SalesSettings;
