import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Package, CreditCard, ShoppingCart, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OrganizationStats {
  totalSales: number;
  outstandingInvoices: number;
  inventoryValue: number;
  pendingPurchases: number;
  customerCount: number;
  taxLiability: number;
}

interface Organization {
  organization_id: string;
  name: string;
  slug: string;
  subscription_plan: string;
  user_limit: number;
  status: string;
  enabled_modules: string[];
  admin_name: string;
  admin_email: string;
  created_at: string;
  updated_at: string;
}

const OrganizationDashboard: React.FC = () => {
  const { organizationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [organizationData, setOrganizationData] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OrganizationStats | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        // Get organization data from localStorage
        const storedOrgData = localStorage.getItem('organization_data'); 
        if (storedOrgData) {
          const parsedOrgData = JSON.parse(storedOrgData);
          if (parsedOrgData.organization_db === organizationId) {
            setOrganizationData(parsedOrgData); 
          } 
        }

        // Fetch organization details from API using organization_db
        const response = await axios.get(`${API_URL}/api/superadmin/organization/${organizationId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        if (response.data.success) {
          const orgData = response.data.data;
          setOrganizationData(orgData);

          // Fetch organization stats using organization_id
          const statsResponse = await axios.get(`${API_URL}/${orgData.organization_id}/dashboard`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          if (statsResponse.data.success) {
            setStats(statsResponse.data.stats);
          }
        }
      } catch (error) {
        console.error('Error fetching organization data:', error);
        // If unauthorized, redirect to login
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchOrganizationData();
    }
  }, [organizationId, API_URL, navigate]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bizblue-500"></div>
          <span>Loading organization data...</span>
        </div>
      </div>
    );
  }

  if (!organizationData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-red-500">Unable to load organization data</div>
      </div>
    );
  }

  const planColor = {
    basic: 'bg-blue-100 text-blue-800',
    standard: 'bg-purple-100 text-purple-800',
    premium: 'bg-amber-100 text-amber-800'
  };

  const getPlanColorClass = () => {
    return planColor[organizationData.subscription_plan as keyof typeof planColor] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{organizationData.name}</h1>
          <p className="text-sm text-gray-500">Organization Dashboard</p>
        </div>
        <Badge className={getPlanColorClass()}>
          {organizationData.subscription_plan.toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales This Month</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalSales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">78 transactions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.outstandingInvoices.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">32 pending invoices</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.inventoryValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">145 items in stock</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Purchases</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.pendingPurchases.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">18 pending orders</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.customerCount}</div>
                <p className="text-xs text-muted-foreground">67 active customers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tax Liability</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.taxLiability.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Current month</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default OrganizationDashboard; 