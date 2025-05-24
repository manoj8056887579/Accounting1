
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
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, CheckCircle, Loader2 } from 'lucide-react';

const formSchema = z.object({
  businessPhone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Phone number must not exceed 15 characters'),
  businessName: z.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(50, 'Business name must not exceed 50 characters'),
  businessCategory: z.string()
    .min(2, 'Business category must be at least 2 characters'),
  email: z.string()
    .email('Invalid email address'),
});

const WhatsAppSignup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessPhone: '',
      businessName: '',
      businessCategory: 'Retail',
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Simulate API call for WhatsApp Business API registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success response
      console.log('WhatsApp Business signup form submitted:', values);
      
      setSignupComplete(true);
      toast({
        title: "Registration Successful!",
        description: "Your WhatsApp Business Account request has been submitted. You'll receive a verification message shortly.",
      });
    } catch (error) {
      console.error('Error during WhatsApp signup:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-green-500" />
          WhatsApp Business API Registration
        </CardTitle>
        <CardDescription>
          Connect your business with customers through the WhatsApp Business API
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {signupComplete ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium">Registration Complete!</h3>
            <p className="text-muted-foreground">
              Your WhatsApp Business Account request has been submitted. 
              We'll send you a verification message to complete the setup.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSignupComplete(false)}
            >
              Register Another Account
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="businessPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 555 123 4567" {...field} />
                    </FormControl>
                    <FormDescription>
                      This phone number will be used for your WhatsApp Business account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Business Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This name will be visible to your customers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Retail, Restaurant, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" type="email" {...field} />
                    </FormControl>
                    <FormDescription>
                      We'll send important account updates to this email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : (
                  'Register WhatsApp Business Account'
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col border-t pt-4">
        <p className="text-xs text-muted-foreground">
          By registering, you agree to the WhatsApp Business Terms of Service and Privacy Policy.
          Standard messaging rates may apply.
        </p>
      </CardFooter>
    </Card>
  );
};

export default WhatsAppSignup;
