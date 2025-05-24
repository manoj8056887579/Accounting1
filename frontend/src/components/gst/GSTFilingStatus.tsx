
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileText, RefreshCw, Download, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

// Mock data for filing statuses
const mockFilings = [
  {
    id: "F1001",
    returnType: "GSTR-1",
    period: "Apr 2023",
    filingDate: "2023-05-10",
    status: "Filed",
    arn: "AA330423001234Z",
    taxAmount: 125000
  },
  {
    id: "F1002",
    returnType: "GSTR-3B",
    period: "Apr 2023",
    filingDate: "2023-05-18",
    status: "Filed",
    arn: "AA330423005678Y",
    taxAmount: 145000
  },
  {
    id: "F1003",
    returnType: "GSTR-1",
    period: "May 2023",
    filingDate: "2023-06-11",
    status: "Filed",
    arn: "AA330523002468X",
    taxAmount: 132500
  },
  {
    id: "F1004",
    returnType: "GSTR-3B",
    period: "May 2023",
    filingDate: "2023-06-19",
    status: "Filed",
    arn: "AA330523007890W",
    taxAmount: 151200
  },
  {
    id: "F1005",
    returnType: "GSTR-1",
    period: "Jun 2023",
    filingDate: "2023-07-09",
    status: "Error",
    arn: "",
    taxAmount: 140800
  },
  {
    id: "F1006",
    returnType: "GSTR-3B",
    period: "Jun 2023",
    filingDate: "",
    status: "Pending",
    arn: "",
    taxAmount: 160000
  }
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Filed': return 'success';
    case 'Error': return 'destructive';
    case 'Pending': return 'warning';
    default: return 'secondary';
  }
};

const GSTFilingStatus = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [arnSearch, setArnSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filingData, setFilingData] = useState(mockFilings);
  
  const handleSearch = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filtered = mockFilings;
      
      if (selectedPeriod && selectedPeriod !== "all") {
        filtered = filtered.filter(filing => filing.period === selectedPeriod);
      }
      
      if (selectedType && selectedType !== "all") {
        filtered = filtered.filter(filing => filing.returnType === selectedType);
      }
      
      if (arnSearch) {
        filtered = filtered.filter(filing => 
          filing.arn.toLowerCase().includes(arnSearch.toLowerCase())
        );
      }
      
      setFilingData(filtered);
      setIsLoading(false);
    }, 800);
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate refresh
    setTimeout(() => {
      setFilingData(mockFilings);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 flex flex-col items-center text-center bg-blue-50">
          <div className="rounded-full bg-blue-100 p-3 mb-2">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-medium">Total Returns</h3>
          <span className="text-2xl font-bold">24</span>
          <span className="text-sm text-muted-foreground">Last 12 months</span>
        </Card>
        
        <Card className="p-4 flex flex-col items-center text-center bg-green-50">
          <div className="rounded-full bg-green-100 p-3 mb-2">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-medium">Filed</h3>
          <span className="text-2xl font-bold">22</span>
          <span className="text-sm text-muted-foreground">Last 12 months</span>
        </Card>
        
        <Card className="p-4 flex flex-col items-center text-center bg-amber-50">
          <div className="rounded-full bg-amber-100 p-3 mb-2">
            <FileText className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="font-medium">Pending</h3>
          <span className="text-2xl font-bold">2</span>
          <span className="text-sm text-muted-foreground">Last 12 months</span>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
            <div className="space-y-2 flex-1">
              <Label htmlFor="period">Filing Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Periods</SelectItem>
                  <SelectItem value="Apr 2023">April 2023</SelectItem>
                  <SelectItem value="May 2023">May 2023</SelectItem>
                  <SelectItem value="Jun 2023">June 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 flex-1">
              <Label htmlFor="type">Return Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="GSTR-1">GSTR-1</SelectItem>
                  <SelectItem value="GSTR-3B">GSTR-3B</SelectItem>
                  <SelectItem value="GSTR-9">GSTR-9</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 flex-1">
              <Label htmlFor="arn">ARN</Label>
              <Input 
                id="arn" 
                placeholder="Search by ARN" 
                value={arnSearch} 
                onChange={(e) => setArnSearch(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleSearch} disabled={isLoading}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Filing Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ARN</TableHead>
                  <TableHead>Tax Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filingData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filingData.map((filing) => (
                    <TableRow key={filing.id}>
                      <TableCell>{filing.returnType}</TableCell>
                      <TableCell>{filing.period}</TableCell>
                      <TableCell>{filing.filingDate || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={
                          filing.status === 'Filed' ? 'default' : 
                          filing.status === 'Error' ? 'destructive' : 
                          'secondary'
                        }>
                          {filing.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{filing.arn || "-"}</TableCell>
                      <TableCell>₹{filing.taxAmount.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" disabled={filing.status !== 'Filed'}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" disabled={filing.status !== 'Filed'}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GSTFilingStatus;
