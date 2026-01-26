import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../../../../store/orderStore';
import { formatDate } from '../../../../utils/formatters';
import { PATHS } from '../../../../routes/paths';
import type { OrderStatus } from '../../../../features/orders/types/order.types';
import './RecentOrdersTable.css';

/**
 * RecentOrdersTable - Displays recent orders on the admin dashboard
 * Using store selectors directly to avoid infinite loops
 */
export const RecentOrdersTable = () => {
  const navigate = useNavigate();
  
  // Access store state and actions with individual selectors
  const orders = useOrderStore((state) => state.orders);
  const isLoading = useOrderStore((state) => state.isLoading);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);

  // Load orders on mount (only once)
  useEffect(() => {
    if (orders.length === 0) {
      fetchOrders();
    }
  }, [fetchOrders, orders.length]); // Empty dependency - run once on mount

  // Get only the 5 most recent orders
  const recentOrders = orders.slice(0, 5);

  // Map backend status to display status
  const mapStatusForDisplay = (status: OrderStatus): 'completed' | 'processing' | 'pending' | 'cancelled' => {
    if (status === 'paid') return 'completed';
    if (status === 'shipped') return 'processing';
    return status as 'pending' | 'cancelled';
  };

  const getStatusClass = (status: OrderStatus) => {
    const displayStatus = mapStatusForDisplay(status);
    const classes = {
      completed: 'status--completed',
      processing: 'status--processing',
      pending: 'status--pending',
      cancelled: 'status--cancelled'
    };
    return classes[displayStatus];
  };

  const handleViewAll = () => {
    navigate(PATHS.ADMIN.ORDERS);
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="admin-card admin-card--large">
        <div className="admin-card__header">
          <h2>Recent Orders</h2>
        </div>
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card admin-card--large">
      <div className="admin-card__header">
        <h2>Recent Orders</h2>
        <button className="btn-link" onClick={handleViewAll}>View All</button>
      </div>
      
      {recentOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📋</div>
          <div className="empty-state__text">No orders yet</div>
        </div>
      ) : (
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
                  <td>{order.User?.username || 'Unknown'}</td>
                  <td className="text-secondary">{formatDate(order.createdAt)}</td>
                  <td className="amount">${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`status ${getStatusClass(order.status)}`}>
                      {mapStatusForDisplay(order.status).charAt(0).toUpperCase() + mapStatusForDisplay(order.status).slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};