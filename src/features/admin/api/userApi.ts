import axiosInstance from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../api/apiConfig';
import type { UserRole } from '../types/admin.types';

/* User Admin API Service */

/**
 * One row of `GET /users` (admin only).
 *
 * `ordersCount` and `totalSpent` are computed per user in SQL by the backend -
 * they are aggregates over orders the admin client never loads, so they cannot
 * be derived here. Both are always present.
 */
interface UsersResponse {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  /** All orders ever placed by this user, cancelled included. */
  ordersCount: number;
  /** Sum of this user's paid + shipped orders only. */
  totalSpent: number;
}

export const userApi = {
  /* Admin only */
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