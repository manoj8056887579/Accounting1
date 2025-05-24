
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { BarChart, CheckCircle, AlertTriangle, Search, Download, RefreshCw } from 'lucide-react';

// Mock reconciliation data
const mockReconciliationData = [
  {
    id: "1",
    invoiceNumber: "INV-2023-001",
    invoiceDate: "2023-07-05",
    partyGstin: "27AAPFU0939F1ZV",
    partyName: "Universal Traders",
    amount: 25000,
    igst: 0,
    cgst: 2250,
    sgst: 2250,
    status: "matched"
  },
  {
    id: "2",
    invoiceNumber: "INV-2023-002",
    invoiceDate: "2023-07-08",
    partyGstin: "29AQDPL8770D1ZO",
    partyName: "Lakshmi Enterprises",
    amount: 18000,
    igst: 3240,
    cgst: 0,
    sgst: 0,
    status: "matched"
  },
  {
    id: "3",
    invoiceNumber: "INV-2023-003",
    invoiceDate: "2023-07-12",
    partyGstin: "27AHXPK7348R1Z7",
    partyName: "Sharma Textiles",
    amount: 42000,
    igst: 0,
    cgst: 3780,
    sgst: 3780,
    status: "mismatch_amount"
  },
  {
    id: "4",
    invoiceNumber: "INV-2023-004",
    invoiceDate: "2023-07-15",
    partyGstin: "06AABCI1332G1ZP",
    partyName: "Innovative Systems",
    amount: 35000,
    igst: 0,
    cgst: 3150,
    sgst: 3150,
    status: "mismatch_tax"
  },
  {
    id: "5",
    invoiceNumber: "INV-2023-005",
    invoiceDate: "2023-07-18",
    partyGstin: "24AAACR5055K1ZD",
    partyName: "Royal Manufacturers",
    amount: 65000,
    igst: 11700,
    cgst: 0,
    sgst: 0,
    status: "not_found"
  },
  {
    id: "6",
    invoiceNumber: "",
    invoiceDate: "2023-07-22",
    partyGstin: "33AADCS0472N1Z5",
    partyName: "Southern Distributors",
    amount: 28000,
    igst: 5040,
    cgst: 0,
    sgst: 0,
    status: "not_in_books"
  }
];

// Helper function to get status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'matched': 
      return 'bg-green-100 text-green-800 border-green-200';
    case 'mismatch_amount':
    case 'mismatch_tax': 
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'not_found':
    case 'not_in_books': 
      return 'bg-red-100 text-red-800 border-red-200';
    default: 
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Helper function to get status display text
const getStatusText = (status: string) => {
  switch (status) {
    case 'matched': return 'Matched';
    case 'mismatch_amount': return 'Amount Mismatch';
    case 'mismatch_tax': return 'Tax Mismatch';
    case 'not_found': return 'Not Found in GSTN';
    case 'not_in_books': return 'Not in Books';
    default: return status;
  }
};

const GSTReconciliation = () => {
  const [activeTab, setActiveTab] = useState('gstr2a');
  const [selectedMonth, setSelectedMonth] = useState('07-2023');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Filter data based on search query
  const filteredData = mockReconciliationData.filter((invoice) => 
    invoice.invoiceNumber.includes(searchQuery) || 
    invoice.partyGstin.includes(searchQuery) ||
    invoice.partyName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate summary statistics
  const summary = {
    total: filteredData.length,
    matched: filteredData.filter(item => item.status === 'matched').length,
    mismatches: filteredData.filter(item => item.status === 'mismatch_amount' || item.status === 'mismatch_tax').length,
    notFound: filteredData.filter(item => item.status === 'not_found').length,
    notInBooks: filteredData.filter(item => item.status === 'not_in_books').length,
  };
  
  const handleRefresh = () => {
    setLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Reconciliation Refreshed",
        description: `Successfully fetched latest data from GSTN portal for ${selectedMonth}`,
      });
      setLoading(false);
    }, 1500);
  };
  
  const handleDownloadReport = () => {
    toast({
      title: "Report Download Started",
      description: "Your reconciliation report will be downloaded shortly",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-4 flex flex-col items-center text-center bg-green-50">
          <div className="rounded-full bg-green-100 p-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="font-medium">Matched</h3>
          <span className="text-xl font-bold">{summary.matched}</span>
        </Card>
        
        <Card className="p-4 flex flex-col items-center text-center bg-amber-50">
          <div className="rounded-full bg-amber-100 p-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="font-medium">Mismatches</h3>
          <span className="text-xl font-bold">{summary.mismatches}</span>
        </Card>
        
        <Card className="p-4 flex flex-col items-center text-center bg-red-50">
          <div className="rounded-full bg-red-100 p-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="font-medium">Not in GSTN</h3>
          <span className="text-xl font-bold">{summary.notFound}</span>
        </Card>
        
        <Card className="p-4 flex flex-col items-center text-center bg-blue-50">
          <div className="rounded-full bg-blue-100 p-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-medium">Not in Books</h3>
          <span className="text-xl font-bold">{summary.notInBooks}</span>
        </Card>
        
        <Card className="p-4 flex flex-col items-center text-center bg-purple-50">
          <div className="rounded-full bg-purple-100 p-2 mb-2">
            <BarChart className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="font-medium">Total</h3>
          <span className="text-xl font-bold">{summary.total}</span>
        </Card>
      </div>
      
      <Tabs defaultValue="gstr2a" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="gstr2a">GSTR-2A Reconciliation</TabsTrigger>
          <TabsTrigger value="gstr1">GSTR-1 Reconciliation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gstr2a" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="space-y-2">
                  <Label>Select Period</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="07-2023">July 2023</SelectItem>
                      <SelectItem value="06-2023">June 2023</SelectItem>
                      <SelectItem value="05-2023">May 2023</SelectItem>
                      <SelectItem value="04-2023">April 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by invoice number, GSTIN or name"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  
                  <Button onClick={handleDownloadReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              
              <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                <AlertTitle>GSTR-2A Reconciliation</AlertTitle>
                <AlertDescription>
                  Compares your purchase records with supplier-filed information in GSTR-2A
                </AlertDescription>
              </Alert>
              
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Party GSTIN</TableHead>
                      <TableHead>Party Name</TableHead>
                      <TableHead>Amount (₹)</TableHead>
                      <TableHead>IGST (₹)</TableHead>
                      <TableHead>CGST (₹)</TableHead>
                      <TableHead>SGST (₹)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>{invoice.invoiceNumber || "-"}</TableCell>
                          <TableCell>{invoice.invoiceDate}</TableCell>
                          <TableCell className="font-mono">{invoice.partyGstin}</TableCell>
                          <TableCell>{invoice.partyName}</TableCell>
                          <TableCell>₹{invoice.amount.toLocaleString('en-IN')}</TableCell>
                          <TableCell>₹{invoice.igst.toLocaleString('en-IN')}</TableCell>
                          <TableCell>₹{invoice.cgst.toLocaleString('en-IN')}</TableCell>
                          <TableCell>₹{invoice.sgst.toLocaleString('en-IN')}</TableCell>
                          <TableCell>
                            <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${getStatusColor(invoice.status)}`}>
                              {getStatusText(invoice.status)}
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
        </TabsContent>
        
        <TabsContent value="gstr1" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="space-y-2">
                  <Label>Select Period</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="07-2023">July 2023</SelectItem>
                      <SelectItem value="06-2023">June 2023</SelectItem>
                      <SelectItem value="05-2023">May 2023</SelectItem>
                      <SelectItem value="04-2023">April 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by invoice number, GSTIN or name"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  
                  <Button onClick={handleDownloadReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <AlertTitle>GSTR-1 Reconciliation</AlertTitle>
                <AlertDescription>
                  Compares your sales records with what you have filed in GSTR-1
                </AlertDescription>
              </Alert>
              
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Party GSTIN</TableHead>
                      <TableHead>Party Name</TableHead>
                      <TableHead>Amount (₹)</TableHead>
                      <TableHead>IGST (₹)</TableHead>
                      <TableHead>CGST (₹)</TableHead>
                      <TableHead>SGST (₹)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        Select a period and click Refresh to load GSTR-1 reconciliation data.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GSTReconciliation;
