import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useOrderStore } from '../../../store/orderStore';
import { useCartStore } from '../../../store/cartStore';
import { authApi, type LoginCredentials, type RegisterData } from '../api/authApi';
import { PATHS } from '../../../routes/paths';
import { getErrorMessage, logError } from '../../../utils/errorHandler';

/**
 * Custom hook for authentication logic
 * const { login, register, logout, isLoading, error } = useAuth();
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const { setAuth, logout: clearAuth, isAuthenticated, user } = useAuthStore();

  // Get reset functions from other stores
  const resetOrders = useOrderStore((state) => state.reset);
  const clearCart = useCartStore((state) => state.clearCart);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call backend API
      const response = await authApi.login(credentials);
      // Clear previous user's data before setting new auth
      resetOrders();
      clearCart();
      // Store token & user in Zustand store (and localStorage via persist)
      setAuth(response.token, response.user);
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

  /*
   * Register function
   */
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register(data);
      // Clear any existing data for fresh user
      resetOrders();
      clearCart();
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

  /*
   * Logout function
   */
  const logout = () => {
    // Clear auth state
    clearAuth();
    // Clear user-specific data from other stores
    resetOrders();
    clearCart();
    // Clear localStorage for stores
    localStorage.removeItem('order-storage');
    localStorage.removeItem('cart-storage');
    // Call API logout (clears token)
    authApi.logout();
    // Redirect to login
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