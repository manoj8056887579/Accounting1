
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Calendar, FileText, AlertCircle, Download, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data for upcoming returns
const upcomingReturns = [
  {
    id: "R1001",
    type: "GSTR-1",
    periodDesc: "July 2023",
    dueDate: "2023-08-11",
    status: "Pending",
    dataReady: true
  },
  {
    id: "R1002",
    type: "GSTR-3B",
    periodDesc: "July 2023",
    dueDate: "2023-08-20",
    status: "Pending",
    dataReady: false
  },
  {
    id: "R1003",
    type: "GSTR-1",
    periodDesc: "August 2023",
    dueDate: "2023-09-11",
    status: "Not Due",
    dataReady: false
  },
  {
    id: "R1004",
    type: "GSTR-3B",
    periodDesc: "August 2023",
    dueDate: "2023-09-20",
    status: "Not Due",
    dataReady: false
  }
];

// Mock data for preparable returns
const preparableReturns = [
  {
    id: "P1001",
    type: "GSTR-1",
    periodDesc: "July 2023",
    dataStatus: "Complete",
    invoiceCount: 87,
    totalValue: 420000,
    taxValue: 75600,
    isPreparable: true
  },
  {
    id: "P1002", 
    type: "GSTR-3B",
    periodDesc: "July 2023",
    dataStatus: "Incomplete",
    invoiceCount: 87,
    totalValue: 420000,
    taxValue: 75600,
    isPreparable: false
  }
];

const GSTReturns = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedFY, setSelectedFY] = useState("2023-2024");
  const [selectedQuarter, setSelectedQuarter] = useState("all");
  
  const handlePrepareReturn = (returnId: string) => {
    toast({
      title: "Return Preparation Started",
      description: `Preparing return ${returnId}. This may take a few moments.`
    });
  };
  
  const handleFileReturn = (returnId: string) => {
    toast({
      title: "Return Filing Initiated",
      description: `Filing process started for return ${returnId}.`
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Returns</TabsTrigger>
          <TabsTrigger value="prepare">Prepare Returns</TabsTrigger>
          <TabsTrigger value="annual">Annual Returns</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Returns Due</h3>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </div>
              
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Upcoming Due Date</AlertTitle>
                <AlertDescription>
                  GSTR-1 for July 2023 is due on 11th August 2023
                </AlertDescription>
              </Alert>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Return</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data Ready</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingReturns.map((returnItem) => (
                      <TableRow key={returnItem.id}>
                        <TableCell className="font-medium">{returnItem.type}</TableCell>
                        <TableCell>{returnItem.periodDesc}</TableCell>
                        <TableCell>{new Date(returnItem.dueDate).toLocaleDateString('en-IN')}</TableCell>
                        <TableCell>
                          <Badge variant={
                            returnItem.status === 'Pending' ? 'secondary' : 
                            returnItem.status === 'Not Due' ? 'outline' : 'default'
                          }>
                            {returnItem.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {returnItem.dataReady ? (
                            <span className="flex items-center text-green-600">
                              <FileText className="h-4 w-4 mr-1" />
                              Ready
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Not Ready</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              disabled={!returnItem.dataReady}
                              onClick={() => handlePrepareReturn(returnItem.id)}
                            >
                              Prepare
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prepare" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium">Prepare GST Returns</h3>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Return</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Data Status</TableHead>
                      <TableHead>Invoice Count</TableHead>
                      <TableHead>Total Value (₹)</TableHead>
                      <TableHead>Tax Value (₹)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preparableReturns.map((returnItem) => (
                      <TableRow key={returnItem.id}>
                        <TableCell className="font-medium">{returnItem.type}</TableCell>
                        <TableCell>{returnItem.periodDesc}</TableCell>
                        <TableCell>
                          <Badge variant={returnItem.dataStatus === 'Complete' ? 'default' : 'secondary'}>
                            {returnItem.dataStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{returnItem.invoiceCount}</TableCell>
                        <TableCell>₹{returnItem.totalValue.toLocaleString('en-IN')}</TableCell>
                        <TableCell>₹{returnItem.taxValue.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toast({
                                title: "Return Downloaded",
                                description: `Downloaded return data for ${returnItem.type} - ${returnItem.periodDesc}`
                              })}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              JSON
                            </Button>
                            <Button 
                              size="sm" 
                              disabled={!returnItem.isPreparable}
                              onClick={() => handleFileReturn(returnItem.id)}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              File
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="annual" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-lg font-medium">Annual GST Returns (GSTR-9)</h3>
                
                <div className="flex flex-col md:flex-row gap-2">
                  <Select value={selectedFY} onValueChange={setSelectedFY}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select FY" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023-2024">FY 2023-24</SelectItem>
                      <SelectItem value="2022-2023">FY 2022-23</SelectItem>
                      <SelectItem value="2021-2022">FY 2021-22</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline">Show Annual Returns</Button>
                </div>
              </div>
              
              {selectedFY === "2023-2024" ? (
                <Alert className="bg-gray-100 border-gray-200">
                  <FileText className="h-4 w-4" />
                  <AlertTitle>Annual Return Not Due</AlertTitle>
                  <AlertDescription>
                    The annual return GSTR-9 for FY 2023-24 will be due on December 31, 2024.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Return Type</TableHead>
                        <TableHead>Financial Year</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">GSTR-9</TableCell>
                        <TableCell>{selectedFY === "2022-2023" ? "2022-23" : "2021-22"}</TableCell>
                        <TableCell>{selectedFY === "2022-2023" ? "31-12-2023" : "31-12-2022"}</TableCell>
                        <TableCell>
                          <Badge variant={selectedFY === "2022-2023" ? "destructive" : "default"}>
                            {selectedFY === "2022-2023" ? "Not Filed" : "Filed"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" disabled={selectedFY === "2021-2022"}>
                            {selectedFY === "2022-2023" ? "Prepare & File" : "View Filed Return"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GSTReturns;
