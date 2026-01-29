import { useCallback } from 'react';
import { useOrderStore } from '../../../store/orderStore';
import { useCartStore } from '../../../store/cartStore';
import type { CreateOrderData, OrderStatus } from '../types/order.types';

/*
 * Custom hook for order operations
 * Provides a clean API for working with orders
 */

export const useOrders = () => {
  const {
    orders,currentUserOrders,
    currentOrder,
    isLoading,
    error,
    fetchOrders,
    fetchOrdersOfCurrentUser,
    fetchOrderById,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    getTotalSpent,
    getOrdersCount,
    clearError,
    clearCurrentOrder,
    reset,
  } = useOrderStore();

  const { clearCart } = useCartStore();

  /*
   * Place order (Checkout)
   */
  const placeOrder = useCallback(async (address: string) => {
    const cartItems = useCartStore.getState().items;

    if (cartItems.length === 0) {
      return {
        success: false,
        error: 'Cart is empty'
      };
    }

    const orderData: CreateOrderData = {
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      })),
      address
    };

    const result = await createOrder(orderData);

    // Clear cart on successful order
    if (result.success) {
      clearCart();
    }

    return result;
  }, [createOrder, clearCart]);

  /*
   * Load order history
   */
  const loadOrders = useCallback(async () => {
    // Skip if already loading or if we have data
    if (isLoading) return;
    
    await fetchOrders();
  }, [fetchOrders, isLoading]);

  /*
   * Force refresh orders from API
   */
  const refreshOrders = useCallback(async () => {
    await fetchOrders();
  }, [fetchOrders]);

  /*
   * Load specific order details
   */
  const loadOrderDetails = useCallback(async (orderId: number) => {
    // Check if already in state
    const existingOrder = getOrderById(orderId);
    if (existingOrder) {
      return existingOrder;
    }
    // Fetch from API
    return await fetchOrderById(orderId);
  }, [getOrderById, fetchOrderById]);

  /*
   * Change order status (Admin/Manager only)
   */
  const changeOrderStatus = useCallback(async (orderId: number, newStatus: OrderStatus) => {
    return await updateOrderStatus(orderId, newStatus);
  }, [updateOrderStatus]);

  /*
   * Get orders by status - memoized helpers
   */
  const getPendingOrders = useCallback(() => getOrdersByStatus('pending'), [getOrdersByStatus]);
  const getShippedOrders = useCallback(() => getOrdersByStatus('shipped'), [getOrdersByStatus]);
  const getCompletedOrders = useCallback(() => getOrdersByStatus('paid'), [getOrdersByStatus]);
  const getCancelledOrders = useCallback(() => getOrdersByStatus('cancelled'), [getOrdersByStatus]);

  /*
   * Get user's order statistics
   */
  const getOrderStats = useCallback(() => ({
    totalOrders: getOrdersCount(),
    totalSpent: getTotalSpent(),
    pendingCount: getPendingOrders().length,
    shippedCount: getShippedOrders().length,
    completedCount: getCompletedOrders().length,
  }), [getOrdersCount, getTotalSpent, getPendingOrders, getShippedOrders, getCompletedOrders]);

  return {
    // State
    orders,
    currentOrder,
    isLoading,
    error,

    // Actions
    placeOrder,
    loadOrders,
    refreshOrders,
    loadOrderDetails,
    changeOrderStatus,
    clearError,
    clearCurrentOrder,
    reset,

    // Helpers
    getOrderById,
    getPendingOrders,
    getShippedOrders,
    getCompletedOrders,
    getCancelledOrders,
    getOrderStats,
    getTotalSpent,
  };
};