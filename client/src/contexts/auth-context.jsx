import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, clearAllData } from '@/lib/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app and check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      // Initialize app (clear data if fresh start)
      await initializeApp();
      
      const token = localStorage.getItem('ayurherb_auth_token');
      const userData = localStorage.getItem('ayurherb_user_data');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem('ayurherb_auth_token');
          localStorage.removeItem('ayurherb_user_data');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual authentication logic
      const { username, password } = credentials;
      
      // For demo purposes, accept any username/password combination
      // In production, this would be an actual API call
      if (username && password) {
        const userData = {
          id: Date.now(),
          username,
          name: username.charAt(0).toUpperCase() + username.slice(1),
          role: 'field_collector',
          loginTime: new Date().toISOString()
        };
        
        const token = `ayurherb_token_${Date.now()}`;
        
        // Store in localStorage for persistence
        localStorage.setItem('ayurherb_auth_token', token);
        localStorage.setItem('ayurherb_user_data', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        return { success: true };
      } else {
        throw new Error('Username and password are required');
      }
    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    // Clear all data including collections when logging out
    await clearAllData();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
