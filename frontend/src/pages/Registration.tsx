import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Loader2, UserPlus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Create a schema for form validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.", 
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone_number: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }).optional(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

interface EmailEligibility {
  type: 'superadmin' | 'organization_admin' | 'new_user';
  canRegister: boolean;
  isRestricted?: boolean;
  message: string;
}

const Registration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailEligibility, setEmailEligibility] = useState<EmailEligibility | null>(null);
  const [emailChecked, setEmailChecked] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch email field for automatic eligibility checking
  const watchedEmail = form.watch("email");

  // Debounced email eligibility check
  const checkEmailEligibility = useCallback(async (email: string) => {
    if (!email) {
      setEmailEligibility(null);
      setEmailChecked(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailEligibility(null);
      setEmailChecked(false);
      return;
    }

    setIsCheckingEmail(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/auth/register/check-email`, {
        email
      });

      if (response.data.success) {
        setEmailEligibility(response.data.data);
        setEmailChecked(true);
      }
    } catch (error) {
      console.error("Email check error:", error);
      setEmailEligibility(null);
      setEmailChecked(false);
    } finally {
      setIsCheckingEmail(false);
    }
  }, [API_URL]);

  // Debounce email checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (watchedEmail) {
        checkEmailEligibility(watchedEmail);
      } else {
        setEmailEligibility(null);
        setEmailChecked(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [watchedEmail, checkEmailEligibility]);

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    if (!emailChecked || !emailEligibility) {
      toast.error("Please wait for email eligibility check to complete");
      return;
    }

    if (!emailEligibility.canRegister) {
      toast.error("This email is not eligible for registration");
      return;
    }

    setIsLoading(true);
    
    try {
      // Register user
      const response = await axios.post(`${API_URL}/api/auth/register/user`, {
        name: values.name,
        email: values.email,
        phone_number: values.phone_number || null,
        password: values.password
      });

      if (response.data.success) {
        toast.success("Registration successful! Please login.");
        navigate('/login');
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Registration failed. Please try again.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getEligibilityIcon = () => {
    if (!emailEligibility) return null;
    
    if (emailEligibility.canRegister) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getEligibilityColor = () => {
    if (!emailEligibility) return "border-gray-200";
    
    if (emailEligibility.canRegister) {
      return "border-green-200 bg-green-50";
    } else {
      return "border-red-200 bg-red-50";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-bizblue-500" />
          </div>
          <h2 className="mt-4 text-3xl font-bold bg-gradient-to-r from-bizblue-500 to-bizteal-500 bg-clip-text text-transparent">BizSuite</h2>
          <p className="mt-2 text-sm text-gray-600">
            Comprehensive Business Management Software
          </p>
        </div>
        
        <Card className="shadow-xl border-slate-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          autoComplete="name"
                          className="bg-white"
                          disabled={isLoading}
                        />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="relative">
                            <Input 
                              type="email" 
                              placeholder="john@example.com" 
                              {...field} 
                              autoComplete="email"
                              className="bg-white pr-10"
                              disabled={isLoading}
                            />
                            {isCheckingEmail && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                              </div>
                              )}
                          </div>
                          
                          {emailEligibility && (
                            <Alert className={`${getEligibilityColor()}`}>
                              <div className="flex items-center gap-2">
                                {getEligibilityIcon()}
                                <AlertDescription className="text-sm">
                                  <strong>{emailEligibility.type === 'superadmin' ? 'Superadmin' : 
                                          emailEligibility.type === 'organization_admin' ? 'Organization Admin' : 
                                          'New User'}:</strong> {emailEligibility.message}
                                  {emailEligibility.isRestricted && (
                                    <div className="mt-1 text-xs text-orange-600">
                                      <AlertCircle className="h-3 w-3 inline mr-1" />
                                      This superadmin account has restricted organization creation privileges.
                                    </div>
                                  )}
                                </AlertDescription>
                              </div>
                            </Alert>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="+1234567890" 
                          {...field} 
                          autoComplete="tel"
                          className="bg-white"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          {...field} 
                          autoComplete="new-password"
                          className="bg-white"
                          disabled={isLoading}
                        /> 
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          {...field} 
                          autoComplete="new-password"
                          className="bg-white"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              
              <CardFooter className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full py-6 bg-gradient-to-r from-bizblue-500 to-bizteal-500 hover:from-bizblue-600 hover:to-bizteal-600" 
                  disabled={isLoading || !emailChecked || !emailEligibility?.canRegister || isCheckingEmail}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
                
                {isCheckingEmail && (
                  <p className="text-xs text-center text-gray-500">
                    Checking email eligibility...
                  </p>
                )}
                
                {!emailChecked && !isCheckingEmail && watchedEmail && (
                  <p className="text-xs text-center text-gray-500">
                    Please enter a valid email address
                  </p>
                )}
                
                <div className="text-center text-sm text-slate-500">
                  <p>
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-bizblue-500 hover:text-bizblue-700">
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
