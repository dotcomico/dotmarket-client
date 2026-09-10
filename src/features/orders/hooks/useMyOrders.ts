import { useCallback, useMemo } from 'react';
import { useOrderStore } from '../../../store/orderStore';
import { computeOrderStats } from '../utils/orderStats';

/*
 * useMyOrders - Hook for current user's orders
 */
export const useMyOrders = () => {
  const {
    currentUserOrders,
    currentOrder,
    isLoading,
    error,
    fetchOrdersOfCurrentUser,
    fetchOrderById,
    getOrderById,
    clearError,
    clearCurrentOrder,
  } = useOrderStore();

  /*
   * Load current user's orders
   */
  const loadOrders = useCallback(async () => {
    if (isLoading) return;
    await fetchOrdersOfCurrentUser();
  }, [fetchOrdersOfCurrentUser, isLoading]);

  /*
   * Force refresh orders from API
   */
  const refreshOrders = useCallback(async () => {
    await fetchOrdersOfCurrentUser();
  }, [fetchOrdersOfCurrentUser]);

  /*
   * Load specific order details
   */
  const loadOrderDetails = useCallback(async (orderId: number) => {
    const existingOrder = getOrderById(orderId);
    if (existingOrder) {
      return existingOrder;
    }
    return await fetchOrderById(orderId);
  }, [getOrderById, fetchOrderById]);

  /*
   * Order statistics for the current user.
   *
   * Derived state, not a getter: it is keyed on the reactive `currentUserOrders`
   * slice, so it recomputes the moment the fetch resolves. Exposing a getter
   * here instead would freeze consumers on the pre-fetch (empty) values, since
   * zustand action identities are permanently stable.
   */
  const stats = useMemo(
    () => computeOrderStats(currentUserOrders),
    [currentUserOrders]
  );

  return {
    // State
    orders: currentUserOrders,
    currentOrder,
    isLoading,
    error,

    // Derived state
    stats,

    // Actions
    loadOrders,
    refreshOrders,
    loadOrderDetails,
    clearError,
    clearCurrentOrder,

    // Helpers
    getOrderById,
  };
};
