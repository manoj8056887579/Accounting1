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
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Search, 
  Printer, 
  Download, 
  Eye, 
  Calendar,
  ArrowUpDown,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';

// Mock data for e-waybill history
const mockHistoryData = [
  {
    id: 'EWB1001',
    date: '2024-05-14',
    fromPlace: 'Mumbai',
    toPlace: 'Delhi',
    consignor: 'ABC Enterprises',
    consignee: 'XYZ Corporation',
    transporterName: 'Speedway Transport',
    validUntil: '2024-05-16',
    status: 'completed',
    value: 24500
  },
  {
    id: 'EWB1002',
    date: '2024-05-10',
    fromPlace: 'Chennai',
    toPlace: 'Bangalore',
    consignor: 'Southern Electronics',
    consignee: 'Tech Solutions',
    transporterName: 'Express Movers',
    validUntil: '2024-05-12',
    status: 'completed',
    value: 18750
  },
  {
    id: 'EWB1003',
    date: '2024-05-08',
    fromPlace: 'Delhi',
    toPlace: 'Jaipur',
    consignor: 'Northern Traders',
    consignee: 'Royal Distributors',
    transporterName: 'Northern Transport Co.',
    validUntil: '2024-05-11',
    status: 'completed',
    value: 32000
  },
  {
    id: 'EWB1004',
    date: '2024-04-30',
    fromPlace: 'Kolkata',
    toPlace: 'Patna',
    consignor: 'Eastern Goods Ltd',
    consignee: 'Bihar Wholesale',
    transporterName: 'Eastern Express',
    validUntil: '2024-05-03',
    status: 'expired',
    value: 15250
  },
  {
    id: 'EWB1005',
    date: '2024-04-28',
    fromPlace: 'Hyderabad',
    toPlace: 'Vijayawada',
    consignor: 'Telangana Products',
    consignee: 'Andhra Distributors',
    transporterName: 'South Connect',
    validUntil: '2024-05-01',
    status: 'expired',
    value: 9800
  },
  {
    id: 'EWB1006',
    date: '2024-04-25',
    fromPlace: 'Pune',
    toPlace: 'Mumbai',
    consignor: 'Western Manufacturing',
    consignee: 'Coastal Dealers',
    transporterName: 'Western Logistics',
    validUntil: '2024-04-28',
    status: 'cancelled',
    value: 21350
  }
];

const WaybillHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [sorting, setSorting] = useState<{
    column: string | null;
    direction: 'asc' | 'desc';
  }>({
    column: null,
    direction: 'desc',
  });

  const filteredData = mockHistoryData.filter((waybill) => {
    // Apply search filter
    const matchesSearch =
      waybill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      waybill.consignor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      waybill.consignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      waybill.fromPlace.toLowerCase().includes(searchQuery.toLowerCase()) ||
      waybill.toPlace.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply status filter
    const matchesStatus =
      statusFilter === 'all' ? true : waybill.status === statusFilter;

    // Apply date range filter
    const waybillDate = new Date(waybill.date);
    const matchesDateRange =
      (!dateRange.from || waybillDate >= dateRange.from) &&
      (!dateRange.to || waybillDate <= dateRange.to);

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sorting.column) return 0;

    let comparison = 0;
    if (sorting.column === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sorting.column === 'value') {
      comparison = a.value - b.value;
    } else if (sorting.column === 'id') {
      comparison = a.id.localeCompare(b.id);
    }

    return sorting.direction === 'asc' ? comparison : -comparison;
  });

  const toggleSort = (column: string) => {
    if (sorting.column === column) {
      // Toggle direction if same column
      setSorting({
        column,
        direction: sorting.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Set new column with desc direction by default
      setSorting({
        column,
        direction: 'desc',
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateRange({ from: undefined, to: undefined });
  };

  const handleAction = (action: string, waybillId: string) => {
    switch (action) {
      case 'view':
        toast({
          title: "Viewing E-Waybill",
          description: `Opening details for ${waybillId}`,
        });
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default'; // green
      case 'expired':
        return 'secondary'; // gray
      case 'cancelled':
        return 'destructive'; // red
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search e-waybills..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 border-dashed">
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Date Range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>

          <Button variant="outline" size="sm" onClick={() => toast({ title: "Refreshed", description: "E-waybill history updated" })}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>E-Waybill History</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] cursor-pointer" onClick={() => toggleSort('id')}>
                <div className="flex items-center">
                  Waybill No.
                  {sorting.column === 'id' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 transition-transform ${
                      sorting.direction === 'asc' ? 'rotate-180' : ''
                    }`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('date')}>
                <div className="flex items-center">
                  Date
                  {sorting.column === 'date' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 transition-transform ${
                      sorting.direction === 'asc' ? 'rotate-180' : ''
                    }`} />
                  )}
                </div>
              </TableHead>
              <TableHead>From - To</TableHead>
              <TableHead>Consignor</TableHead>
              <TableHead>Consignee</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('value')}>
                <div className="flex items-center">
                  Value (₹)
                  {sorting.column === 'value' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 transition-transform ${
                      sorting.direction === 'asc' ? 'rotate-180' : ''
                    }`} />
                  )}
                </div>
              </TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No e-waybills found
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((waybill) => (
                <TableRow key={waybill.id}>
                  <TableCell className="font-medium">{waybill.id}</TableCell>
                  <TableCell>{waybill.date}</TableCell>
                  <TableCell>{waybill.fromPlace} - {waybill.toPlace}</TableCell>
                  <TableCell>{waybill.consignor}</TableCell>
                  <TableCell>{waybill.consignee}</TableCell>
                  <TableCell>{waybill.value.toLocaleString()}</TableCell>
                  <TableCell>{waybill.validUntil}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(waybill.status)}>
                      {waybill.status.charAt(0).toUpperCase() + waybill.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction('view', waybill.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('print', waybill.id)}>
                          <Printer className="mr-2 h-4 w-4" />
                          <span>Print</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('download', waybill.id)}>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
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

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {sortedData.length} of {mockHistoryData.length} e-waybills
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({ title: "Export CSV", description: "Exporting e-waybill history to CSV" })}
          >
            Export CSV
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => toast({ title: "Print Report", description: "Preparing to print e-waybill history report" })}
          >
            Print Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WaybillHistory;
