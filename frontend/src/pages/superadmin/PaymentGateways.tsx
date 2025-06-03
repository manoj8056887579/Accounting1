import React, { useState, useEffect } from 'react';
import { CreditCard, Eye, EyeOff, Shield, CheckCircle2, XCircle, AlertTriangle, Webhook } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';

// Import RazorpayTest component
import RazorpayTest from './paymentGateway/RazorpayTest';
// Import WebhookEvents component
import WebhookEvents from './paymentGateway/WebhookEvents';

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
  payment_id?: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  failure_reason?: string;
  failure_code?: string;
  failure_description?: string;
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

const PaymentGateways = () => {
  const [razorpaySettings, setRazorpaySettings] = useState<PaymentGatewaySettings>(initialRazorpaySettings);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({
    razorpayApiSecret: false,
    razorpayWebhook: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showTestUI, setShowTestUI] = useState(false);
  const [payments, setPayments] = useState<PaymentFailure[]>([]);
  const [showPayments, setShowPayments] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestData, setWebhookTestData] = useState(null);
  const [showWebhookEvents, setShowWebhookEvents] = useState(false);

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

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/superadmin/payment-gateways/payment-failures`);
      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    fetchPaymentGatewaySettings();
    if (razorpaySettings.isActive) {
      fetchPayments();
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
    const updatedSettings = {
      ...razorpaySettings,
      isTestMode: !razorpaySettings.isTestMode,
      apiKey: '',
      apiSecret: '',
      isActive: false // Deactivate when changing modes for safety
    };
    
    setRazorpaySettings(updatedSettings);
    toast.info(`Switched to ${!razorpaySettings.isTestMode ? 'test' : 'live'} mode. Please enter new API credentials and save to activate.`);
  };

  const toggleActiveStatus = async () => {
    const newStatus = !razorpaySettings.isActive;
    if (newStatus && (!razorpaySettings.apiKey || !razorpaySettings.apiSecret)) {
      toast.error('Please configure API credentials before activating the gateway');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${API_URL}/api/superadmin/payment-gateways/toggle-status`, {
        gateway: razorpaySettings.gateway,
        isActive: newStatus
      });
      
      if (response.data.success) {
        setRazorpaySettings({
          ...razorpaySettings,
          isActive: newStatus
        });
        toast.success(`Razorpay gateway ${newStatus ? 'activated' : 'deactivated'}`);
        await fetchPaymentGatewaySettings();
        if (newStatus) {
          await fetchPayments();
        }
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error('Error updating gateway status:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || "Failed to update gateway status";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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

  const testWebhook = async () => {
    try {
      setIsTestingWebhook(true);
      const response = await axios.get(`${API_URL}/api/superadmin/payment-gateways/test-webhook`);
      
      if (response.data.success) {
        setWebhookTestData(response.data.testData);
        toast.success('Webhook test created. Check developer console for details.');
        console.log('Webhook Test Data:', response.data.testData);
      } else {
        toast.error(response.data.message || 'Failed to create webhook test');
      }
    } catch (error) {
      console.error('Error testing webhook:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to test webhook';
      toast.error(errorMessage);
    } finally {
      setIsTestingWebhook(false);
    }
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
              <div className="flex justify-end space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="test-mode" 
                    checked={razorpaySettings.isTestMode} 
                    onCheckedChange={toggleTestMode}
                    disabled={isLoading}
                  />
                  <Label htmlFor="test-mode" className="text-sm">
                    Test Mode
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="active-status" 
                    checked={razorpaySettings.isActive} 
                    onCheckedChange={toggleActiveStatus}
                    disabled={isLoading}
                  />
                  <Label htmlFor="active-status" className="text-sm">
                    {isLoading ? 'Updating...' : 'Active'}
                  </Label>
                </div>
              </div>
              
              <div className={`p-4 rounded-md ${razorpaySettings.isTestMode ? 'bg-amber-50 border border-amber-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                <div className="flex items-center">
                  <Shield className={`h-5 w-5 mr-2 ${razorpaySettings.isTestMode ? 'text-amber-500' : 'text-emerald-500'}`} />
                  <p className={`text-sm font-medium ${razorpaySettings.isTestMode ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {razorpaySettings.isTestMode 
                      ? "Test Mode Enabled: Payments will use the Razorpay test environment" 
                      : "Live Mode Enabled: Payments will be processed in the production environment"}
                  </p>
                </div>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
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
                </div>
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="webhook-secret">Webhook Secret</Label>
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
                  
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label>Webhook URL</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={testWebhook}
                        disabled={isTestingWebhook || !razorpaySettings.webhookSecret}
                      >
                        <Webhook className="h-4 w-4 mr-2" />
                        {isTestingWebhook ? 'Testing...' : 'Test Webhook'}
                      </Button>
                    </div>
                    <div className="flex">
                      <Input
                        value={`${window.location.origin}/api/superadmin/payment-gateways/webhook`}
                        readOnly
                        className="bg-muted"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="ml-2"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/api/superadmin/payment-gateways/webhook`);
                          toast.success("Webhook URL copied to clipboard");
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    
                    {webhookTestData && (
                      <div className="mt-2 p-3 rounded-md bg-green-50 border border-green-200">
                        <h4 className="text-sm font-medium text-green-800 mb-1">Webhook Test Created</h4>
                        <p className="text-xs text-green-700">
                          A test webhook event has been generated. You can test your webhook integration
                          by examining the details in the browser console (F12).
                        </p>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      Configure this URL in your Razorpay dashboard to receive webhook events
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2 p-3 rounded-md bg-yellow-50 border border-yellow-200">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">Important Security Note</h4>
                <p className="text-xs text-yellow-700">
                  For production use, you should whitelist Razorpay's webhook IP addresses in your firewall or server configuration.
                  This ensures that only legitimate webhook requests from Razorpay are accepted.
                </p>
                <div className="mt-2">
                  <details className="text-xs">
                    <summary className="cursor-pointer font-medium text-yellow-800">View Razorpay IP Addresses</summary>
                    <ul className="list-disc pl-4 pt-1 text-yellow-700">
                      <li>3.7.38.198</li>
                      <li>3.7.168.129</li>
                      <li>3.7.9.161</li>
                      <li>13.235.115.208</li>
                      <li>13.235.92.196</li>
                      <li>13.235.38.227</li>
                    </ul>
                    <p className="mt-1 text-yellow-700">
                      <em>Note:</em> IP addresses may change. Always refer to the 
                      <a href="https://razorpay.com/docs/webhooks/" className="underline ml-1" target="_blank" rel="noreferrer">
                        Razorpay documentation
                      </a> for the latest information.
                    </p>
                  </details>
                </div>
              </div>
              
              <div className="mt-2 p-3 rounded-md bg-blue-50 border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Webhook Configuration Guide</h4>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal pl-4">
                  <li>Copy the webhook URL shown above</li>
                  <li>Go to your Razorpay Dashboard &gt; Settings &gt; Webhooks</li>
                  <li>Click "Add New Webhook"</li>
                  <li>Paste the URL and enter your webhook secret</li>
                  <li>Select at least these events:
                    <ul className="list-disc pl-4 pt-1">
                      <li>payment.authorized</li>
                      <li>payment.captured</li>
                      <li>payment.failed</li>
                      <li>order.paid</li>
                    </ul>
                  </li>
                  <li>Save the webhook configuration</li>
                </ol>
                <p className="text-xs text-blue-700 mt-2">
                  Webhooks ensure automatic payment status updates even if the customer's browser closes during payment.
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
            </CardContent>
          </Card>

          {razorpaySettings.isActive && (
            <>
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <CardTitle>Test Razorpay Integration</CardTitle>
                      </div>
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
                      <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-4">
                          <CreditCard className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Test Payment Integration</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                          You can test your Razorpay integration with a sample payment to verify everything is working correctly.
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowTestUI(true)}
                        >
                          Show Test UI
                        </Button>
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
                        <CardTitle>Payment Transactions</CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPayments(!showPayments);
                          if (!showPayments) {
                            fetchPayments();
                          }
                        }}
                      >
                        {showPayments ? 'Hide Payments' : 'Show Recent Payments'}
                      </Button>
                    </div>
                    <CardDescription>
                      Monitor all payment transactions and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {showPayments ? (
                      <div className="space-y-4">
                        {payments.length > 0 ? (
                          payments.map((payment) => (
                            <div 
                              key={payment.order_id} 
                              className={`border rounded-lg p-4 transition-colors ${
                                payment.status === 'paid' 
                                  ? 'border-green-200 bg-green-50' 
                                  : payment.status === 'failed'
                                    ? 'border-red-200 bg-red-50'
                                    : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">Order: {payment.order_id}</p>
                                    <Badge 
                                      variant={payment.status === 'paid' ? 'default' : 
                                              payment.status === 'created' ? 'outline' : 'destructive'}
                                      className={payment.status === 'paid' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                                    >
                                      {payment.status?.toUpperCase() || 'UNKNOWN'}
                                    </Badge>
                                  </div>
                                  <div className="mt-1">
                                    <p className="text-sm font-medium">
                                      Amount: <span className="font-bold">₹{formatAmount(payment.amount)}</span> <span className="text-muted-foreground">{payment.currency}</span>
                                    </p>
                                    {payment.payment_id && (
                                      <p className="text-sm text-muted-foreground mt-1">
                                        Payment ID: <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">{payment.payment_id}</span>
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right text-sm">
                                  <p className="text-muted-foreground">
                                    {formatDate(payment.updated_at)}
                                  </p>
                                </div>
                              </div>
                              
                              {payment.status === 'failed' && (
                                <div className="mt-3 p-3 bg-red-100 rounded-md">
                                  <p className="text-sm font-medium text-red-800">Failure Reason: {payment.failure_reason || 'Unknown'}</p>
                                  {payment.failure_description && (
                                    <p className="text-sm text-red-700 mt-1">{payment.failure_description}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-4">
                              <AlertTriangle className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No Transactions Yet</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                              No payment transactions have been recorded. Transactions will appear here after payments are processed.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-orange-100 flex items-center justify-center rounded-full mb-4">
                          <AlertTriangle className="h-8 w-8 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Payment Transactions</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                          View all payment transactions, including successful payments and failures, to monitor your payment activity.
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowPayments(true);
                            fetchPayments();
                          }}
                        >
                          Show Recent Payments
                        </Button>
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
                        <Webhook className="h-5 w-5 text-blue-500" />
                        <CardTitle>Webhook Events</CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowWebhookEvents(!showWebhookEvents)}
                      >
                        {showWebhookEvents ? 'Hide Events' : 'View Webhook Events'}
                      </Button>
                    </div>
                    <CardDescription>
                      Monitor incoming webhook events from Razorpay
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {showWebhookEvents ? (
                      <div className="py-2">
                        <React.Suspense fallback={<div className="text-center py-4">Loading webhook events...</div>}>
                          <WebhookEvents />
                        </React.Suspense>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-blue-100 flex items-center justify-center rounded-full mb-4">
                          <Webhook className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Monitor Webhook Events</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                          Track, monitor, and retry webhook events from Razorpay to ensure your integration is working correctly.
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowWebhookEvents(true)}
                        >
                          View Webhook Events
                        </Button>
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
