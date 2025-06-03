import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  Shield,
  Building,
  Package,
  CreditCard,
  Settings,
  Mail,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useBranding } from "@/contexts/BrandingContext";

const SuperAdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const { logoUrl, faviconUrl } = useBranding();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    {
      href: "/superadmin",
      label: "Dashboard",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      href: "/superadmin/organizations",
      label: "Organizations",
      icon: <Building className="h-4 w-4" />,
    },
    {
      href: "/superadmin/subscription-plans",
      label: "Subscription Plans",
      icon: <Package className="h-4 w-4" />,
    },
    {
      href: "/superadmin/payment-gateways",
      label: "Payment Gateways",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      href: "/superadmin/smtp-settings",
      label: "SMTP Settings",
      icon: <Mail className="h-4 w-4" />,
    },
    {
      href: "/superadmin/whatsapp-settings",
      label: "WhatsApp Settings",
      icon: <Mail className="h-4 w-4" />,
    },
    {
      href: "/superadmin/settings",
      label: "Advanced Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col bg-background border-r transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {" "}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            <div
              className={cn(
                "flex items-center",
                !isSidebarCollapsed ? "w-full" : "justify-center w-full"
              )}
            >
              {" "}
              {isSidebarCollapsed ? (
                // Show favicon when collapsed
                <div className="flex justify-center items-center w-full">
                  {faviconUrl ? (
                    <div className="w-10 h-10 p-1.5 flex items-center justify-center duration-200">
                      <img
                        src={faviconUrl}
                        alt="Brand Icon"
                        className="w-full h-full object-contain"
                        loading="eager"
                        width={32}
                        height={32}
                      />
                    </div>
                  ) : (
                    <Shield className="h-6 w-6 text-primary" />
                  )}
                </div>
              ) : (
                // Show logo when expanded
                <>
                  {logoUrl ? (
                    <div className="w-44 h-16 flex items-center justify-start duration-200 p-2">
                      <img
                        src={logoUrl}
                        alt="Company Logo"
                        className="w-full h-full object-contain"
                        loading="eager"
                      />
                    </div>
                  ) : (
                    <Shield className="h-8 w-8 text-primary" />
                  )}
                </>
              )}
            </div>
          </div>
          
        </div>
        <Separator />
        <div className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              to={item.href}
              end={item.href === "/superadmin"}
              key={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 text-sm rounded-md w-full",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-primary transition-colors",
                  isSidebarCollapsed && "justify-center px-2"
                )
              }
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <div
                className={cn(
                  "flex items-center",
                  !isSidebarCollapsed && "mr-2"
                )}
              >
                {item.icon}
              </div>
              {!isSidebarCollapsed && item.label}
            </NavLink>
          ))}
        </div>
        <div className="p-2 mt-auto">
          <Button
            variant="ghost"
            className="flex items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={logout}
            title={isSidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!isSidebarCollapsed && "Logout"}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 md:h-14 px-4 border-b flex items-center justify-between bg-background">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0 bg-black text-white"
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          <h1 className="md:hidden text-lg font-bold flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            Super Admin
          </h1>
          <div className="flex items-center ml-auto gap-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={logout}
              className="flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
