import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";

interface FreeTrialSettings {
  id: number;
  trialDays: number;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function FreeTrial() {
  const [settings, setSettings] = useState<FreeTrialSettings>({
    id: 0,
    trialDays: 0,
    updatedAt: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    getTrialDays();
  }, []);

  const getTrialDays = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/superadmin/freetrial`);
      if (response.data.success) {
        setSettings({
          id: response.data.data.id,
          trialDays: response.data.data.trial_days,
          updatedAt: response.data.data.updated_at
        });
      }
    } catch (error) {
      toast.error("Failed to load trial days setting");
    }
  };

  const handleUpdate = (value: number) => {
    if (value < 0 || value > 90) {
      toast.error("Trial days must be between 0 and 90");
      return;
    }
    setSettings(prev => ({
      ...prev,
      trialDays: value,
      updatedAt: new Date().toISOString()
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = settings.id 
        ? await axios.put(`${API_URL}/api/superadmin/freetrial/${settings.id}`, {
            trialDays: settings.trialDays
          })
        : await axios.post(`${API_URL}/api/superadmin/freetrial`, {
            trialDays: settings.trialDays
          });

      if (response.data.success) {
        setSettings({
          id: response.data.data.id,
          trialDays: response.data.data.trial_days,
          updatedAt: response.data.data.updated_at
        });
        toast.success("Trial days updated successfully");
        setHasChanges(false);
      }
    } catch (error) {
      toast.error("Failed to update trial days");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-5">
        <div className="grid gap-2">
          <Label htmlFor="trial-days">Trial Days</Label>
          <Input
            id="trial-days"
            type="number"
            min="0"
            max="90"
            placeholder="Enter trial days"
            value={settings.trialDays}
            onChange={(e) => handleUpdate(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Set the trial period length (0-90 days)
          </p>
        </div>
        <div className="flex justify-between items-center pt-4">
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date(settings.updatedAt).toLocaleString()}
          </span>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}