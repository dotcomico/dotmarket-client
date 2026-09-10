
// API
export { orderApi } from './api/orderApi';

// Hooks
export { useOrders } from './hooks/useOrders';

/* Aggregation
   The single frontend definition of "money that counts as revenue", and the
   single reducer built on it. Anything showing a total-spent / revenue figure
   must go through these instead of re-listing statuses inline. */
export { REVENUE_ORDER_STATUSES } from './utils/orderUtils';
export { computeOrderStats } from './utils/orderStats';

// Types
export type {
  Order,
  OrderItem,
  OrderStatus,
  CreateOrderData,
  OrderState,
  OrderStatsSummary,
} from './types/order.types';