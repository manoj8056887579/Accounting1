import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SystemConfiguration from "./settings/System-Configuration";
import Branding from "./settings/Branding";
import ThemeConfiguration from "./settings/Theme-Configuration";
import General from "./settings/General";
import FreeTrial from "./settings/FreeTrial";
import  Finance  from "./settings/Finance";

const AdvancedSettings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Advanced Settings</h2>
        <p className="text-muted-foreground">
          Configure global system settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="system">System Configuration</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="free-trial">Free Trial</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <General />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle> System Configuration</CardTitle>
              <CardDescription>
                Core system settings and authentication options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SystemConfiguration />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Customize logo and app appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Branding />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="free-trial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Free Trial Settings</CardTitle>
              <CardDescription>
                Configure free trial period and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FreeTrial />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Finance Settings</CardTitle>
              <CardDescription>
                Configure finance-related settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Finance />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Configuration</CardTitle>
              <CardDescription>
                Define color scheme for light and dark modes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeConfiguration />
            </CardContent>
          </Card> 
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default AdvancedSettings;
