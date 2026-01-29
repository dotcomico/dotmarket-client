import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyOrders } from '../../features/orders/hooks/useMyOrders';
import { PATHS } from '../../routes/paths';
import type { Order } from '../../features/orders/types/order.types';
import './Orders.css';
import OrderStats from '../../features/orders/components/OrderStats/OrderStats';
import OrderCard from '../../features/orders/components/OrderCard/OrderCard';
import OrderDetailsModal from '../../features/orders/components/OrderDetailsModal/OrderDetailsModal';

const Orders = () => {
  const navigate = useNavigate();
  const { orders, isLoading, error, refreshOrders, getOrderStats, clearError } = useMyOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      refreshOrders();
    }
  }, [refreshOrders]);

  const stats = useMemo(() => getOrderStats(), [getOrderStats]);

  const handleStartShopping = () => {
    navigate(PATHS.PRODUCTS);
  };

  const handleRetry = () => {
    clearError();
    hasFetchedRef.current = false;
    refreshOrders();
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1 className="orders-header__title">My Orders</h1>
          <p className="orders-header__subtitle">Track and manage your order history</p>
        </div>

        {orders.length > 0 && <OrderStats stats={stats} />}

        {error && (
          <div className="orders-error">
            <span className="orders-error__icon">⚠️</span>
            <span className="orders-error__message">{error}</span>
            <button className="orders-error__retry" onClick={handleRetry}>Try Again</button>
          </div>
        )}

        {isLoading && orders.length === 0 ? (
          <div className="orders-loading">
            <div className="orders-loading__spinner" />
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty__icon">📦</div>
            <h2 className="orders-empty__title">No orders yet</h2>
            <p className="orders-empty__text">
              When you place orders, they'll appear here for you to track.
            </p>
            <button className="orders-empty__btn" onClick={handleStartShopping}>Start Shopping</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} onClick={setSelectedOrder} />
            ))}
          </div>
        )}

         {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            variant="customer"
            onContinueShopping={handleStartShopping}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;