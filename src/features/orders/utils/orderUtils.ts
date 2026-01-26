/**
 * Order Utilities
 * Centralized helpers for order status mapping and styling
 * Reused by: OrderManagement, RecentOrdersTable, Dashboard
 */

import type { OrderStatus } from '../types/order.types';

/**
 * Display status type for UI presentation
 * Maps backend statuses to user-friendly labels
 */
export type DisplayStatus = 'completed' | 'processing' | 'pending' | 'cancelled';

/**
 * Maps backend order status to display status
 * Backend uses: pending, paid, shipped, cancelled
 * UI displays: pending, completed, processing, cancelled
 */
export const mapStatusForDisplay = (status: OrderStatus): DisplayStatus => {
  switch (status) {
    case 'paid':
      return 'completed';
    case 'shipped':
      return 'processing';
    case 'pending':
    case 'cancelled':
      return status;
    default:
      return 'pending';
  }
};

/**
 * Gets CSS class for status badge/select styling
 */
export const getStatusClass = (status: OrderStatus): string => {
  const displayStatus = mapStatusForDisplay(status);
  const classes: Record<DisplayStatus, string> = {
    completed: 'status--completed',
    processing: 'status--processing',
    pending: 'status--pending',
    cancelled: 'status--cancelled',
  };
  return classes[displayStatus];
};

/**
 * Gets display label for status (capitalized)
 */
export const getStatusLabel = (status: OrderStatus): string => {
  const displayStatus = mapStatusForDisplay(status);
  return displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1);
};

/**
 * Status options for select dropdowns
 */
export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'paid', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

/**
 * Calculate item count from order
 * Handles both OrderItems and Products relationships
 */
export const getOrderItemCount = (order: {
  OrderItems?: Array<{ quantity: number }>;
  Products?: Array<unknown>;
}): number => {
  if (order.OrderItems) {
    return order.OrderItems.reduce((sum, item) => sum + item.quantity, 0);
  }
  if (order.Products) {
    return order.Products.length;
  }
  return 0;
};