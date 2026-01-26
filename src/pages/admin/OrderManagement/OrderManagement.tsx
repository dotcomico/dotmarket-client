import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AdminHeader } from '../../../components/admin/AdminHeader/AdminHeader';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import { useOrderStore } from '../../../store/orderStore';
import { formatDate } from '../../../utils/formatters';
import { 
  getStatusClass, 
  getStatusLabel, 
  getOrderItemCount,
  ORDER_STATUS_OPTIONS 
} from '../../../features/orders/utils/orderUtils';
import type { Order, OrderStatus } from '../../../features/orders/types/order.types';
import './OrderManagement.css';

/**
 * OrderManagement - Admin page for managing all orders
 * 
 * Reusing orderUtils from: src/features/orders/utils/orderUtils.ts
 * to avoid code duplication with RecentOrdersTable
 */
const OrderManagement = () => {
  // Access store with individual selectors to prevent re-render loops
  const orders = useOrderStore((state) => state.orders);
  const isLoading = useOrderStore((state) => state.isLoading);
  const error = useOrderStore((state) => state.error);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Track if initial fetch has been attempted to prevent infinite loops
  const hasFetchedRef = useRef(false);

  // Load orders on mount - only once
  useEffect(() => {
    if (!hasFetchedRef.current && orders.length === 0) {
      hasFetchedRef.current = true;
      fetchOrders();
    }
  }, [orders.length, fetchOrders]);

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toString().includes(searchQuery) ||
        order.User?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.User?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Calculate stats from orders array
  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'shipped').length,
    completed: orders.filter(o => o.status === 'paid').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }), [orders]);

  // Memoized handler to prevent recreation on each render
  const handleStatusChange = useCallback(async (orderId: number, newStatus: OrderStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (!result.success) {
      console.error('Failed to update order status:', result.error);
    }
  }, [updateOrderStatus]);

  const handleViewDetails = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  const handleRetry = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <>
      <AdminHeader title="Order Management" />
      
      <main className="admin-main">
        {/* Stats Summary */}
        <div className="order-stats">
          <div 
            className="order-stat-card" 
            onClick={() => setStatusFilter('all')}
          >
            <div className="order-stat-card__value">{stats.total}</div>
            <div className="order-stat-card__label">Total Orders</div>
          </div>
          <div 
            className="order-stat-card order-stat-card--pending" 
            onClick={() => setStatusFilter('pending')}
          >
            <div className="order-stat-card__value">{stats.pending}</div>
            <div className="order-stat-card__label">Pending</div>
          </div>
          <div 
            className="order-stat-card order-stat-card--processing" 
            onClick={() => setStatusFilter('shipped')}
          >
            <div className="order-stat-card__value">{stats.processing}</div>
            <div className="order-stat-card__label">Shipped</div>
          </div>
          <div 
            className="order-stat-card order-stat-card--completed" 
            onClick={() => setStatusFilter('paid')}
          >
            <div className="order-stat-card__value">{stats.completed}</div>
            <div className="order-stat-card__label">Completed</div>
          </div>
        </div>

        <div className="admin-card">
          <div className="order-management-header">
            <div className="order-management-header__info">
              <h2>Orders</h2>
              <p className="subtitle">{filteredOrders.length} orders found</p>
            </div>
          </div>

          <div className="filters-section">
            <div className="admin-search-wrapper">
              <SearchBar
                placeholder="Search by order ID, customer name or email..."
                navigateOnEnter={false}
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>

            <select
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | OrderStatus)}
            >
              <option value="all">All Status</option>
              {ORDER_STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
              <button onClick={handleRetry} className="btn-link">Retry</button>
            </div>
          )}

          {isLoading && orders.length === 0 ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📋</div>
              <h3>No orders found</h3>
              <p>
                {orders.length === 0 
                  ? 'No orders have been placed yet' 
                  : 'Try adjusting your search or filter criteria'}
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td className="order-id">#{order.id}</td>
                      <td>
                        <div className="customer-cell">
                          <div className="customer-name">
                            {order.User?.username || 'Unknown'}
                          </div>
                          <div className="customer-email">
                            {order.User?.email || '—'}
                          </div>
                        </div>
                      </td>
                      <td className="items-cell">
                        {getOrderItemCount(order)} items
                      </td>
                      <td className="amount-cell">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="date-cell">
                        {formatDate(order.createdAt)}
                      </td>
                      <td>
                        <select
                          className={`status-select ${getStatusClass(order.status)}`}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        >
                          {ORDER_STATUS_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn action-btn--view"
                            onClick={() => handleViewDetails(order)}
                            title="View Details"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal 
            order={selectedOrder} 
            onClose={handleCloseModal} 
          />
        )}
      </main>
    </>
  );
};

/**
 * Order Details Modal - Extracted as separate component for cleaner code
 */
interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

const OrderDetailsModal = ({ order, onClose }: OrderDetailsModalProps) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Order #{order.id}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="order-details-grid">
            <div className="order-detail-section">
              <h4>Customer Information</h4>
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">
                  {order.User?.username || 'Unknown'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">
                  {order.User?.email || '—'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">
                  {order.address || '—'}
                </span>
              </div>
            </div>
            
            <div className="order-detail-section">
              <h4>Order Information</h4>
              <div className="detail-row">
                <span className="detail-label">Items:</span>
                <span className="detail-value">
                  {getOrderItemCount(order)} items
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total:</span>
                <span className="detail-value detail-value--highlight">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status ${getStatusClass(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Created:</span>
                <span className="detail-value">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Last Updated:</span>
                <span className="detail-value">
                  {formatDate(order.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {order.Products && order.Products.length > 0 && (
            <div className="order-detail-section" style={{ marginTop: 'var(--spacing-xl)' }}>
              <h4>Order Items</h4>
              <div className="order-items-list">
                {order.Products.map(product => (
                  <div key={product.id} className="order-item">
                    <div className="order-item__info">
                      <span className="order-item__name">{product.name}</span>
                      <span className="order-item__price">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;