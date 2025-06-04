import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import LandingPage from './pages/LandingPage';
import { BrandingProvider } from './contexts/BrandingContext';
import { ForgotPassword } from './pages/forgot_password/ForgotPassword';
import ResetPassword from './pages/forgot_password/ResetPassword';
import './App.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrandingProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/*" element={<Index />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrandingProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
