
import React, { useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Settings,
  Bell,
  Lock,
  SaveIcon,
  CheckCircle,
  Link,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useWhatsApp } from '@/contexts/WhatsAppContext';
import { getWhatsAppService } from '@/services/whatsAppService';
import { useState } from 'react';

const WhatsAppSettings = () => {
  const { 
    apiKey, setApiKey,
    phoneNumberId, setPhoneNumberId,
    businessAccountId, setBusinessAccountId,
    isConnected, connect, disconnect
  } = useWhatsApp();

  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    incomingMessages: true,
    messageDelivered: false,
    messageRead: true,
    broadcastComplete: true,
    emailNotifications: false
  });

  useEffect(() => {
    // If we're connected, try to fetch business profile data
    const fetchBusinessProfile = async () => {
      if (!isConnected) return;
      
      try {
        setIsLoading(true);
        const service = getWhatsAppService();
        const profile = await service.getBusinessProfile();
        
        // Update local state with fetched data
        if (profile && profile.data && profile.data[0]) {
          const data = profile.data[0];
          setBusinessName(data.about || '');
          setBusinessDescription(data.description || '');
        }
      } catch (error) {
        console.error('Failed to fetch business profile:', error);
        toast({
          title: "Error",
          description: "Failed to load WhatsApp business profile.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinessProfile();
  }, [isConnected]);

  const handleVerifyConnection = async () => {
    setVerifying(true);
    try {
      const success = await connect();
      
      if (success) {
        toast({
          title: "Connection Successful",
          description: "WhatsApp Business API connected successfully.",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Please check your API credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to WhatsApp API. Check your credentials.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Disconnected",
      description: "WhatsApp Business API disconnected successfully.",
    });
  };

  const handleSaveSettings = async () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect to WhatsApp API first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const service = getWhatsAppService();
      await service.updateBusinessProfile({
        about: businessName,
        description: businessDescription
      });
      
      toast({
        title: "Settings Saved",
        description: "Your WhatsApp business profile has been updated.",
      });
    } catch (error) {
      console.error('Failed to save business profile:', error);
      toast({
        title: "Save Failed",
        description: "Could not update your WhatsApp business profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNotifications = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    
    // In a real app, you would save this to your backend
    toast({
      title: "Notification Settings Updated",
      description: `${key} notifications ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp API Settings</CardTitle>
            <CardDescription>Configure your WhatsApp Business API integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isConnected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 flex items-start gap-2">
                <AlertTriangle className="text-yellow-500 h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Not Connected</p>
                  <p className="text-yellow-700 text-sm">
                    Enter your WhatsApp API credentials and click "Verify" to connect.
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key (Access Token)</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your WhatsApp Business API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isConnected}
              />
              <p className="text-xs text-muted-foreground">
                Your API key is used to authenticate requests to the WhatsApp Business API
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone-number-id">Phone Number ID</Label>
              <Input
                id="phone-number-id"
                placeholder="Enter your WhatsApp Phone Number ID"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                disabled={isConnected}
              />
              <p className="text-xs text-muted-foreground">
                The ID of your WhatsApp phone number from Meta Business Dashboard
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-account-id">Business Account ID</Label>
              <Input
                id="business-account-id"
                placeholder="Enter your WhatsApp Business Account ID"
                value={businessAccountId}
                onChange={(e) => setBusinessAccountId(e.target.value)}
                disabled={isConnected}
              />
              <p className="text-xs text-muted-foreground">
                Your WhatsApp Business Account ID from Meta Business Dashboard
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL (Configure in Meta Dashboard)</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  value="https://your-app.com/api/whatsapp/webhook"
                  readOnly
                />
                <Button variant="outline" size="icon">
                  <Link className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use this URL as your webhook endpoint in the WhatsApp Business API dashboard
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            {isConnected ? (
              <Button variant="outline" onClick={handleDisconnect}>Disconnect API</Button>
            ) : (
              <div className="w-full">
                <Button 
                  onClick={handleVerifyConnection} 
                  className="w-full"
                  disabled={!apiKey || !phoneNumberId || !businessAccountId || verifying}
                >
                  {verifying ? "Verifying..." : "Verify & Connect"}
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
            <CardDescription>Configure your WhatsApp business profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                disabled={!isConnected || isLoading}
              />
              {!isConnected && (
                <p className="text-xs text-muted-foreground">
                  Connect to WhatsApp API first to manage your business profile
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-description">Business Description</Label>
              <Textarea
                id="business-description"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                rows={3}
                disabled={!isConnected || isLoading}
              />
            </div>
            
            {isConnected && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Connected to WhatsApp Business API</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button 
              onClick={handleSaveSettings} 
              className="w-full"
              disabled={!isConnected || isLoading}
            >
              <SaveIcon className="mr-2 h-4 w-4" /> 
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you receive WhatsApp notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="incoming-messages">Incoming Messages</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when you receive a new message
              </p>
            </div>
            <Switch 
              id="incoming-messages" 
              checked={notifications.incomingMessages}
              onCheckedChange={(checked) => handleUpdateNotifications('incomingMessages', checked)}
              disabled={!isConnected}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="message-delivered">Message Delivered</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your message is delivered
              </p>
            </div>
            <Switch 
              id="message-delivered"
              checked={notifications.messageDelivered}
              onCheckedChange={(checked) => handleUpdateNotifications('messageDelivered', checked)}
              disabled={!isConnected}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="message-read">Message Read</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your message is read
              </p>
            </div>
            <Switch 
              id="message-read" 
              checked={notifications.messageRead}
              onCheckedChange={(checked) => handleUpdateNotifications('messageRead', checked)}
              disabled={!isConnected}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="broadcast-complete">Broadcast Complete</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when a broadcast is complete
              </p>
            </div>
            <Switch 
              id="broadcast-complete" 
              checked={notifications.broadcastComplete}
              onCheckedChange={(checked) => handleUpdateNotifications('broadcastComplete', checked)}
              disabled={!isConnected}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send a copy of notifications to your email
              </p>
            </div>
            <Switch 
              id="email-notifications" 
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => handleUpdateNotifications('emailNotifications', checked)}
              disabled={!isConnected}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppSettings;
