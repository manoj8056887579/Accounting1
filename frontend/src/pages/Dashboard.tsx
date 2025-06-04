import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ShoppingCart, BookOpen, Package, Truck, Users, Percent, Receipt, ChartBar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Organization } from '@/models/organization';

const Dashboard = ({ organization }: { organization?: Organization }) => {
  const { organizationId } = useParams();
  const basePath = organizationId ? `/${organizationId}` : '';
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Welcome message based on the time of day
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning'; 
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Mock data for different time ranges
  const statsData = {
    today: {
      sales: { amount: 0, transactions: 0 },
      invoices: { amount: 0, count: 0 },
      inventory: { value: 0, items: 0 },
      purchases: { amount: 0, orders: 0 }, 
      customers: { total: 0, active: 0 },
      tax: { amount: 0, period: 'Current period' }
    },
    week: {
      sales: { amount: 1250.75, transactions: 17 },
      invoices: { amount: 3450.25, count: 8 },
      inventory: { value: 24750.50, items: 145 },
      purchases: { amount: 850.30, orders: 5 },
      customers: { total: 67, active: 42 },
      tax: { amount: 235.45, period: 'Current week' }
    },
    month: {
      sales: { amount: 5735.95, transactions: 78 },
      invoices: { amount: 8920.75, count: 32 },
      inventory: { value: 24750.50, items: 145 },
      purchases: { amount: 3245.60, orders: 18 },
      customers: { total: 94, active: 67 },
      tax: { amount: 987.65, period: 'Current month' }
    }
  };

  const currentStats = statsData[timeRange];

  const handleCardClick = (cardName: string) => {
    toast({
      title: `${cardName} Details`,
      description: `Viewing detailed information about ${cardName.toLowerCase()}.`,
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome!{organization?.name ? ` ${organization.name}` : ''}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your business today.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Tabs 
            value={timeRange} 
            onValueChange={(v) => setTimeRange(v as 'today' | 'week' | 'month')}
            className="w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card 
          className="transition-all duration-300 hover:shadow-md cursor-pointer hover:border-primary/50"
          onClick={() => handleCardClick("Sales")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Sales {timeRange === 'today' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month'}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-fade-in">{formatCurrency(currentStats.sales.amount)}</div>
            <p className="text-xs text-muted-foreground">
              {currentStats.sales.transactions} transactions
            </p>
          </CardContent>
        </Card>

        <Card 
          className="transition-all duration-300 hover:shadow-md cursor-pointer hover:border-primary/50"
          onClick={() => handleCardClick("Outstanding Invoices")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-fade-in">{formatCurrency(currentStats.invoices.amount)}</div>
            <p className="text-xs text-muted-foreground">
              {currentStats.invoices.count} pending invoices
            </p>
          </CardContent>
        </Card>

        <Card 
          className="transition-all duration-300 hover:shadow-md cursor-pointer hover:border-primary/50"
          onClick={() => handleCardClick("Inventory Value")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-fade-in">{formatCurrency(currentStats.inventory.value)}</div>
            <p className="text-xs text-muted-foreground">
              {currentStats.inventory.items} items in stock
            </p>
          </CardContent>
        </Card>

        <Card 
          className="transition-all duration-300 hover:shadow-md cursor-pointer hover:border-primary/50"
          onClick={() => handleCardClick("Pending Purchases")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Purchases</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-fade-in">{formatCurrency(currentStats.purchases.amount)}</div>
            <p className="text-xs text-muted-foreground">
              {currentStats.purchases.orders} pending orders
            </p>
          </CardContent>
        </Card>

        <Card 
          className="transition-all duration-300 hover:shadow-md cursor-pointer hover:border-primary/50"
          onClick={() => handleCardClick("Customers")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-fade-in">{currentStats.customers.total}</div>
            <p className="text-xs text-muted-foreground">
              {currentStats.customers.active} active customers
            </p>
          </CardContent>
        </Card>

        <Card 
          className="transition-all duration-300 hover:shadow-md cursor-pointer hover:border-primary/50"
          onClick={() => handleCardClick("Tax Liability")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tax Liability</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-fade-in">{formatCurrency(currentStats.tax.amount)}</div>
            <p className="text-xs text-muted-foreground">
              {currentStats.tax.period}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Module Access Cards */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Quick Access</h2>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <Link to={`${basePath}/pos`}>
          <Card className="hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/50">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-bizblue-500 mb-2" />
              <CardTitle className="text-center text-sm">Point of Sale</CardTitle>
            </CardContent>
          </Card>
        </Link>
        
        <Link to={`${basePath}/accounting`}>
          <Card className="hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/50">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <BookOpen className="h-10 w-10 text-bizblue-500 mb-2" />
              <CardTitle className="text-center text-sm">Accounting</CardTitle>
            </CardContent>
          </Card>
        </Link>
        
        <Link to={`${basePath}/inventory`}>
          <Card className="hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/50">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Package className="h-10 w-10 text-bizblue-500 mb-2" />
              <CardTitle className="text-center text-sm">Inventory</CardTitle>
            </CardContent>
          </Card>
        </Link>
        
        <Link to={`${basePath}/sales`}>
          <Card className="hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/50">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Receipt className="h-10 w-10 text-bizblue-500 mb-2" />
              <CardTitle className="text-center text-sm">Sales</CardTitle>
            </CardContent>
          </Card>
        </Link>
        
        <Link to={`${basePath}/purchases`}>
          <Card className="hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/50">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Truck className="h-10 w-10 text-bizblue-500 mb-2" />
              <CardTitle className="text-center text-sm">Purchases</CardTitle>
            </CardContent>
          </Card>
        </Link>
        
        <Link to={`${basePath}/crm`}>
          <Card className="hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/50">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Users className="h-10 w-10 text-bizblue-500 mb-2" />
              <CardTitle className="text-center text-sm">CRM</CardTitle>
            </CardContent>
          </Card>
        </Link>

        <Link to={`${basePath}/reports`}>
          <Card className="hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer border-primary/10 hover:border-primary/50">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <ChartBar className="h-10 w-10 text-bizblue-500 mb-2" />
              <CardTitle className="text-center text-sm">Reports</CardTitle>
            </CardContent>
          </Card>
        </Link>
      </div>

   
    </div>
  );
};

export default Dashboard;
