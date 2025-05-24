
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, MessageCircle } from 'lucide-react';

// Import shared WhatsApp component
import WhatsAppSettingsForm from '@/components/whatsapp/WhatsAppSettings';

const WhatsAppSettingsWrapper = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your WhatsApp settings have been updated successfully.",
      });
      setSaving(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">WhatsApp Business Integration</h3>
          <p className="text-sm text-muted-foreground">
            Configure your WhatsApp Business API connection
          </p>
        </div>
        <MessageCircle className="h-8 w-8 text-green-500" />
      </div>
      <Separator />
      
      <WhatsAppSettingsForm />
    </div>
  );
};

export default WhatsAppSettingsWrapper;
