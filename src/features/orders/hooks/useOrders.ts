import { useOrderStore } from '../../../store/orderStore';
import { useCartStore } from '../../../store/cartStore';
import type { CreateOrderData, OrderStatus } from '../types/order.types';

/**
 * Custom hook for order operations
 * Provides a clean API for working with orders
 * Reusing pattern from: src/features/cart/hooks/useCart.ts
 */

export const useOrders = () => {
  const {
    orders,
    currentOrder,
    isLoading,
    error,
    fetchOrders,
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

  /**
   * Place order (Checkout)
   * - Creates order from current cart
   * - Clears cart on success
   */
  const placeOrder = async (address: string) => {
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
  };

  /**
   * Load order history
   * Call on profile/orders page mount
   */
  const loadOrders = async () => {
    if (orders.length === 0 && !isLoading) {
      await fetchOrders();
    }
  };

  /**
   * Load specific order details
   */
  const loadOrderDetails = async (orderId: number) => {
    // Check if already in state
    const existingOrder = getOrderById(orderId);
    if (existingOrder) {
      return existingOrder;
    }

    // Fetch from API
    return await fetchOrderById(orderId);
  };

  /**
   * Change order status (Admin/Manager only)
   */
  const changeOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    return await updateOrderStatus(orderId, newStatus);
  };

  /**
   * Get orders by status
   */
  const getPendingOrders = () => getOrdersByStatus('pending');
  const getShippedOrders = () => getOrdersByStatus('shipped');
  const getCompletedOrders = () => getOrdersByStatus('paid');
  const getCancelledOrders = () => getOrdersByStatus('cancelled');

  /**
   * Get user's order statistics
   */
  const getOrderStats = () => ({
    totalOrders: getOrdersCount(),
    totalSpent: getTotalSpent(),
    pendingCount: getPendingOrders().length,
    shippedCount: getShippedOrders().length,
    completedCount: getCompletedOrders().length,
  });

  return {
    // State
    orders,
    currentOrder,
    isLoading,
    error,

    // Actions
    placeOrder,
    loadOrders,
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