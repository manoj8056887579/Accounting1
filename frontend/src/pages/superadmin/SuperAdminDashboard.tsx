
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Package, CreditCard, Users } from 'lucide-react';

const SuperAdminDashboard = () => {
  // In a real app, these would be fetched from an API
  const stats = [
    { title: "Total Organizations", value: "28", icon: <Building className="h-5 w-5" />, change: "+12%" },
    { title: "Active Subscriptions", value: "24", icon: <Package className="h-5 w-5" />, change: "+18%" },
    { title: "Monthly Revenue", value: "₹86,400", icon: <CreditCard className="h-5 w-5" />, change: "+24%" },
    { title: "Total Users", value: "142", icon: <Users className="h-5 w-5" />, change: "+8%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Manage organizations, subscriptions, and system settings
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <span className={`text-${stat.change.startsWith('+') ? 'emerald' : 'rose'}-500 mr-1`}>
                  {stat.change}
                </span> 
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Organizations</CardTitle>
            <CardDescription>
              Recently created organizations in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["ABC Corporation", "XYZ Industries", "123 Enterprises", "Tech Solutions"].map((org, i) => (
                <div key={i} className="flex items-center justify-between border-b py-2 last:border-0">
                  <div>
                    <p className="font-medium">{org}</p>
                    <p className="text-sm text-muted-foreground">
                      Created {i + 1} day{i !== 0 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Overview</CardTitle>
            <CardDescription>
              Active subscriptions by plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: "Basic", count: 8, percentage: 30 },
                { name: "Standard", count: 12, percentage: 45 },
                { name: "Premium", count: 4, percentage: 15 },
                { name: "Enterprise", count: 3, percentage: 10 }
              ].map((plan, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{plan.name}</p>
                    <p className="text-sm text-muted-foreground">{plan.count} orgs ({plan.percentage}%)</p>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${plan.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
