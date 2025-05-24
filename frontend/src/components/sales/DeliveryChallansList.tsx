
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Mail, Phone, FileText, Truck, MapPin, Calendar } from 'lucide-react';
import { DeliveryChallan } from '@/models/sales';
import { getDeliveryChallans } from '@/data/mockSales';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const deliveryStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_transit: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  returned: "bg-red-100 text-red-800",
};

const DeliveryChallansList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const deliveryChallans = getDeliveryChallans();
  
  const filteredChallans = deliveryChallans.filter(challan => 
    challan.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    challan.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (challan.vehicleNumber && challan.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search challans..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Create Delivery Challan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Challans</CardTitle>
          <CardDescription>Manage delivery documentation for your shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Delivery Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Billable</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChallans.length > 0 ? (
                filteredChallans.map((challan) => (
                  <TableRow key={challan.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        {challan.number}
                      </div>
                    </TableCell>
                    <TableCell>{challan.customer.name}</TableCell>
                    <TableCell>{format(challan.date, 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <div className="flex items-center">
                          <Truck className="h-3 w-3 mr-1" /> 
                          {challan.vehicleNumber || 'Not specified'}
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" /> 
                          {challan.deliveryDate ? format(challan.deliveryDate, 'MMM dd, yyyy') : 'Not scheduled'}
                        </div>
                        <div className="flex items-center mt-1 max-w-[200px] truncate">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" /> 
                          {challan.deliveryAddress}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={deliveryStatusColors[challan.deliveryStatus] || "bg-gray-100"}>
                        {challan.deliveryStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={challan.isBillable ? "default" : "outline"}>
                        {challan.isBillable ? 'Billable' : 'Non-Billable'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Print</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No delivery challans found. Try adjusting your search or create a new one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryChallansList;
