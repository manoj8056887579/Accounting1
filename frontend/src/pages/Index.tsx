import React from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Registration from './Registration';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import { superadminRoutes } from '@/routes/superadmin';
import { organizationRoutes } from '@/routes/organization';
import OrganizationWrapper from '@/components/OrganizationWrapper';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
   
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!isAuthenticated ? <Registration /> : <Navigate to="/login" replace />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Super Admin Routes */}
      {superadminRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        >
          {route.children.map((child) => (
            <Route
              key={child.path}
              path={child.path}
              element={child.element}
            />
          ))}
        </Route>
      ))}
      
      {/* Organization Routes */}
      {organizationRoutes.map((route) => (
        <Route 
          key={route.path}
          path={route.path}
          element={
            <OrganizationWrapper>
              {route.element}
            </OrganizationWrapper>
          }
        >
          {route.children.map((child) => (
            <Route
              key={child.path}
              path={child.path}
              element={child.element}
            />
          ))}
        </Route>
      ))}
      
      {/* Default app routes */}
      <Route path="/app" element={
        <Navigate to={
          isAuthenticated 
            ? (user?.role === 'super_admin' ? '/superadmin' : '/dashboard') 
            : '/login'
        } replace />
      } />
      
      {/* Redirect from root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Index;
 