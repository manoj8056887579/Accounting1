
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BarChart3, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Phone, 
  Mail, 
  Tag,
  MapPin, 
  CreditCard, 
  Activity 
} from 'lucide-react';
import { Customer } from '@/models/crm';
import { getLeadScoreForCustomer, getActivitiesForEntity } from '@/data/mockCRM';
import ActivityForm from './ActivityForm';

interface CustomerDetailsProps {
  customer: Customer;
  onClose: () => void;
}

const CustomerDetails = ({ customer, onClose }: CustomerDetailsProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddActivity, setShowAddActivity] = useState(false);

  const leadScore = getLeadScoreForCustomer(customer.id);
  const activities = getActivitiesForEntity(customer.id, 'customer');

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {customer.name}
            <span className={`ml-2 px-2 py-1 rounded-md text-xs font-medium ${
              customer.customer_type === 'Retail' ? 'bg-blue-100 text-blue-800' :
              customer.customer_type === 'Wholesale' ? 'bg-amber-100 text-amber-800' :
              'bg-violet-100 text-violet-800'
            }`}>
              {customer.customer_type}
            </span>
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
              customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {customer.status}
            </span>
          </DialogTitle>
          <DialogDescription>
            Customer since {formatDate(customer.created_at)}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm font-medium">{customer.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <Label>Phone</Label>
                      <p className="text-sm font-medium">{customer.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <Label>Address</Label>
                      <p className="text-sm font-medium">{customer.address}</p>
                    </div>
                  </div>
                  
                  {customer.gst_number && (
                    <div className="flex items-start space-x-2">
                      <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <Label>GST Number</Label>
                        <p className="text-sm font-medium">{customer.gst_number}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Credit Limit</Label>
                    <span className="text-sm font-semibold">{formatCurrency(customer.credit_limit)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Opening Balance</Label>
                    <span className="text-sm font-semibold">{formatCurrency(customer.opening_balance)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Total Orders</Label>
                    <span className="text-sm font-semibold">{customer.total_orders || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Total Spent</Label>
                    <span className="text-sm font-semibold">{customer.total_spent ? formatCurrency(customer.total_spent) : '$0.00'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Last Order Date</Label>
                    <span className="text-sm font-semibold">
                      {customer.last_order_date ? formatDate(customer.last_order_date) : 'No orders'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 opacity-30 mb-2" />
                    <p className="text-sm">Recent orders will appear here</p>
                    <p className="text-xs">This feature will be integrated with the Sales module</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Customer Activities</h3>
              <Button onClick={() => setShowAddActivity(true)}>Add Activity</Button>
            </div>
            
            {activities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Activity className="h-10 w-10 text-muted-foreground opacity-50 mb-2" />
                  <p className="text-muted-foreground">No activities recorded for this customer yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setShowAddActivity(true)}
                  >
                    Record First Activity
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          activity.type === 'call' ? 'bg-blue-100 text-blue-800' :
                          activity.type === 'email' ? 'bg-green-100 text-green-800' :
                          activity.type === 'whatsapp' ? 'bg-emerald-100 text-emerald-800' :
                          activity.type === 'meeting' ? 'bg-violet-100 text-violet-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {activity.type}
                        </span>
                      </TableCell>
                      <TableCell>{activity.subject}</TableCell>
                      <TableCell>{formatDate(activity.due_date)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {activity.status}
                        </span>
                      </TableCell>
                      <TableCell>{activity.assigned_to_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {showAddActivity && (
              <ActivityForm 
                relatedId={customer.id}
                relatedName={customer.name}
                relatedType="customer"
                onClose={() => setShowAddActivity(false)}
                onActivityAdded={() => {
                  setShowAddActivity(false);
                  // In a real app, we would refresh the activities list here
                }}
              />
            )}
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-4">
            {leadScore ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Lead Score</span>
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg ${
                          leadScore.score >= 80 ? 'bg-green-500' : 
                          leadScore.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                      >
                        {leadScore.score}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{leadScore.reason}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label>Purchase Frequency</Label>
                          <span className="text-sm font-semibold">{leadScore.purchase_frequency_score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              leadScore.purchase_frequency_score >= 80 ? 'bg-green-500' : 
                              leadScore.purchase_frequency_score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${leadScore.purchase_frequency_score}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label>Order Value</Label>
                          <span className="text-sm font-semibold">{leadScore.order_value_score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              leadScore.order_value_score >= 80 ? 'bg-green-500' : 
                              leadScore.order_value_score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${leadScore.order_value_score}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label>Recency</Label>
                          <span className="text-sm font-semibold">{leadScore.recency_score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              leadScore.recency_score >= 80 ? 'bg-green-500' : 
                              leadScore.recency_score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${leadScore.recency_score}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label>Communication</Label>
                          <span className="text-sm font-semibold">{leadScore.communication_score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              leadScore.communication_score >= 80 ? 'bg-green-500' : 
                              leadScore.communication_score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${leadScore.communication_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {leadScore.score >= 80 ? (
                      <>
                        <div className="flex items-start space-x-2">
                          <BarChart3 className="h-5 w-5 mt-0.5 text-green-500" />
                          <p className="text-sm">
                            <span className="font-semibold">High Value Customer:</span> This customer has high engagement and purchase value. 
                            Consider offering a premium loyalty program or exclusive early access to new products.
                          </p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Calendar className="h-5 w-5 mt-0.5 text-green-500" />
                          <p className="text-sm">
                            <span className="font-semibold">Schedule Check-in:</span> Regular quarterly business reviews would help maintain this 
                            valuable relationship and potentially uncover new opportunities.
                          </p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="h-5 w-5 mt-0.5 text-green-500" />
                          <p className="text-sm">
                            <span className="font-semibold">Personal Contact:</span> Consider direct outreach from a senior team member to express 
                            appreciation for their business and discuss future needs.
                          </p>
                        </div>
                      </>
                    ) : leadScore.score >= 60 ? (
                      <>
                        <div className="flex items-start space-x-2">
                          <BarChart3 className="h-5 w-5 mt-0.5 text-amber-500" />
                          <p className="text-sm">
                            <span className="font-semibold">Growth Opportunity:</span> This customer shows good potential. Consider targeted 
                            promotions to increase order frequency or average order value.
                          </p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Calendar className="h-5 w-5 mt-0.5 text-amber-500" />
                          <p className="text-sm">
                            <span className="font-semibold">Follow-up Needed:</span> It's been {
                              customer.last_order_date 
                                ? Math.round((new Date().getTime() - new Date(customer.last_order_date).getTime()) / (1000 * 3600 * 24))
                                : '?'
                            } days since their last order. Consider a friendly follow-up.
                          </p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CreditCard className="h-5 w-5 mt-0.5 text-amber-500" />
                          <p className="text-sm">
                            <span className="font-semibold">Incentive:</span> A targeted discount or free shipping offer might encourage 
                            their next purchase and build loyalty.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start space-x-2">
                          <BarChart3 className="h-5 w-5 mt-0.5 text-red-500" />
                          <p className="text-sm">
                            <span className="font-semibold">Re-engagement Needed:</span> This customer has low engagement. A win-back campaign 
                            with a special offer could help reactivate them.
                          </p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Calendar className="h-5 w-5 mt-0.5 text-red-500" />
                          <p className="text-sm">
                            <span className="font-semibold">Churn Risk:</span> This customer hasn't ordered in {
                              customer.last_order_date 
                                ? Math.round((new Date().getTime() - new Date(customer.last_order_date).getTime()) / (1000 * 3600 * 24))
                                : '?'
                            } days. Direct outreach is recommended to understand their needs.
                          </p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="h-5 w-5 mt-0.5 text-red-500" />
                          <p className="text-sm">
                            <span className="font-semibold">Feedback Request:</span> Consider sending a short survey to understand why their 
                            engagement has dropped and what would bring them back.
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <BarChart3 className="h-10 w-10 text-muted-foreground opacity-50 mb-2" />
                  <p className="text-muted-foreground">No AI insights available for this customer yet</p>
                  <p className="text-sm text-muted-foreground">Insights will be generated based on customer activity</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetails;
