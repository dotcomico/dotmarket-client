import { useState, useMemo } from 'react';
import type { Product } from '../../types/product.types';
import { ProductCard } from '../ProductCard/ProductCard';
import './ProductGrid.css';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
  limit?: number;
  showMoreEnabled?: boolean;
  showMoreLabel?: string;
}

export const ProductGrid = ({
  products,
  isLoading = false,
  emptyMessage = "No products found",
  limit,
  showMoreEnabled = false,
  showMoreLabel = "Show More",
}: ProductGridProps) => {

  const [offset, setOffset] = useState(0);
  const initialLimit = limit ?? products.length;
  const totalVisibleCount = Math.min(initialLimit + offset, products.length);
  const visibleProducts = useMemo(() => {
    return products.slice(0, totalVisibleCount);
  }, [products, totalVisibleCount]);
  const hasMore = showMoreEnabled && totalVisibleCount < products.length;
  const remainingCount = products.length - totalVisibleCount;

  const handleShowMore = () => {
    if (limit) {
      setOffset((prev) => prev + limit);
    }
  };

  if (isLoading) {
    return (
      <div className="product-grid__loading">
        <div className="spinner" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid__empty">
        <div className="empty-icon">🛒</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="product-grid__show-more">
          <button
            className="product-grid__show-more-btn"
            onClick={handleShowMore}
          >
            {showMoreLabel} ({remainingCount} more)
          </button>
        </div>
      )}
    </div>
  );
};