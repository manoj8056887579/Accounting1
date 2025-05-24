import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  BookOpen,
  Package,
  Truck,
  Users,
  Percent,
  ChartBar,
  User,
  LogOut,
  Menu,
  X,
  Settings,
  Receipt,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  FileText,
  File
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define navigation items with role access control
const navigationItems = [
  { 
    name: 'Dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard, 
    roles: ['admin', 'cashier', 'accountant', 'inventory_manager', 'purchase_manager'] as UserRole[] 
  },
  { 
    name: 'Point of Sale', 
    path: '/pos', 
    icon: ShoppingCart, 
    roles: ['admin', 'cashier'] as UserRole[] 
  },
  { 
    name: 'Inventory', 
    path: '/inventory', 
    icon: Package, 
    roles: ['admin', 'inventory_manager'] as UserRole[] 
  },
  { 
    name: 'Sales', 
    path: '/sales', 
    icon: Receipt, 
    roles: ['admin'] as UserRole[] 
  },
  { 
    name: 'Purchases', 
    path: '/purchases', 
    icon: Truck, 
    roles: ['admin', 'purchase_manager'] as UserRole[] 
  },
  { 
    name: 'Accounting', 
    path: '/accounting', 
    icon: BookOpen, 
    roles: ['admin', 'accountant'] as UserRole[] 
  },
  { 
    name: 'CRM', 
    path: '/crm', 
    icon: Users, 
    roles: ['admin', 'accountant', 'purchase_manager'] as UserRole[] 
  },
  { 
    name: 'WhatsApp', 
    path: '/whatsapp', 
    icon: MessageSquare, 
    roles: ['admin', 'accountant', 'purchase_manager'] as UserRole[] 
  },
  { 
    name: 'E-Waybill', 
    path: '/e-waybill', 
    icon: FileText, 
    roles: ['admin', 'accountant', 'inventory_manager'] as UserRole[] 
  },
  { 
    name: 'GST E-Filing', 
    path: '/gst-efiling', 
    icon: File, 
    roles: ['admin', 'accountant'] as UserRole[] 
  },
  { 
    name: 'Tax', 
    path: '/tax', 
    icon: Percent, 
    roles: ['admin', 'accountant'] as UserRole[] 
  },
  { 
    name: 'Reports', 
    path: '/reports', 
    icon: ChartBar, 
    roles: ['admin', 'accountant'] as UserRole[] 
  },
  { 
    name: 'User Management', 
    path: '/users', 
    icon: User, 
    roles: ['admin'] as UserRole[] 
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: Settings, 
    roles: ['admin'] as UserRole[] 
  },
];

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  if (!user) {
    return <Outlet />;
  }

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  // Toggle sidebar (especially for mobile)
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  // Toggle sidebar minimized state (desktop only)
  const toggleSidebarMinimized = () => {
    setSidebarMinimized(prev => !prev);
  };
  
  // Get user initials for avatar
  const userInitials = user.name
    .split(' ')
    .map(name => name[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarMinimized ? "w-16" : "w-64",
          isMobile && "shadow-xl"
        )}
      >
        {/* Sidebar Header */}
        <div className={cn(
          "flex h-16 items-center justify-between border-b border-sidebar-border",
          sidebarMinimized ? "px-2" : "px-4"
        )}>
          {!sidebarMinimized ? (
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold">BizSuite</span>
            </Link>
          ) : (
            <Link to="/dashboard" className="flex w-full items-center justify-center">
              <span className="text-xl font-bold">B</span>
            </Link>
          )}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebarMinimized}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
              title={sidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarMinimized ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    location.pathname === item.path || location.pathname.startsWith(`${item.path}/`) 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    sidebarMinimized && "justify-center"
                  )}
                  title={sidebarMinimized ? item.name : undefined}
                >
                  <item.icon className={cn("h-5 w-5", !sidebarMinimized && "mr-3")} />
                  {!sidebarMinimized && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User Profile */}
        <div className="border-t border-sidebar-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "flex w-full items-center text-sidebar-foreground hover:bg-sidebar-accent px-3 py-2",
                  sidebarMinimized && "justify-center px-1"
                )}
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-bizteal-500 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {!sidebarMinimized && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs capitalize">{user.role.replace("_", " ")}</span>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300 ease-in-out",
        sidebarOpen && !isMobile ? (sidebarMinimized ? "ml-16" : "ml-64") : "ml-0"
      )}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-10 h-16 bg-white shadow">
          <div className="px-4 h-full flex justify-between items-center">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(
                sidebarOpen && !isMobile && "invisible"
              )}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Page Title - Dynamically set based on route */}
            <div className="text-lg font-semibold">
              {filteredNavItems.find(item => 
                location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))?.name || 'Dashboard'}
            </div>
            
            {/* User Dropdown (for desktop only) */}
            {!isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-bizteal-500 text-white">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
