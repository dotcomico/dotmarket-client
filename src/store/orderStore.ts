import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OrderState, CreateOrderData } from '../features/orders/types/order.types';
import { orderApi } from '../features/orders/api/orderApi';
import { getErrorMessage, logError } from '../utils/errorHandler';

/*
 * Order Store - Manages orders state
  - orders: All orders (admin/manager)
  - currentUserOrders: user orders only (customer )
 */
export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      // State
      orders: [],
      currentUserOrders: [],
      currentOrder: null,
      isLoading: false,
      error: null,

      /*
       * Fetch all orders (Admin/Manager)
       */
      fetchOrders: async () => {
        if (get().isLoading) return;

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

      /*
       * Fetch current user's orders 
       */
      fetchOrdersOfCurrentUser: async () => {
        if (get().isLoading) return;

        set({ isLoading: true, error: null });

        try {
          const response = await orderApi.getAllOfCurrentUser();
          set({
            currentUserOrders: response.data,
            isLoading: false
          });
        } catch (error) {
          const errorMessage = getErrorMessage(error, 'Failed to load your orders');
          logError(error, 'orderStore.fetchOrdersOfCurrentUser');

          set({
            error: errorMessage,
            isLoading: false,
            currentUserOrders: []
          });
        }
      },

      /*
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

      /*
       * Create new order
       */
      createOrder: async (orderData: CreateOrderData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await orderApi.create(orderData);
          const newOrder = response.data;

          set(state => ({
            orders: [newOrder, ...state.orders],
            currentUserOrders: [newOrder, ...state.currentUserOrders],
            currentOrder: newOrder,
            isLoading: false
          }));

          return { success: true, order: newOrder };
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

      /*
       * Update order status (Admin/Manager)
       */
      updateOrderStatus: async (orderId: number, status) => {
        set({ error: null });

        try {
          const response = await orderApi.updateStatus(orderId, status);
          const updatedOrder = response.data;

          set(state => ({
            orders: state.orders.map(order =>
              order.id === orderId ? updatedOrder : order
            ),
            currentUserOrders: state.currentUserOrders.map(order =>
              order.id === orderId ? updatedOrder : order
            ),
            currentOrder: state.currentOrder?.id === orderId
              ? updatedOrder
              : state.currentOrder
          }));

          return { success: true, order: updatedOrder };
        } catch (error) {
          const errorMessage = getErrorMessage(error, 'Failed to update order status');
          logError(error, 'orderStore.updateOrderStatus');

          set({ error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      //  Helpers (Admin) 

      getOrderById: (orderId: number) => {
        const { orders, currentUserOrders } = get();
        return orders.find(o => o.id === orderId)
          || currentUserOrders.find(o => o.id === orderId);
      },

      getOrdersByStatus: (status) => {
        return get().orders.filter(order => order.status === status);
      },

      getTotalSpent: () => {
        return get().orders.reduce((sum, order) => sum + order.totalAmount, 0);
      },

      getOrdersCount: () => get().orders.length,

      //  Helpers ( User ) 

      getCurrentUserOrdersByStatus: (status) => {
        return get().currentUserOrders.filter(order => order.status === status);
      },

      getCurrentUserTotalSpent: () => {
        return get().currentUserOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      },

      getCurrentUserOrdersCount: () => get().currentUserOrders.length,

      //////////////////

      clearError: () => set({ error: null }),

      clearCurrentOrder: () => set({ currentOrder: null }),

      reset: () => set({
        orders: [],
        currentUserOrders: [],
        currentOrder: null,
        isLoading: false,
        error: null
      })
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({
        orders: state.orders,
        currentUserOrders: state.currentUserOrders
      })
    }
  )
);