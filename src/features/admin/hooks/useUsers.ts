import { useCallback } from 'react';
import { useUserStore } from '../store/userStore';
import type { UserRole } from '../types/admin.types';

export const useUsers = () => {
  const {
    users,
    isLoading,
    error,
    fetchUsers,
    updateUserRole,
    getUserById,
    getUsersByRole,
    getStats,
    clearError,
    reset,
  } = useUserStore();


  const loadUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  /*
   * Force refresh users from API
   */
  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  /*
   * Change user role
   */
  const changeRole = useCallback(async (userId: number, newRole: UserRole) => {
    return await updateUserRole(userId, newRole);
  }, [updateUserRole]);

  /*
   * Filter users by search query
   */
  const filterUsers = useCallback((
    searchQuery: string,
    roleFilter: 'all' | UserRole = 'all'
  ) => {
    const query = searchQuery.toLowerCase();
    
    return users.filter(user => {
      const matchesSearch = 
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users]);

  return {
    users,
    isLoading,
    error,
    loadUsers,
    refreshUsers,
    changeRole,
    filterUsers,
    getUserById,
    getUsersByRole,
    getStats,
    clearError,
    reset,
  };
};