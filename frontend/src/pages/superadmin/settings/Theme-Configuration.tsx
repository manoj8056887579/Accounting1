import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Undo2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { SuperAdminSettings, ThemeColors, initialSettings } from "@/models/settings";

export default function ThemeConfiguration() {
  const [settings, setSettings] = useState<SuperAdminSettings>(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const updateThemeColor = (theme: 'light' | 'dark', colorKey: keyof ThemeColors, value: string) => {
    const themeKey = theme === 'light' ? 'lightThemeColors' : 'darkThemeColors';
    setSettings((prev) => ({
      ...prev,
      [themeKey]: {
        ...prev[themeKey],
        [colorKey]: value,
      },
      updatedAt: new Date().toISOString(),
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to an API
    toast({
      title: "Success",
      description: "Theme settings saved successfully",
      variant: "default",
    });
    setHasChanges(false);
  };

  const handleResetSettings = () => {
    // Reset functionality would be implemented here
    toast({
      title: "Info",
      description: "Theme settings reset to default values",
      variant: "default",
    });
    setHasChanges(false);
  };

  const ColorInput = ({ 
    theme, 
    label, 
    colorKey 
  }: { 
    theme: 'light' | 'dark', 
    label: string, 
    colorKey: keyof ThemeColors 
  }) => (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="flex gap-2 items-center">
        <Input
          type="color"
          value={settings[`${theme}ThemeColors`][colorKey]}
          onChange={(e) => updateThemeColor(theme, colorKey, e.target.value)}
          className="w-12 h-8 p-1"
        />
        <Input
          type="text"
          value={settings[`${theme}ThemeColors`][colorKey]}
          onChange={(e) => updateThemeColor(theme, colorKey, e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    </div>
  );

  return (
    <Card>
      
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Light Theme</h3>
            <ColorInput theme="light" label="Primary Color" colorKey="primary" />
            <ColorInput theme="light" label="Secondary Color" colorKey="secondary" />
            <ColorInput theme="light" label="Accent Color" colorKey="accent" />
            <ColorInput theme="light" label="Background Color" colorKey="background" />
            <ColorInput theme="light" label="Text Color" colorKey="text" />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dark Theme</h3>
            <ColorInput theme="dark" label="Primary Color" colorKey="primary" />
            <ColorInput theme="dark" label="Secondary Color" colorKey="secondary" />
            <ColorInput theme="dark" label="Accent Color" colorKey="accent" />
            <ColorInput theme="dark" label="Background Color" colorKey="background" />
            <ColorInput theme="dark" label="Text Color" colorKey="text" />
          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm text-muted-foreground">
            Note: Theme changes require a rebuild of the application to take effect.
          </p>
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