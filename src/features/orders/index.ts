/**
 * Orders Feature - Barrel Export
 * Centralized exports for the orders feature
 */

// API
export { orderApi } from './api/orderApi';

// Hooks
export { useOrders } from './hooks/useOrders';

// Types
export type {
  Order,
  OrderItem,
  OrderStatus,
  CreateOrderData,
  OrderState,
} from './types/order.types';