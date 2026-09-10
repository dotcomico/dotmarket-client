import type { LowStockProduct } from '../../../../features/products';
import './LowStockAlert.css';

interface LowStockAlertProps {
  /**
   * The backend's capped preview (up to 5, lowest stock first) — NOT the full
   * low-stock set, and NOT a slice of the products page. It used to be the
   * latter, which meant the panel could only ever surface low-stock items that
   * happened to land on page 1 of the paginated catalogue.
   */
  products: LowStockProduct[];
  /** True catalogue-wide low-stock count, from the same backend response. */
  lowStockCount: number;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const formatPrice = (price: number) =>
  `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const LowStockAlert = ({ products, lowStockCount, isLoading, error, onRetry }: LowStockAlertProps) => {
  /* The preview is capped, so say so instead of implying it is the whole list.
     Only shown when something is actually hidden. */
  const hiddenCount = lowStockCount - products.length;

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading stock levels...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={onRetry} className="btn-link">Retry</button>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state__icon">✅</div>
          <div className="empty-state__text">All products well stocked!</div>
        </div>
      );
    }

    return (
      <>
        <div className="low-stock-list">
          {products.map(product => (
            <div key={product.id} className="low-stock-item">
              <div className="low-stock-item__info">
                <div className="low-stock-item__name">{product.name}</div>
                <div className="low-stock-item__price">{formatPrice(product.price)}</div>
              </div>
              <div className="low-stock-item__stock">
                <span className={`stock-badge ${product.stock === 0 ? 'stock-badge--critical' : 'stock-badge--low'}`}>
                  {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                </span>
              </div>
            </div>
          ))}
        </div>

        {hiddenCount > 0 && (
          <p className="low-stock-footnote">
            Showing the {products.length} lowest-stock items of {lowStockCount}.
          </p>
        )}
      </>
    );
  };

  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <h2>Low Stock Alert</h2>
        {!isLoading && !error && <span className="badge badge--warning">{lowStockCount}</span>}
      </div>

      {renderBody()}
    </div>
  );
};
