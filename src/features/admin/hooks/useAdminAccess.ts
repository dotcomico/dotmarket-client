import { useAuthStore } from '../../../store/authStore';

/**
 * Custom hook for checking admin access and permissions
 */
export const useAdminAccess = () => {
  const { user, isAuthenticated } = useAuthStore();

  const isAdmin = isAuthenticated && user?.role === 'admin';
  const isManager = isAuthenticated && user?.role === 'manager';
  const isAdminOrManager = isAdmin || isManager;

  const hasAccess = (requiredRoles: ('admin' | 'manager' | 'customer')[]) => {
    if (!isAuthenticated || !user) return false;
    return requiredRoles.includes(user.role);
  };

  return {
    isAdmin,
    isManager,
    isAdminOrManager,
    hasAccess,
    user,
  };
};