import { useAuth } from '@/contexts/auth-context';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="bg-primary text-primary-foreground p-4 rounded-full inline-block">
            <i className="fas fa-leaf text-3xl"></i>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <i className="fas fa-spinner fa-spin text-primary text-xl"></i>
              <span className="text-lg font-medium text-primary">Loading AyurHerb...</span>
            </div>
            <p className="text-sm text-muted-foreground">Checking authentication status</p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (redirect will happen via useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render the protected content
  return children;
}
