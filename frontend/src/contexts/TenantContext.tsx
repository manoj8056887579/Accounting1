
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Organization, OrganizationRole, TenantContext as TenantContextType } from '@/models/organization';
import { toast } from 'sonner';

// Mock organization data for demo
const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "1",
    name: "ABC Corporation",
    slug: "abc-corp",
    logo: "/logos/abc-corp.png",
    status: "active",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    id: "2",
    name: "XYZ Industries",
    slug: "xyz-industries",
    logo: "/logos/xyz-industries.png",
    status: "active",
    createdAt: "2023-02-01T00:00:00.000Z",
    updatedAt: "2023-02-01T00:00:00.000Z"
  },
  {
    id: "3",
    name: "123 Enterprises",
    slug: "123-enterprises",
    status: "active",
    createdAt: "2023-03-01T00:00:00.000Z",
    updatedAt: "2023-03-01T00:00:00.000Z"
  }
];

// Mock user-organization memberships
const MOCK_MEMBERSHIPS: Record<string, Array<{userId: string; organizationId: string; role: OrganizationRole; joinedAt: string; isDefault: boolean}>> = {
  // Admin user is owner of ABC Corp and member of XYZ
  "1": [
    { userId: "1", organizationId: "1", role: "owner", joinedAt: "2023-01-01T00:00:00.000Z", isDefault: true },
    { userId: "1", organizationId: "2", role: "member", joinedAt: "2023-02-01T00:00:00.000Z", isDefault: false }
  ],
  // Cashier user is member of ABC Corp only
  "2": [
    { userId: "2", organizationId: "1", role: "member", joinedAt: "2023-01-15T00:00:00.000Z", isDefault: true }
  ],
  // Accountant user is admin of XYZ Industries
  "3": [
    { userId: "3", organizationId: "2", role: "admin", joinedAt: "2023-02-15T00:00:00.000Z", isDefault: true }
  ],
  // Inventory user is member of ABC Corp and 123 Enterprises
  "4": [
    { userId: "4", organizationId: "1", role: "member", joinedAt: "2023-01-20T00:00:00.000Z", isDefault: true },
    { userId: "4", organizationId: "3", role: "member", joinedAt: "2023-03-20T00:00:00.000Z", isDefault: false }
  ],
  // Purchase user is admin of 123 Enterprises
  "5": [
    { userId: "5", organizationId: "3", role: "admin", joinedAt: "2023-03-10T00:00:00.000Z", isDefault: true }
  ]
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentOrganizationId, setCurrentOrganizationId] = useState<string | null>(null);
  const [availableOrganizations, setAvailableOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [userRole, setUserRole] = useState<OrganizationRole | null>(null);

  // Load user's organizations and set default
  useEffect(() => {
    const loadOrganizations = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Get user's memberships
        const userMemberships = MOCK_MEMBERSHIPS[user.id] || [];
        
        // Get organizations the user belongs to
        const userOrgs = userMemberships.map(membership => {
          const org = MOCK_ORGANIZATIONS.find(org => org.id === membership.organizationId);
          return org;
        }).filter(Boolean) as Organization[];
        
        setAvailableOrganizations(userOrgs);
        
        // Get default organization
        const defaultMembership = userMemberships.find(m => m.isDefault);
        
        if (defaultMembership) {
          const orgId = defaultMembership.organizationId;
          setCurrentOrganizationId(orgId);
          
          // Set current org and user role
          const org = MOCK_ORGANIZATIONS.find(org => org.id === orgId) || null;
          setCurrentOrganization(org);
          
          const role = defaultMembership.role;
          setUserRole(role);
        } else if (userOrgs.length > 0) {
          // If no default, use first available
          setCurrentOrganizationId(userOrgs[0].id);
          setCurrentOrganization(userOrgs[0]);
          setUserRole(userMemberships.find(m => m.organizationId === userOrgs[0].id)?.role || null);
        }
      } catch (error) {
        console.error("Error loading organizations", error);
        toast.error("Failed to load organizations");
      } finally {
        setIsLoading(false);
      }
    };

    // Get from localStorage if available
    const storedOrgId = localStorage.getItem('current_organization_id');
    if (storedOrgId) {
      setCurrentOrganizationId(storedOrgId);
    }

    loadOrganizations();
  }, [isAuthenticated, user]);

  // When current organization changes, update local storage and current org data
  useEffect(() => {
    if (currentOrganizationId) {
      localStorage.setItem('current_organization_id', currentOrganizationId);
      
      // Update current organization and user role
      const org = MOCK_ORGANIZATIONS.find(org => org.id === currentOrganizationId) || null;
      setCurrentOrganization(org);
      
      if (user) {
        const membership = MOCK_MEMBERSHIPS[user.id]?.find(m => m.organizationId === currentOrganizationId);
        setUserRole(membership?.role || null);
      }
    }
  }, [currentOrganizationId, user]);

  const handleSetCurrentOrganizationId = (orgId: string) => {
    if (availableOrganizations.some(org => org.id === orgId)) {
      setCurrentOrganizationId(orgId);
      toast.success("Organization switched successfully");
    } else {
      toast.error("You don't have access to this organization");
    }
  };

  return (
    <TenantContext.Provider value={{
      currentOrganizationId,
      currentOrganization,
      userRole,
      availableOrganizations,
      setCurrentOrganizationId: handleSetCurrentOrganizationId,
      isLoading
    }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
