
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Search, 
  FileEdit, 
  Printer, 
  Download,
  ArrowUpDown,
  Truck
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data for active e-waybills
const mockWaybills = [
  {
    id: 'EWB1001',
    date: '2024-05-14',
    fromPlace: 'Mumbai',
    toPlace: 'Delhi',
    consignor: 'ABC Enterprises',
    consignee: 'XYZ Corporation',
    transporterName: 'Speedway Transport',
    validUntil: '2024-05-16',
    status: 'active',
    value: 24500
  },
  {
    id: 'EWB1002',
    date: '2024-05-14',
    fromPlace: 'Chennai',
    toPlace: 'Bangalore',
    consignor: 'Southern Electronics',
    consignee: 'Tech Solutions',
    transporterName: 'Express Movers',
    validUntil: '2024-05-15',
    status: 'active',
    value: 18750
  },
  {
    id: 'EWB1003',
    date: '2024-05-13',
    fromPlace: 'Delhi',
    toPlace: 'Jaipur',
    consignor: 'Northern Traders',
    consignee: 'Royal Distributors',
    transporterName: 'Northern Transport Co.',
    validUntil: '2024-05-16',
    status: 'active',
    value: 32000
  },
  {
    id: 'EWB1004',
    date: '2024-05-12',
    fromPlace: 'Kolkata',
    toPlace: 'Patna',
    consignor: 'Eastern Goods Ltd',
    consignee: 'Bihar Wholesale',
    transporterName: 'Eastern Express',
    validUntil: '2024-05-17',
    status: 'expiring',
    value: 15250
  },
  {
    id: 'EWB1005',
    date: '2024-05-11',
    fromPlace: 'Hyderabad',
    toPlace: 'Vijayawada',
    consignor: 'Telangana Products',
    consignee: 'Andhra Distributors',
    transporterName: 'South Connect',
    validUntil: '2024-05-15',
    status: 'expiring',
    value: 9800
  }
];

const ActiveWaybills = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [selectedWaybill, setSelectedWaybill] = useState<string | null>(null);
  const [updateVehicleDialogOpen, setUpdateVehicleDialogOpen] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [reason, setReason] = useState('');

  const filteredWaybills = mockWaybills.filter(
    (waybill) =>
      waybill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      waybill.consignor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      waybill.consignee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExtendValidity = () => {
    toast({
      title: "Validity Extended",
      description: `E-Waybill ${selectedWaybill} validity has been extended by 24 hours.`,
    });
    setExtendDialogOpen(false);
  };

  const handleUpdateVehicle = () => {
    if (!vehicleNumber || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Vehicle Updated",
      description: `E-Waybill ${selectedWaybill} vehicle information has been updated.`,
    });
    setUpdateVehicleDialogOpen(false);
    setVehicleNumber('');
    setReason('');
  };

  const handleAction = (action: string, waybillId: string) => {
    setSelectedWaybill(waybillId);
    
    switch (action) {
      case 'extend':
        setExtendDialogOpen(true);
        break;
      case 'updateVehicle':
        setUpdateVehicleDialogOpen(true);
        break;
      case 'print':
        toast({
          title: "Print Requested",
          description: `Printing E-Waybill ${waybillId}`,
        });
        break;
      case 'download':
        toast({
          title: "Download Started",
          description: `Downloading E-Waybill ${waybillId}`,
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search e-waybills..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Refreshed", description: "E-waybills list updated" })}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Active E-Waybills that are currently in transit</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Waybill No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>From - To</TableHead>
              <TableHead>Consignor</TableHead>
              <TableHead>Consignee</TableHead>
              <TableHead>Transporter</TableHead>
              <TableHead className="w-[100px]">
                <div className="flex items-center">
                  Value (₹)
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWaybills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No active e-waybills found
                </TableCell>
              </TableRow>
            ) : (
              filteredWaybills.map((waybill) => (
                <TableRow key={waybill.id}>
                  <TableCell className="font-medium">{waybill.id}</TableCell>
                  <TableCell>{waybill.date}</TableCell>
                  <TableCell>{waybill.fromPlace} - {waybill.toPlace}</TableCell>
                  <TableCell>{waybill.consignor}</TableCell>
                  <TableCell>{waybill.consignee}</TableCell>
                  <TableCell>{waybill.transporterName}</TableCell>
                  <TableCell>{waybill.value.toLocaleString()}</TableCell>
                  <TableCell>{waybill.validUntil}</TableCell>
                  <TableCell>
                    <Badge variant={waybill.status === 'active' ? 'default' : 'outline'} 
                      className={waybill.status === 'expiring' ? 'bg-amber-500 hover:bg-amber-600' : ''}>
                      {waybill.status === 'active' ? 'Active' : 'Expiring Soon'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction('print', waybill.id)}>
                          <Printer className="mr-2 h-4 w-4" />
                          <span>Print</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('download', waybill.id)}>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('extend', waybill.id)}>
                          <FileEdit className="mr-2 h-4 w-4" />
                          <span>Extend Validity</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('updateVehicle', waybill.id)}>
                          <Truck className="mr-2 h-4 w-4" />
                          <span>Update Vehicle</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Extend Validity Dialog */}
      <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend E-Waybill Validity</DialogTitle>
            <DialogDescription>
              The validity of E-Waybill {selectedWaybill} will be extended by 24 hours. This can only be done once per e-waybill.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Please confirm that you want to extend the validity of this e-waybill. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setExtendDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleExtendValidity}>Confirm Extension</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Vehicle Dialog */}
      <Dialog open={updateVehicleDialogOpen} onOpenChange={setUpdateVehicleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Vehicle Information</DialogTitle>
            <DialogDescription>
              Update the vehicle information for E-Waybill {selectedWaybill}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="vehicleNumber" className="text-sm font-medium">New Vehicle Number</label>
              <Input 
                id="vehicleNumber" 
                placeholder="Enter vehicle number" 
                value={vehicleNumber} 
                onChange={(e) => setVehicleNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">Reason for Change</label>
              <Input 
                id="reason" 
                placeholder="Enter reason for change" 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setUpdateVehicleDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateVehicle}>Update Vehicle</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveWaybills;
