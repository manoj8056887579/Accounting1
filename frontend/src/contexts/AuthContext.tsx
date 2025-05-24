
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// User roles 
export type UserRole = 'super_admin' | 'admin' | 'cashier' | 'accountant' | 'inventory_manager' | 'purchase_manager';

// User object structure
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  username: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Auth context structure
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAccess: (allowedRoles: UserRole[]) => boolean;
}

// Mock user data for demo (in a real app this would come from API/backend)
const MOCK_USERS = [
  {
    id: "1",
    name: "Super Admin User",
    email: "superadmin@bizapp.com",
    phone: "123-456-7890",
    username: "superadmin",
    password: "superadmin123", // In a real app, this would be hashed
    role: "super_admin" as UserRole,
    status: "active" as const,
    createdAt: "2023-01-01T00:00:00.000Z"
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@bizapp.com",
    phone: "123-456-7890",
    username: "admin",
    password: "admin123", // In a real app, this would be hashed
    role: "admin" as UserRole,
    status: "active" as const,
    createdAt: "2023-01-01T00:00:00.000Z"
  },
  {
    id: "3",
    name: "Cashier User",
    email: "cashier@bizapp.com",
    phone: "123-456-7891", 
    username: "cashier",
    password: "cashier123", // In a real app, this would be hashed
    role: "cashier" as UserRole,
    status: "active" as const,
    createdAt: "2023-01-02T00:00:00.000Z"
  },
  {
    id: "4",
    name: "Accountant User",
    email: "accountant@bizapp.com",
    phone: "123-456-7892",
    username: "accountant",
    password: "accountant123", // In a real app, this would be hashed
    role: "accountant" as UserRole,
    status: "active" as const,
    createdAt: "2023-01-03T00:00:00.000Z"
  },
  {
    id: "5",
    name: "Inventory User",
    email: "inventory@bizapp.com",
    phone: "123-456-7893",
    username: "inventory",
    password: "inventory123", // In a real app, this would be hashed
    role: "inventory_manager" as UserRole,
    status: "active" as const,
    createdAt: "2023-01-04T00:00:00.000Z"
  },
  {
    id: "6",
    name: "Purchase User",
    email: "purchase@bizapp.com",
    phone: "123-456-7894",
    username: "purchase",
    password: "purchase123", // In a real app, this would be hashed
    role: "purchase_manager" as UserRole,
    status: "active" as const,
    createdAt: "2023-01-05T00:00:00.000Z"
  },
  {
    id: "7",
    name: "Inactive User",
    email: "inactive@bizapp.com",
    phone: "123-456-7895",
    username: "inactive",
    password: "inactive123", // In a real app, this would be hashed
    role: "cashier" as UserRole,
    status: "inactive" as const,
    createdAt: "2023-01-06T00:00:00.000Z"
  },
];

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // On component mount, check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('bizapp_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('bizapp_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function - would connect to an API in a real app
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user with matching credentials
      const foundUser = MOCK_USERS.find(u => 
        u.username === username && 
        u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid username or password");
      }
      
      if (foundUser.status === "inactive") {
        throw new Error("Your account is inactive. Please contact the administrator.");
      }
      
      // Remove password from user object before storing
      const { password: _, ...safeUser } = foundUser;
      
      // Store user in state and localStorage
      setUser(safeUser);
      localStorage.setItem('bizapp_user', JSON.stringify(safeUser));
      
      toast.success(`Welcome, ${safeUser.name}!`);
      
      // Redirect based on user role
      if (safeUser.role === 'super_admin') {
        navigate('/superadmin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      throw error; // Re-throw the error so it can be caught in the login component
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('bizapp_user');
    toast.success("You have been logged out successfully");
    navigate('/login');
  };

  // Check if user has access based on their role
  const checkAccess = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      checkAccess 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
