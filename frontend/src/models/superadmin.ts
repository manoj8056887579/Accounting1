import { Organization } from './organization';

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired';
export type PaymentGateway = 'razorpay' | 'stripe' | 'none';

// Define available modules in the system
export type ApplicationModule = 'inventory' | 'pos' | 'sales' | 'purchases' | 'accounting' | 'crm' | 'whatsapp' | 'reports';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string; // e.g., "INR", "USD" 
  interval: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  userLimit: number; // Maximum number of users allowed
  modules: ApplicationModule[]; // Available modules in this plan
  isPopular?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentGatewaySettings {
  gateway: PaymentGateway;
  apiKey: string;
  apiSecret: string;
  isTestMode: boolean;
  webhookSecret?: string;
  isActive: boolean;
}

export interface OrganizationSubscription {
  id: string;
  organizationId: string;
  planId: string;
  planName: string;
  price: number;
  currency: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  trialEndDate?: string;
  cancelAtPeriodEnd: boolean;
  paymentGateway: PaymentGateway;
  gatewaySubscriptionId?: string;
  gatewayCustomerId?: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SMTPSettings {
  id?: number; // Should be added
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

export interface SuperAdminSettings {
  id: string;
  requireEmailVerification: boolean;
  allowOrganizationCreation: boolean;
  defaultTrialDays: number;
  enforceStrongPasswords: boolean;
  logoUrl?: string;
  faviconUrl?: string;
  lightThemeColors?: ThemeColors;
  darkThemeColors?: ThemeColors;
  smtp?: SMTPSettings;
  updatedAt: string;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface OrganizationCreationRequest {
  name: string;
  adminEmail: string;
  adminName: string;
  planId: string;
  trialDays?: number;
}
