import { StatCard } from '../../../../components/ui/StatCard/StatCard';
import type { ProductStats } from '../../../../features/products';
import type { OrderStatsSummary } from '../../../../features/orders';
import './DashboardStats.css';

/**
 * DashboardStats - the four headline metrics on the admin dashboard.
 *
 * The props are split by WHERE the number is allowed to come from, because
 * that distinction is the whole bug this component used to have:
 *
 * - `orderStats` is derived at render from the orders the client fully holds
 *   in `orderStore`. Deriving is correct there.
 * - `productStats` is computed by the backend in SQL, because the client only
 *   ever holds one paginated page of products and cannot answer a
 *   catalogue-wide question.
 *
 * BOTH are nullable, and `null` means "not known yet", never "zero". The
 * orders half used to be non-nullable, so before the fetch resolved (or after
 * it failed) the tiles painted a confident `$0.00` / `0` that was simply
 * false. A number the page cannot vouch for renders as UNKNOWN instead.
 *
 * Every subtext line is derived from real data. There are deliberately no
 * period-over-period deltas: the app stores no historical data, so any "+x%"
 * here would be fabricated.
 */
interface DashboardStatsProps {
  /** Derived from `orderStore.orders`; `null` until that fetch has succeeded. */
  orderStats: OrderStatsSummary | null;
  productStats: ProductStats | null;
}

/** Placeholder for a backend figure that hasn't arrived (or failed to). */
const UNKNOWN = '—';

/*
 * Always two decimals. The rounded form ("$134") used to sit here, which put
 * a revenue tile reading $134 on the same session as a user row reading
 * $133.63 for the exact same money - two renderings of one number that look
 * like a disagreement. Cents cost nothing at this scale.
 */
const formatMoney = (value: number) =>
  `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

export const DashboardStats = ({ orderStats, productStats }: DashboardStatsProps) => {
  /* Orders: "N pending" is a real, currently-true fact about the same array
     the count came from — the one honest subline the original component had.
     Suppressed entirely while the orders are unknown. */
  const ordersSubtext =
    orderStats && orderStats.totalOrders > 0 ? `${orderStats.pendingCount} pending` : undefined;

  const lowStockSubtext = () => {
    if (!productStats) return undefined;
    if (productStats.lowStockCount === 0) return 'All products stocked';
    /* outOfStockCount is a SUBSET of lowStockCount (stock 0 is also below the
       threshold) — reported alongside it, never added to it. */
    if (productStats.outOfStockCount > 0) return `${productStats.outOfStockCount} out of stock`;
    return `Below ${productStats.lowStockThreshold} units`;
  };

  return (
    <div className="admin-stats">
      <StatCard
        title="Total Revenue"
        /* `totalSpent` is paid + shipped only (REVENUE_ORDER_STATUSES) — the
           same money the admin user list reports per user. */
        value={orderStats ? formatMoney(orderStats.totalSpent) : UNKNOWN}
        /* No subtext: there is no historical data to compare against, and
           nothing else true to say that the Orders card doesn't already say. */
        color="#10b981"
      />
      <StatCard
        title="Total Orders"
        value={orderStats ? orderStats.totalOrders.toString() : UNKNOWN}
        subtext={ordersSubtext}
        color="#3b82f6"
      />
      <StatCard
        title="Low Stock Alert"
        value={productStats ? productStats.lowStockCount.toString() : UNKNOWN}
        subtext={lowStockSubtext()}
        color={productStats && productStats.lowStockCount > 0 ? '#ef4444' : '#10b981'}
      />
      <StatCard
        title="Total Products"
        value={productStats ? productStats.totalProducts.toString() : UNKNOWN}
        subtext={productStats ? `${formatMoney(productStats.inventoryValue)} inventory value` : undefined}
        color="#8b5cf6"
      />
    </div>
  );
};
