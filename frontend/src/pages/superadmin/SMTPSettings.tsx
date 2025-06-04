import React, { useState, useEffect } from "react";
import { Mail, Save, RefreshCcw, Play } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


interface SMTPSettings {
  id?: number;  // Add id field
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  secure: boolean;
  isActive: boolean;
  updatedAt: string;
}

// Initial settings
const initialSettings: SMTPSettings = {
  host: '',
  port: 587, 
  username: '',
  password: '',
  fromEmail: '',
  fromName: '',
  secure: true, 
  isActive: false,
  updatedAt: new Date().toISOString(),
};

const smtpFormSchema = z.object({
  host: z.string().min(1, "SMTP host is required"),
  port: z.coerce.number().int().min(1, "Port must be a positive number"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  fromEmail: z.string().email("Must be a valid email address"),
  fromName: z.string().min(1, "From name is required"),
  secure: z.boolean()
  // removed isActive from schema
});

const SMTPSettings = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testMessage, setTestMessage] = useState("");
  const [testSubject, setTestSubject] = useState(""); // Add subject state
  const [isLoading, setIsLoading] = useState(true);
  const [settingId, setSettingId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof smtpFormSchema>>({
    resolver: zodResolver(smtpFormSchema),
    defaultValues: initialSettings,
  });

  useEffect(() => {
    fetchSMTPSettings();
  }, []);

  const fetchSMTPSettings = async () => {
    try {
      const { data: { data } } = await axios.get(`${API_URL}/api/superadmin/smtp-settings`);
      if (data) {
        setSettingId(data.id); // Store the ID
        const formData = {
          host: data.host,
          port: data.port,
          username: data.username,
          password: data.password,
          fromEmail: data.fromEmail,
          fromName: data.fromName,
          secure: data.secure
        };
        form.reset(formData);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error("Failed to fetch SMTP settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (values: z.infer<typeof smtpFormSchema>) => {
    try {
      const url = settingId 
        ? `${API_URL}/api/superadmin/smtp-settings/${settingId}`
        : `${API_URL}/api/superadmin/smtp-settings`;

      const method = settingId ? 'put' : 'post';
      const { data } = await axios({
        method,
        url,
        data: values
      });

      toast.success(data.message || `SMTP settings ${settingId ? 'updated' : 'created'} successfully`);
      fetchSMTPSettings(); // Refresh to get the new ID if it was a creation
    } catch (error) {
      console.error('Save error:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to save SMTP settings");
      } else {
        toast.error("Failed to save SMTP settings");
      }
    }
  };

  const handleTest = async () => {
    if (!testEmail || !testMessage || !testSubject) {
      toast.error("Please enter email, subject and message");
      return;
    }

    setIsTesting(true);
    try {
      const { data: { message } } = await axios.post(
        `${API_URL}/api/superadmin/smtp-settings/test`,
        {
          to: testEmail,
          subject: testSubject,
          message: testMessage
        }
      );

      toast.success(message || `Test email sent to ${testEmail}`);
      setTestEmail('');
      setTestMessage('');
      setTestSubject('');
    } catch (error: Error | unknown) {
      console.error('Test email error:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to send test email");
      } else {
        toast.error("Failed to send test email");
      }
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">SMTP Settings</h2>
        <p className="text-muted-foreground">
          Configure email settings for system notifications and user
          communications
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                SMTP Configuration
              </CardTitle>
              <CardDescription>
                Email server settings for sending system emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Host</FormLabel>
                      <FormControl>
                        <Input placeholder="smtp.example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The hostname of your SMTP server
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Common ports are 25, 465, or 587
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fromEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Email</FormLabel>
                      <FormControl>
                        <Input placeholder="noreply@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Address that will appear in the From field
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fromName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Name</FormLabel>
                      <FormControl>
                        <Input placeholder="System Notifications" {...field} />
                      </FormControl>
                      <FormDescription>
                        Name that will appear in the From field
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="secure"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Use Secure Connection (SSL/TLS)
                      </FormLabel>
                      <FormDescription>
                        Enable for SSL/TLS encrypted connection
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Removed Enable SMTP Service FormField */}
              
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <Card>
        <CardHeader>
          <CardTitle>Test SMTP Connection</CardTitle>
          <CardDescription>
            Send a test email to verify your SMTP configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Test Email Address</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="recipient@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-subject">Subject</Label>
              <Input
                id="test-subject"
                placeholder="Test Email Subject"
                value={testSubject}
                onChange={(e) => setTestSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-message">Message</Label>
              <Input
                id="test-message"
                placeholder="Enter your test message here"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleTest} disabled={isTesting}>
              {isTesting ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Send Test Email
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SMTPSettings;
