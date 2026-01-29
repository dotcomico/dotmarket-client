import React from 'react';
import { getStatusClass, getStatusLabel } from '../../utils/orderUtils';
import { formatDate } from '../../../../utils/formatters';
import type { Order } from '../../types/order.types';
import './OrderDetailsModal.css';

type ModalVariant = 'customer' | 'admin';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  variant?: ModalVariant;
  onContinueShopping?: () => void;
}


const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  variant = 'customer',
  onContinueShopping,
}) => {
  const isAdmin = variant === 'admin';

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div
        className={`order-modal ${isAdmin ? 'order-modal--admin' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="order-modal__header">
          <h2>Order #{order.id}</h2>
          <button className="order-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="order-modal__body">
          {/* Admin-only: Customer Information */}
          {isAdmin && (
            <div className="order-modal__section">
              <h3>Customer Information</h3>
              <div className="order-modal__info-grid">
                <div className="order-modal__info-item">
                  <span className="order-modal__info-label">Name</span>
                  <span className="order-modal__info-value">
                    {order.User?.username || 'Unknown'}
                  </span>
                </div>
                <div className="order-modal__info-item">
                  <span className="order-modal__info-label">Email</span>
                  <span className="order-modal__info-value">
                    {order.User?.email || '—'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Order Details - Both variants */}
          <div className="order-modal__section">
            <h3>Order Details</h3>
            <div className="order-modal__info-grid">
              <div className="order-modal__info-item">
                <span className="order-modal__info-label">Status</span>
                <span className={`order-modal__info-value ${getStatusClass(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="order-modal__info-item">
                <span className="order-modal__info-label">Order Date</span>
                <span className="order-modal__info-value">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="order-modal__info-item">
                <span className="order-modal__info-label">Total Amount</span>
                <span className="order-modal__info-value order-modal__info-value--highlight">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="order-modal__info-item order-modal__info-item--full">
                <span className="order-modal__info-label">Delivery Address</span>
                <span className="order-modal__info-value">
                  {order.address || 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items - Both variants */}
          {order.Products && order.Products.length > 0 && (
            <div className="order-modal__section">
              <h3>Items ({order.Products.length})</h3>
              <div className="order-modal__items">
                {order.Products.map((product) => (
                  <div key={product.id} className="order-modal__item">
                    {/* Customer variant shows images */}
                    {!isAdmin && (
                      <div className="order-modal__item-image">
                        {product.image ? (
                          <img src={product.image} alt={product.name} />
                        ) : (
                          <span className="order-modal__item-placeholder">📦</span>
                        )}
                      </div>
                    )}
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

        {/* Footer */}
        <div className="order-modal__footer">
          <button
            className="order-modal__btn order-modal__btn--secondary"
            onClick={onClose}
          >
            Close
          </button>
          {!isAdmin && onContinueShopping && (
            <button
              className="order-modal__btn order-modal__btn--primary"
              onClick={onContinueShopping}
            >
              Continue Shopping
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;