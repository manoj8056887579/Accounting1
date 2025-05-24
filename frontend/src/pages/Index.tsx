
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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
import SuperAdminLayout from '@/pages/superadmin/SuperAdminLayout';
import SuperAdminDashboard from '@/pages/superadmin/SuperAdminDashboard';
import OrganizationsList from '@/pages/superadmin/OrganizationsList';
import SubscriptionPlans from '@/pages/superadmin/SubscriptionPlans';
import PaymentGateways from '@/pages/superadmin/PaymentGateways';
import SMTPSettings from '@/pages/superadmin/SMTPSettings';
import WhatsAppSettings from '@/pages/superadmin/WhatsAppSettings';
import AdvancedSettings from '@/pages/superadmin/AdvancedSettings';
import Login from '@/pages/Login';
import { useAuth } from '@/contexts/AuthContext';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized'; 
import ProtectedRoute from '@/components/ProtectedRoute';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Super Admin Routes */}
      {user?.role === 'super_admin' && (
        <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
          <Route element={<SuperAdminLayout />}>
            <Route path="/superadmin" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/organizations" element={<OrganizationsList />} />
            <Route path="/superadmin/subscription-plans" element={<SubscriptionPlans />} /> 
            <Route path="/superadmin/payment-gateways" element={<PaymentGateways />} />
            <Route path="/superadmin/smtp-settings" element={<SMTPSettings />} />
            <Route path="/superadmin/whatsapp-settings" element={<WhatsAppSettings />} />
            <Route path="/superadmin/settings" element={<AdvancedSettings />} />
          </Route>
        </Route>
      )}
      
      {/* Regular User Routes - Only show when authenticated */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pos" element={<PointOfSale />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/whatsapp" element={<WhatsApp />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/tax" element={<TaxManagement />} />
          <Route path="/e-waybill" element={<EWaybill />} />
          <Route path="/gst-efiling" element={<GSTEFiling />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      
      {/* Default app routes - only used when accessing /app directly */}
      <Route path="/app" element={<Navigate to={isAuthenticated ? (user?.role === 'super_admin' ? '/superadmin' : '/dashboard') : '/login'} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Index;
