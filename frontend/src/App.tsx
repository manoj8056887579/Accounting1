
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import LandingPage from './pages/LandingPage';
import { BrandingProvider } from './contexts/BrandingContext';
import './App.css';

const App: React.FC = () => {
  return (
    <BrandingProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/*" element={<Index />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </BrandingProvider>
  );
};

export default App;
