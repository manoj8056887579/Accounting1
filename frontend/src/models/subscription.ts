
import { Organization } from './organization';

export type SubscriptionInterval = 'monthly' | 'quarterly' | 'yearly';
export type SubscriptionStatus = 'active' | 'created' | 'authenticated' | 'pending' | 'halted' | 'cancelled' | 'completed' | 'failed';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: SubscriptionInterval;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export interface SubscriptionOrder {
  id: string;
  orderId?: string;
  organizationId: string;
  planId: string;
  amount: number;
  currency: string;
  receipt?: string;
  status: 'created' | 'paid' | 'failed';
  paymentId?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  razorpaySubscriptionId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}
