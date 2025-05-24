
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
  Calendar, 
  FileText, 
  Phone, 
  Mail, 
  Tag,
  MapPin, 
  CreditCard, 
  Activity 
} from 'lucide-react';
import { Vendor } from '@/models/crm';
import { getActivitiesForEntity } from '@/data/mockCRM';
import ActivityForm from './ActivityForm';

interface VendorDetailsProps {
  vendor: Vendor;
  onClose: () => void;
}

const VendorDetails = ({ vendor, onClose }: VendorDetailsProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddActivity, setShowAddActivity] = useState(false);

  const activities = getActivitiesForEntity(vendor.id, 'vendor');

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
            {vendor.name}
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
              vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {vendor.status}
            </span>
          </DialogTitle>
          <DialogDescription>
            Vendor since {formatDate(vendor.created_at)}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
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
                      <p className="text-sm font-medium">{vendor.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <Label>Phone</Label>
                      <p className="text-sm font-medium">{vendor.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <Label>Address</Label>
                      <p className="text-sm font-medium">{vendor.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <Label>GST Number</Label>
                      <p className="text-sm font-medium">{vendor.gst_number}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Opening Balance</Label>
                    <span className="text-sm font-semibold">{formatCurrency(vendor.opening_balance)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Total Orders</Label>
                    <span className="text-sm font-semibold">{vendor.total_orders || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Total Purchased</Label>
                    <span className="text-sm font-semibold">{vendor.total_spent ? formatCurrency(vendor.total_spent) : '$0.00'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Last Order Date</Label>
                    <span className="text-sm font-semibold">
                      {vendor.last_order_date ? formatDate(vendor.last_order_date) : 'No orders'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Purchase Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 opacity-30 mb-2" />
                    <p className="text-sm">Recent purchase orders will appear here</p>
                    <p className="text-xs">This feature will be integrated with the Purchases module</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Vendor Activities</h3>
              <Button onClick={() => setShowAddActivity(true)}>Add Activity</Button>
            </div>
            
            {activities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Activity className="h-10 w-10 text-muted-foreground opacity-50 mb-2" />
                  <p className="text-muted-foreground">No activities recorded for this vendor yet</p>
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
                relatedId={vendor.id}
                relatedName={vendor.name}
                relatedType="vendor"
                onClose={() => setShowAddActivity(false)}
                onActivityAdded={() => {
                  setShowAddActivity(false);
                  // In a real app, we would refresh the activities list here
                }}
              />
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

export default VendorDetails;
