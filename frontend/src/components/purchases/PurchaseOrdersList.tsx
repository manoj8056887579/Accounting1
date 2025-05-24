
import React, { useState } from 'react';
import { 
  getPurchaseOrders, 
  getVendors,
} from '@/data/mockPurchases';
import { PurchaseOrder } from '@/models/purchases';
import PurchaseDocumentList from './PurchaseDocumentList';
import { ShoppingCart, CheckCircle, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Document } from './types';

const PurchaseOrdersList = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>(getPurchaseOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Enhanced status colors with better visual distinction
  const statusColors = {
    'draft': { bg: 'bg-slate-100', text: 'text-slate-800' },
    'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'approved': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'sent': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'received': { bg: 'bg-green-100', text: 'text-green-800' },
    'cancelled': { bg: 'bg-red-100', text: 'text-red-800' },
    'closed': { bg: 'bg-gray-100', text: 'text-gray-800' }
  };

  // Handle add new purchase order
  const handleAddOrder = () => {
    toast({
      title: "Add Purchase Order",
      description: "This would open a purchase order creation form"
    });
  };

  // Handle edit purchase order
  const handleEditOrder = (order: PurchaseOrder) => {
    toast({
      title: "Edit Purchase Order",
      description: `Editing purchase order ${order.reference}`
    });
  };

  // Handle delete purchase order
  const handleDeleteOrder = (order: PurchaseOrder) => {
    setOrders(orders.filter(o => o.id !== order.id));
    toast({
      title: "Purchase Order Deleted",
      description: `Purchase order ${order.reference} has been deleted`,
      variant: "destructive"
    });
  };

  // Handle view purchase order details
  const handleViewOrder = (order: PurchaseOrder) => {
    toast({
      title: "View Purchase Order Details",
      description: `Viewing details for purchase order ${order.reference}`
    });
  };

  // Handle approve purchase order
  const handleApproveOrder = (order: PurchaseOrder) => {
    const updatedOrders = orders.map(o =>
      o.id === order.id ? { ...o, status: 'approved' as const } : o
    );
    setOrders(updatedOrders);
    toast({
      title: "Purchase Order Approved",
      description: `Purchase order ${order.reference} has been approved`,
      variant: "default"
    });
  };

  // Handle receive purchase order
  const handleReceiveOrder = (order: PurchaseOrder) => {
    const updatedOrders = orders.map(o =>
      o.id === order.id ? { ...o, status: 'received' as const } : o
    );
    setOrders(updatedOrders);
    toast({
      title: "Purchase Order Received",
      description: `Purchase order ${order.reference} has been marked as received`,
      variant: "default"
    });
  };

  return (
    <PurchaseDocumentList
      title="Purchase Orders"
      description="Manage purchase orders to your vendors"
      icon={<ShoppingCart className="h-5 w-5 text-muted-foreground mr-2" />}
      documents={orders as Document[]}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onAdd={handleAddOrder}
      onEdit={(doc) => handleEditOrder(doc as PurchaseOrder)}
      onDelete={(doc) => handleDeleteOrder(doc as PurchaseOrder)}
      onView={(doc) => handleViewOrder(doc as PurchaseOrder)}
      additionalAction={{
        label: (doc) => ((doc.status === 'approved' || doc.status === 'sent') ? "Receive" : "Approve"),
        icon: <Truck className="h-4 w-4 text-blue-600" />,
        onClick: (doc) => {
          const order = doc as PurchaseOrder;
          return (order.status === 'approved' || order.status === 'sent') ? 
            handleReceiveOrder(order) : handleApproveOrder(order);
        },
        showFor: (doc) => ['draft', 'pending', 'approved', 'sent'].includes(doc.status)
      }}
      statusColors={statusColors}
      emptyStateMessage="No purchase orders found. Create your first purchase order to get started."
    />
  );
};

export default PurchaseOrdersList;
