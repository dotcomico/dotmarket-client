import axiosInstance from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../api/apiConfig';
import type { User } from '../../../types';

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
  user: User;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.REGISTER,
      data
    );
    return response.data;
  },

  getMe: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ME);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

export type { LoginCredentials, RegisterData, AuthResponse };