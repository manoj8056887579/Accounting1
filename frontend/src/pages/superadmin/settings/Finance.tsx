import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FileText, AlertCircle, Loader2, Hash } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addYears, subDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface FinanceSettings {
  id: number;
  invoice_prefix: string;
  financial_year_start_date: string;
  financial_year_end_date: string;
  gst_percentage: number;
  invoice_number_length: number;
  created_at: string;
  updated_at: string;
  financialYearCode?: string;
  nextInvoiceNumber?: string;
  counters?: InvoiceCounter[];
}

interface InvoiceCounter {
  id: number;
  financial_year_code: string;
  prefix: string;
  last_number: number;
  created_at: string;
  updated_at: string;
}

export default function Finance() {
  // State for invoice prefix
  const [invoicePrefix, setInvoicePrefix] = useState('INV');
  const [prefixError, setPrefixError] = useState('');
  
  // State for financial year
  const [financialStartDate, setFinancialStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 3, 1)); // April 1st
  const [financialEndDate, setFinancialEndDate] = useState<Date | undefined>();
  
  // State for financial year short code (e.g., "24-25")
  const [financialYearCode, setFinancialYearCode] = useState('');
  
  // State for GST percentage
  const [gstPercentage, setGstPercentage] = useState('18');
  
  // State for next invoice number
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('');
  
  // State for counters
  const [counters, setCounters] = useState<InvoiceCounter[]>([]);

  // State for API operations
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [financeSettings, setFinanceSettings] = useState<FinanceSettings | null>(null);

  // Fetch initial settings
  useEffect(() => {
    fetchSettings();
  }, []);

  // Recalculate the end date whenever the start date changes
  useEffect(() => {
    if (financialStartDate) {
      // Calculate end date (1 year - 1 day from start date)
      const oneYearLater = addYears(financialStartDate, 1);
      const endDate = subDays(oneYearLater, 1);
      setFinancialEndDate(endDate);
      
      // Calculate financial year code (e.g., "24-25")
      const startYear = financialStartDate.getFullYear() % 100; // Get last 2 digits
      const endYear = endDate.getFullYear() % 100; // Get last 2 digits
      setFinancialYearCode(`${startYear}-${endYear}`);
    }
  }, [financialStartDate]);
  
  // Validate invoice prefix
  useEffect(() => {
    if (invoicePrefix.length < 2) {
      setPrefixError('Prefix must be at least 2 characters');
    } else if (invoicePrefix.length > 3) {
      setPrefixError('Prefix cannot exceed 3 characters');
    } else {
      setPrefixError('');
    }
  }, [invoicePrefix]);

  // Fetch finance settings from API
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/superadmin/finance`);
      
      if (response.data.success && response.data.data) {
        const settings = response.data.data;
        setFinanceSettings(settings);
        
        // Update state with fetched values
        setInvoicePrefix(settings.invoice_prefix);
        setGstPercentage(settings.gst_percentage.toString());
        
        // Set financial year code and next invoice number
        if (settings.financialYearCode) {
          setFinancialYearCode(settings.financialYearCode);
        }
        
        if (settings.nextInvoiceNumber) {
          setNextInvoiceNumber(settings.nextInvoiceNumber);
        }
        
        if (settings.counters) {
          setCounters(settings.counters);
        }
        
        // Parse dates
        if (settings.financial_year_start_date) {
          setFinancialStartDate(parseISO(settings.financial_year_start_date));
        }
        if (settings.financial_year_end_date) {
          setFinancialEndDate(parseISO(settings.financial_year_end_date));
        }
      }
    } catch (error) {
      console.error('Error fetching finance settings:', error);
      toast.error('Failed to load finance settings');
    } finally {
      setLoading(false);
    }
  };

  // Save finance settings
  const saveSettings = async () => {
    if (prefixError) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        invoice_prefix: invoicePrefix,
        financial_year_start_date: financialStartDate?.toISOString(),
        financial_year_end_date: financialEndDate?.toISOString(),
        gst_percentage: parseFloat(gstPercentage)
      };

      let response;
      
      if (financeSettings?.id) {
        // Update existing settings
        response = await axios.put(`${API_URL}/api/superadmin/finance/${financeSettings.id}`, payload);
      } else {
        // Create new settings
        response = await axios.post(`${API_URL}/api/superadmin/finance`, payload);
      }

      if (response.data.success) {
        toast.success('Finance settings saved successfully');
        setFinanceSettings(response.data.data);
        fetchSettings(); // Refresh to get the updated counters and next invoice number
      } else {
        toast.error('Failed to save finance settings');
      }
    } catch (error: unknown) {
      console.error('Error saving finance settings:', error);
      const axiosError = error as AxiosError<{message: string}>;
      toast.error(axiosError.response?.data?.message || 'Failed to save finance settings');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle financial year start date change
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setFinancialStartDate(date);
    }
  };

  // Handle invoice prefix change
  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoicePrefix(e.target.value.toUpperCase());
  };

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    return date ? format(date, "MMMM d, yyyy") : "-";
  };

  // Generate invoice number example
  const getInvoiceExample = () => {
    return nextInvoiceNumber || `${invoicePrefix}/${financialYearCode}/1`;
  };

  // Format a counter for display
  const formatCounter = (counter: InvoiceCounter) => {
    return `${counter.prefix}/${counter.financial_year_code}/${counter.last_number}`;
  };
  
  // Get formatted date from timestamp
  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), "dd MMM yyyy, hh:mm a");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading finance settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Invoice Prefix Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invoice Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Prefix (2-3 characters)</Label>
              <Input 
                id="invoicePrefix" 
                placeholder="e.g. INV"
                value={invoicePrefix}
                onChange={handlePrefixChange}
                className={prefixError ? "border-red-500" : ""}
              />
              
              {prefixError && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{prefixError}</AlertDescription>
                </Alert>
              )}
              
              <div className="mt-4 p-3 border rounded-md bg-muted/30">
                <p className="text-sm font-medium mb-1">Invoice Number Format:</p>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <div className="px-2 py-1 bg-muted rounded">{invoicePrefix}</div>
                  <span>/</span>
                  <div className="px-2 py-1 bg-muted rounded">{financialYearCode}</div>
                  <span>/</span>
                  <div className="px-2 py-1 bg-muted rounded">[number]</div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Next: <span className="font-medium">{getInvoiceExample()}</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Year Invoice Numbers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Year Invoice Numbers</CardTitle>
          </CardHeader>
          <CardContent>
            {counters.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Financial Year</TableHead>
                    <TableHead>Prefix</TableHead>
                    <TableHead>Last Number</TableHead>
                    <TableHead>Next Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {counters.map((counter) => {
                    const isCurrentCounter = counter.financial_year_code === financialYearCode && 
                                           counter.prefix === invoicePrefix;
                    const nextInvoice = `${counter.prefix}/${counter.financial_year_code}/${counter.last_number + 1}`;
                    
                    return (
                      <TableRow key={counter.id} className={isCurrentCounter ? "bg-muted/40" : ""}>
                        <TableCell>{counter.financial_year_code}</TableCell>
                        <TableCell>{counter.prefix}</TableCell>
                        <TableCell>{counter.last_number}</TableCell>
                        <TableCell className="font-medium">{nextInvoice}</TableCell>
                        <TableCell>
                          <Badge variant={isCurrentCounter ? "default" : "outline"}>
                            {isCurrentCounter ? "Current" : "Previous"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatTimestamp(counter.updated_at)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No invoice numbers generated yet.</p>
                <p className="text-sm mt-2">Generate your first invoice number to see it here.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Year Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Year Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Financial Year Start Date */}
              <div className="space-y-2">
                <Label>Financial Year Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !financialStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {financialStartDate ? format(financialStartDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={financialStartDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  Select the first day of your financial year
                </p>
              </div>

              {/* Financial Year End Date (calculated automatically) */}
              <div className="space-y-2">
                <Label>Financial Year End Date</Label>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {financialEndDate ? format(financialEndDate, "PPP") : "Auto-calculated"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  End date is automatically calculated (1 year - 1 day from start date)
                </p>
              </div>
            </div>

            <div className="p-3 border rounded-md bg-muted/30 mt-2">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm">
                  Current Financial Year: {formatDate(financialStartDate)} to {formatDate(financialEndDate)}
                </span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Financial Year Code: <span className="font-medium">{financialYearCode}</span> (Used in invoice numbers)
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <strong>Note:</strong> Changing the financial year will reset invoice numbering for the new year.
                Previous year's invoice numbering will be preserved.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* GST Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tax Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gstPercentage">Default GST Percentage</Label>
              <div className="flex items-center">
                <Input 
                  id="gstPercentage" 
                  type="number"
                  placeholder="e.g. 18"
                  value={gstPercentage}
                  onChange={(e) => setGstPercentage(e.target.value)}
                  className="w-full"
                />
                <span className="ml-2">%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!!prefixError || saving} 
            onClick={saveSettings}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 