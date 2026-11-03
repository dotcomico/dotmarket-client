import React from 'react';
import type { Order } from '../../types/order.types';
import { getOrderItemCount, getStatusClass, getStatusLabel } from '../../utils/orderUtils';
import { formatDate } from '../../../../utils/formatters'
import './OrderCard.css'


interface OrderCardProps {
    order: Order;
    onClick: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
    // The whole card is the click target, so expose it as a button to
    // keyboard and screen-reader users (Enter/Space, like a native button).
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const { key } = event;
        if (key === 'Enter' || key === ' ') {
            event.preventDefault();
            onClick(order);
        }
    };

    return (
        <div
            className="order-card"
            onClick={() => onClick(order)}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`View details for order #${order.id}, ${getStatusLabel(order.status)}, total $${order.totalAmount.toFixed(2)}`}
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

            {order.Products && order.Products.length > 0 && (
                <div className="order-card__products">
                    {order.Products.slice(0, 4).map((product, index) => (
                        <div key={product.id} className="order-card__product-thumb">
                            {product.image ? (
                                <img src={product.image} alt={product.name} />
                            ) : (
                                <span className="order-card__product-placeholder">📦</span>
                            )}
                            {index === 3 && order.Products && order.Products.length > 4 && (
                                <span className="order-card__product-more">
                                    +{order.Products.length - 4}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderCard;