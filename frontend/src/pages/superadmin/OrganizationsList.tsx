
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, Search, Plus, MoreHorizontal, Check, X, ArrowUpDown, Mail, Package, Users, Grid3X3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { OrganizationCreationRequest } from '@/models/superadmin';
import { createOrganization } from '@/services/organizationService';

// Mock plans for dropdown
const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential features for small businesses',
    userLimit: 10,
    modules: ['inventory', 'pos', 'sales']
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Perfect for growing businesses',
    userLimit: 25,
    modules: ['inventory', 'pos', 'sales', 'purchases', 'crm', 'reports']
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Advanced features for larger operations',
    userLimit: 0, // Unlimited
    modules: ['inventory', 'pos', 'sales', 'purchases', 'accounting', 'crm', 'whatsapp', 'reports']
  }
];

// Module display names
const moduleNames = {
  inventory: 'Inventory',
  pos: 'POS',
  sales: 'Sales',
  purchases: 'Purchases',
  accounting: 'Accounting',
  crm: 'CRM',
  whatsapp: 'WhatsApp',
  reports: 'Reports'
};

// Mock data for organizations
const organizations = [
  {
    id: '1',
    name: 'ABC Corporation',
    admin: 'admin@abc-corp.com',
    subscription: 'Premium',
    userLimit: 0, // Unlimited
    enabledModules: ['inventory', 'pos', 'sales', 'purchases', 'accounting', 'crm', 'whatsapp', 'reports'],
    status: 'active',
    users: 24,
    created: '2023-01-15'
  },
  {
    id: '2',
    name: 'XYZ Industries',
    admin: 'admin@xyz.com',
    subscription: 'Standard',
    userLimit: 25,
    enabledModules: ['inventory', 'pos', 'sales', 'purchases', 'crm', 'reports'],
    status: 'active',
    users: 16,
    created: '2023-02-22'
  },
  {
    id: '3',
    name: '123 Enterprises',
    admin: 'admin@123ent.com',
    subscription: 'Basic',
    userLimit: 10,
    enabledModules: ['inventory', 'pos', 'sales'],
    status: 'suspended',
    users: 5,
    created: '2023-03-10'
  },
  {
    id: '4',
    name: 'Tech Solutions',
    admin: 'admin@techsol.com',
    subscription: 'Premium',
    userLimit: 0,
    enabledModules: ['inventory', 'pos', 'sales', 'purchases', 'accounting', 'crm', 'whatsapp', 'reports'],
    status: 'active',
    users: 42,
    created: '2023-04-05'
  },
  {
    id: '5',
    name: 'Global Services',
    admin: 'admin@globalserv.com',
    subscription: 'Standard',
    userLimit: 25,
    enabledModules: ['inventory', 'pos', 'sales', 'purchases', 'crm', 'reports'],
    status: 'past_due',
    users: 11,
    created: '2023-05-18'
  }
];

const OrganizationsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newOrg, setNewOrg] = useState<OrganizationCreationRequest>({
    name: '',
    adminName: '',
    adminEmail: '',
    planId: 'standard'
  });

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.admin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrganization = async () => {
    // Validate form
    if (!newOrg.name || !newOrg.adminEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsCreating(true);
      
      // Call the organization creation service
      await createOrganization(newOrg);
      
      toast.success(`Organization "${newOrg.name}" created successfully`, {
        description: `Admin account created for ${newOrg.adminEmail}`,
      });
      
      setCreateDialogOpen(false);
      setNewOrg({
        name: '',
        adminName: '',
        adminEmail: '',
        planId: 'standard'
      });
      
      // In a real app, we would refresh the organizations list here
      // For now, we'll just keep the mock data
      
    } catch (error: any) {
      toast.error("Failed to create organization", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Suspended</Badge>;
      case 'past_due':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Past Due</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSelectedPlanDetails = () => {
    return subscriptionPlans.find(plan => plan.id === newOrg.planId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organizations</h2>
          <p className="text-muted-foreground">
            Manage tenant organizations in the system
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Organization
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>All Organizations</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search organizations..."
                  className="w-[250px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          <CardDescription>
            {filteredOrgs.length} organization(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Admin Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Modules</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrgs.map(org => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      {org.name}
                    </div>
                  </TableCell>
                  <TableCell>{org.admin}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Package className="mr-1 h-4 w-4 text-muted-foreground" />
                      {org.subscription}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                      {org.users}/{org.userLimit === 0 ? '∞' : org.userLimit}
                    </div>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex">
                            <Badge variant="outline" className="bg-blue-50">
                              {org.enabledModules.length} modules
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="p-2">
                            <p className="font-medium mb-1">Enabled Modules:</p>
                            <ul className="list-disc pl-5 space-y-1">
                              {org.enabledModules.map(module => (
                                <li key={module}>{moduleNames[module] || module}</li>
                              ))}
                            </ul>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{getStatusBadge(org.status)}</TableCell>
                  <TableCell>{new Date(org.created).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/superadmin/organizations/${org.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success("Organization edited")}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => toast.success(`${org.status === 'active' ? 'Suspended' : 'Activated'} organization`)}
                          className={org.status === 'active' ? "text-destructive" : "text-green-600"}
                        >
                          {org.status === 'active' ? 'Suspend' : 'Activate'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Create a new tenant organization and assign an administrator
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={newOrg.name}
                onChange={(e) => setNewOrg({...newOrg, name: e.target.value})}
                placeholder="Enter organization name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="adminName">Admin Name</Label>
                <Input
                  id="adminName"
                  value={newOrg.adminName}
                  onChange={(e) => setNewOrg({...newOrg, adminName: e.target.value})}
                  placeholder="Enter admin name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={newOrg.adminEmail}
                  onChange={(e) => setNewOrg({...newOrg, adminEmail: e.target.value})}
                  placeholder="Enter admin email"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="plan">Subscription Plan</Label>
              <select
                id="plan"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={newOrg.planId}
                onChange={(e) => setNewOrg({...newOrg, planId: e.target.value})}
              >
                {subscriptionPlans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - {plan.userLimit === 0 ? "Unlimited Users" : `${plan.userLimit} Users`}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Plan Details Preview */}
            {getSelectedPlanDetails() && (
              <div className="mt-2 p-3 border rounded-md bg-muted/20">
                <h4 className="font-medium flex items-center">
                  <Package className="h-4 w-4 mr-1" /> 
                  {getSelectedPlanDetails()?.name} Plan Details
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {getSelectedPlanDetails()?.description}
                </p>
                
                <div className="mt-3">
                  <div className="flex items-center text-sm mb-1">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{getSelectedPlanDetails()?.userLimit === 0 ? "Unlimited Users" : `${getSelectedPlanDetails()?.userLimit} Users`}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Grid3X3 className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Available Modules: </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-1">
                    {getSelectedPlanDetails()?.modules.map(module => (
                      <Badge key={module} variant="outline" className="text-xs">
                        {moduleNames[module] || module}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrganization} disabled={isCreating}>
              {isCreating && <span className="mr-2 h-4 w-4 animate-spin">⏳</span>}
              Create Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationsList;
