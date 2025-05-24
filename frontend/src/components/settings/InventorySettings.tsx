
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save } from 'lucide-react';

const InventorySettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Settings states
  const [settings, setSettings] = useState({
    lowStockThreshold: 10,
    autoReorder: true,
    trackSerialNumbers: false,
    trackBatchNumbers: true,
    expiryDateTracking: true,
    costingMethod: 'fifo',
    allowNegativeStock: false,
    purchaseApprovalNeeded: true,
    defaultUnitOfMeasure: 'pcs'
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
        description: "Your inventory settings have been updated successfully.",
      });
      setSaving(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Stock Management</h4>
          <Separator />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
            <Input 
              id="low-stock-threshold" 
              type="number" 
              value={settings.lowStockThreshold}
              onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Products with stock below this level will trigger low stock alerts
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="costing-method">Inventory Costing Method</Label>
            <Select 
              value={settings.costingMethod}
              onValueChange={(value) => handleInputChange('costingMethod', value)}
            >
              <SelectTrigger id="costing-method">
                <SelectValue placeholder="Select costing method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fifo">FIFO (First In, First Out)</SelectItem>
                <SelectItem value="lifo">LIFO (Last In, First Out)</SelectItem>
                <SelectItem value="average">Average Cost</SelectItem>
                <SelectItem value="specific">Specific Identification</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Method used to calculate cost of goods sold
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="default-uom">Default Unit of Measure</Label>
            <Select 
              value={settings.defaultUnitOfMeasure}
              onValueChange={(value) => handleInputChange('defaultUnitOfMeasure', value)}
            >
              <SelectTrigger id="default-uom">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="ltr">Liters (ltr)</SelectItem>
                <SelectItem value="box">Boxes (box)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Default unit for new products
            </p>
          </div>
        </div>
        
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-reorder" className="flex flex-col">
              <span>Auto-reorder</span>
              <span className="font-normal text-muted-foreground text-xs">
                Automatically create purchase orders when stock is low
              </span>
            </Label>
            <Switch 
              id="auto-reorder" 
              checked={settings.autoReorder}
              onCheckedChange={(checked) => handleInputChange('autoReorder', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="allow-negative" className="flex flex-col">
              <span>Allow Negative Stock</span>
              <span className="font-normal text-muted-foreground text-xs">
                Allow sales even when products are out of stock
              </span>
            </Label>
            <Switch 
              id="allow-negative" 
              checked={settings.allowNegativeStock}
              onCheckedChange={(checked) => handleInputChange('allowNegativeStock', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="purchase-approval" className="flex flex-col">
              <span>Purchase Approval Required</span>
              <span className="font-normal text-muted-foreground text-xs">
                Require approval for purchase orders
              </span>
            </Label>
            <Switch 
              id="purchase-approval" 
              checked={settings.purchaseApprovalNeeded}
              onCheckedChange={(checked) => handleInputChange('purchaseApprovalNeeded', checked)}
            />
          </div>
        </div>
        
        <div className="space-y-2 pt-4">
          <h4 className="text-sm font-medium">Tracking Options</h4>
          <Separator />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="track-serial" className="flex flex-col">
              <span>Track Serial Numbers</span>
              <span className="font-normal text-muted-foreground text-xs">
                Enable tracking of individual product serial numbers
              </span>
            </Label>
            <Switch 
              id="track-serial" 
              checked={settings.trackSerialNumbers}
              onCheckedChange={(checked) => handleInputChange('trackSerialNumbers', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="track-batch" className="flex flex-col">
              <span>Track Batch/Lot Numbers</span>
              <span className="font-normal text-muted-foreground text-xs">
                Enable tracking of product batches or lots
              </span>
            </Label>
            <Switch 
              id="track-batch" 
              checked={settings.trackBatchNumbers}
              onCheckedChange={(checked) => handleInputChange('trackBatchNumbers', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="expiry-tracking" className="flex flex-col">
              <span>Track Expiry Dates</span>
              <span className="font-normal text-muted-foreground text-xs">
                Enable tracking of product expiry dates
              </span>
            </Label>
            <Switch 
              id="expiry-tracking" 
              checked={settings.expiryDateTracking}
              onCheckedChange={(checked) => handleInputChange('expiryDateTracking', checked)}
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

export default InventorySettings;
