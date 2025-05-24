import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";
import axios from 'axios';
import { useBranding } from '@/contexts/BrandingContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface BrandSettings {
  id?: number;
  logo_url: string;
  favicon_url: string;
  updated_at: string;
  created_at?: string;
}

export default function Branding() {
  const { updateBranding } = useBranding();
  const [settings, setSettings] = useState<BrandSettings>({
    logo_url: '',
    favicon_url: '',
    updated_at: new Date().toISOString()
  });
  const [files, setFiles] = useState<{ logo?: File; favicon?: File }>({});
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/superadmin/branding`);
      if (data) {
        setSettings(data);
        setFiles({});
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error("Failed to fetch brand settings");
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Update hasChanges when files are selected
  useEffect(() => {
    setHasChanges(Object.keys(files).length > 0);
  }, [files]);

  const handleSave = async () => {
    if (!hasChanges) return;
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Add files to formData if they exist
      if (files.logo) {
        formData.append('logo', files.logo);
      }
      if (files.favicon) {
        formData.append('favicon', files.favicon);
      }      const response = settings.id 
        ? await axios.put(`${API_URL}/api/superadmin/branding/${settings.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        : await axios.post(`${API_URL}/api/superadmin/branding`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

      if (response.data) {
        setSettings(response.data);
        setFiles({}); // Clear selected files
        setHasChanges(false);
        // Update global branding context
        updateBranding(response.data.favicon_url, response.data.logo_url);
        toast.success("Brand settings saved successfully");
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error("Failed to save brand settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
     
      <CardContent className="space-y-6">
        {/* Logo Section */}
        <div className="space-y-6 border rounded-lg p-6">
          <h3 className="text-lg font-medium">Company Logo</h3>
          <div className="flex flex-col md:flex-row gap-6">
            {settings.logo_url && (
              <div className="flex justify-center p-4 border rounded-lg bg-muted w-full md:w-1/6">
                <img 
                  src={settings.logo_url} 
                  alt="Company Logo Preview" 
                  className="max-h-40 object-contain"
                />
              </div>
            )}
            <div className="flex-1 space-y-4">
              <ImageUpload
                label="Upload Logo"
                currentImageUrl={settings.logo_url}
                onChange={(file) => {
                  setFiles(prev => ({ ...prev, logo: file }));
                  setHasChanges(true);
                }}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Recommended: PNG or JPEG, 400x400px or larger
              </p>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={settings.logo_url}
                  readOnly
                  placeholder="No logo uploaded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Favicon Section */}
        <div className="space-y-6 border rounded-lg p-6">
          <h3 className="text-lg font-medium">Favicon</h3>
          <div className="flex flex-col md:flex-row gap-6">
            {settings.favicon_url && (
              <div className="flex justify-center items-center p-4 border rounded-lg bg-muted w-full md:w-1/6">
                <img 
                  src={settings.favicon_url} 
                  alt="Favicon Preview" 
                  className="w-16 h-16 object-contain"
                />
              </div>
            )}
            <div className="flex-1 space-y-4">
              <ImageUpload
                label="Upload Favicon"
                currentImageUrl={settings.favicon_url}
                onChange={(file) => {
                  setFiles(prev => ({ ...prev, favicon: file }));
                  setHasChanges(true);
                }}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Recommended: ICO, PNG or SVG, 32x32px or 64x64px
              </p>
              <div className="space-y-2">
                <Label>Favicon URL</Label>
                <Input
                  value={settings.favicon_url}
                  readOnly
                  placeholder="No favicon uploaded"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="flex items-center justify-between mt-6 pt-4 border-t px-6 pb-6">
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date(settings.updated_at).toLocaleString()}
        </div>
        <Button 
          onClick={handleSave}
          disabled={!hasChanges || loading}
          variant="default"
        >
          <Save className="mr-2 h-4 w-4" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </Card>
  );
}