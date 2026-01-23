import { useEffect, useMemo } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader/AdminHeader';
import { DashboardStats } from '../../features/admin/components/DashboardStats/DashboardStats';
import { RecentOrdersTable } from '../../features/admin/components/RecentOrdersTable/RecentOrdersTable';
import { LowStockAlert } from '../../features/admin/components/LowStockAlert/LowStockAlert';
import { QuickStatsGrid } from '../../features/admin/components/QuickStatsGrid/QuickStatsGrid';
import { useProductStore } from '../../features/products';
import './Dashboard.css';

const Dashboard = () => {
  const { products, fetchProducts } = useProductStore();

  // Fetch products if not already loaded
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  // Calculate stats using useMemo to avoid recalculation on every render
  const stats = useMemo(() => {
    const lowStockCount = products.filter(p => p.stock < 10).length;
    const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    return {
      totalRevenue,
      totalOrders: 184, // TODO: Replace with actual order count from API
      lowStockCount,
      totalProducts: products.length
    };
  }, [products]);

  return (
    <>
      <AdminHeader title="Dashboard" />
      
      <main className="admin-main">
        {/* Stats Cards Grid */}
        <DashboardStats stats={stats} />

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Recent Orders */}
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