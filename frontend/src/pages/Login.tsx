import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield } from 'lucide-react';
import axios from 'axios';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import OTP from './otp/OTP';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [timer, setTimer] = useState(120);

  // If user is already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const orgData = JSON.parse(localStorage.getItem('organization_data') || '{}');
      
      if (userData.role === 'superadmin') {
        navigate('/superadmin');
      } else {
        navigate(`/${orgData.id}/dashboard`);
      }
    } 
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (showOTP && timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [showOTP, timer]);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/api/auth/google`, { 
        token: credentialResponse.credential
      });

      if (response.data.success) {
        const { user, organization, token } = response.data.data;
        
        // Store auth data in memory (not localStorage)
        sessionStorage.setItem('auth_token', token);
        sessionStorage.setItem('user_data', JSON.stringify(user));
        sessionStorage.setItem('organization_data', JSON.stringify(organization));
        
        // Redirect based on role
        if (user.role === 'superadmin') {
          navigate('/superadmin');
        } else {
          navigate(`/${organization.organization_id}/dashboard`);
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Google login failed. Please try again.');
      } else {
        setError('Google login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In failed. Please try again or use email/password login.');
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (!identifier || !password) {
      setError('Please enter your username, email, or phone number and password');
      setIsLoading(false);
      return;
    }
    
    try {
      // First, send OTP
      const otpResponse = await axios.post(`${API_URL}/api/auth/otp/send`, {
        identifier
      });

      if (otpResponse.data.success) {
        setShowOTP(true);
      } else {
        setError(otpResponse.data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
        setError(errorMessage);
        console.error('OTP Error:', err.response?.data);
      } else if (err instanceof Error) {
        setError(err.message || 'Login failed. Please try again.');
      } else {
        setError('Login failed. Please try again.'); 
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = async (otp: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Verifying OTP for identifier:', identifier); // Debug log

      const response = await axios.post(`${API_URL}/api/auth/otp/verify`, {
        identifier,
        otp
      });

      console.log('OTP verification response:', response.data); // Debug log

      if (response.data.success) {
        const { user, organization, token } = response.data.data;
        
        // Store auth data in memory (not localStorage)
        sessionStorage.setItem('auth_token', token);
        sessionStorage.setItem('user_data', JSON.stringify(user));
        sessionStorage.setItem('organization_data', JSON.stringify(organization));
        
        // Close OTP modal
        setShowOTP(false);
        
        // Redirect based on role
        if (user.role === 'superadmin') {
          navigate('/superadmin');
        } else {
          navigate(`/${organization.organization_id}/dashboard`);
        }
      } else {
        setError(response.data.message || 'OTP verification failed. Please try again.');
        // Keep the OTP modal open if verification fails
        setShowOTP(true);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || 'OTP verification failed. Please try again.';
        setError(errorMessage);
        console.error('OTP Verification Error:', err.response?.data);
        // Keep the OTP modal open if verification fails
        setShowOTP(true);
      } else {
        setError('OTP verification failed. Please try again.');
        // Keep the OTP modal open if verification fails
        setShowOTP(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/auth/otp/send`, {
        identifier
      });
      if (response.data.success) {
        setTimer(120); // Reset timer to 2 minutes
        // Optionally show a success message
      } else {
        setError(response.data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
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
            <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-fadeIn">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="identifier">Email</Label>
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="email"
                  className="bg-white"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="bg-white"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-3">
              <Button 
                type="submit" 
                className="w-full py-6 bg-gradient-to-r from-bizblue-500 to-bizteal-500 hover:from-bizblue-600 hover:to-bizteal-600" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div id="google-signin-button" className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="filled_blue"
                  shape="rectangular"
                  text="signin_with"
                  width="400"
                  context="signin"
                  prompt_parent_id="google-signin-button"
                  cancel_on_tap_outside={false}
                />
              </div>

              <div className="text-center text-sm text-slate-500">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register" className="font-medium text-bizblue-500 hover:text-bizblue-700">
                    Register now
                  </Link>
                </p>
                <p className="mt-2">
                  <Link to="/forgot-password" className="font-medium text-bizblue-500 hover:text-bizblue-700">
                    Forgot your password?
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* OTP Modal */}
      <Dialog open={showOTP} onOpenChange={setShowOTP}>
        <DialogContent className="sm:max-w-md p-6 rounded-xl shadow-2xl bg-white">
          <div className="flex flex-col items-center space-y-4">
            <Shield className="h-8 w-8 text-bizblue-500 mb-2" />
            <h3 className="text-xl font-semibold text-gray-800">Verify Your Identity</h3>
            <p className="text-sm text-gray-500 text-center">
              Enter the 6-digit code sent to your email or phone.<br />
              This helps us keep your account secure.
            </p>
            {/* OTP Input */}
            <OTP onComplete={handleOTPComplete} disabled={timer === 0} />
            {/* Error Message */}
            {error && (
              <div className="w-full text-center text-red-500 text-xs mt-2 animate-fadeIn">
                {error}
              </div>
            )}
            {/* Resend and Timer */}
            <div className="flex items-center justify-between w-full mt-2">
              <button
                className="text-bizblue-500 hover:underline text-xs"
                onClick={handleResendOTP}
                disabled={isLoading || timer > 0}
              >
                Resend Code
              </button>
              <span className="text-xs text-gray-400">
                {timer > 0 ? `${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}` : ''}
              </span>
            </div>
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center justify-center w-full mt-2">
                <Loader2 className="h-4 w-4 animate-spin text-bizblue-500" />
                <span className="ml-2 text-xs text-gray-500">Verifying...</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
