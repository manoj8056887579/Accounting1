
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="bg-white"
                  placeholder="Enter your username"
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
              
              <div className="text-sm text-gray-600 border border-slate-200 rounded-lg p-3 bg-slate-50">
                <p className="font-medium mb-1">Demo Accounts:</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li><span className="font-medium">Admin (with Super Admin access):</span> admin / admin123</li>
                  <li>Cashier: cashier / cashier123</li>
                  <li>Accountant: accountant / accountant123</li>
                  <li>Inventory: inventory / inventory123</li>
                  <li>Purchase: purchase / purchase123</li>
                </ul>
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
              <div className="text-center text-sm text-slate-500">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register" className="font-medium text-bizblue-500 hover:text-bizblue-700">
                    Register now
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
