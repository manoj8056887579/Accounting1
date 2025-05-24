
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Truck, Building, Box, FileCheck } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Form schema for E-Waybill generation
const formSchema = z.object({
  documentType: z.string(),
  documentNumber: z.string().min(1, "Document number is required"),
  documentDate: z.date(),
  transactionType: z.string(),
  fromGstin: z.string().min(15, "GSTIN must be 15 characters").max(15),
  fromTraderName: z.string().min(1, "Trader name is required"),
  fromAddress: z.string().min(1, "Address is required"),
  fromPincode: z.string().min(6, "Pincode must be 6 digits").max(6),
  fromPlace: z.string().min(1, "Place is required"),
  toGstin: z.string().min(15, "GSTIN must be 15 characters").max(15),
  toTraderName: z.string().min(1, "Trader name is required"),
  toAddress: z.string().min(1, "Address is required"),
  toPincode: z.string().min(6, "Pincode must be 6 digits").max(6),
  toPlace: z.string().min(1, "Place is required"),
  transporterName: z.string().min(1, "Transporter name is required"),
  transporterId: z.string().min(1, "Transporter ID is required"),
  transportMode: z.string(),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  approximateDistance: z.string().min(1, "Distance is required"),
  hsnCode: z.string().min(1, "HSN code is required"),
  productName: z.string().min(1, "Product name is required"),
  quantity: z.string().min(1, "Quantity is required"),
  taxableAmount: z.string().min(1, "Taxable amount is required"),
  taxRate: z.string().min(1, "Tax rate is required"),
});

const GenerateWaybill = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "invoice",
      transportMode: "road",
      documentDate: new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Here we would normally send the data to an API
    console.log(values);
    toast({
      title: "E-Waybill Generated Successfully",
      description: `E-Waybill for ${values.documentNumber} has been generated.`,
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6 border rounded-lg p-4 bg-card">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <FileCheck className="h-5 w-5" /> Document Details
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="invoice">Tax Invoice</SelectItem>
                          <SelectItem value="bill">Bill of Supply</SelectItem>
                          <SelectItem value="delivery">Delivery Challan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. INV-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Document Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transactionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="bill_to_ship_to">Bill To - Ship To</SelectItem>
                          <SelectItem value="combo">Combo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6 border rounded-lg p-4 bg-card">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Truck className="h-5 w-5" /> Transportation Details
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="transporterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transporter Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. ABC Transport" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transporterId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transporter ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 29AAACR5055K1ZK" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transportMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode of Transport</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="road">Road</SelectItem>
                          <SelectItem value="rail">Rail</SelectItem>
                          <SelectItem value="air">Air</SelectItem>
                          <SelectItem value="ship">Ship</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. KA01AB1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="approximateDistance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approx Distance (in KM)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6 border rounded-lg p-4 bg-card">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Building className="h-5 w-5" /> From Details (Consignor)
              </h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fromGstin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GSTIN</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 29AAACR5055K1ZK" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fromTraderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Name of Business</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. ABC Enterprises" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fromAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter complete address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fromPlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place/City</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Bangalore" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fromPincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 560001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 border rounded-lg p-4 bg-card">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Building className="h-5 w-5" /> To Details (Consignee)
              </h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="toGstin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GSTIN</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 29AAACR5055K1ZK" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toTraderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Name of Business</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. XYZ Enterprises" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter complete address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="toPlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place/City</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Chennai" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="toPincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 600001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 border rounded-lg p-4 bg-card">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Box className="h-5 w-5" /> Item Details
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="hsnCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HSN Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 8471" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mobile Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxableAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxable Amount (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tax rate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="12">12%</SelectItem>
                        <SelectItem value="18">18%</SelectItem>
                        <SelectItem value="28">28%</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between mt-4">
              <Button type="button" variant="outline">Add More Items</Button>
              <div className="text-right">
                <div className="flex justify-between text-sm">
                  <span>Total Taxable Value:</span>
                  <span className="font-medium">₹ 0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Tax Amount:</span>
                  <span className="font-medium">₹ 0.00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Grand Total:</span>
                  <span>₹ 0.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">Save as Draft</Button>
            <Button type="submit">Generate E-Waybill</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GenerateWaybill;
