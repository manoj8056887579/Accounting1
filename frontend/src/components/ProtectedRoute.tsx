
import { Navigate, Outlet } from 'react-router-dom';
import { UserRole, useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles = ["super_admin", "admin", "cashier", "accountant", "inventory_manager", "purchase_manager"],
  redirectTo = "/login" 
}) => {
  const { isAuthenticated, isLoading, user, checkAccess } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-bizblue-500" />
        <span className="ml-2 text-xl font-medium">Loading...</span>
      </div>
    );
  }

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has the required role
  const hasAccess = checkAccess(allowedRoles);
  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has the correct role, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
