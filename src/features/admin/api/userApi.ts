import axiosInstance from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../api/apiConfig';
import type { UserRole } from '../types/admin.types';

/*
 * User Admin API Service
 * Handles all admin user management API calls
 */

// Response type for get all users
interface UsersResponse {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export const userApi = {
  /*
   * Admin only
   */
  getAll: async () => {
    const response = await axiosInstance.get<UsersResponse[]>(
      API_ENDPOINTS.ADMIN_USERS
    );
    return response;
  },

  /*
   * Admin only
   */
  updateRole: async (userId: number, role: UserRole) => {
    const response = await axiosInstance.put<{ message: string }>(
      API_ENDPOINTS.ADMIN_UPDATE_ROLE(userId),
      { role }
    );
    return response;
  },
};

export type { UsersResponse };