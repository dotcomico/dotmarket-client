import { useEffect, useMemo } from 'react';
import './Dashboard.css';
import { useProductStore } from '../../../features/products';
import { useOrderStore } from '../../../store/orderStore';
import { AdminHeader } from '../../../components/admin/AdminHeader/AdminHeader';
import { DashboardStats, LowStockAlert, QuickStatsGrid, RecentOrdersTable } from '../../../features/admin';

/**
 * Admin Dashboard - Main overview page
 * 
 * Note: Order fetching is delegated to RecentOrdersTable to avoid double-fetch.
 * Dashboard only reads from the store state that RecentOrdersTable populates.
 */
const Dashboard = () => {
  const { products, fetchProducts } = useProductStore();
  
  // Access store state only - RecentOrdersTable handles fetching
  const orders = useOrderStore((state) => state.orders);

  // Fetch products on mount (only if empty)
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  // Calculate stats using useMemo - derived from store state
  const stats = useMemo(() => {
    const lowStockCount = products.filter(p => p.stock < 10).length;
    const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    
    // Calculate order stats directly from orders array
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const totalOrders = orders.length;
    
    // Calculate total revenue from completed orders (paid or shipped)
    const totalRevenue = orders
      .filter(order => order.status === 'paid' || order.status === 'shipped')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalRevenue,
      totalOrders,
      lowStockCount,
      totalProducts: products.length,
      inventoryValue,
      pendingOrders: pendingCount,
    };
  }, [products, orders]);

  return (
    <>
      <AdminHeader title="Dashboard" />
      
      <main className="admin-main">
        {/* Stats Cards Grid */}
        <DashboardStats stats={stats} />

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Recent Orders - handles its own data fetching */}
          <RecentOrdersTable />

          {/* Low Stock Alert */}
          <LowStockAlert products={products} lowStockCount={stats.lowStockCount} />
        </div>

        {/* Quick Stats Row */}
        <QuickStatsGrid stats={stats} />
      </main>
    </>
  );
};

export default Dashboard;