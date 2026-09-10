/**
 * Order statistics
 * Pure aggregation over an orders array — no store access, no React.
 *
 * Global rule this enforces: an aggregate over data the client already holds
 * must be derived from that data at render time, never read back out of a
 * captured store getter (a getter's identity is stable, so a `useMemo` keyed
 * on it never recomputes and the tiles freeze on their initial values).
 */

import type { Order, OrderStatsSummary } from '../types/order.types';
import { REVENUE_ORDER_STATUSES } from './orderUtils';

/**
 * Builds the summary shown by the customer <OrderStats /> tiles.
 *
 * - `totalOrders` counts every order, including cancelled ones (it is order
 *   history, not money).
 * - `totalSpent` sums only REVENUE_ORDER_STATUSES (paid + shipped), so a
 *   cancelled or still-pending order never inflates the amount.
 *
 * Pure and synchronous — safe to call on every render and trivially testable.
 */
export const computeOrderStats = (orders: Order[]): OrderStatsSummary =>
  orders.reduce<OrderStatsSummary>(
    (stats, order) => {
      stats.totalOrders += 1;

      if (REVENUE_ORDER_STATUSES.includes(order.status)) {
        stats.totalSpent += order.totalAmount;
      }

      if (order.status === 'pending') stats.pendingCount += 1;
      if (order.status === 'shipped') stats.shippedCount += 1;

      return stats;
    },
    { totalOrders: 0, totalSpent: 0, pendingCount: 0, shippedCount: 0 }
  );
