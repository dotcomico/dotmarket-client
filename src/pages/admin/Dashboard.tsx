import { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader/AdminHeader';
import { StatCard } from '../../components/ui/StatCard/StatCard';
import { useProductStore } from '../../features/products';
import './Dashboard.css';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  lowStockCount: number;
  totalProducts: number;
}

interface RecentOrder {
  id: number;
  customer: string;
  amount: number;
  status: 'completed' | 'processing' | 'pending' | 'cancelled';
  date: string;
}

const Dashboard = () => {
  const { products, fetchProducts } = useProductStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    lowStockCount: 0,
    totalProducts: 0
  });

  // Mock recent orders - replace with actual API call
  const recentOrders: RecentOrder[] = [
    { id: 12345, customer: 'John Doe', amount: 125.00, status: 'completed', date: '2026-01-23' },
    { id: 12346, customer: 'Jane Smith', amount: 89.50, status: 'processing', date: '2026-01-23' },
    { id: 12347, customer: 'Bob Johnson', amount: 234.00, status: 'pending', date: '2026-01-22' },
    { id: 12348, customer: 'Alice Williams', amount: 156.75, status: 'completed', date: '2026-01-22' },
    { id: 12349, customer: 'Charlie Brown', amount: 98.20, status: 'processing', date: '2026-01-21' },
  ];

  useEffect(() => {
    // Fetch products if not already loaded
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  useEffect(() => {
    // Calculate stats from actual product data
    if (products.length > 0) {
      const lowStock = products.filter(p => p.stock < 10).length;
      const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

      setStats({
        totalRevenue,
        totalOrders: 184, // Replace with actual order count
        lowStockCount: lowStock,
        totalProducts: products.length
      });
    }
  }, [products]);

  const getStatusClass = (status: RecentOrder['status']) => {
    const classes = {
      completed: 'status--completed',
      processing: 'status--processing',
      pending: 'status--pending',
      cancelled: 'status--cancelled'
    };
    return classes[status];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <AdminHeader title="Dashboard" />
      
      <main className="admin-main">
        {/* Stats Grid */}
        <div className="admin-stats">
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
            change="+12.5%"
            trend="up"
            color="#10b981"
          />
          <StatCard
            title="Active Orders"
            value={stats.totalOrders.toString()}
            change="+4.2%"
            trend="up"
            color="#3b82f6"
          />
          <StatCard
            title="Low Stock Alert"
            value={stats.lowStockCount.toString()}
            change={stats.lowStockCount > 0 ? "Action needed" : "All good"}
            trend={stats.lowStockCount > 0 ? "down" : "up"}
            color={stats.lowStockCount > 0 ? "#ef4444" : "#10b981"}
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts.toString()}
            change="+8.1%"
            trend="up"
            color="#8b5cf6"
          />
        </div>

        {/* Dashboard Grid - Recent Orders and Quick Actions */}
        <div className="dashboard-grid">
          {/* Recent Orders Table */}
          <div className="admin-card admin-card--large">
            <div className="admin-card__header">
              <h2>Recent Orders</h2>
              <button className="btn-link">View All</button>
            </div>
            
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td className="order-id">#{order.id}</td>
                      <td>{order.customer}</td>
                      <td className="text-secondary">{formatDate(order.date)}</td>
                      <td className="amount">${order.amount.toFixed(2)}</td>
                      <td>
                        <span className={`status ${getStatusClass(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2>Low Stock Alert</h2>
              <span className="badge badge--warning">{stats.lowStockCount}</span>
            </div>
            
            <div className="low-stock-list">
              {products
                .filter(p => p.stock < 10)
                .slice(0, 5)
                .map(product => (
                  <div key={product.id} className="low-stock-item">
                    <div className="low-stock-item__info">
                      <div className="low-stock-item__name">{product.name}</div>
                      <div className="low-stock-item__category">
                        {product.category?.name || 'Uncategorized'}
                      </div>
                    </div>
                    <div className="low-stock-item__stock">
                      <span className={`stock-badge ${product.stock === 0 ? 'stock-badge--critical' : 'stock-badge--low'}`}>
                        {product.stock} left
                      </span>
                    </div>
                  </div>
                ))}
              
              {stats.lowStockCount === 0 && (
                <div className="empty-state">
                  <div className="empty-state__icon">✅</div>
                  <div className="empty-state__text">All products well stocked!</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="dashboard-grid dashboard-grid--3col">
          <div className="admin-card admin-card--highlight">
            <div className="quick-stat">
              <div className="quick-stat__icon" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
                📦
              </div>
              <div className="quick-stat__info">
                <div className="quick-stat__value">{stats.totalProducts}</div>
                <div className="quick-stat__label">Total Products</div>
              </div>
            </div>
          </div>

          <div className="admin-card admin-card--highlight">
            <div className="quick-stat">
              <div className="quick-stat__icon" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                ⚠️
              </div>
              <div className="quick-stat__info">
                <div className="quick-stat__value">{stats.lowStockCount}</div>
                <div className="quick-stat__label">Need Restock</div>
              </div>
            </div>
          </div>

          <div className="admin-card admin-card--highlight">
            <div className="quick-stat">
              <div className="quick-stat__icon" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                💰
              </div>
              <div className="quick-stat__info">
                <div className="quick-stat__value">${(stats.totalRevenue / 1000).toFixed(1)}K</div>
                <div className="quick-stat__label">Inventory Value</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;