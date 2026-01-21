import axiosInstance from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../api/apiConfig';

// TypeScript interfaces for type safety
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'manager' | 'customer';
  };
}

/**
 * Auth API Service
 * Handles all authentication-related API calls
 */
export const authApi = {
  /**
   * Login user
   * POST /api/auth/login
   */
  login: async (credentials: LoginCredentials) => {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    return response.data;
  },

  /**
   * Register new user
   * POST /api/auth/register
   */
  register: async (data: RegisterData) => {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.REGISTER,
      data
    );
    return response.data;
  },

  /**
   * Get current user info
   * GET /api/auth/me
   * Requires authentication token
   */
  getMe: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ME);
    return response.data;
  },

  /**
   * Logout (client-side only, clears token)
   */
  logout: () => {
    localStorage.removeItem('token');
  }
};

export type { LoginCredentials, RegisterData, AuthResponse };