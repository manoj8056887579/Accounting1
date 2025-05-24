import React, { useState, useEffect } from 'react';
import { CreditCard, Eye, EyeOff, Shield, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

type PaymentGateway = 'razorpay' | 'stripe' | 'none';

interface PaymentGatewaySettings {
  gateway: PaymentGateway;
  apiKey: string;
  apiSecret: string;
  isTestMode: boolean;
  webhookSecret?: string; 
  isActive: boolean;
}

interface PaymentFailure {
  order_id: string;
  amount: number;
  currency: string;
  receipt: string;
  failure_reason: string;
  failure_code: string;
  failure_description: string;
  created_at: string;
  updated_at: string;
}

const initialRazorpaySettings: PaymentGatewaySettings = {
  gateway: 'razorpay',
  apiKey: '',
  apiSecret: '',
  isTestMode: true,
  webhookSecret: '',
  isActive: false
};

// Import RazorpayTest component at the top
import RazorpayTest from './paymentGateway/RazorpayTest';

const PaymentGateways = () => {
  const [razorpaySettings, setRazorpaySettings] = useState<PaymentGatewaySettings>(initialRazorpaySettings);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({
    razorpayApiSecret: false,
    razorpayWebhook: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showTestUI, setShowTestUI] = useState(false);
  const [paymentFailures, setPaymentFailures] = useState<PaymentFailure[]>([]);
  const [showFailures, setShowFailures] = useState(false);

  const fetchPaymentGatewaySettings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/superadmin/payment-gateways`);
      if (response.data.success && response.data.data.length > 0) {
        // Sort by createdAt in descending order and get the most recent record
        const sortedGateways = response.data.data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const latestSettings = sortedGateways[0];
        setRazorpaySettings({
          gateway: latestSettings.gateway,
          apiKey: latestSettings.apiKey || '',
          apiSecret: latestSettings.apiSecret || '',
          isTestMode: latestSettings.isTestMode ?? true,
          webhookSecret: latestSettings.webhookSecret || '',
          isActive: latestSettings.isActive ?? false
        });
      }
    } catch (error) {
      console.error('Error fetching payment gateway settings:', error);
      toast.error('Failed to fetch payment gateway settings');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentFailures = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/superadmin/payment-gateways/payment-failures?limit=5`);
      if (response.data.success) {
        setPaymentFailures(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching payment failures:', error);
    }
  };

  useEffect(() => {
    fetchPaymentGatewaySettings();
    if (razorpaySettings.isActive) {
      fetchPaymentFailures();
    }
  }, [razorpaySettings.isActive]);
  
  const toggleShowSecret = (key: string) => {
    setShowSecrets({
      ...showSecrets,
      [key]: !showSecrets[key]
    });
  };

  const handleSaveRazorpay = async () => {
    try {
      // Validate API key format
      const keyPrefix = razorpaySettings.isTestMode ? 'rzp_test_' : 'rzp_live_';
      if (!razorpaySettings.apiKey.startsWith(keyPrefix)) {
        toast.error(`Invalid API key format. ${razorpaySettings.isTestMode ? 'Test' : 'Live'} mode key should start with '${keyPrefix}'`);
        return;
      }

      // Validate required fields
      if (!razorpaySettings.apiKey || !razorpaySettings.apiSecret) {
        toast.error('API key and secret are required');
        return;
      }

      setIsLoading(true);
      const response = await axios.post(`${API_URL}/api/superadmin/payment-gateways`, razorpaySettings);
      
      if (response.data.success) {
        toast.success(`Razorpay ${razorpaySettings.isTestMode ? 'test' : 'live'} settings saved successfully`);
        // Fetch updated settings after saving
        await fetchPaymentGatewaySettings();
      } else {
        toast.error(response.data.message || "Failed to save settings");
      } 
    } catch (error) {
      console.error('Error saving Razorpay settings:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || "Failed to save Razorpay settings. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTestMode = () => {
    // Clear API key when switching modes to prevent mixing test/live keys
    setRazorpaySettings({
      ...razorpaySettings,
      isTestMode: !razorpaySettings.isTestMode,
      apiKey: '',
      apiSecret: ''
    });
    toast.info(`Switched to ${!razorpaySettings.isTestMode ? 'test' : 'live'} mode. Please enter new API credentials.`);
  };

  const toggleActiveStatus = () => {
    const newStatus = !razorpaySettings.isActive;
    if (newStatus && (!razorpaySettings.apiKey || !razorpaySettings.apiSecret)) {
      toast.error('Please configure API credentials before activating the gateway');
      return;
    }
    setRazorpaySettings({
      ...razorpaySettings,
      isActive: newStatus
    });
    toast.success(`Razorpay gateway ${newStatus ? 'activated' : 'deactivated'}`);
  };

  const formatKey = (key: string | undefined, show: boolean) => {
    if (!key) return '';
    if (show) return key;
    return key.substring(0, 4) + '••••••••••••' + key.substring(key.length - 4);
  };

  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payment Gateways</h2>
        <p className="text-muted-foreground">
          Configure payment gateways for subscription billing
        </p>
      </div>
      
      <Tabs defaultValue="razorpay" className="max-w-4xl">
        <TabsList>
          <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
          <TabsTrigger value="stripe" disabled>Stripe (Coming Soon)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="razorpay" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle>Razorpay Configuration</CardTitle>
                </div>
                <Badge variant={razorpaySettings.isActive ? "default" : "outline"}>
                  {razorpaySettings.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>
                Configure Razorpay API keys and settings for subscription payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-end space-x-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="test-mode" 
                    checked={razorpaySettings.isTestMode} 
                    onCheckedChange={toggleTestMode}
                  />
                  <Label htmlFor="test-mode" className="text-muted-foreground text-sm">
                    Test Mode
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="active-status" 
                    checked={razorpaySettings.isActive} 
                    onCheckedChange={toggleActiveStatus}
                  />
                  <Label htmlFor="active-status" className="text-muted-foreground text-sm">
                    Active
                  </Label>
                </div>
              </div>
              
              <div className={`p-3 rounded-md ${razorpaySettings.isTestMode ? 'bg-amber-50 border border-amber-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                <div className="flex items-center">
                  <Shield className={`h-5 w-5 mr-2 ${razorpaySettings.isTestMode ? 'text-amber-500' : 'text-emerald-500'}`} />
                  <p className={`text-sm font-medium ${razorpaySettings.isTestMode ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {razorpaySettings.isTestMode 
                      ? "Test Mode Enabled: Payments will use the Razorpay test environment" 
                      : "Live Mode Enabled: Payments will be processed in the production environment"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="api-key">API Key {razorpaySettings.isTestMode && <span className="text-sm text-muted-foreground">(Test)</span>}</Label>
                  <Input
                    id="api-key"
                    value={razorpaySettings.apiKey}
                    onChange={(e) => setRazorpaySettings({...razorpaySettings, apiKey: e.target.value})}
                    placeholder="rzp_test_XXXXXXXXXXXXX or rzp_live_XXXXXXXXXXXXX"
                  />
                  <p className="text-xs text-muted-foreground">
                    The API key can be found in your Razorpay dashboard under Settings &gt; API Keys
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="api-secret">
                    API Secret {razorpaySettings.isTestMode && <span className="text-sm text-muted-foreground">(Test)</span>}
                  </Label>
                  <div className="flex">
                    <Input
                      id="api-secret"
                      type={showSecrets.razorpayApiSecret ? "text" : "password"}
                      value={formatKey(razorpaySettings.apiSecret, showSecrets.razorpayApiSecret)}
                      onChange={(e) => setRazorpaySettings({...razorpaySettings, apiSecret: e.target.value})}
                      className="rounded-r-none"
                      placeholder="API Secret Key"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-l-none border-l-0"
                      onClick={() => toggleShowSecret('razorpayApiSecret')}
                    >
                      {showSecrets.razorpayApiSecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The API secret should be kept confidential and never exposed in client-side code
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="webhook-secret">Webhook Secret (Optional)</Label>
                  <div className="flex">
                    <Input
                      id="webhook-secret"
                      type={showSecrets.razorpayWebhook ? "text" : "password"}
                      value={razorpaySettings.webhookSecret || ''}
                      onChange={(e) => setRazorpaySettings({...razorpaySettings, webhookSecret: e.target.value})}
                      className="rounded-r-none"
                      placeholder="Webhook Secret Key"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-l-none border-l-0"
                      onClick={() => toggleShowSecret('razorpayWebhook')}
                    >
                      {showSecrets.razorpayWebhook ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Used to verify webhook events sent by Razorpay
                  </p>
                </div>
                
                <div className="grid gap-2 py-4">
                  <Label>Webhook URL</Label>
                  <div className="flex">
                    <Input
                      value={`${window.location.origin}/api/webhooks/razorpay`}
                      readOnly
                      className="bg-muted"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-2"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/api/webhooks/razorpay`);
                        toast.success("Webhook URL copied to clipboard");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Configure this URL in your Razorpay dashboard to receive webhook events
                  </p>
                </div>
                
                <div className="pt-4 space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      {razorpaySettings.apiKey && razorpaySettings.apiSecret ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span className={razorpaySettings.apiKey && razorpaySettings.apiSecret ? "text-green-700" : "text-red-700"}>
                        API Keys Configured
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      {razorpaySettings.isActive ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-amber-500 mr-2" />
                      )}
                      <span className={razorpaySettings.isActive ? "text-green-700" : "text-amber-700"}>
                        {razorpaySettings.isActive ? "Gateway Active" : "Gateway Not Active"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setRazorpaySettings(initialRazorpaySettings)}
                      disabled={isLoading}
                    >
                      Reset
                    </Button>
                    <Button 
                      onClick={handleSaveRazorpay}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Razorpay Settings'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {razorpaySettings.isActive && (
            <>
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Test Razorpay Integration</CardTitle>
                      <Button
                        variant="outline"
                        onClick={() => setShowTestUI(!showTestUI)}
                      >
                        {showTestUI ? 'Hide Test UI' : 'Show Test UI'}
                      </Button>
                    </div>
                    <CardDescription>
                      Test your Razorpay integration with a sample payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {showTestUI ? (
                      <RazorpayTest />
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        Click "Show Test UI" to test the payment integration
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <CardTitle>Payment Failures</CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowFailures(!showFailures);
                          if (!showFailures) {
                            fetchPaymentFailures();
                          }
                        }}
                      >
                        {showFailures ? 'Hide Failures' : 'Show Recent Failures'}
                      </Button>
                    </div>
                    <CardDescription>
                      Monitor recent payment failures and their reasons
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {showFailures ? (
                      <div className="space-y-4">
                        {paymentFailures.length > 0 ? (
                          paymentFailures.map((failure) => (
                            <div key={failure.order_id} className="border rounded-lg p-4 space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">Order: {failure.order_id}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Amount: ₹{formatAmount(failure.amount)} | {failure.currency}
                                  </p>
                                </div>
                                <Badge variant="destructive">{failure.failure_code}</Badge>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Reason: {failure.failure_reason}</p>
                                <p className="text-sm text-muted-foreground">{failure.failure_description}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Failed: {formatDate(failure.updated_at)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            No payment failures found
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        Click "Show Recent Failures" to view payment failure logs
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentGateways;
