
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save } from 'lucide-react';

const PurchaseSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    poPrefix: 'PO-',
    billPrefix: 'BILL-',
    poStartNumber: 2001,
    billStartNumber: 4001,
    approvalRequired: true,
    approvalThreshold: 10000,
    autoCreateBill: true,
    defaultPaymentTerm: 'net30',
    trackPurchaseOrders: true,
    allowPartialReceive: true,
    defaultPurchaseTax: 18,
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
        description: "Your purchase settings have been updated successfully.",
      });
      setSaving(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Purchase Order Settings</h4>
          <Separator />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="po-prefix">PO Number Prefix</Label>
            <Input 
              id="po-prefix" 
              value={settings.poPrefix}
              onChange={(e) => handleInputChange('poPrefix', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="po-start">PO Start Number</Label>
            <Input 
              id="po-start" 
              type="number" 
              value={settings.poStartNumber}
              onChange={(e) => handleInputChange('poStartNumber', parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bill-prefix">Bill Number Prefix</Label>
            <Input 
              id="bill-prefix" 
              value={settings.billPrefix}
              onChange={(e) => handleInputChange('billPrefix', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bill-start">Bill Start Number</Label>
            <Input 
              id="bill-start" 
              type="number" 
              value={settings.billStartNumber}
              onChange={(e) => handleInputChange('billStartNumber', parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="space-y-2 pt-2">
          <h4 className="text-sm font-medium">Approval Settings</h4>
          <Separator />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="approval-required" className="flex flex-col">
              <span>Purchase Approval Required</span>
              <span className="font-normal text-muted-foreground text-xs">
                Require approval for purchase orders
              </span>
            </Label>
            <Switch 
              id="approval-required" 
              checked={settings.approvalRequired}
              onCheckedChange={(checked) => handleInputChange('approvalRequired', checked)}
            />
          </div>
          
          {settings.approvalRequired && (
            <div className="space-y-2">
              <Label htmlFor="approval-threshold">Approval Threshold Amount</Label>
              <Input 
                id="approval-threshold" 
                type="number" 
                value={settings.approvalThreshold}
                onChange={(e) => handleInputChange('approvalThreshold', parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Purchases above this amount will require approval
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-2 pt-2">
          <h4 className="text-sm font-medium">Purchase Options</h4>
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
            <Label htmlFor="default-purchase-tax">Default Purchase Tax (%)</Label>
            <Input 
              id="default-purchase-tax" 
              type="number" 
              value={settings.defaultPurchaseTax}
              onChange={(e) => handleInputChange('defaultPurchaseTax', parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="track-pos" className="flex flex-col">
              <span>Track Purchase Orders</span>
              <span className="font-normal text-muted-foreground text-xs">
                Enable tracking of purchase orders and status
              </span>
            </Label>
            <Switch 
              id="track-pos" 
              checked={settings.trackPurchaseOrders}
              onCheckedChange={(checked) => handleInputChange('trackPurchaseOrders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-create-bill" className="flex flex-col">
              <span>Auto-create bills from POs</span>
              <span className="font-normal text-muted-foreground text-xs">
                Automatically create bills when goods are received
              </span>
            </Label>
            <Switch 
              id="auto-create-bill" 
              checked={settings.autoCreateBill}
              onCheckedChange={(checked) => handleInputChange('autoCreateBill', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="allow-partial" className="flex flex-col">
              <span>Allow Partial Receiving</span>
              <span className="font-normal text-muted-foreground text-xs">
                Allow receiving partial quantities from purchase orders
              </span>
            </Label>
            <Switch 
              id="allow-partial" 
              checked={settings.allowPartialReceive}
              onCheckedChange={(checked) => handleInputChange('allowPartialReceive', checked)}
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

export default PurchaseSettings;
