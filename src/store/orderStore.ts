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
      isOrdersLoading: false,
      ordersError: null,
      ordersLoaded: false,

      /*
       * Fetch all orders (Admin/Manager)
       *
       * Tracked with its OWN request state (`isOrdersLoading` / `ordersError` /
       * `ordersLoaded`) rather than the shared `isLoading` / `error`, for three
       * reasons:
       *  1. `isLoading` answers "is a request in flight", not "do we have
       *     data". `isLoading === false` with `orders === []` is exactly the
       *     ambiguous first-paint state, so it cannot tell a consumer whether
       *     0 orders means "unknown" or "genuinely none". `ordersLoaded` can.
       *  2. `isLoading` is also written by the customer/detail/create fetches,
       *     so an unrelated order request would put the admin order views into
       *     a spinner (and its error into their banner).
       *  3. The re-entrancy guard below must only skip a duplicate *admin
       *     orders* fetch. Guarding on the shared flag silently cancelled this
       *     fetch whenever any other order request happened to be in flight.
       *
       * `ordersLoaded` is intentionally NOT persisted (see `partialize`): a
       * rehydrated `orders` array is last session's data, so every mount must
       * re-fetch before any aggregate derived from it is presented as fact.
       */
      fetchOrders: async () => {
        if (get().isOrdersLoading) return;

        set({ isOrdersLoading: true, ordersError: null });

        try {
          const response = await orderApi.getAll();
          set({
            orders: response.data,
            isOrdersLoading: false,
            ordersLoaded: true
          });
        } catch (error) {
          const errorMessage = getErrorMessage(error, 'Failed to load orders');
          logError(error, 'orderStore.fetchOrders');

          set({
            ordersError: errorMessage,
            isOrdersLoading: false,
            // Stays false so consumers keep rendering "unknown" instead of
            // presenting the empty array below as a confident zero.
            ordersLoaded: false,
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
        // Admin-orders surface, so it reports through `ordersError` — the pair
        // the admin screens actually render — not the shared `error`.
        set({ ordersError: null });

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

          set({ ordersError: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      //  Helpers (Admin) 

      getOrderById: (orderId: number) => {
        const { orders, currentUserOrders } = get();
        return orders.find(o => o.id === orderId)
          || currentUserOrders.find(o => o.id === orderId);
      },

      /*
       * NOTE: there are deliberately no `getTotalSpent` / `getOrdersCount` /
       * `getOrdersByStatus` getters here. Aggregates over `orders` are derived
       * at render from the reactive slice (see `utils/orderStats.ts`): a
       * zustand action identity is permanently stable, so a `useMemo` keyed on
       * a getter never recomputes and freezes on the pre-fetch values. The old
       * `getTotalSpent` also summed EVERY status ($910.63 on the seed data)
       * while every other surface reports paid+shipped only ($133.63).
       */

      //////////////////

      clearError: () => set({ error: null, ordersError: null }),

      clearCurrentOrder: () => set({ currentOrder: null }),

      reset: () => set({
        orders: [],
        currentUserOrders: [],
        currentOrder: null,
        isLoading: false,
        error: null,
        isOrdersLoading: false,
        ordersError: null,
        ordersLoaded: false
      })
    }),
    {
      // Only the data is persisted. `ordersLoaded` is not, so a rehydrated
      // `orders` array can never be mistaken for a freshly-loaded one.
      name: 'order-storage',
      partialize: (state) => ({
        orders: state.orders,
        currentUserOrders: state.currentUserOrders
      })
    }
  )
);