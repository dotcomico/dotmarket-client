import type { Order } from "../../../orders";
import { getOrderItemCount, getStatusClass, getStatusLabel } from "../../../orders/utils/orderUtils";


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
                <span className="detail-value">{order.User?.username || 'Unknown'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{order.User?.email || '—'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{order.address || '—'}</span>
              </div>
            </div>
            
            <div className="order-detail-section">
              <h4>Order Information</h4>
              <div className="detail-row">
                <span className="detail-label">Items:</span>
                <span className="detail-value">{getOrderItemCount(order)} items</span>
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
                      <span className="order-item__price">${product.price.toFixed(2)}</span>
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

export default OrderDetailsModal;