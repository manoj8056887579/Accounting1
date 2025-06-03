import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Building2, Users, Package, ArrowLeft, Loader2, Pencil, X, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


interface Organization {
  id: number;
  organization_id: string;
  name: string;
  slug: string;
  organization_db: string;
  admin_email: string;
  admin_name: string;
  role: string;
  phone_number: string;
  subscription_plan: string;
  user_limit: number;
  status: string;
  enabled_modules: string[];
  active: boolean; 
  updated_at: string;
  created_at: string;
  users?: number;
  // Optional fields that might be added later
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  tax_id?: string;
}

interface OrganizationAdmin {
  id: number;
  name: string;
  organization_db: string;
  admin_email: string;
  admin_name: string;
  phone_number: string;
  role: string;
  organization_id: string;
  tax_id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  organization: {
    id: string;
    name: string;
    db: string;
    subscription_plan: string;
    enabled_modules: string[];
  };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const OrganizationDetails = () => {
  const { organization_id } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [admin, setAdmin] = useState<OrganizationAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);
  const [detailsEditMode, setDetailsEditMode] = useState(false);
  const [adminEditMode, setAdminEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Create form states for editable data
  const [editableOrg, setEditableOrg] = useState<Partial<Organization>>({});
  const [editableAdmin, setEditableAdmin] = useState<Partial<OrganizationAdmin>>({});

  const fetchOrganizationDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/superadmin/organization/${organization_id}`);
      
      if (response.data.success) {
        setOrganization(response.data.data);
      } else {
        toast.error('Failed to fetch organization details');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Error fetching organization details', {
        description: errorMsg
      });
    } finally {
      setLoading(false);
    }
  }, [organization_id]);

  // Fetch organization admin details
  const fetchOrganizationAdmin = useCallback(async () => {
    try {
      setAdminLoading(true);
      const response = await axios.get(`${API_URL}/api/superadmin/organizationadmin/${organization_id}`);
      
      if (response.data.success) {
        setAdmin(response.data.data);
      } else {
        toast.error('Failed to fetch admin details');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Error fetching admin details', {
        description: errorMsg
      });
    } finally {
      setAdminLoading(false);
    }
  }, [organization_id]);

  useEffect(() => {
    fetchOrganizationDetails();
  }, [fetchOrganizationDetails]);

  useEffect(() => {
    fetchOrganizationAdmin();
  }, [fetchOrganizationAdmin]);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'past_due':
        return <Badge variant="secondary">Past Due</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  // Update organization details (updates both main and tenant databases)
  const handleOrganizationUpdate = async () => {
    try {
      if (!editableOrg.name?.trim()) {
        toast.error('Organization name is required');
        return;
      }

      if (editableOrg.phone_number && !editableOrg.phone_number.match(/^\d{10}$/)) {
        toast.error('Phone number must be 10 digits');
        return;
      }

      if (editableOrg.user_limit && (editableOrg.user_limit < 1 || editableOrg.user_limit > 100)) {
        toast.error('User limit must be between 1 and 100');
        return;
      }

      setSaving(true);

      // Make sure all fields are properly typed
      const updateData = {
        name: editableOrg.name?.trim(),
        adminEmail: editableOrg.admin_email?.trim(),
        adminName: editableOrg.admin_name?.trim(),
        phoneNumber: editableOrg.phone_number?.trim(),
        planId: editableOrg.subscription_plan,
        status: editableOrg.status,
        user_limit: editableOrg.user_limit ? Number(editableOrg.user_limit) : undefined
      };

      const response = await axios.put(
        `${API_URL}/api/superadmin/organization/${organization_id}`,
        updateData
      );
      
      if (response.data.success) {
        setOrganization({ ...organization!, ...editableOrg });
        setDetailsEditMode(false);
        toast.success('Organization details updated successfully');
      } else {
        toast.error('Failed to update organization details');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Error updating organization', {
        description: errorMsg
      });
    } finally {
      setSaving(false);
    }
  };
  // Update admin details (updates both main and tenant databases)
  const handleAdminUpdate = async () => {
    try {
      // Validate required fields
      if (!editableAdmin.admin_name?.trim()) {
        toast.error('Admin name is required');
        return;
      }

      // Validate phone number format
      if (editableAdmin.phone_number && !editableAdmin.phone_number.match(/^\d{10}$/)) {
        toast.error('Phone number must be 10 digits');
        return;
      }

      // Validate ZIP code format if provided
      if (editableAdmin.zip_code && !editableAdmin.zip_code.match(/^\d{6}$/)) {
        toast.error('ZIP code must be 6 digits');
        return;
      }

      setSaving(true);
      const updateData = {
        name: editableAdmin.admin_name?.trim(),
        phone_number: editableAdmin.phone_number,
        tax_id: editableAdmin.tax_id || 'N/A',
        address: editableAdmin.address || 'N/A',
        city: editableAdmin.city || 'N/A',
        state: editableAdmin.state || 'N/A',
        zip_code: editableAdmin.zip_code || 'N/A',
        country: editableAdmin.country || 'N/A'
      };      const response = await axios.put(
        `${API_URL}/api/superadmin/organizationadmin/${organization_id}`, 
        updateData
      );
      
      if (response.data.success) {
        setAdmin(response.data.data);
        setAdminEditMode(false);
        toast.success('Admin details updated successfully');
        setAdmin({ ...admin!, ...response.data.data });
        setAdminEditMode(false);
        toast.success('Admin details updated successfully in both databases');
      } else {
        toast.error('Failed to update admin details');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error('Error updating admin details', {
        description: errorMsg
      });
    } finally {
      setSaving(false);
    }
  };

  // Cancel edit mode and reset form
  const handleCancelDetailsEdit = () => {
    setEditableOrg({});
    setDetailsEditMode(false);
  };

  const handleCancelAdminEdit = () => {
    setEditableAdmin({});
    setAdminEditMode(false);
  };

  // Start edit mode
  const handleStartDetailsEdit = () => {
    setEditableOrg(organization || {});
    setDetailsEditMode(true);
  };

  const handleStartAdminEdit = () => {
    setEditableAdmin(admin || {});
    setAdminEditMode(true);
  };

  // Handle organization input changes
  const handleOrgInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableOrg(prev => ({
      ...prev,
      [name]: name === 'user_limit' ? parseInt(value) : value
    }));
  };

  // Handle admin input changes
  const handleAdminInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableAdmin(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate('/superadmin/organizations')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Organizations
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{organization.name}</p>
                <p className="text-sm text-muted-foreground">
                  ID: {organization.organization_id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">{organization.subscription_plan}</p>
                <div className="mt-1">{getStatusBadge(organization.status)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">
                  {organization.users || 0} / {organization.user_limit || 'Unlimited'}
                </p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>
                  Detailed information about the organization
                </CardDescription>
              </div>
              {detailsEditMode ? (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelDetailsEdit}
                    disabled={saving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleOrganizationUpdate}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartDetailsEdit}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input
                      name="name"
                      value={detailsEditMode ? editableOrg.name : organization?.name}
                      onChange={handleOrgInputChange}
                      disabled={!detailsEditMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Organization ID</Label>
                    <Input value={organization?.organization_id} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      name="phone_number"
                      value={detailsEditMode ? editableOrg.phone_number : organization?.phone_number}
                      onChange={handleOrgInputChange}
                      disabled={!detailsEditMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subscription Plan</Label>
                    <Input value={organization?.subscription_plan} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>User Limit</Label>
                    <Input
                      name="user_limit"
                      value={detailsEditMode ? editableOrg.user_limit : organization?.user_limit}
                      onChange={handleOrgInputChange}
                      type="number"
                      disabled={!detailsEditMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Input value={organization?.status} disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Enabled Modules</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {organization?.enabled_modules.map((module) => (
                      <Badge key={module} variant="secondary" className="capitalize">
                        {module}
                      </Badge>
                    ))}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Admin Information</CardTitle>
                <CardDescription>
                  Organization administrator details and contact information
                </CardDescription>
              </div>
              {adminEditMode ? (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelAdminEdit}
                    disabled={saving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleAdminUpdate}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartAdminEdit}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {adminLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : admin ? (
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Admin Name</Label>
                      <Input
                        name="admin_name"
                        value={adminEditMode ? editableAdmin.admin_name : admin?.admin_name}
                        onChange={handleAdminInputChange}
                        disabled={!adminEditMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={admin?.admin_email}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        name="phone_number"
                        value={adminEditMode ? editableAdmin.phone_number : admin?.phone_number}
                        onChange={handleAdminInputChange}
                        disabled={!adminEditMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input value={admin?.role} disabled />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Address Information</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                          name="address"
                          value={adminEditMode ? editableAdmin.address : admin?.address}
                          onChange={handleAdminInputChange}
                          disabled={!adminEditMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          name="city"
                          value={adminEditMode ? editableAdmin.city : admin?.city}
                          onChange={handleAdminInputChange}
                          disabled={!adminEditMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input
                          name="state"
                          value={adminEditMode ? editableAdmin.state : admin?.state}
                          onChange={handleAdminInputChange}
                          disabled={!adminEditMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ZIP Code</Label>
                        <Input
                          name="zip_code"
                          value={adminEditMode ? editableAdmin.zip_code : admin?.zip_code}
                          onChange={handleAdminInputChange}
                          disabled={!adminEditMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input
                          name="country"
                          value={adminEditMode ? editableAdmin.country : admin?.country}
                          onChange={handleAdminInputChange}
                          disabled={!adminEditMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tax ID</Label>
                        <Input
                          name="tax_id"
                          value={adminEditMode ? editableAdmin.tax_id : admin?.tax_id}
                          onChange={handleAdminInputChange}
                          disabled={!adminEditMode}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <p>No admin information available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage organization users and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* User management content will be implemented later */}
              <p>User management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                View and manage billing details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Billing content will be implemented later */}
              <p>Billing information coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationDetails;
