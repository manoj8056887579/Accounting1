import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Building,
  Search,
  Plus,
  MoreHorizontal,
  Check,
  X,
  ArrowUpDown,
  Mail,
  Package,
  Users,
  Grid3X3,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define interface for organization data
interface Organization {
  id: string;
  organization_id: string;
  name: string;
  admin_email: string;
  admin_name: string;
  phone_number?: string;
  subscription_plan: string;
  user_limit: number;
  enabled_modules: string[];
  status: string;
  users?: number; // Optional for frontend display
  created_at: string;
}

// Define interface for organization creation request
interface OrganizationCreationRequest {
  name: string;
  adminEmail: string;
  adminName: string;
  phoneNumber?: string;
  planId: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Mock plans for dropdown
const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    description: "Essential features for small businesses",
    userLimit: 10,
    modules: ["inventory", "pos", "sales"],
  },
  {
    id: "standard",
    name: "Standard",
    description: "Perfect for growing businesses",
    userLimit: 25,
    modules: ["inventory", "pos", "sales", "purchases", "crm", "reports"],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Advanced features for larger operations",
    userLimit: 0, // Unlimited
    modules: [
      "inventory",
      "pos",
      "sales",
      "purchases",
      "accounting",
      "crm",
      "whatsapp",
      "reports",
    ],
  },
];

// Module display names
const moduleNames = {
  inventory: "Inventory",
  pos: "POS",
  sales: "Sales",
  purchases: "Purchases",
  accounting: "Accounting",
  crm: "CRM",
  whatsapp: "WhatsApp",
  reports: "Reports",
};

const OrganizationsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newOrg, setNewOrg] = useState<OrganizationCreationRequest>({
    name: "",
    adminName: "",
    adminEmail: "",
    phoneNumber: "",
    planId: "standard",
  });
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Function to fetch organizations from the API
  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/superadmin/organization`
      );

      if (response.data.success) {
        setOrganizations(response.data.data);
      } else {
        toast.error("Failed to fetch organizations");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Error fetching organizations", {
        description: errorMsg,
      });
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrgs = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.admin_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrganization = async () => {
    // Validate form
    if (!newOrg.name || !newOrg.adminEmail || !newOrg.adminName) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsCreating(true);

      // Call the API directly using Axios
      const response = await axios.post(
        `${API_URL}/api/superadmin/organization`,
        {
          name: newOrg.name,
          adminEmail: newOrg.adminEmail,
          adminName: newOrg.adminName,
          phoneNumber: newOrg.phoneNumber,
          planId: newOrg.planId,
        }
      );

      if (response.data.success) {
        const tempPassword = response.data.data.admin.tempPassword;

        toast.success(`Organization "${newOrg.name}" created successfully`, {
          description: `Admin account created for ${newOrg.adminEmail}. Temporary password: ${tempPassword}`,
          duration: 10000, // Show for 10 seconds
        });

        // Refresh the organizations list
        fetchOrganizations();

        // Close the dialog and reset form
        setCreateDialogOpen(false);
        setNewOrg({
          name: "",
          adminName: "",
          adminEmail: "",
          phoneNumber: "",
          planId: "standard",
        });
      } else {
        toast.error("Failed to create organization", {
          description: response.data.message,
        });
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Failed to create organization", {
        description: errorMsg,
      });
      console.error("Error creating organization:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;

      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSelectedPlanDetails = () => {
    return subscriptionPlans.find((plan) => plan.id === newOrg.planId);
  };

  const handleStatusChange = async (
    organizationId: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";

    try {
      const response = await axios.put(
        `${API_URL}/api/superadmin/organization/${organizationId}`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        toast.success(
          `Organization ${
            newStatus === "active" ? "activated" : "suspended"
          } successfully`
        );
        fetchOrganizations();
      } else {
        toast.error(`Failed to update organization status`);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Error updating organization status", {
        description: errorMsg,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Organizations</h2>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-0 pb-4">
          <div className="flex items-center justify-between">

            <div className="w-72">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm pl-8"
                />
              </div>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Organization
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredOrgs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No organizations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {org.organization_id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{org.admin_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {org.admin_email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{org.phone_number || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{org.subscription_plan}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(org.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(
                                `/superadmin/organizations/${org.organization_id}`
                              )
                            }
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(org.id, org.status)
                            }
                          >
                            {org.status === "active" ? "Suspend" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Organization Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Create a new organization with an admin account.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={newOrg.name}
                onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                placeholder="Enter organization name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="adminName">Admin Name</Label>
              <Input
                id="adminName"
                value={newOrg.adminName}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, adminName: e.target.value })
                }
                placeholder="Enter admin name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={newOrg.adminEmail}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, adminEmail: e.target.value })
                }
                placeholder="Enter admin email"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={newOrg.phoneNumber}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, phoneNumber: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="plan">Subscription Plan</Label>
              <Select
                value={newOrg.planId}
                onValueChange={(value) =>
                  setNewOrg({ ...newOrg, planId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptionPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {getSelectedPlanDetails() && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>{getSelectedPlanDetails()?.description}</p>
                  <p className="mt-1">
                    User limit:{" "}
                    {getSelectedPlanDetails()?.userLimit || "Unlimited"} users
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setCreateDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateOrganization} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Organization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationsList;
