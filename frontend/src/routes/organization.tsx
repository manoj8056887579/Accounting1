import React from 'react';
import { Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import PointOfSale from '@/pages/modules/PointOfSale';
import Inventory from '@/pages/modules/Inventory';
import Sales from '@/pages/modules/Sales';
import Purchases from '@/pages/modules/Purchases';
import Accounting from '@/pages/modules/Accounting';
import CRM from '@/pages/modules/CRM';
import WhatsApp from '@/pages/modules/WhatsApp';
import Reports from '@/pages/modules/Reports';
import TaxManagement from '@/pages/modules/TaxManagement';
import EWaybill from '@/pages/modules/EWaybill';
import GSTEFiling from '@/pages/modules/GSTEFiling';
import UserManagement from '@/pages/UserManagement';
import Settings from '@/pages/modules/Settings';

// Define available modules
export type ApplicationModule = 
  | 'inventory'
  | 'pos'
  | 'sales'
  | 'purchases'
  | 'accounting' 
  | 'crm'
  | 'whatsapp'
  | 'reports';

// Module configuration
export const moduleConfig = {
  inventory: {
    title: 'Inventory',
    icon: 'package',
    path: 'inventory',
    component: Inventory,
    description: 'Manage your inventory and stock levels'
  },
  pos: {
    title: 'Point of Sale',
    icon: 'shopping-cart',
    path: 'pos',
    component: PointOfSale,
    description: 'Process sales and manage transactions'
  },
  sales: {
    title: 'Sales',
    icon: 'trending-up',
    path: 'sales',
    component: Sales,
    description: 'Track and manage sales operations'
  },
  purchases: {
    title: 'Purchases',
    icon: 'shopping-bag',
    path: 'purchases',
    component: Purchases,
    description: 'Manage purchase orders and suppliers'
  },
  accounting: {
    title: 'Accounting',
    icon: 'calculator',
    path: 'accounting',
    component: Accounting,
    description: 'Handle financial transactions and reports'
  },
  crm: {
    title: 'CRM',
    icon: 'users',
    path: 'crm',
    component: CRM,
    description: 'Manage customer relationships'
  },
  whatsapp: {
    title: 'WhatsApp',
    icon: 'message-circle',
    path: 'whatsapp',
    component: WhatsApp,
    description: 'WhatsApp integration and messaging'
  },
  reports: {
    title: 'Reports',
    icon: 'bar-chart',
    path: 'reports',
    component: Reports,
    description: 'Generate and view reports'
  }
};

// Organization routes configuration
export const organizationRoutes = [
  {
    path: '/:organizationId',
    element: <AppLayout />,
    children: [
      {
        path: '',
        element: <Dashboard />,
        title: 'Dashboard',
        icon: 'dashboard'
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
        title: 'Dashboard',
        icon: 'dashboard'
      },
      ...Object.values(moduleConfig).map(module => ({
        path: module.path,
        element: <module.component />,
        title: module.title,
        icon: module.icon,
        description: module.description
      })),
      {
        path: 'tax',
        element: <TaxManagement />,
        title: 'Tax Management',
        icon: 'percent'
      },
      {
        path: 'e-waybill',
        element: <EWaybill />,
        title: 'E-Waybill',
        icon: 'file-text'
      },
      {
        path: 'gst-efiling',
        element: <GSTEFiling />,
        title: 'GST E-Filing',
        icon: 'file-check'
      },
      {
        path: 'users',
        element: <UserManagement />,
        title: 'User Management',
        icon: 'users'
      },
      {
        path: 'settings',
        element: <Settings />,
        title: 'Settings',
        icon: 'settings'
      }
    ]
  }
];

// Subscription plan configurations
export const subscriptionPlans = {
  basic: {
    name: 'Basic',
    userLimit: 10,
    modules: ['inventory', 'pos', 'sales'] as ApplicationModule[],
    price: 0,
    description: 'Essential features for small businesses'
  },
  standard: {
    name: 'Standard',
    userLimit: 25,
    modules: ['inventory', 'pos', 'sales', 'purchases', 'crm', 'reports'] as ApplicationModule[],
    price: 0,
    description: 'Perfect for growing businesses'
  },
  premium: {
    name: 'Premium',
    userLimit: 0, // Unlimited
    modules: ['inventory', 'pos', 'sales', 'purchases', 'accounting', 'crm', 'whatsapp', 'reports'] as ApplicationModule[],
    price: 0,
    description: 'Advanced features for larger operations'
  }
};

// Helper function to get available modules for a plan
export const getModulesForPlan = (planId: keyof typeof subscriptionPlans): ApplicationModule[] => {
  return subscriptionPlans[planId]?.modules || [];
};

// Helper function to check if a module is available for a plan
export const isModuleAvailable = (planId: keyof typeof subscriptionPlans, moduleId: ApplicationModule): boolean => {
  return getModulesForPlan(planId).includes(moduleId);
}; 