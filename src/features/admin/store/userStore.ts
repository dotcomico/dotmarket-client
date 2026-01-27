import { create } from 'zustand';
import { userApi } from '../api/userApi';
import { getErrorMessage, logError } from '../../../utils/errorHandler';
import type { AdminUser, UserRole } from '../types/admin.types';

/*
 * User Store State Interface
 */
interface UserState {
  // State
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchUsers: () => Promise<void>;
  updateUserRole: (userId: number, role: UserRole) => Promise<{
    success: boolean;
    error?: string;
  }>;

  // Helpers
  getUserById: (userId: number) => AdminUser | undefined;
  getUsersByRole: (role: UserRole) => AdminUser[];
  getStats: () => {
    total: number;
    admins: number;
    managers: number;
    customers: number;
  };
  clearError: () => void;
  reset: () => void;
}

/*
 * User Store - Manages admin user management state
 */
export const useUserStore = create<UserState>((set, get) => ({
  // Initial State
  users: [],
  isLoading: false,
  error: null,

  /*
   * Fetch all users from API
   * Only accessible by admin users
   */
  fetchUsers: async () => {
    // Prevent duplicate fetches
    if (get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const response = await userApi.getAll();
      
      // Transform API response to AdminUser format
      // API returns basic user data, we extend with default values for admin fields
      const users: AdminUser[] = response.data.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        // These fields may not be available from API yet
        // They'll be populated when backend is extended
        ordersCount: 0,
        totalSpent: 0,
        lastActive: user.updatedAt,
      }));

      set({
        users,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to load users');
      logError(error, 'userStore.fetchUsers');

      set({
        error: errorMessage,
        isLoading: false,
        users: [],
      });
    }
  },

  /*
   * Update user role
   */
  updateUserRole: async (userId: number, role: UserRole) => {
    set({ error: null });

    try {
      await userApi.updateRole(userId, role);

      // Update local state optimistically
      set(state => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, role } : user
        ),
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to update user role');
      logError(error, 'userStore.updateUserRole');

      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /*
   * Get user by ID from local state
   */
  getUserById: (userId: number) => {
    return get().users.find(user => user.id === userId);
  },

  /*
   * Get users filtered by role
   */
  getUsersByRole: (role: UserRole) => {
    return get().users.filter(user => user.role === role);
  },

  /*
   * Calculate user statistics
   */
  getStats: () => {
    const users = get().users;
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      managers: users.filter(u => u.role === 'manager').length,
      customers: users.filter(u => u.role === 'customer').length,
    };
  },

  /*
   * Clear error state
   */
  clearError: () => {
    set({ error: null });
  },

  /*
   * Reset store to initial state
   */
  reset: () => {
    set({
      users: [],
      isLoading: false,
      error: null,
    });
  },
}));