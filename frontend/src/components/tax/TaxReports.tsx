
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileDown, FileBarChart } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const TaxReports = () => {
  const [reportType, setReportType] = useState('gst-summary');
  const [period, setPeriod] = useState('monthly');
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { toast } = useToast();
  
  const reportTypes = [
    { value: 'gst-summary', label: 'GST Summary Report' },
    { value: 'tax-liability', label: 'Tax Liability Report' },
    { value: 'gst-return', label: 'GST Return' },
    { value: 'input-credit', label: 'Input Tax Credit Report' },
    { value: 'vat-return', label: 'VAT Return' },
    { value: 'sales-tax', label: 'Sales Tax Report' }
  ];
  
  const periods = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'custom', label: 'Custom Date Range' }
  ];
  
  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Mock API call
    setTimeout(() => {
      toast({
        title: "Report generated",
        description: `Your ${reportTypes.find(r => r.value === reportType)?.label} has been generated successfully.`
      });
      setIsGenerating(false);
    }, 1500);
  };
  
  const handleDownloadReport = (format: string) => {
    toast({
      title: `Downloading ${format.toUpperCase()} report`,
      description: "Your report download will begin shortly"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="period">Report Period</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map(p => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {period === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !fromDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto">
                        <Calendar
                          mode="single"
                          selected={fromDate}
                          onSelect={setFromDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>To Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !toDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto">
                        <Calendar
                          mode="single"
                          selected={toDate}
                          onSelect={setToDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col justify-end space-y-4">
              <Button 
                onClick={handleGenerateReport} 
                disabled={isGenerating}
                className="w-full md:w-auto"
              >
                <FileBarChart className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
              
              <div className="flex flex-col space-y-2">
                <Label>Download Format</Label>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadReport('pdf')}
                    className="flex-1"
                  >
                    <FileDown className="mr-2 h-4 w-4" /> PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadReport('excel')}
                    className="flex-1"
                  >
                    <FileDown className="mr-2 h-4 w-4" /> Excel
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadReport('csv')}
                    className="flex-1"
                  >
                    <FileDown className="mr-2 h-4 w-4" /> CSV
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="border rounded-lg p-6 bg-muted/20">
        <div className="text-center space-y-3">
          <FileBarChart className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-medium">No reports generated yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Select a report type and time period above, then click "Generate Report" to view your tax reports.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaxReports;
