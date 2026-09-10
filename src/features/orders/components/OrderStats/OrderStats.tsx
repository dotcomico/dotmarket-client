import React from 'react';
import type { OrderStatsSummary } from '../../types/order.types';
import './OrderStats.css';

interface OrderStatsProps {
    stats: OrderStatsSummary;
}

const OrderStats: React.FC<OrderStatsProps> = ({ stats }) => {
    return (
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
    );
};

export default OrderStats;