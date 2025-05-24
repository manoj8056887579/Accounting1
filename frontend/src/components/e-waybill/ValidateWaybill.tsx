
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

// Form schema for E-Waybill validation
const formSchema = z.object({
  waybillNumber: z
    .string()
    .min(10, "E-Waybill number must be at least 10 characters")
    .max(20, "E-Waybill number must not exceed 20 characters"),
  modeType: z.string().min(1, "Please select mode type"),
  vehicleNumber: z.string().optional(),
  transactionType: z.string().optional(),
});

// Mock validation result
const mockValidationResult = {
  valid: true,
  waybillNumber: 'EWB1001',
  status: 'Active',
  generatedDate: '2024-05-14',
  validUntil: '2024-05-16',
  fromGstin: '27AAACR5055K1Z3',
  fromName: 'ABC Enterprises',
  fromPlace: 'Mumbai',
  toGstin: '07AAACP5055K1Z3',
  toName: 'XYZ Corporation',
  toPlace: 'Delhi',
  documentType: 'Tax Invoice',
  documentNumber: 'INV-2024-0123',
  documentDate: '2024-05-14',
  transporterName: 'Speedway Transport',
  transporterId: '29AAACP5055K1Z3',
  transportMode: 'Road',
  vehicleNumber: 'MH01AB1234',
  hsnCode: '8471',
  productDesc: 'Laptop Computers',
  quantity: '10',
  taxableAmount: '245000',
  taxRate: '18%',
};

const ValidateWaybill = () => {
  const [validationResult, setValidationResult] = useState<any>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      waybillNumber: '',
      modeType: 'waybill',
      vehicleNumber: '',
      transactionType: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsValidating(true);
    setValidationResult(null);
    setValidationError(null);

    // Simulate API call with setTimeout
    setTimeout(() => {
      setIsValidating(false);
      
      // Mock validation logic - in a real app, this would be an API call
      if (values.waybillNumber === 'EWB1001') {
        setValidationResult(mockValidationResult);
        toast({
          title: "Validation Successful",
          description: "The e-waybill is valid and active.",
        });
      } else if (values.waybillNumber === 'EWB9999') {
        setValidationError("This e-waybill has expired.");
        toast({
          title: "Validation Failed",
          description: "This e-waybill has expired.",
          variant: "destructive",
        });
      } else {
        setValidationError("Invalid e-waybill number. No records found.");
        toast({
          title: "Validation Failed",
          description: "No records found with this e-waybill number.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Validate E-Waybill</CardTitle>
          <CardDescription>
            Check the validity and status of an e-waybill by entering its details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="waybillNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-Waybill Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter e-waybill number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="modeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode Type*</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="waybill">E-Waybill</option>
                          <option value="invoice">Invoice Reference</option>
                          <option value="vehicle">Vehicle Number</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('modeType') === 'vehicle' && (
                  <FormField
                    control={form.control}
                    name="vehicleNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter vehicle number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch('modeType') === 'invoice' && (
                  <FormField
                    control={form.control}
                    name="transactionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Type</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="">Select type</option>
                            <option value="b2b">B2B</option>
                            <option value="b2c">B2C</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Button type="submit" className="w-full md:w-auto" disabled={isValidating}>
                {isValidating ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Validate E-Waybill
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {validationError && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Validation Failed</AlertTitle>
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      {validationResult && (
        <Card>
          <CardHeader className="bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <CardTitle className="text-green-600 dark:text-green-400">
                Valid E-Waybill
              </CardTitle>
            </div>
            <CardDescription>
              E-Waybill {validationResult.waybillNumber} is valid and {validationResult.status.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">E-Waybill Details</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">E-Waybill Number</p>
                    <p className="text-sm">{validationResult.waybillNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Generated Date</p>
                    <p className="text-sm">{validationResult.generatedDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Valid Until</p>
                    <p className="text-sm">{validationResult.validUntil}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-3">From (Consignor)</h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">GSTIN</p>
                      <p className="text-sm">{validationResult.fromGstin}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm">{validationResult.fromName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Place</p>
                      <p className="text-sm">{validationResult.fromPlace}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">To (Consignee)</h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">GSTIN</p>
                      <p className="text-sm">{validationResult.toGstin}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm">{validationResult.toName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Place</p>
                      <p className="text-sm">{validationResult.toPlace}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Document & Transportation Details</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Document Type</p>
                    <p className="text-sm">{validationResult.documentType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Document Number</p>
                    <p className="text-sm">{validationResult.documentNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Document Date</p>
                    <p className="text-sm">{validationResult.documentDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Transporter Name</p>
                    <p className="text-sm">{validationResult.transporterName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Transporter ID</p>
                    <p className="text-sm">{validationResult.transporterId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Transport Mode</p>
                    <p className="text-sm">{validationResult.transportMode}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Vehicle Number</p>
                    <p className="text-sm">{validationResult.vehicleNumber}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Item Details</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>HSN Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Taxable Amount (₹)</TableHead>
                      <TableHead>Tax Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{validationResult.hsnCode}</TableCell>
                      <TableCell>{validationResult.productDesc}</TableCell>
                      <TableCell>{validationResult.quantity}</TableCell>
                      <TableCell>{parseInt(validationResult.taxableAmount).toLocaleString()}</TableCell>
                      <TableCell>{validationResult.taxRate}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-slate-50">
            <Button variant="outline">
              Print Details
            </Button>
            <Button>
              Download Certificate
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Validation Tips</h4>
            <ul className="list-disc list-inside text-sm text-blue-600/80 dark:text-blue-400/80 space-y-1">
              <li>Try 'EWB1001' as a sample e-waybill number to see a valid result</li>
              <li>Try 'EWB9999' to see an expired e-waybill error</li>
              <li>Any other input will show an invalid e-waybill error</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidateWaybill;
