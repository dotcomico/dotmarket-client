import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { authApi, type LoginCredentials, type RegisterData } from '../api/authApi';
import { PATHS } from '../../../routes/paths';
import { getErrorMessage, logError } from '../../../utils/errorHandler';

/**
 * Custom hook for authentication logic
 * 
 * Usage:
 * const { login, register, logout, isLoading, error } = useAuth();
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const { setAuth, logout: clearAuth, isAuthenticated, user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Login function
   * 1. Validates input
   * 2. Calls API
   * 3. Stores token & user
   * 4. Redirects to home
   */
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call backend API
      const response = await authApi.login(credentials);
      // Store token & user in Zustand store (and localStorage via persist)
      setAuth(response.token, response.user);
      // Also store token separately for axios interceptor
      localStorage.setItem('token', response.token);

      // Role-based redirect
      if (response.user.role === 'admin' || response.user.role === 'manager') {
        navigate(PATHS.ADMIN.DASHBOARD);
      } else {
        navigate(PATHS.HOME);
      }

      return { success: true };
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Login failed. Please try again.');
      logError(err, 'useAuth.login');
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register function
   * Similar to login but creates new account first
   */
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register(data);

      // Auto-login after registration
      setAuth(response.token, response.user);
      localStorage.setItem('token', response.token);

      navigate(PATHS.HOME);

      return { success: true };
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Registration failed. Please try again.');
      logError(err, 'useAuth.register');
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   * 1. Clears store
   * 2. Removes token from localStorage
   * 3. Redirects to login
   */
  const logout = () => {
    clearAuth();
    authApi.logout();
    navigate(PATHS.LOGIN);
  };

  return {
    // State
    isAuthenticated,
    user,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout
  };
};