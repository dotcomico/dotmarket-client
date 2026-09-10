export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  image360: string | null;
  categoryId: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * The product form's field values. Every field is a string because it mirrors
 * raw `<input>` values — parsing to number happens at validation/submit time.
 * Shared by the form component and its validation helper.
 */
export interface ProductFormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * A single entry in `ProductStats.lowStockProducts`.
 *
 * Deliberately NOT a `Product`: `GET /products/stats` returns a trimmed
 * preview row (no description/category/timestamps) because it is a summary
 * endpoint, not a listing. Typing it as `Product` would be a lie that only
 * shows up at runtime as `undefined`.
 */
/**
 * One row of the dashboard's "Low Stock Alert" preview.
 *
 * Exactly the four fields the panel renders — it has no thumbnail slot, so
 * `image` is not on the wire either. Keep this in step with the projection in
 * `product_service.get_product_stats`; do not widen it to `Product`.
 */
export interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
  price: number;
}

/**
 * Catalogue-wide aggregates from `GET /products/stats` (admin/manager only).
 *
 * These are computed in SQL over the WHOLE catalogue. They must never be
 * re-derived from `ProductState.products`, which only ever holds one
 * paginated page (10 of 84 products) and would silently under-report.
 *
 * `lowStockProducts` is a capped preview (up to 5, stock ascending) while
 * `lowStockCount` is the true total — render them as "5 of 7", never as if
 * the preview were the whole set. `outOfStockCount` is a SUBSET of
 * `lowStockCount` (stock 0 is also < threshold), so never sum the two.
 */
export interface ProductStats {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  inventoryValue: number;
  lowStockThreshold: number;
  lowStockProducts: LowStockProduct[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  /**
   * Backend-computed catalogue aggregates. `null` until `fetchStats` has
   * succeeded — consumers must treat `null` as "unknown", not as zero.
   */
  stats: ProductStats | null;
  /* Tracked separately from `isLoading`/`error` so a stats failure never
     blanks the product list, and vice versa — they are two independent
     requests that happen to share a store. */
  isStatsLoading: boolean;
  statsError: string | null;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchStats: () => Promise<void>;
  getProductById: (id: number) => Product | undefined;
}