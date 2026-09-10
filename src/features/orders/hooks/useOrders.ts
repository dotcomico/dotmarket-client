import { useCallback } from 'react';
import { useOrderStore } from '../../../store/orderStore';
import type { Order, OrderStatus } from '../types/order.types';

/**
 * useOrders - admin-facing hook wrapping useOrderStore.
 * Mirrors useMyOrders' shape but for the admin order list: houses the
 * search/status filtering and stats OrderManagement previously computed
 * inline with useMemo, on top of the store's raw `orders` + actions.
 */
export const useOrders = () => {
  const {
    orders,
    /* The admin-list-specific request state, surfaced to consumers under the
       plain `isLoading` / `error` names. The store's shared pair is written by
       the customer/detail/create fetches too, so reading it here would let an
       unrelated order request spinner-out or error-out the admin screens. */
    isOrdersLoading,
    ordersError,
    ordersLoaded,
    fetchOrders,
    updateOrderStatus
  } = useOrderStore();

  /**
   * Filter orders by free-text search (id/customer/email/address) and status.
   */
  const filterOrders = useCallback(
    (searchQuery: string, statusFilter: 'all' | OrderStatus): Order[] => {
      return orders.filter(order => {
        const matchesSearch =
          order.id.toString().includes(searchQuery) ||
          order.User?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.User?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.address?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
      });
    },
    [orders]
  );

  /**
   * Summary counts for the admin stat tiles, keyed off the status options
   * already defined in orderUtils rather than duplicating status literals.
   */
  const getOrderStats = useCallback(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'shipped').length,
      completed: orders.filter(o => o.status === 'paid').length,
    };
  }, [orders]);

  return {
    // State
    orders,
    isLoading: isOrdersLoading,
    error: ordersError,
    /* Has `fetchOrders` succeeded at least once this session? Consumers that
       present an aggregate over `orders` must render it as unknown until this
       is true — `orders: []` before the first successful fetch is not zero. */
    ordersLoaded,

    // Actions
    fetchOrders,
    updateOrderStatus,

    // Helpers
    filterOrders,
    getOrderStats,
  };
};
