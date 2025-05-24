
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Format role for display
  const formatRole = (role?: string) => {
    if (!role) return 'unknown';
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <ShieldAlert className="mx-auto h-24 w-24 text-destructive" />
        <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-lg text-gray-600">
          Sorry, you don't have permission to access this page.
        </p>
        <p className="text-sm text-gray-500">
          Your role ({formatRole(user?.role)}) does not have the necessary permissions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button 
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
