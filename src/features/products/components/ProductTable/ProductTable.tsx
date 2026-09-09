import type { Product } from '../../types/product.types';

interface StockStatus {
  label: string;
  class: string;
}

interface ProductTableProps {
  products: Product[];
  getStockStatus: (stock: number) => StockStatus;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

/**
 * Presentational table of products. Owns no state — the page decides what to
 * show and what happens on click.
 *
 * Styling comes from the page-level `ProductManagement.css` (global
 * stylesheet, not CSS modules), which also defines the shared `.admin-table`
 * chrome.
 */
export const ProductTable = ({ products, getStockStatus, onEdit, onDelete }: ProductTableProps) => (
  <div className="table-wrapper">
    <table className="admin-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => {
          const stockStatus = getStockStatus(product.stock);

          return (
            <tr key={product.id}>
              <td>
                <div className="product-cell">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  ) : (
                    <div className="product-thumbnail product-thumbnail--placeholder">
                      📦
                    </div>
                  )}
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    {product.description && (
                      <div className="product-description">
                        {product.description.substring(0, 50)}
                        {product.description.length > 50 ? '...' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <span className="category-badge">
                  {product.category?.name || 'Uncategorized'}
                </span>
              </td>
              <td className="price-cell">${product.price.toFixed(2)}</td>
              <td className="stock-cell">{product.stock}</td>
              <td>
                <span className={`stock-status ${stockStatus.class}`}>
                  {stockStatus.label}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="action-btn action-btn--edit"
                    onClick={() => onEdit(product)}
                    title="Edit"
                    aria-label={`Edit ${product.name}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    className="action-btn action-btn--delete"
                    onClick={() => onDelete(product)}
                    title="Delete"
                    aria-label={`Delete ${product.name}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
