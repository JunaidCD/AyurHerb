import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    const result = await login(credentials);
    
    if (result.success) {
      toast({
        title: "Welcome to AyurHerb!",
        description: "Successfully logged in. Redirecting to collection form...",
        variant: "default",
      });
      
      // Redirect to main app after successful login
      setTimeout(() => {
        setLocation('/');
      }, 1000);
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setCredentials({
      username: 'field_collector',
      password: 'demo123'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <i className="fas fa-leaf text-2xl"></i>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary">AyurHerb</h1>
          <p className="text-muted-foreground">Ayurvedic Field Data Collection</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-primary">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to continue collecting herbal data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  <i className="fas fa-user mr-2 text-primary"></i>
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="h-12 text-base border-primary/20 focus:border-primary"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  <i className="fas fa-lock mr-2 text-primary"></i>
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="h-12 text-base border-primary/20 focus:border-primary"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-destructive/20">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Demo Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Demo Access</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base border-primary/20 hover:bg-primary/5"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              <i className="fas fa-flask mr-2 text-primary"></i>
              Use Demo Credentials
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            <i className="fas fa-shield-alt mr-1 text-primary"></i>
            Secure field data collection platform
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span>
              <i className="fas fa-mobile-alt mr-1"></i>
              Mobile Optimized
            </span>
            <span>
              <i className="fas fa-wifi-slash mr-1"></i>
              Offline Ready
            </span>
            <span>
              <i className="fas fa-sync mr-1"></i>
              Auto Sync
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
