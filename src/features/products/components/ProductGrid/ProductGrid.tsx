import type { Product } from '../../types/product.types';
import { ProductCard } from '../ProductCard/ProductCard';
import './ProductGrid.css';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export const ProductGrid = ({ 
  products, 
  isLoading = false, 
  emptyMessage = "No products found" 
}: ProductGridProps) => {
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
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};