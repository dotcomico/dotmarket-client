import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../../utils/formatters';
import { PATHS } from '../../../../routes/paths';
import type { Order, OrderStatus } from '../../../../features/orders';
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

interface RecentOrdersTableProps {
  /** The full admin orders list; the table shows the first 5 itself. */
  orders: Order[];
  /** True only while the first successful load is still outstanding. */
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

/**
 * RecentOrdersTable - presentational.
 *
 * It used to fetch its own orders in a `useEffect` guarded by
 * `orders.length === 0`, which made it the *only* thing on the dashboard
 * loading orders — the page's revenue/order tiles silently depended on a
 * child's side effect, ran a paint behind it, and never refreshed at all when
 * a persisted `order-storage` made the guard false. The page owns that fetch
 * now (see `pages/admin/Dashboard`), so there is exactly one fetcher and the
 * tiles and this table always describe the same request.
 */
export const RecentOrdersTable = ({ orders, isLoading, error, onRetry }: RecentOrdersTableProps) => {
  const navigate = useNavigate();

  // Derived State
  const recentOrders = orders.slice(0, 5);
  const hasOrders = recentOrders.length > 0;

  const handleViewAll = () => {
    navigate(PATHS.ADMIN.ORDERS);
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading orders...</p>
        </div>
      );
    }

    /* A failed load must read as a failure, not as "no orders yet" — the
       dashboard tiles show — for the same reason. Mirrors LowStockAlert. */
    if (error) {
      return (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={onRetry} className="btn-link">Retry</button>
        </div>
      );
    }

    if (!hasOrders) {
      return (
        <div className="empty-state">
          <div className="empty-state__icon">📋</div>
          <div className="empty-state__text">No orders yet</div>
        </div>
      );
    }

    return (
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
    );
  };

  return (
    <div className="admin-card admin-card--large">
      <div className="admin-card__header">
        <h2>Recent Orders</h2>
        <button className="btn-link" onClick={handleViewAll}>View All</button>
      </div>

      {renderBody()}
    </div>
  );
};