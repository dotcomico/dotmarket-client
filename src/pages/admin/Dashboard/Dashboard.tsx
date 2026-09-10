import { useEffect, useMemo } from 'react';
import './Dashboard.css';
import { useProducts } from '../../../features/products';
import { computeOrderStats, useOrders } from '../../../features/orders';
import { AdminHeader } from '../../../components/admin/AdminHeader/AdminHeader';
import { DashboardStats, LowStockAlert, QuickStatsGrid, RecentOrdersTable } from '../../../features/admin';

/**
 * Admin dashboard.
 *
 * The rule this page follows: an aggregate over data the client does NOT
 * fully hold is computed by the backend; an aggregate over data the client
 * DOES hold is derived at render; and a figure that is not known yet renders
 * as unknown, never as a confident zero.
 *
 * - Product figures (total, low stock, inventory value) come from
 *   `GET /products/stats`. `productStore.products` is one paginated page
 *   (10 of 84), so reducing over it answered a question about 12% of the
 *   catalogue while presenting the result as the whole thing.
 * - Order figures are derived here from `orderStore.orders`, which holds
 *   every order for this admin view — so deriving them is correct and keeps
 *   the revenue tile consistent with the rest of the app.
 *
 * This page owns BOTH fetches. The orders one used to live in a `useEffect`
 * inside `<RecentOrdersTable />`, guarded by `orders.length === 0`, which had
 * three consequences: the tiles painted `$0.00` / `0` for a frame on a cold
 * load; a rejected fetch left those zeros on screen permanently with the
 * error surfaced nowhere; and a warm, persisted `order-storage` made the
 * guard false so revenue was never refreshed at all. Fetching here — always,
 * on mount — fixes all three, and the child is now presentational.
 *
 * The raw products page is deliberately NOT fetched: nothing on this screen
 * reads it now that `LowStockAlert` is fed by the stats response.
 */
const Dashboard = () => {
  const { stats, statsError, fetchStats } = useProducts();

  const {
    orders,
    error: ordersError,
    ordersLoaded,
    fetchOrders
  } = useOrders();

  /* Unconditional on mount, for both. A persisted `orders` array is last
     session's data, so it is never allowed to stand in for a fetch. */
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /*
   * Derived from the reactive `orders` slice, via the one shared reducer —
   * which is also the one place REVENUE_ORDER_STATUSES (paid + shipped) is
   * applied, so this tile and the admin user list's "total spent" column are
   * the same definition rather than two inline literals that merely happen to
   * agree today.
   *
   * `null` until `fetchOrders` has actually succeeded: an empty `orders` array
   * before/after a failed fetch is "unknown", not "zero", and `<DashboardStats />`
   * renders it as — exactly like the (backend-computed) product stats.
   */
  const orderStats = useMemo(
    () => (ordersLoaded ? computeOrderStats(orders) : null),
    [ordersLoaded, orders]
  );

  return (
    <>
      <AdminHeader title="Dashboard" />

      <main className="admin-main">
        {/* Stats Cards Grid — both halves nullable, both render — when unknown */}
        <DashboardStats orderStats={orderStats} productStats={stats} />

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Recent Orders — presentational; this page owns the fetch */}
          {/* "Loading" = we hold nothing authoritative and nothing has failed.
              Phrased on the data rather than on the in-flight flag on purpose:
              the very first paint happens BEFORE the effect above runs, so
              `isOrdersLoading` is still false there and a flag-based condition
              would flash "No orders yet" at a page that has simply not asked
              yet. Same reasoning for the stock panel below. */}
          <RecentOrdersTable
            orders={orders}
            isLoading={!ordersLoaded && !ordersError}
            error={ordersError}
            onRetry={fetchOrders}
          />

          {/* Low Stock Alert - capped preview + true count, both from the API */}
          <LowStockAlert
            products={stats?.lowStockProducts ?? []}
            lowStockCount={stats?.lowStockCount ?? 0}
            isLoading={!stats && !statsError}
            error={statsError}
            onRetry={fetchStats}
          />
        </div>

        {/* Quick Stats Row */}
        <QuickStatsGrid stats={stats} />
      </main>
    </>
  );
};

export default Dashboard;
