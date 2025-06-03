import React from 'react';
import { Route } from 'react-router-dom';
import SuperAdminLayout from '@/pages/superadmin/SuperAdminLayout';
import SuperAdminDashboard from '@/pages/superadmin/SuperAdminDashboard';
import OrganizationsList from '@/pages/superadmin/OrganizationsList';
import OrganizationDetails from '@/pages/superadmin/organizationDetails/OrganizationDetails';
import SubscriptionPlans from '@/pages/superadmin/SubscriptionPlans';
import PaymentGateways from '@/pages/superadmin/PaymentGateways';
import SMTPSettings from '@/pages/superadmin/SMTPSettings';
import WhatsAppSettings from '@/pages/superadmin/WhatsAppSettings';
import AdvancedSettings from '@/pages/superadmin/AdvancedSettings';

// Superadmin route configuration
export const superadminRoutes = [
  {
    path: '/superadmin',
    element: <SuperAdminLayout />,
    children: [
      {
        path: '',
        element: <SuperAdminDashboard />, 
        title: 'Dashboard',
        icon: 'dashboard'
      },
      {
        path: 'organizations',
        element: <OrganizationsList />,
        title: 'Organizations', 
        icon: 'building'
      },
      {
        path: 'organizations/:organization_id',
        element: <OrganizationDetails />,
        title: 'Organization Details',
        icon: 'building',
        hideFromNav: true
      },
      {
        path: 'subscription-plans',
        element: <SubscriptionPlans />,
        title: 'Subscription Plans',
        icon: 'credit-card'
      },
      {
        path: 'payment-gateways',
        element: <PaymentGateways />,
        title: 'Payment Gateways',
        icon: 'payment'
      },
      {
        path: 'smtp-settings',
        element: <SMTPSettings />,
        title: 'SMTP Settings',
        icon: 'mail'
      },
      {
        path: 'whatsapp-settings',
        element: <WhatsAppSettings />,
        title: 'WhatsApp Settings',
        icon: 'message-circle'
      },
      {
        path: 'settings',
        element: <AdvancedSettings />,
        title: 'Advanced Settings',
        icon: 'settings'
      }
    ]
  }
];

// Superadmin navigation items
export const superadminNavItems = superadminRoutes[0].children.map(route => ({
  title: route.title,
  path: `/superadmin/${route.path}`,
  icon: route.icon
}));