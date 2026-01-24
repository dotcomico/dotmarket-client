import { useState, useEffect } from 'react';
import { AdminHeader } from '../../../components/admin/AdminHeader/AdminHeader';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import type { OrderStatus } from '../../../features/admin/types/admin.types';
import './OrderManagement.css';
import { formatDate } from '../../../utils/formatters';

// Order type - extending the existing OrderStatus type
interface Order {
  id: number;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  items: number;
  amount: number;
  status: OrderStatus;
  address: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data - will be replaced with API calls
const mockOrders: Order[] = [
  { id: 12345, customer: { id: 1, name: 'John Doe', email: 'john@email.com' }, items: 3, amount: 125.00, status: 'completed', address: '123 Main St, NYC', createdAt: '2026-01-23T10:30:00', updatedAt: '2026-01-23T14:00:00' },
  { id: 12346, customer: { id: 2, name: 'Jane Smith', email: 'jane@email.com' }, items: 5, amount: 89.50, status: 'processing', address: '456 Oak Ave, LA', createdAt: '2026-01-23T09:15:00', updatedAt: '2026-01-23T09:15:00' },
  { id: 12347, customer: { id: 3, name: 'Bob Johnson', email: 'bob@email.com' }, items: 2, amount: 234.00, status: 'pending', address: '789 Pine Rd, Chicago', createdAt: '2026-01-22T16:45:00', updatedAt: '2026-01-22T16:45:00' },
  { id: 12348, customer: { id: 4, name: 'Alice Williams', email: 'alice@email.com' }, items: 7, amount: 156.75, status: 'completed', address: '321 Elm St, Boston', createdAt: '2026-01-22T11:20:00', updatedAt: '2026-01-23T08:00:00' },
  { id: 12349, customer: { id: 5, name: 'Charlie Brown', email: 'charlie@email.com' }, items: 1, amount: 98.20, status: 'cancelled', address: '654 Maple Dr, Seattle', createdAt: '2026-01-21T14:30:00', updatedAt: '2026-01-22T10:00:00' },
  { id: 12350, customer: { id: 6, name: 'Diana Ross', email: 'diana@email.com' }, items: 4, amount: 312.00, status: 'processing', address: '987 Cedar Ln, Miami', createdAt: '2026-01-24T08:00:00', updatedAt: '2026-01-24T08:00:00' },
];

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchQuery) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status styling - reusing pattern from RecentOrdersTable
  const getStatusClass = (status: OrderStatus) => {
    const classes: Record<OrderStatus, string> = {
      completed: 'status--completed',
      processing: 'status--processing',
      pending: 'status--pending',
      cancelled: 'status--cancelled'
    };
    return classes[status];
  };


  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ));
    // TODO: API call to update order status
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  // Calculate summary stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <>
      <AdminHeader title="Order Management" />
      
      <main className="admin-main">
        {/* Stats Summary */}
        <div className="order-stats">
          <div className="order-stat-card" onClick={() => setStatusFilter('all')}>
            <div className="order-stat-card__value">{stats.total}</div>
            <div className="order-stat-card__label">Total Orders</div>
          </div>
          <div className="order-stat-card order-stat-card--pending" onClick={() => setStatusFilter('pending')}>
            <div className="order-stat-card__value">{stats.pending}</div>
            <div className="order-stat-card__label">Pending</div>
          </div>
          <div className="order-stat-card order-stat-card--processing" onClick={() => setStatusFilter('processing')}>
            <div className="order-stat-card__value">{stats.processing}</div>
            <div className="order-stat-card__label">Processing</div>
          </div>
          <div className="order-stat-card order-stat-card--completed" onClick={() => setStatusFilter('completed')}>
            <div className="order-stat-card__value">{stats.completed}</div>
            <div className="order-stat-card__label">Completed</div>
          </div>
        </div>

        <div className="admin-card">
          {/* Header Section */}
          <div className="order-management-header">
            <div className="order-management-header__info">
              <h2>Orders</h2>
              <p className="subtitle">{filteredOrders.length} orders found</p>
            </div>
          </div>

          {/* Filters Section - Reusing SearchBar component */}
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
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Orders Table */}
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📋</div>
              <h3>No orders found</h3>
              <p>Try adjusting your search or filter criteria</p>
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
                          <div className="customer-name">{order.customer.name}</div>
                          <div className="customer-email">{order.customer.email}</div>
                        </div>
                      </td>
                      <td className="items-cell">{order.items} items</td>
                      <td className="amount-cell">${order.amount.toFixed(2)}</td>
                      <td className="date-cell">{formatDate(order.createdAt)}</td>
                      <td>
                        <select
                          className={`status-select ${getStatusClass(order.status)}`}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
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
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="modal modal--large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Order #{selectedOrder.id}</h3>
                <button 
                  className="modal-close"
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="order-details-grid">
                  <div className="order-detail-section">
                    <h4>Customer Information</h4>
                    <div className="detail-row">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{selectedOrder.customer.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedOrder.customer.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">{selectedOrder.address}</span>
                    </div>
                  </div>
                  
                  <div className="order-detail-section">
                    <h4>Order Information</h4>
                    <div className="detail-row">
                      <span className="detail-label">Items:</span>
                      <span className="detail-value">{selectedOrder.items} items</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Total:</span>
                      <span className="detail-value detail-value--highlight">${selectedOrder.amount.toFixed(2)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className={`status ${getStatusClass(selectedOrder.status)}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Created:</span>
                      <span className="detail-value">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Last Updated:</span>
                      <span className="detail-value">{formatDate(selectedOrder.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default OrderManagement;