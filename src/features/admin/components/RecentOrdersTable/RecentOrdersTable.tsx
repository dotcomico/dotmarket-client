import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../../../../store/orderStore';
import { formatDate } from '../../../../utils/formatters';
import { PATHS } from '../../../../routes/paths';
import type { OrderStatus } from '../../../../features/orders/types/order.types';
import './RecentOrdersTable.css';

// --- Helper Functions (Moved outside to keep component clean) ---

/**
 * Maps backend status to display status for CSS styling
 */
const mapStatusForDisplay = (status: OrderStatus): 'completed' | 'processing' | 'pending' | 'cancelled' => {
  if (status === 'paid') return 'completed';
  if (status === 'shipped') return 'processing';
  return status as 'pending' | 'cancelled';
};

/**
 * Returns the CSS class based on order status
 */
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

/**
 * Capitalizes the first letter for display
 */
const getStatusLabel = (status: OrderStatus) => {
  const displayStatus = mapStatusForDisplay(status);
  return displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1);
};


// --- Main Component ---

export const RecentOrdersTable = () => {
  const navigate = useNavigate();
  
  // Store Selectors
  const orders = useOrderStore((state) => state.orders);
  const isLoading = useOrderStore((state) => state.isLoading);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);

  // SAFE EFFECT: Only runs if orders are empty. 
  // Does NOT depend on isLoading, preventing the infinite loop.
  useEffect(() => {
    if (orders.length === 0) {
      fetchOrders();
    }
  }, [fetchOrders, orders.length]);

  // Derived State
  const recentOrders = orders.slice(0, 5);
  const hasOrders = recentOrders.length > 0;

  const handleViewAll = () => {
    navigate(PATHS.ADMIN.ORDERS);
  };

  // 1. Loading State (Only show if we have no data yet)
  if (isLoading && !hasOrders) {
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

  // 2. Main Render
  return (
    <div className="admin-card admin-card--large">
      <div className="admin-card__header">
        <h2>Recent Orders</h2>
        <button className="btn-link" onClick={handleViewAll}>View All</button>
      </div>
      
      {!hasOrders ? (
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
                      {getStatusLabel(order.status)}
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