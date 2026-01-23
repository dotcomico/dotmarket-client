import type { Product } from '../../../../features/products/types/product.types';
import './LowStockAlert.css';

interface LowStockAlertProps {
  products: Product[];
  lowStockCount: number;
}

export const LowStockAlert = ({ products, lowStockCount }: LowStockAlertProps) => {
  const lowStockProducts = products.filter(p => p.stock < 10).slice(0, 5);

  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <h2>Low Stock Alert</h2>
        <span className="badge badge--warning">{lowStockCount}</span>
      </div>
      
      <div className="low-stock-list">
        {lowStockProducts.length > 0 ? (
          lowStockProducts.map(product => (
            <div key={product.id} className="low-stock-item">
              <div className="low-stock-item__info">
                <div className="low-stock-item__name">{product.name}</div>
                <div className="low-stock-item__category">
                  {product.category?.name || 'Uncategorized'}
                </div>
              </div>
              <div className="low-stock-item__stock">
                <span className={`stock-badge ${product.stock === 0 ? 'stock-badge--critical' : 'stock-badge--low'}`}>
                  {product.stock} left
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">✅</div>
            <div className="empty-state__text">All products well stocked!</div>
          </div>
        )}
      </div>
    </div>
  );
};