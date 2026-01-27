import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../features/orders/hooks/useOrders';
import { formatDate } from '../../utils/formatters';
import { 
  getStatusClass, 
  getStatusLabel, 
  getOrderItemCount 
} from '../../features/orders/utils/orderUtils';
import { PATHS } from '../../routes/paths';
import type { Order } from '../../features/orders/types/order.types';
import './Orders.css';

/**
 * Customer Orders Page
 * Displays user's order history with status tracking
 * 
 * Reusing:
 * - useOrders hook from src/features/orders/hooks/useOrders.ts
 * - formatDate from src/utils/formatters.ts
 * - orderUtils from src/features/orders/utils/orderUtils.ts
 */
const Orders = () => {
  const navigate = useNavigate();
  const { 
    orders, 
    isLoading, 
    error, 
    loadOrders, 
    getOrderStats,
    clearError 
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Get order statistics
  const stats = useMemo(() => getOrderStats(), [orders, getOrderStats]);

  // Handle empty cart redirect to shopping
  const handleStartShopping = () => {
    navigate(PATHS.PRODUCTS);
  };

  // Handle retry on error
  const handleRetry = () => {
    clearError();
    loadOrders();
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Page Header */}
        <div className="orders-header">
          <h1 className="orders-header__title">My Orders</h1>
          <p className="orders-header__subtitle">
            Track and manage your order history
          </p>
        </div>

        {/* Order Stats Summary */}
        {orders.length > 0 && (
          <div className="orders-stats">
            <div className="orders-stat">
              <span className="orders-stat__value">{stats.totalOrders}</span>
              <span className="orders-stat__label">Total Orders</span>
            </div>
            <div className="orders-stat">
              <span className="orders-stat__value">${stats.totalSpent.toFixed(2)}</span>
              <span className="orders-stat__label">Total Spent</span>
            </div>
            <div className="orders-stat orders-stat--pending">
              <span className="orders-stat__value">{stats.pendingCount}</span>
              <span className="orders-stat__label">Pending</span>
            </div>
            <div className="orders-stat orders-stat--shipped">
              <span className="orders-stat__value">{stats.shippedCount}</span>
              <span className="orders-stat__label">Shipped</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="orders-error">
            <span className="orders-error__icon">⚠️</span>
            <span className="orders-error__message">{error}</span>
            <button className="orders-error__retry" onClick={handleRetry}>
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && orders.length === 0 ? (
          <div className="orders-loading">
            <div className="orders-loading__spinner" />
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="orders-empty">
            <div className="orders-empty__icon">📦</div>
            <h2 className="orders-empty__title">No orders yet</h2>
            <p className="orders-empty__text">
              When you place orders, they'll appear here for you to track.
            </p>
            <button 
              className="orders-empty__btn"
              onClick={handleStartShopping}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* Orders List */
          <div className="orders-list">
            {orders.map(order => (
              <div 
                key={order.id} 
                className="order-card"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="order-card__header">
                  <div className="order-card__id">Order #{order.id}</div>
                  <span className={`order-card__status ${getStatusClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="order-card__body">
                  <div className="order-card__info">
                    <div className="order-card__row">
                      <span className="order-card__label">Date</span>
                      <span className="order-card__value">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="order-card__row">
                      <span className="order-card__label">Items</span>
                      <span className="order-card__value">{getOrderItemCount(order)} items</span>
                    </div>
                    <div className="order-card__row">
                      <span className="order-card__label">Delivery</span>
                      <span className="order-card__value order-card__value--truncate">
                        {order.address || '—'}
                      </span>
                    </div>
                  </div>

                  <div className="order-card__total">
                    <span className="order-card__total-label">Total</span>
                    <span className="order-card__total-value">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Product Thumbnails Preview */}
                {order.Products && order.Products.length > 0 && (
                  <div className="order-card__products">
                    {order.Products.slice(0, 4).map((product, index) => (
                      <div key={product.id} className="order-card__product-thumb">
                        {product.image ? (
                          <img src={product.image} alt={product.name} />
                        ) : (
                          <span className="order-card__product-placeholder">📦</span>
                        )}
                        {index === 3 && order.Products!.length > 4 && (
                          <div className="order-card__product-more">
                            +{order.Products!.length - 4}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="order-card__footer">
                  <button className="order-card__view-btn">
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="order-modal" onClick={(e) => e.stopPropagation()}>
              <div className="order-modal__header">
                <h2>Order #{selectedOrder.id}</h2>
                <button 
                  className="order-modal__close"
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </button>
              </div>

              <div className="order-modal__body">
                {/* Status Banner */}
                <div className={`order-modal__status-banner ${getStatusClass(selectedOrder.status)}`}>
                  <span className="order-modal__status-icon">
                    {selectedOrder.status === 'paid' && '✓'}
                    {selectedOrder.status === 'shipped' && '🚚'}
                    {selectedOrder.status === 'pending' && '⏳'}
                    {selectedOrder.status === 'cancelled' && '✕'}
                  </span>
                  <span className="order-modal__status-text">
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>

                {/* Order Info */}
                <div className="order-modal__section">
                  <h3>Order Information</h3>
                  <div className="order-modal__info-grid">
                    <div className="order-modal__info-item">
                      <span className="order-modal__info-label">Order Date</span>
                      <span className="order-modal__info-value">
                        {formatDate(selectedOrder.createdAt)}
                      </span>
                    </div>
                    <div className="order-modal__info-item">
                      <span className="order-modal__info-label">Total Amount</span>
                      <span className="order-modal__info-value order-modal__info-value--highlight">
                        ${selectedOrder.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="order-modal__info-item order-modal__info-item--full">
                      <span className="order-modal__info-label">Delivery Address</span>
                      <span className="order-modal__info-value">
                        {selectedOrder.address || 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {selectedOrder.Products && selectedOrder.Products.length > 0 && (
                  <div className="order-modal__section">
                    <h3>Items ({selectedOrder.Products.length})</h3>
                    <div className="order-modal__items">
                      {selectedOrder.Products.map(product => (
                        <div key={product.id} className="order-modal__item">
                          <div className="order-modal__item-image">
                            {product.image ? (
                              <img src={product.image} alt={product.name} />
                            ) : (
                              <span className="order-modal__item-placeholder">📦</span>
                            )}
                          </div>
                          <div className="order-modal__item-info">
                            <span className="order-modal__item-name">{product.name}</span>
                            <span className="order-modal__item-price">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="order-modal__footer">
                <button 
                  className="order-modal__btn order-modal__btn--secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
                <button 
                  className="order-modal__btn order-modal__btn--primary"
                  onClick={handleStartShopping}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;