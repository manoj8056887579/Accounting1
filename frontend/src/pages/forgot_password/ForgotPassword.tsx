import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Shield, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      
      if (response.data.success) {
        setIsSuccess(true);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to send reset email');
      } else {
        setError('Failed to send reset email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              We've sent password reset instructions to {email}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Try another email
            </Button>
            <Link to="/login" className="w-full">
              <Button variant="link" className="w-full">
                Return to login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-bizblue-500" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and we'll send you instructions to reset your password
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </Button>
              
              <Link to="/login" className="w-full">
                <Button variant="link" className="w-full">
                  Back to login
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
