
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, MessageSquare, Send, UserPlus } from 'lucide-react';
import WhatsAppDashboard from '@/components/whatsapp/WhatsAppDashboard';
import WhatsAppContacts from '@/components/whatsapp/WhatsAppContacts';
import WhatsAppSettings from '@/components/whatsapp/WhatsAppSettings';
import WhatsAppBroadcast from '@/components/whatsapp/WhatsAppBroadcast';
import WhatsAppSignup from '@/components/whatsapp/WhatsAppSignup';
import { useWhatsApp } from '@/contexts/WhatsAppContext';

const WhatsApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isConnected } = useWhatsApp();

  useEffect(() => {
    // Add event listener for tab changes requested by child components
    const handleTabChange = (event: CustomEvent) => {
      if (event.detail && typeof event.detail === 'string') {
        setActiveTab(event.detail);
      }
    };

    document.addEventListener('whatsapp-tab-change', handleTabChange as EventListener);

    return () => {
      document.removeEventListener('whatsapp-tab-change', handleTabChange as EventListener);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">WhatsApp Integration</h1>
        <p className="text-muted-foreground">
          Connect with your customers directly through WhatsApp messaging and broadcasts.
        </p>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2" disabled={!isConnected}>
            <Users className="h-4 w-4" /> Contacts
          </TabsTrigger>
          <TabsTrigger value="broadcasts" className="flex items-center gap-2" disabled={!isConnected}>
            <Send className="h-4 w-4" /> Broadcasts
          </TabsTrigger>
          <TabsTrigger value="signup" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Sign Up
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <WhatsAppDashboard />
        </TabsContent>
        
        <TabsContent value="contacts">
          <WhatsAppContacts />
        </TabsContent>
        
        <TabsContent value="broadcasts">
          <WhatsAppBroadcast />
        </TabsContent>
        
        <TabsContent value="signup">
          <WhatsAppSignup />
        </TabsContent>
        
        <TabsContent value="settings">
          <WhatsAppSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsApp;
