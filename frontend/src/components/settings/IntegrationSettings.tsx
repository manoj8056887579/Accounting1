
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  CreditCard, 
  ArrowRightLeft, 
  Mail, 
  MessageSquare, 
  ShoppingCart, 
  Truck, 
  FileText, 
  AlertCircle 
} from 'lucide-react';

const IntegrationSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Status for each integration
  const [integrations, setIntegrations] = useState({
    stripe: { enabled: true, connected: true },
    razorpay: { enabled: false, connected: false },
    mailchimp: { enabled: true, connected: true },
    twilio: { enabled: false, connected: false },
    whatsapp: { enabled: false, connected: false },
    dhl: { enabled: true, connected: true },
    fedex: { enabled: false, connected: false },
    zapier: { enabled: false, connected: false },
    quickbooks: { enabled: true, connected: true },
  });
  
  const [formData, setFormData] = useState({
    stripeKey: '•••••••••••••••••••••••••••••••',
    razorpayKey: '',
    mailchimpApiKey: '•••••••••••••••••••••••••',
    twilioSid: '',
    twilioToken: '',
    dhlApiKey: '•••••••••••••••••••••••••',
    fedexApiKey: '',
    quickbooksToken: '•••••••••••••••••••••••••',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleIntegration = (name: string) => {
    setIntegrations(prev => ({
      ...prev,
      [name]: {
        ...prev[name as keyof typeof prev],
        enabled: !prev[name as keyof typeof prev].enabled
      }
    }));
    
    toast({
      title: `Integration ${integrations[name as keyof typeof integrations].enabled ? 'disabled' : 'enabled'}`,
      description: `${name.charAt(0).toUpperCase() + name.slice(1)} integration has been ${integrations[name as keyof typeof integrations].enabled ? 'disabled' : 'enabled'}.`,
    });
  };
  
  const connectIntegration = (name: string) => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        [name]: {
          ...prev[name as keyof typeof prev],
          connected: true
        }
      }));
      
      toast({
        title: "Integration connected",
        description: `${name.charAt(0).toUpperCase() + name.slice(1)} has been successfully connected.`,
      });
      
      setSaving(false);
    }, 1500);
  };
  
  const disconnectIntegration = (name: string) => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        [name]: {
          ...prev[name as keyof typeof prev],
          connected: false,
          enabled: false
        }
      }));
      
      toast({
        title: "Integration disconnected",
        description: `${name.charAt(0).toUpperCase() + name.slice(1)} has been disconnected.`,
      });
      
      setSaving(false);
    }, 1000);
  };
  
  const handleSubmit = (e: React.FormEvent, integration: string) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: `${integration.charAt(0).toUpperCase() + integration.slice(1)} settings have been updated.`,
      });
      
      // If this is connecting a new integration
      if (!integrations[integration as keyof typeof integrations].connected) {
        setIntegrations(prev => ({
          ...prev,
          [integration]: {
            ...prev[integration as keyof typeof prev],
            connected: true,
            enabled: true
          }
        }));
      }
      
      setSaving(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Payment Integrations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stripe Integration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <CreditCard className="h-4 w-4" />
                Stripe
              </CardTitle>
              <CardDescription>Credit card payment processing</CardDescription>
            </div>
            <div className="flex items-center">
              {integrations.stripe.connected && (
                <Badge variant={integrations.stripe.enabled ? "default" : "outline"} className="mr-2">
                  {integrations.stripe.enabled ? "Enabled" : "Disabled"}
                </Badge>
              )}
              <Switch
                checked={integrations.stripe.enabled}
                onCheckedChange={() => toggleIntegration('stripe')}
                disabled={!integrations.stripe.connected}
              />
            </div>
          </CardHeader>
          <CardContent>
            {integrations.stripe.connected ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stripeKey">API Key</Label>
                  <Input
                    id="stripeKey"
                    name="stripeKey"
                    value={formData.stripeKey}
                    onChange={handleInputChange}
                    type="password"
                  />
                </div>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => disconnectIntegration('stripe')}
                  >
                    Disconnect
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={(e) => handleSubmit(e, 'stripe')}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Settings"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => connectIntegration('stripe')}
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowRightLeft className="h-4 w-4 mr-2" />}
                Connect Stripe
              </Button>
            )}
          </CardContent>
        </Card>
        
        {/* Razorpay Integration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <CreditCard className="h-4 w-4" />
                Razorpay
              </CardTitle>
              <CardDescription>Indian payment processing</CardDescription>
            </div>
            <div className="flex items-center">
              {integrations.razorpay.connected && (
                <Badge variant={integrations.razorpay.enabled ? "default" : "outline"} className="mr-2">
                  {integrations.razorpay.enabled ? "Enabled" : "Disabled"}
                </Badge>
              )}
              <Switch
                checked={integrations.razorpay.enabled}
                onCheckedChange={() => toggleIntegration('razorpay')}
                disabled={!integrations.razorpay.connected}
              />
            </div>
          </CardHeader>
          <CardContent>
            {integrations.razorpay.connected ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="razorpayKey">API Key</Label>
                  <Input
                    id="razorpayKey"
                    name="razorpayKey"
                    value={formData.razorpayKey}
                    onChange={handleInputChange}
                    type="password"
                  />
                </div>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => disconnectIntegration('razorpay')}
                  >
                    Disconnect
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={(e) => handleSubmit(e, 'razorpay')}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Settings"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => connectIntegration('razorpay')}
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowRightLeft className="h-4 w-4 mr-2" />}
                Connect Razorpay
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-lg font-medium mt-8">Communication & Marketing</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mailchimp Integration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Mail className="h-4 w-4" />
                Mailchimp
              </CardTitle>
              <CardDescription>Email marketing automation</CardDescription>
            </div>
            <div className="flex items-center">
              {integrations.mailchimp.connected && (
                <Badge variant={integrations.mailchimp.enabled ? "default" : "outline"} className="mr-2">
                  {integrations.mailchimp.enabled ? "Enabled" : "Disabled"}
                </Badge>
              )}
              <Switch
                checked={integrations.mailchimp.enabled}
                onCheckedChange={() => toggleIntegration('mailchimp')}
                disabled={!integrations.mailchimp.connected}
              />
            </div>
          </CardHeader>
          <CardContent>
            {integrations.mailchimp.connected ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mailchimpApiKey">API Key</Label>
                  <Input
                    id="mailchimpApiKey"
                    name="mailchimpApiKey"
                    value={formData.mailchimpApiKey}
                    onChange={handleInputChange}
                    type="password"
                  />
                </div>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => disconnectIntegration('mailchimp')}
                  >
                    Disconnect
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={(e) => handleSubmit(e, 'mailchimp')}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Settings"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => connectIntegration('mailchimp')}
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowRightLeft className="h-4 w-4 mr-2" />}
                Connect Mailchimp
              </Button>
            )}
          </CardContent>
        </Card>
        
        {/* WhatsApp Integration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <MessageSquare className="h-4 w-4" />
                WhatsApp Business
              </CardTitle>
              <CardDescription>WhatsApp messaging integration</CardDescription>
            </div>
            <div className="flex items-center">
              {integrations.whatsapp.connected && (
                <Badge variant={integrations.whatsapp.enabled ? "default" : "outline"} className="mr-2">
                  {integrations.whatsapp.enabled ? "Enabled" : "Disabled"}
                </Badge>
              )}
              <Switch
                checked={integrations.whatsapp.enabled}
                onCheckedChange={() => toggleIntegration('whatsapp')}
                disabled={!integrations.whatsapp.connected}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-muted/20 text-center">
              <AlertCircle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Configure WhatsApp integration through the dedicated WhatsApp module.
              </p>
              <Button 
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  toast({
                    title: "Navigation",
                    description: "Redirecting to WhatsApp settings page..."
                  });
                }}
              >
                Go to WhatsApp Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-lg font-medium mt-8">Other Integrations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* QuickBooks Integration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <FileText className="h-4 w-4" />
                QuickBooks
              </CardTitle>
              <CardDescription>Accounting software</CardDescription>
            </div>
            <div className="flex items-center">
              {integrations.quickbooks.connected && (
                <Badge variant={integrations.quickbooks.enabled ? "default" : "outline"} className="mr-2">
                  {integrations.quickbooks.enabled ? "Enabled" : "Disabled"}
                </Badge>
              )}
              <Switch
                checked={integrations.quickbooks.enabled}
                onCheckedChange={() => toggleIntegration('quickbooks')}
                disabled={!integrations.quickbooks.connected}
              />
            </div>
          </CardHeader>
          <CardContent className="text-center">
            {integrations.quickbooks.connected ? (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => disconnectIntegration('quickbooks')}
                className="w-full"
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => connectIntegration('quickbooks')}
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowRightLeft className="h-4 w-4 mr-2" />}
                Connect
              </Button>
            )}
          </CardContent>
        </Card>
        
        {/* DHL Integration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Truck className="h-4 w-4" />
                DHL
              </CardTitle>
              <CardDescription>Shipping carrier</CardDescription>
            </div>
            <div className="flex items-center">
              {integrations.dhl.connected && (
                <Badge variant={integrations.dhl.enabled ? "default" : "outline"} className="mr-2">
                  {integrations.dhl.enabled ? "Enabled" : "Disabled"}
                </Badge>
              )}
              <Switch
                checked={integrations.dhl.enabled}
                onCheckedChange={() => toggleIntegration('dhl')}
                disabled={!integrations.dhl.connected}
              />
            </div>
          </CardHeader>
          <CardContent className="text-center">
            {integrations.dhl.connected ? (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => disconnectIntegration('dhl')}
                className="w-full"
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => connectIntegration('dhl')}
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowRightLeft className="h-4 w-4 mr-2" />}
                Connect
              </Button>
            )}
          </CardContent>
        </Card>
        
        {/* Zapier Integration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <ArrowRightLeft className="h-4 w-4" />
                Zapier
              </CardTitle>
              <CardDescription>Workflow automation</CardDescription>
            </div>
            <div className="flex items-center">
              {integrations.zapier.connected && (
                <Badge variant={integrations.zapier.enabled ? "default" : "outline"} className="mr-2">
                  {integrations.zapier.enabled ? "Enabled" : "Disabled"}
                </Badge>
              )}
              <Switch
                checked={integrations.zapier.enabled}
                onCheckedChange={() => toggleIntegration('zapier')}
                disabled={!integrations.zapier.connected}
              />
            </div>
          </CardHeader>
          <CardContent className="text-center">
            {integrations.zapier.connected ? (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => disconnectIntegration('zapier')}
                className="w-full"
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => connectIntegration('zapier')}
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowRightLeft className="h-4 w-4 mr-2" />}
                Connect
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntegrationSettings;
