import type { Product } from '../types/product.types';

export interface ProductStockStatus {
  label: string;
  class: 'out' | 'low' | 'limited' | 'available';
  icon: string;
}

/**
 * Customer-facing stock badge for the product detail page (icon + tiered
 * label + "N left" wording). Deliberately separate from the admin
 * ProductManagement/ProductTable getStockStatus, which renders a plainer
 * 3-tier badge for a dense table row — same concept, different presentation
 * needs, so sharing one function would just push a branch into the caller.
 */
export const getProductStockStatus = (product: Pick<Product, 'stock'>): ProductStockStatus => {
  const { stock } = product;
  if (stock === 0) return { label: 'Out of Stock', class: 'out', icon: '✕' };
  if (stock <= 5) return { label: `Only ${stock} left!`, class: 'low', icon: '⚠' };
  if (stock <= 20) return { label: 'Limited Stock', class: 'limited', icon: '📦' };
  return { label: 'In Stock', class: 'available', icon: '✓' };
};
