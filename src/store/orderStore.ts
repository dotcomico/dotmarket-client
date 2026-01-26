import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderState, CreateOrderData } from '../features/orders/types/order.types';
import { orderApi } from '../features/orders/api/orderApi';
import { getErrorMessage, logError } from '../utils/errorHandler';

/**
 * Order Store - Manages user orders and order history
 * 
 * Features:
 * - Fetches user's order history
 * - Creates new orders (checkout)
 * - Tracks order status
 * - Persists orders to localStorage
 * - Integrates with order API
 */
export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      // State
      orders: [],
      currentOrder: null,
      isLoading: false,
      error: null,

      /**
       * Fetch all orders for the current user
       * Admins/Managers see all orders via API
       */
      fetchOrders: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await orderApi.getAll();
          set({
            orders: response.data,
            isLoading: false
          });
        } catch (error) {
          const errorMessage = getErrorMessage(error, 'Failed to load orders');
          logError(error, 'orderStore.fetchOrders');

          set({
            error: errorMessage,
            isLoading: false,
            orders: []
          });
        }
      },

      /**
       * Fetch specific order by ID
       */
      fetchOrderById: async (orderId: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await orderApi.getById(orderId);
          set({
            currentOrder: response.data,
            isLoading: false
          });
          return response.data;
        } catch (error) {
          const errorMessage = getErrorMessage(error, 'Failed to load order details');
          logError(error, 'orderStore.fetchOrderById');

          set({
            error: errorMessage,
            isLoading: false,
            currentOrder: null
          });
          throw error;
        }
      },

      /**
       * Create new order (Checkout)
       * Clears cart on success
       */
      createOrder: async (orderData: CreateOrderData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await orderApi.create(orderData);

          // Add new order to the beginning of orders array
          set((state) => ({
            orders: [response.data, ...state.orders],
            currentOrder: response.data,
            isLoading: false
          }));

          return { success: true, order: response.data };
        } catch (error) {
          const errorMessage = getErrorMessage(error, 'Failed to create order');
          logError(error, 'orderStore.createOrder');

          set({
            error: errorMessage,
            isLoading: false
          });

          return { success: false, error: errorMessage };
        }
      },

      /**
       * Update order status (Admin/Manager only)
       */
      updateOrderStatus: async (orderId: number, status: Order['status']) => {
        set({ isLoading: true, error: null });

        try {
          const response = await orderApi.updateStatus(orderId, status);

          // Update order in state
          set((state) => ({
            orders: state.orders.map(order =>
              order.id === orderId ? response.data : order
            ),
            currentOrder: state.currentOrder?.id === orderId
              ? response.data
              : state.currentOrder,
            isLoading: false
          }));

          return { success: true, order: response.data };
        } catch (error) {
          const errorMessage = getErrorMessage(error, 'Failed to update order status');
          logError(error, 'orderStore.updateOrderStatus');

          set({
            error: errorMessage,
            isLoading: false
          });

          return { success: false, error: errorMessage };
        }
      },

      /**
       * Get order by ID from state (no API call)
       */
      getOrderById: (orderId: number) => {
        return get().orders.find(order => order.id === orderId);
      },

      /**
       * Get orders by status
       */
      getOrdersByStatus: (status: Order['status']) => {
        return get().orders.filter(order => order.status === status);
      },

      /**
       * Calculate total spent across all completed orders
       */
      getTotalSpent: () => {
        return get().orders
          .filter(order => order.status === 'paid')
          .reduce((total, order) => total + order.totalAmount, 0);
      },

      /**
       * Get orders count
       */
      getOrdersCount: () => {
        return get().orders.length;
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Clear current order
       */
      clearCurrentOrder: () => {
        set({ currentOrder: null });
      },

      /**
       * Reset entire store (logout scenario)
       */
      reset: () => {
        set({
          orders: [],
          currentOrder: null,
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'order-storage', // localStorage key
      partialize: (state) => ({
        orders: state.orders,
        currentOrder: state.currentOrder
      })
    }
  )
);