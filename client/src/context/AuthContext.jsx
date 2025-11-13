/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        const storedToken = authService.getStoredToken();

        if (storedUser && storedToken) {
          // Verify token is still valid by fetching user profile
          try {
            const response = await authService.getMe();
            if (response.success && response.data.user) {
              setUser(response.data.user);
              setIsAuthenticated(true);
            } else {
              // Token is invalid, clear storage
              await authService.logout();
              setUser(null);
              setIsAuthenticated(false);
            }
          } catch (error) {
            // Token is invalid or expired
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Sign up a new user
   */
  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.signup(userData);

      if (response.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success('Account created successfully!');
        return { success: true, user: response.data.user };
      }

      return { success: false, message: response.message };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create account';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);

      if (response.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return { success: true, user: response.data.user };
      }

      return { success: false, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to login';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Update user profile in context
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signup,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
