
import React, { useState } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Plus, Edit, Trash2, Check, X, Users, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { Organization } from '@/models/organization';

const OrganizationsPage = () => {
  const { availableOrganizations, currentOrganizationId, setCurrentOrganizationId } = useTenant();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleCreateOrg = () => {
    if (!newOrgName.trim()) {
      toast.error("Organization name can't be empty");
      return;
    }

    toast.success(`Organization "${newOrgName}" created`);
    setNewOrgName('');
    setIsCreateDialogOpen(false);
    // In a real app, this would make an API call to create the organization
  };

  const handleSwitchOrg = (orgId: string) => {
    setCurrentOrganizationId(orgId);
  };

  // Filter organizations based on active tab
  const filteredOrganizations = activeTab === "all" 
    ? availableOrganizations
    : availableOrganizations.filter(org => org.status === activeTab);

  return (
    <div className="container max-w-6xl py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organizations and settings
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Organization
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Organizations</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrganizations.map((org) => (
              <OrganizationCard 
                key={org.id}
                organization={org}
                isActive={org.id === currentOrganizationId}
                onSwitch={() => handleSwitchOrg(org.id)}
              />
            ))}
          </div>
          {filteredOrganizations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-muted/20">
              <Building className="h-12 w-12 text-muted mb-4" />
              <h3 className="text-xl font-medium mb-2">No organizations found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                There are no organizations in this category. Create one to get started.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                New Organization
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrganizations.map((org) => (
              <OrganizationCard 
                key={org.id}
                organization={org}
                isActive={org.id === currentOrganizationId}
                onSwitch={() => handleSwitchOrg(org.id)}
              />
            ))}
          </div>
          {filteredOrganizations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-muted/20">
              <Building className="h-12 w-12 text-muted mb-4" />
              <h3 className="text-xl font-medium mb-2">No active organizations</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                There are no active organizations. Create one to get started.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                New Organization
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrganizations.map((org) => (
              <OrganizationCard 
                key={org.id}
                organization={org}
                isActive={org.id === currentOrganizationId}
                onSwitch={() => handleSwitchOrg(org.id)}
              />
            ))}
          </div>
          {filteredOrganizations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-muted/20">
              <Building className="h-12 w-12 text-muted mb-4" />
              <h3 className="text-xl font-medium mb-2">No pending organizations</h3>
              <p className="text-muted-foreground text-center max-w-md">
                There are no organizations in pending status.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="suspended" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrganizations.map((org) => (
              <OrganizationCard 
                key={org.id}
                organization={org}
                isActive={org.id === currentOrganizationId}
                onSwitch={() => handleSwitchOrg(org.id)}
              />
            ))}
          </div>
          {filteredOrganizations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-muted/20">
              <Building className="h-12 w-12 text-muted mb-4" />
              <h3 className="text-xl font-medium mb-2">No suspended organizations</h3>
              <p className="text-muted-foreground text-center max-w-md">
                There are no organizations in suspended status.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Organization Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Add a new organization to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Organization name</Label>
              <Input
                id="name"
                placeholder="Enter organization name"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                className="col-span-3"
              />
              <p className="text-sm text-muted-foreground">
                This name will be used for your organization's profile and URL.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrg}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface OrganizationCardProps {
  organization: Organization;
  isActive: boolean;
  onSwitch: () => void;
}

const OrganizationCard = ({ organization, isActive, onSwitch }: OrganizationCardProps) => {
  // Function to determine status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return "success";
      case 'pending': return "warning";
      case 'suspended': return "destructive";
      default: return "secondary";
    }
  };

  // Create custom badge variant for status
  const statusVariants: Record<string, string> = {
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    secondary: "bg-secondary text-secondary-foreground"
  };

  const statusVariant = getStatusVariant(organization.status);

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${isActive ? 'border-primary border-2' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="mr-3 h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
              {organization.logo ? (
                <img 
                  src={organization.logo} 
                  alt={organization.name} 
                  className="h-10 w-10 rounded-md" 
                />
              ) : (
                <Building className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <CardTitle>{organization.name}</CardTitle>
              <CardDescription className="mt-1">
                {organization.slug}
              </CardDescription>
            </div>
          </div>
          <Badge variant={isActive ? "default" : "outline"} className="ml-2">
            {isActive ? "Current" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status:</span>
            <Badge className={statusVariants[statusVariant]} variant="outline">
              <span className="capitalize">{organization.status}</span>
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Created:</span>
            <span className="font-medium">{new Date(organization.createdAt).toLocaleDateString()}</span>
          </div>
          
          {organization.enabledModules && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center">
                <Layers className="h-4 w-4 mr-1" /> Modules:
              </span>
              <span className="font-medium">{organization.enabledModules.length}</span>
            </div>
          )}
          
          {organization.userLimit !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center">
                <Users className="h-4 w-4 mr-1" /> User Limit:
              </span>
              <span className="font-medium">{organization.userLimit === 0 ? 'Unlimited' : organization.userLimit}</span>
            </div>
          )}
          
          {organization.subscriptionPlan && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Plan:</span>
              <Badge variant="secondary" className="capitalize">
                {organization.subscriptionPlan}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 pb-4">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
        
        {!isActive && (
          <Button size="sm" onClick={onSwitch}>
            <Check className="h-4 w-4 mr-1" />
            Switch
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OrganizationsPage;
