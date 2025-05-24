import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Settings, Save, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { SuperAdminSettings, initialSettings } from "@/models/settings"; 

export default function SystemConfiguration() {
  const [settings, setSettings] = useState<SuperAdminSettings>(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleUpdate = (key: keyof SuperAdminSettings, value: SuperAdminSettings[keyof SuperAdminSettings]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
      updatedAt: new Date().toISOString(),
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to an API
    toast({
      title: "Success",
      description: "System settings saved successfully",
      variant: "default",
    });
    setHasChanges(false);
  };

  const handleResetSettings = () => {
    // Reset to initial settings
    setSettings(initialSettings);
    toast({
      title: "Info",
      description: "System settings reset to default values",
      variant: "default",
    });
    setHasChanges(false); 
  };

  return (
    <Card>
     
      <CardContent className="space-y-6">
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-verification" className="flex flex-col">
              <span>Email Verification</span>
              <span className="text-sm text-muted-foreground">
                Require email verification before account access
              </span>
            </Label>
            <Switch
              id="email-verification"
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked) => handleUpdate('requireEmailVerification', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="org-creation" className="flex flex-col">
              <span>Organization Creation</span>
              <span className="text-sm text-muted-foreground">
                Allow users to create new organizations
              </span>
            </Label>
            <Switch
              id="org-creation"
              checked={settings.allowOrganizationCreation}
              onCheckedChange={(checked) => handleUpdate('allowOrganizationCreation', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="strong-passwords" className="flex flex-col">
              <span>Strong Passwords</span>
              <span className="text-sm text-muted-foreground">
                Enforce strong password requirements
              </span>
            </Label>
            <Switch
              id="strong-passwords"
              checked={settings.enforceStrongPasswords}
              onCheckedChange={(checked) => handleUpdate('enforceStrongPasswords', checked)}
            />
          </div>

        </div>
      </CardContent>
      
      <div className="flex items-center justify-between mt-6 pt-4 border-t px-6 pb-6">
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date(settings.updatedAt).toLocaleString()}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            disabled={!hasChanges}
          >
            <Undo2 className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={!hasChanges}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
}