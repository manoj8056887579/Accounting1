import React, { useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";
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
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define navigation items
const navigationItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Point of Sale", path: "/pos", icon: ShoppingCart },
  { name: "Inventory", path: "/inventory", icon: Package },
  { name: "Sales", path: "/sales", icon: Receipt },
  { name: "Purchases", path: "/purchases", icon: Truck },
  { name: "Accounting", path: "/accounting", icon: BookOpen },
  // { name: "CRM", path: "/crm", icon: Users },
  // { name: "WhatsApp", path: "/whatsapp", icon: MessageSquare },
  // { name: "E-Waybill", path: "/e-waybill", icon: FileText },
  // { name: "GST E-Filing", path: "/gst-efiling", icon: File },
  // { name: "Tax", path: "/tax", icon: Percent },
  { name: "Reports", path: "/reports", icon: ChartBar },
  // { name: "User Management", path: "/users", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
];

const AppLayout: React.FC<{ organization?: { name?: string } }> = ({ organization }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const { organizationId } = useParams();
  const basePath = organizationId ? `/${organizationId}` : "";
  const navigate = useNavigate();

  // Toggle sidebar (especially for mobile)
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Toggle sidebar minimized state (desktop only)
  const toggleSidebarMinimized = () => {
    setSidebarMinimized((prev) => !prev);
  };

  return (
    <div className="flex bg-gray-50">
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
        <div
          className={cn(
            "flex h-16 items-center justify-between border-b border-sidebar-border",
            sidebarMinimized ? "px-2" : "px-4"
          )}
        >
          {!sidebarMinimized ? (
            <span className="text-xl font-bold truncate">{organization?.name || 'Organization'}</span>
          ) : (
            <span className="text-xl font-bold">{organization?.name ? organization.name.charAt(0).toUpperCase() : 'O'}</span>
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
          {/* {!isMobile && (
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
          )} */}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1"> 
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={`${basePath}${item.path}`}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    location.pathname === `${basePath}${item.path}` ||
                      location.pathname.startsWith(`${basePath}${item.path}/`)
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    sidebarMinimized && "justify-center"
                  )}
                  title={sidebarMinimized ? item.name : undefined}
                >
                  <item.icon
                    className={cn("h-5 w-5", !sidebarMinimized && "mr-3")}
                  />
                  {!sidebarMinimized && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Bottom Logout Button */}
        <div className="border-t border-sidebar-border p-4 mt-auto">
          <button
            className="w-full px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
            onClick={() => {
              localStorage.removeItem("auth_token");
              localStorage.removeItem("organization_data");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          sidebarOpen && !isMobile
            ? sidebarMinimized
              ? "ml-16"
              : "ml-64"
            : "ml-0"
        )}
      >
        {/* Top Navigation */}
        <header className="sticky top-0 z-10 h-16 bg-white shadow">
          <div className="px-4 h-full flex items-center justify-between sm:justify-between gap-2">
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebarMinimized}
                className="text-sidebar-foreground bg-gray-200 text-gray-700 hover:bg-sidebar-accent"
                title={sidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {sidebarMinimized ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </Button>
            )}
            {/* Mobile: Hamburger left, title center; Desktop: title left, logout right */}
            <div className="flex items-center flex-1 min-w-0">
              {/* Hamburger icon on mobile */}
              {isMobile && (
                <button
                  className="mr-2 p-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 focus:outline-none sm:hidden"
                  onClick={toggleSidebar}
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}
              {/* Page Title: centered on mobile, left on desktop */}
              <div className="text-lg font-semibold truncate w-full text-center sm:text-left">
                {navigationItems.find(
                  (item) =>
                    location.pathname === `${basePath}${item.path}` ||
                    location.pathname.startsWith(`${basePath}${item.path}/`)
                )?.name || "Dashboard"}
              </div>
            </div>

            {/* Avatar and Dropdown Menu */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {organization?.name ? organization.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{organization?.name || 'User'}</p>
                      
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`${basePath}/profile`} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`${basePath}/settings`} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => {
                      localStorage.removeItem("auth_token");
                      localStorage.removeItem("organization_data");
                      navigate("/login");
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
