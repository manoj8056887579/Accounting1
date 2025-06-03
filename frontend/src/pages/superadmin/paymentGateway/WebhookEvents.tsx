import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { RefreshCw, Check, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface WebhookEvent {
  id: number;
  event_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  processed: boolean;
  created_at: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const WebhookEvents = () => {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const filterParam = filter !== null ? `&processed=${filter}` : '';
      const response = await axios.get(
        `${API_URL}/api/superadmin/payment-gateways/webhook-events?page=${pagination.page}&limit=${pagination.limit}${filterParam}`
      );
      
      if (response.data.success) {
        setEvents(response.data.data);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.data.message || 'Failed to fetch webhook events');
      }
    } catch (error) {
      console.error('Error fetching webhook events:', error);
      toast.error('Failed to fetch webhook events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [pagination.page, filter]);

  const handleRetry = async (eventId: string) => {
    try {
      setIsRetrying(prev => ({ ...prev, [eventId]: true }));
      
      const response = await axios.post(
        `${API_URL}/api/superadmin/payment-gateways/webhook-events/${eventId}/retry`
      );
      
      if (response.data.success) {
        toast.success('Webhook event reprocessed successfully');
        fetchEvents();
      } else {
        toast.error(response.data.message || 'Failed to retry webhook event');
      }
    } catch (error) {
      console.error('Error retrying webhook event:', error);
      toast.error('Failed to retry webhook event');
    } finally {
      setIsRetrying(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatEventType = (type: string) => {
    return type.split('.').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  };

  const renderPayloadPreview = (payload: Record<string, unknown>) => {
    if (!payload) return 'No payload';
    
    try {
      const payloadObj = typeof payload === 'string' ? JSON.parse(payload) : payload;
      
      if (payloadObj.event) {
        return `Event: ${payloadObj.event}`;
      }
      
      // Safe access using optional chaining and type assertions
      const payloadContent = (payloadObj.payload as Record<string, unknown> | undefined);
      const paymentEntity = payloadContent?.payment as Record<string, unknown> | undefined;
      const entity = paymentEntity?.entity as Record<string, unknown> | undefined;
      const paymentId = entity?.id;
      
      if (paymentId) {
        return `Payment ID: ${paymentId}`;
      }
      
      return 'View details';
    } catch (error) {
      return 'Invalid payload';
    }
  };

  // Simple pagination component
  const SimplePagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
  }: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void 
  }) => {
    return (
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Webhook Events</CardTitle>
            <CardDescription>Monitor and manage incoming webhook events from Razorpay</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilter(filter === 'true' ? null : 'true')}
            >
              {filter === 'true' ? 'Show All' : 'Show Processed Only'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilter(filter === 'false' ? null : 'false')}
            >
              {filter === 'false' ? 'Show All' : 'Show Unprocessed Only'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchEvents}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {isLoading ? 'Loading events...' : 'No webhook events found'}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payload</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.event_id}>
                    <TableCell className="font-medium">
                      {formatEventType(event.event_type)}
                    </TableCell>
                    <TableCell>
                      {event.processed ? (
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                          <Check className="h-3 w-3 mr-1" />
                          Processed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {renderPayloadPreview(event.payload)}
                    </TableCell>
                    <TableCell>{formatDate(event.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetry(event.event_id)}
                        disabled={isRetrying[event.event_id] || event.processed}
                      >
                        {isRetrying[event.event_id] ? 'Retrying...' : 'Retry'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <SimplePagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WebhookEvents; 