
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ArrowUpRight, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, RefreshCcw } from 'lucide-react';
import { mockLeadScores, mockCustomers } from '@/data/mockCRM';
import { CustomerType } from '@/models/crm';
import { toast } from '@/hooks/use-toast';

const AIInsights = () => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate customer type distribution
  const customerTypeData = mockCustomers.reduce((acc, customer) => {
    const type = customer.customer_type;
    const existingType = acc.find(item => item.name === type);
    
    if (existingType) {
      existingType.value++;
    } else {
      acc.push({ name: type, value: 1 });
    }
    
    return acc;
  }, [] as { name: CustomerType; value: number }[]);

  // Calculate lead score distribution
  const leadScoreData = [
    { name: 'High (80-100)', value: mockLeadScores.filter(score => score.score >= 80).length },
    { name: 'Medium (60-79)', value: mockLeadScores.filter(score => score.score >= 60 && score.score < 80).length },
    { name: 'Low (0-59)', value: mockLeadScores.filter(score => score.score < 60).length },
  ];

  // Engagement trend data (mock data)
  const engagementData = [
    { month: 'Jan', calls: 12, emails: 25, meetings: 5 },
    { month: 'Feb', calls: 15, emails: 30, meetings: 8 },
    { month: 'Mar', calls: 18, emails: 22, meetings: 10 },
    { month: 'Apr', calls: 20, emails: 28, meetings: 12 },
    { month: 'May', calls: 22, emails: 32, meetings: 15 },
    { month: 'Jun', calls: 25, emails: 35, meetings: 18 },
  ];

  // COLORS for pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleGenerateInsights = () => {
    setIsGenerating(true);
    
    // Simulate API call for generating insights
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: 'AI Insights Generated',
        description: 'New customer insights have been generated based on the latest data.',
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">AI-Generated Customer Insights</h2>
          <p className="text-muted-foreground">
            Understand your customers better with AI-powered analytics and recommendations
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleGenerateInsights}
            disabled={isGenerating}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate New Insights'}
          </Button>
        </div>
      </div>

      {/* Lead Scoring Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Scoring Overview</CardTitle>
          <CardDescription>AI-generated lead scores for all customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 h-64">
              <div className="flex mb-4">
                <div className="mr-2">Chart Type:</div>
                <div className="flex gap-1 border rounded-md overflow-hidden">
                  <Button 
                    size="sm" 
                    variant={chartType === 'bar' ? 'default' : 'ghost'}
                    className="rounded-none px-3 h-8"
                    onClick={() => setChartType('bar')}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={chartType === 'line' ? 'default' : 'ghost'}
                    className="rounded-none px-3 h-8"
                    onClick={() => setChartType('line')}
                  >
                    <LineChartIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={chartType === 'pie' ? 'default' : 'ghost'}
                    className="rounded-none px-3 h-8"
                    onClick={() => setChartType('pie')}
                  >
                    <PieChartIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={leadScoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                ) : chartType === 'line' ? (
                  <LineChart data={leadScoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={leadScoreData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {leadScoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Primary Factor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeadScores
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5)
                    .map((score) => (
                      <TableRow key={score.id}>
                        <TableCell>{score.customer_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div 
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mr-2 ${
                                score.score >= 80 ? 'bg-green-500' : 
                                score.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                            >
                              {score.score}
                            </div>
                            <div className={`text-sm ${
                              score.score >= 80 ? 'text-green-600' : 
                              score.score >= 60 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              {score.score >= 80 ? 'High' : score.score >= 60 ? 'Medium' : 'Low'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {score.purchase_frequency_score > score.recency_score && 
                           score.purchase_frequency_score > score.order_value_score ? 
                            'Frequent buyer' : 
                           score.order_value_score > score.recency_score ?
                            'High order value' : 'Recent purchase'}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                  View all scores <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers by Segment */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segmentation Analysis</CardTitle>
          <CardDescription>Distribution of customers by type and engagement level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Customer Type Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {customerTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Customer Engagement Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="calls" stroke="#8884d8" />
                    <Line type="monotone" dataKey="emails" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="meetings" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Recommendations</CardTitle>
          <CardDescription>Smart suggestions to improve customer engagement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-800">High-Value Customers</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-700 space-y-2">
                <p>
                  <strong>5 customers</strong> have lead scores above 80 and represent <strong>60%</strong> of your total revenue.
                </p>
                <p>Consider implementing a VIP loyalty program for these customers to increase retention.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full text-blue-700 border-blue-200 hover:bg-blue-100">
                  View High-Value Customers
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-amber-800">Churn Risk</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-amber-700 space-y-2">
                <p>
                  <strong>3 customers</strong> who previously ordered regularly haven't made a purchase in over 60 days.
                </p>
                <p>Send them a personalized win-back campaign with special incentives.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full text-amber-700 border-amber-200 hover:bg-amber-100">
                  View Churn Risk Customers
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-800">Growth Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-green-700 space-y-2">
                <p>
                  <strong>7 customers</strong> have consistent ordering patterns but low average order values.
                </p>
                <p>Try cross-selling and bundle offers to increase their average order value.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full text-green-700 border-green-200 hover:bg-green-100">
                  View Growth Opportunities
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Suggested Follow-ups</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Days Since Last Order</TableHead>
                    <TableHead>Suggested Action</TableHead>
                    <TableHead className="text-right">Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCustomers
                    .filter(customer => customer.last_order_date)
                    .slice(0, 5)
                    .map((customer) => {
                      const daysSinceOrder = customer.last_order_date 
                        ? Math.round((new Date().getTime() - new Date(customer.last_order_date).getTime()) / (1000 * 3600 * 24))
                        : 0;
                        
                      return (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              customer.customer_type === 'Retail' ? 'bg-blue-100 text-blue-800' :
                              customer.customer_type === 'Wholesale' ? 'bg-amber-100 text-amber-800' :
                              'bg-violet-100 text-violet-800'
                            }`}>
                              {customer.customer_type}
                            </span>
                          </TableCell>
                          <TableCell>{daysSinceOrder}</TableCell>
                          <TableCell>
                            {daysSinceOrder > 60 
                              ? 'Win-back campaign' 
                              : daysSinceOrder > 30 
                              ? 'Check-in call' 
                              : 'Product recommendation'}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              daysSinceOrder > 60 ? 'bg-red-100 text-red-800' :
                              daysSinceOrder > 30 ? 'bg-amber-100 text-amber-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {daysSinceOrder > 60 ? 'High' : daysSinceOrder > 30 ? 'Medium' : 'Low'}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights;
