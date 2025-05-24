
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, Plus } from 'lucide-react';

const TaxSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('gst');
  
  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your tax settings have been updated successfully.",
      });
      setSaving(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="gst">GST Settings</TabsTrigger>
          <TabsTrigger value="tax-rates">Tax Rates</TabsTrigger>
          <TabsTrigger value="tax-categories">Tax Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gst" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-gst" className="flex flex-col">
                <span>Enable GST</span>
                <span className="font-normal text-muted-foreground text-xs">
                  Enable GST for all invoices and transactions
                </span>
              </Label>
              <Switch id="enable-gst" defaultChecked />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="gstin">Business GSTIN</Label>
                <Input id="gstin" placeholder="Enter your GSTIN" defaultValue="27AADCB2230M1ZT" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gst-business-type">Business Type</Label>
                <Select defaultValue="regular">
                  <SelectTrigger id="gst-business-type">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="composition">Composition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label htmlFor="gst-state">GST State</Label>
              <Select defaultValue="27">
                <SelectTrigger id="gst-state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="27">Maharashtra (27)</SelectItem>
                  <SelectItem value="29">Karnataka (29)</SelectItem>
                  <SelectItem value="07">Delhi (07)</SelectItem>
                  <SelectItem value="33">Tamil Nadu (33)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">E-Filing Settings</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-e-filing" className="flex flex-col">
                  <span>Auto-generate return data</span>
                  <span className="font-normal text-muted-foreground text-xs">
                    Automatically prepare GST return data from invoices
                  </span>
                </Label>
                <Switch id="auto-e-filing" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="remind-filing" className="flex flex-col">
                  <span>GST filing reminders</span>
                  <span className="font-normal text-muted-foreground text-xs">
                    Send reminder notifications for GST filing deadlines
                  </span>
                </Label>
                <Switch id="remind-filing" defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tax-rates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Tax Rates</h4>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Tax Rate
            </Button>
          </div>
          
          <div className="space-y-4 border rounded-md p-4">
            <div className="grid grid-cols-3 gap-4 items-center pb-2 border-b">
              <Label className="font-medium">Name</Label>
              <Label className="font-medium">Rate (%)</Label>
              <Label className="font-medium">Status</Label>
            </div>
            
            {/* GST Rates */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>GST 5%</div>
              <div>5%</div>
              <Switch defaultChecked />
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>GST 12%</div>
              <div>12%</div>
              <Switch defaultChecked />
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>GST 18%</div>
              <div>18%</div>
              <Switch defaultChecked />
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>GST 28%</div>
              <div>28%</div>
              <Switch defaultChecked />
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>No Tax</div>
              <div>0%</div>
              <Switch defaultChecked />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tax-categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Tax Categories</h4>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Category
            </Button>
          </div>
          
          <div className="space-y-4 border rounded-md p-4">
            <div className="grid grid-cols-3 gap-4 items-center pb-2 border-b">
              <Label className="font-medium">Name</Label>
              <Label className="font-medium">Default Rate</Label>
              <Label className="font-medium">Status</Label>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>Essential Goods</div>
              <div>GST 5%</div>
              <Switch defaultChecked />
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>Standard Goods</div>
              <div>GST 18%</div>
              <Switch defaultChecked />
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>Luxury Items</div>
              <div>GST 28%</div>
              <Switch defaultChecked />
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>Services</div>
              <div>GST 18%</div>
              <Switch defaultChecked />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
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

export default TaxSettings;
