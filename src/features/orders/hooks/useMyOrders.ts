import { useCallback } from 'react';
import { useOrderStore } from '../../../store/orderStore';
import type { OrderStatus } from '../types/order.types';

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
    getCurrentUserOrdersByStatus,
    getCurrentUserTotalSpent,
    getCurrentUserOrdersCount,
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
   * Get orders filtered by status
   */
  const getOrdersByStatus = useCallback((status: OrderStatus) => {
    return getCurrentUserOrdersByStatus(status);
  }, [getCurrentUserOrdersByStatus]);

  /*
   * Memoized status helpers
   */
  const getPendingOrders = useCallback(() => getOrdersByStatus('pending'), [getOrdersByStatus]);
  const getShippedOrders = useCallback(() => getOrdersByStatus('shipped'), [getOrdersByStatus]);
  const getPaidOrders = useCallback(() => getOrdersByStatus('paid'), [getOrdersByStatus]);
  const getCancelledOrders = useCallback(() => getOrdersByStatus('cancelled'), [getOrdersByStatus]);

  /*
   * Get order statistics for current user
   */
  const getOrderStats = useCallback(() => ({
    totalOrders: getCurrentUserOrdersCount(),
    totalSpent: getCurrentUserTotalSpent(),
    pendingCount: getPendingOrders().length,
    shippedCount: getShippedOrders().length,
    paidCount: getPaidOrders().length,
    cancelledCount: getCancelledOrders().length,
  }), [
    getCurrentUserOrdersCount,
    getCurrentUserTotalSpent,
    getPendingOrders,
    getShippedOrders,
    getPaidOrders,
    getCancelledOrders
  ]);

  return {
    // State
    orders: currentUserOrders,
    currentOrder,
    isLoading,
    error,

    // Actions
    loadOrders,
    refreshOrders,
    loadOrderDetails,
    clearError,
    clearCurrentOrder,

    // Helpers
    getOrderById,
    getOrdersByStatus,
    getPendingOrders,
    getShippedOrders,
    getPaidOrders,
    getCancelledOrders,
    getOrderStats,
  };
};
