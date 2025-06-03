import React, { useState, useEffect } from 'react';
import { Package, Plus, Check, Trash2, AlertCircle, Users, Grid3X3, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,  
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import axios from 'axios';

// Define types inline
type ApplicationModule = 'inventory' | 'pos' | 'sales' | 'purchases' | 'accounting' | 'crm' | 'whatsapp' | 'reports';

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  user_limit: number;
  modules: string[];
  is_published: boolean;
  is_popular: boolean;
  razorpay_plan_id: string;
  gst_percentage: number | null;
  gst_amount: number | null;
  total_amount: number | null;
  created_at: string;
  updated_at: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: string[];
      success?: boolean;
    };
  };
  message: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// All available modules in the system
const availableModules: {id: ApplicationModule, name: string}[] = [
  { id: 'inventory', name: 'Inventory Management' },
  { id: 'pos', name: 'Point of Sale' },
  { id: 'sales', name: 'Sales Management' },
  { id: 'purchases', name: 'Purchases & Expenses' },
  { id: 'accounting', name: 'Accounting' },
  { id: 'crm', name: 'CRM' },
  { id: 'whatsapp', name: 'WhatsApp Integration' },
  { id: 'reports', name: 'Reports & Analytics' }
];

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [activeTab, setActiveTab] = useState<string>("monthly");
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({
    monthly: 1,
    yearly: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [financeSettings, setFinanceSettings] = useState<{ gst_percentage: number } | null>(null);

  const PLANS_PER_PAGE = 3;

  // Group plans by interval
  const groupedPlans = plans.reduce((acc, plan) => {
    if (!acc[plan.interval]) {
      acc[plan.interval] = [];
    }
    acc[plan.interval].push(plan);
    return acc;
  }, {} as Record<string, SubscriptionPlan[]>);

  // Get paginated plans for current interval
  const getPaginatedPlans = (interval: string) => {
    const plans = groupedPlans[interval] || [];
    const startIndex = (currentPage[interval] - 1) * PLANS_PER_PAGE;
    return plans.slice(startIndex, startIndex + PLANS_PER_PAGE);
  };

  // Get total pages for current interval
  const getTotalPages = (interval: string) => {
    const plans = groupedPlans[interval] || [];
    return Math.ceil(plans.length / PLANS_PER_PAGE);
  };

  // Handle page change
  const handlePageChange = (interval: string, page: number) => {
    setCurrentPage(prev => ({
      ...prev,
      [interval]: page
    }));
  };

  const handleOpenCreateDialog = () => {
    setCurrentPlan({
      id: 0,
      name: "",
      description: "",
      price: 0,
      currency: "INR",
      interval: "monthly",
      features: [""],
      user_limit: 0,
      modules: [],
      is_published: false,
      is_popular: false,
      razorpay_plan_id: "",
      gst_percentage: null,
      gst_amount: null,
      total_amount: null,
      created_at: "",
      updated_at: ""
    });
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (plan: SubscriptionPlan) => {
    setCurrentPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/superadmin/subscription-plans`);
      if (response.data.success) {
        setPlans(response.data.data);
      } else {
        toast.error('Failed to fetch subscription plans');
      }
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      toast.error('Error fetching subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchFinanceSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/superadmin/finance`);
      if (response.data.success) {
        setFinanceSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching finance settings:', error);
    }
  };

  const createSubscriptionPlan = async (planData: SubscriptionPlan) => {
    try {
      // Format the data to match backend expectations
      const formattedData = {
        name: planData.name,
        description: planData.description,
        price: Number(planData.price),
        currency: planData.currency,
        interval: planData.interval,
        features: planData.features,
        userLimit: Number(planData.user_limit), // Convert to number
        modules: planData.modules,
        isPublished: Boolean(planData.is_published), // Ensure boolean
        isPopular: Boolean(planData.is_popular) // Ensure boolean
      };

      const response = await axios.post(`${API_URL}/api/superadmin/subscription-plans`, formattedData);
      if (response.data.success) {
        toast.success(`Plan "${planData.name}" created successfully`);
        fetchSubscriptionPlans(); // Refresh the plans list
        return true;
      } else {
        toast.error(response.data.message || 'Failed to create subscription plan');
        return false;
      }
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Error creating subscription plan:', apiError);
      
      // Show validation errors if available
      if (apiError.response?.data?.errors) {
        apiError.response.data.errors.forEach((err: string) => {
          toast.error(err);
        });
      } else {
        toast.error(apiError.response?.data?.message || 'Error creating subscription plan');
      }
      return false;
    }
  };

  const handleSavePlan = async () => {
    if (!currentPlan) return;
    
    if (!currentPlan.name || !currentPlan.description || currentPlan.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Filter out empty feature strings
    const features = currentPlan.features.filter(feature => feature.trim() !== "");
    
    if (features.length === 0) {
      toast.error("Please add at least one feature");
      return;
    }
    
    if (currentPlan.modules.length === 0) {
      toast.error("Please select at least one module");
      return;
    }

    const success = await createSubscriptionPlan({
      ...currentPlan,
      features
    });

    if (success) {
      setIsDialogOpen(false);
    }
  };

  const handleStatusToggle = async (id: number, currentStatus: boolean, type: 'published' | 'popular') => {
    try {
      const response = await axios.put(
        `${API_URL}/api/superadmin/subscription-plans/${id}`,
        {
          [type === 'published' ? 'isPublished' : 'isPopular']: !currentStatus
        }
      );

      if (response.data.success) {
        // Update local state
        setPlans(plans.map(plan => 
          plan.id === id 
            ? { 
                ...plan, 
                [type === 'published' ? 'is_published' : 'is_popular']: !currentStatus 
              }
            : plan
        ));
        
        // Show success message
        toast.success(response.data.message);
      }
    } catch (error) {
      const apiError = error as ApiError;
      console.error(`Error toggling ${type} status:`, apiError);
      toast.error(apiError.response?.data?.message || `Failed to update ${type} status`);
    }
  };

  const deletePlan = async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/api/superadmin/subscription-plans/${id}`);
      
      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh the plans list
        fetchSubscriptionPlans();
        // Close the delete dialog
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Error deleting plan:', apiError);
      toast.error(apiError.response?.data?.message || 'Failed to delete plan');
    }
  };

  const handleDeletePlan = () => {
    if (!currentPlan) return;
    deletePlan(currentPlan.id);
  };

  const handleAddFeature = () => {
    if (!currentPlan) return; 
    
    setCurrentPlan({
      ...currentPlan,
      features: [...currentPlan.features, ""]
    });
  };

  const handleRemoveFeature = (index: number) => {
    if (!currentPlan) return;
    
    const features = [...currentPlan.features];
    features.splice(index, 1);
    setCurrentPlan({
      ...currentPlan,
      features
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (!currentPlan) return;
    
    const features = [...currentPlan.features];
    features[index] = value;
    setCurrentPlan({
      ...currentPlan,
      features
    });
  };

  const handleModuleToggle = (moduleId: ApplicationModule) => {
    if (!currentPlan) return;
    
    const modules = [...currentPlan.modules];
    if (modules.includes(moduleId)) {
      setCurrentPlan({
        ...currentPlan,
        modules: modules.filter(id => id !== moduleId)
      });
    } else {
      setCurrentPlan({
        ...currentPlan,
        modules: [...modules, moduleId]
      });
    }
  };

  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    });
    return formatter.format(price);
  };

  const renderPagination = (interval: string) => {
    const totalPages = getTotalPages(interval);
    const currentPageNum = currentPage[interval];

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPageNum - 1) * PLANS_PER_PAGE) + 1} to {Math.min(currentPageNum * PLANS_PER_PAGE, (groupedPlans[interval] || []).length)} of {(groupedPlans[interval] || []).length} plans
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(interval, currentPageNum - 1)}
            disabled={currentPageNum === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPageNum ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(interval, page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(interval, currentPageNum + 1)}
            disabled={currentPageNum === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  };

  // Function to calculate GST and total amount
  const calculateGSTAndTotal = (basePrice: number): { gstAmount: number; totalAmount: number } => {
    const gstPercentage = financeSettings?.gst_percentage || 18.00;
    const gstAmount = (basePrice * gstPercentage) / 100;
    const totalAmount = basePrice + gstAmount;
    return { gstAmount, totalAmount };
  };

  // Add useEffect to fetch plans on component mount
  useEffect(() => {
    fetchSubscriptionPlans();
    fetchFinanceSettings();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscription Plans</h2>
          <p className="text-muted-foreground">
            Create and manage subscription plans for organizations
          </p>
        </div>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> New Plan
        </Button>
      </div>

      <Tabs defaultValue="monthly" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">Monthly</span>
            Monthly Plans
          </TabsTrigger>
          <TabsTrigger value="yearly" className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">Yearly</span>
            Yearly Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getPaginatedPlans('monthly').map((plan) => (
              <Card key={plan.id} className={`overflow-hidden ${plan.is_popular ? 'border-primary' : ''}`}>
                {plan.is_popular && (
                  <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <Package className="mr-2 h-5 w-5 text-muted-foreground" />
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <Badge variant={plan.is_published ? "default" : "outline"} className="ml-2">
                      {plan.is_published ? 'Published' : 'Not Published'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">
                    {formatPrice(plan.price, plan.currency)}
                    <span className="text-base font-normal text-muted-foreground">/month</span>
                  </div>
                  
                  {plan.gst_percentage && plan.gst_amount && (
                    <div className="text-sm text-muted-foreground mb-4">
                      <div>Base Price: {formatPrice(plan.price, plan.currency)}</div>
                      <div>GST ({plan.gst_percentage}%): {formatPrice(plan.gst_amount, plan.currency)}</div>
                      <div className="font-medium">Total: {formatPrice(plan.total_amount || plan.price, plan.currency)}</div>
                    </div>
                  )}
                  
                  <div className="flex items-center mb-3 text-sm">
                    <Users className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                    <span className="font-medium">
                      {plan.user_limit === 0 ? 'Unlimited Users' : `${plan.user_limit} Users`}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-2 text-sm">
                      <Grid3X3 className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                      <span className="font-medium">Available Modules:</span>
                    </div>
                    <div className="flex flex-wrap gap-1 ml-7 mb-4">
                      {plan.modules.map(moduleId => {
                        const module = availableModules.find(m => m.id === moduleId);
                        return (
                          <Badge key={moduleId} variant="outline" className="bg-blue-50">
                            {module?.name || moduleId}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`published-${plan.id}`} 
                        checked={plan.is_published} 
                        onCheckedChange={() => handleStatusToggle(plan.id, plan.is_published, 'published')}
                      />
                      <Label htmlFor={`published-${plan.id}`}>
                        {plan.is_published ? 'Published' : 'Not Published'}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`popular-${plan.id}`} 
                        checked={plan.is_popular} 
                        onCheckedChange={() => handleStatusToggle(plan.id, plan.is_popular, 'popular')}
                      />
                      <Label htmlFor={`popular-${plan.id}`}>
                        {plan.is_popular ? 'Popular' : 'Not Popular'}
                      </Label>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleOpenDeleteDialog(plan)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          {renderPagination('monthly')}
        </TabsContent>


        <TabsContent value="yearly" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getPaginatedPlans('yearly').map((plan) => (
              <Card key={plan.id} className={`overflow-hidden ${plan.is_popular ? 'border-primary' : ''}`}>
                {plan.is_popular && (
                  <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <Package className="mr-2 h-5 w-5 text-muted-foreground" />
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <Badge variant={plan.is_published ? "default" : "outline"} className="ml-2">
                      {plan.is_published ? 'Published' : 'Not Published'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">
                    {formatPrice(plan.price, plan.currency)}
                    <span className="text-base font-normal text-muted-foreground">/year</span>
                  </div>
                  
                  {plan.gst_percentage && plan.gst_amount && (
                    <div className="text-sm text-muted-foreground mb-4">
                      <div>Base Price: {formatPrice(plan.price, plan.currency)}</div>
                      <div>GST ({plan.gst_percentage}%): {formatPrice(plan.gst_amount, plan.currency)}</div>
                      <div className="font-medium">Total: {formatPrice(plan.total_amount || plan.price, plan.currency)}</div>
                    </div>
                  )}
                  
                  <div className="flex items-center mb-3 text-sm">
                    <Users className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                    <span className="font-medium">
                      {plan.user_limit === 0 ? 'Unlimited Users' : `${plan.user_limit} Users`}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-2 text-sm">
                      <Grid3X3 className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                      <span className="font-medium">Available Modules:</span>
                    </div>
                    <div className="flex flex-wrap gap-1 ml-7 mb-4">
                      {plan.modules.map(moduleId => {
                        const module = availableModules.find(m => m.id === moduleId);
                        return (
                          <Badge key={moduleId} variant="outline" className="bg-blue-50">
                            {module?.name || moduleId}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`published-${plan.id}`} 
                        checked={plan.is_published} 
                        onCheckedChange={() => handleStatusToggle(plan.id, plan.is_published, 'published')}
                      />
                      <Label htmlFor={`published-${plan.id}`}>
                        {plan.is_published ? 'Published' : 'Not Published'}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`popular-${plan.id}`} 
                        checked={plan.is_popular} 
                        onCheckedChange={() => handleStatusToggle(plan.id, plan.is_popular, 'popular')}
                      />
                      <Label htmlFor={`popular-${plan.id}`}>
                        {plan.is_popular ? 'Popular' : 'Not Popular'}
                      </Label>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleOpenDeleteDialog(plan)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          {renderPagination('yearly')}
        </TabsContent>
      </Tabs>

      {/* Create Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create Subscription Plan</DialogTitle>
            <DialogDescription>
              Define the details for a new subscription plan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input
                id="plan-name"
                value={currentPlan?.name || ''}
                onChange={(e) => setCurrentPlan(currentPlan ? {...currentPlan, name: e.target.value} : null)}
                placeholder="e.g. Basic, Standard, Premium"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="plan-description">Description</Label>
              <Textarea
                id="plan-description"
                value={currentPlan?.description || ''}
                onChange={(e) => setCurrentPlan(currentPlan ? {...currentPlan, description: e.target.value} : null)}
                placeholder="Brief description of what this plan offers"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="plan-price">Price</Label>
                <Input
                  id="plan-price"
                  type="number"
                  value={currentPlan?.price || ''}
                  onChange={(e) => setCurrentPlan(currentPlan ? {...currentPlan, price: Number(e.target.value)} : null)}
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan-currency">Currency</Label>
                <select
                  id="plan-currency"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={currentPlan?.currency || 'INR'}
                  onChange={(e) => setCurrentPlan(currentPlan ? {...currentPlan, currency: e.target.value} : null)}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
            
            {/* GST Calculation Preview */}
            <div className="p-4 border rounded-md bg-muted/30">
              <h4 className="text-sm font-medium mb-2">Price Breakdown</h4>
              {currentPlan && currentPlan.price > 0 && (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>{formatPrice(currentPlan.price, currentPlan.currency || 'INR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST ({financeSettings?.gst_percentage || 18}%):</span>
                    <span>{formatPrice(calculateGSTAndTotal(currentPlan.price).gstAmount, currentPlan.currency || 'INR')}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>{formatPrice(calculateGSTAndTotal(currentPlan.price).totalAmount, currentPlan.currency || 'INR')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    GST will be calculated based on the current finance settings ({financeSettings?.gst_percentage || 18}%)
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="plan-interval">Billing Interval</Label>
                <select
                  id="plan-interval"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={currentPlan?.interval || 'monthly'}
                  onChange={(e) => setCurrentPlan(currentPlan ? {...currentPlan, interval: e.target.value as 'monthly' | 'yearly'} : null)}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-limit">User Limit</Label>
                <Input
                  id="user-limit"
                  type="number"
                  min="0"
                  value={currentPlan?.user_limit || 0}
                  onChange={(e) => setCurrentPlan(currentPlan ? {...currentPlan, user_limit: Number(e.target.value)} : null)}
                  placeholder="Number of users"
                />
                <p className="text-xs text-muted-foreground mt-1">Enter 0 for unlimited users</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="plan-published"
                  checked={currentPlan?.is_published || false}
                  onCheckedChange={(checked) => setCurrentPlan(currentPlan ? {...currentPlan, is_published: checked} : null)}
                />
                <Label htmlFor="plan-published">Mark as Published</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="plan-popular"
                  checked={currentPlan?.is_popular || false}
                  onCheckedChange={(checked) => setCurrentPlan(currentPlan ? {...currentPlan, is_popular: checked} : null)}
                />
                <Label htmlFor="plan-popular">Mark as Popular</Label>
              </div>
            </div>
            
            {/* Modules Selection */}
            <div className="grid gap-3 pt-2">
              <Label>Available Modules</Label>
              <div className="grid grid-cols-2 gap-3">
                {availableModules.map(module => (
                  <div key={module.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`module-${module.id}`}
                      checked={currentPlan?.modules.includes(module.id)}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                    />
                    <Label htmlFor={`module-${module.id}`} className="text-sm font-normal">
                      {module.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid gap-2 pt-2">
              <Label className="flex justify-between items-center">
                <span>Features</span>
                <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>
                  <Plus className="h-4 w-4 mr-1" /> Add Feature
                </Button>
              </Label>
              
              {currentPlan?.features?.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    placeholder="e.g. 10 Users, 5GB Storage"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="shrink-0" 
                    onClick={() => handleRemoveFeature(idx)}
                  >
                    <XCircle className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan}>
              Create Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Subscription Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{currentPlan?.name}" plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center p-4 border rounded-md bg-destructive/10 text-destructive mb-4">
              <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
              <p className="text-sm">Deleting this plan will not affect existing subscriptions, but organizations will not be able to subscribe to it anymore.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePlan}>
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlans;
