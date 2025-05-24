
import { ApplicationModule } from "./superadmin";

export type OrganizationStatus = "active" | "suspended" | "pending" | "deactivated";
export type OrganizationRole = "owner" | "admin" | "member" | "guest";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  status: OrganizationStatus;
  createdAt: string;
  updatedAt: string;
  subscriptionPlan?: string; // Plan ID
  userLimit?: number; // Maximum number of users
  enabledModules?: ApplicationModule[]; // Enabled modules based on subscription
}

export interface TenantContext {
  currentOrganizationId: string | null;
  currentOrganization: Organization | null;
  userRole: OrganizationRole | null;
  availableOrganizations: Organization[];
  setCurrentOrganizationId: (id: string) => void;
  isLoading: boolean;
}
