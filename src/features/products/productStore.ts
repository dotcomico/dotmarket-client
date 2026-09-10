import { create } from 'zustand';
import { productApi } from './api/productApi';
import { getErrorMessage, logError } from '../../utils/errorHandler';
import type { ProductFilters, ProductState } from './types/product.types';

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  pagination: null,
  stats: null,
  isStatsLoading: false,
  statsError: null,

  fetchProducts: async (filters?: ProductFilters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApi.getAll(filters);
      set({ 
        products: response.data.products, 
        pagination: response.data.pagination,
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to load products');
      logError(error, 'productStore.fetchProducts');
      
      set({ 
        error: errorMessage,
        isLoading: false,
        products: [] 
      });
    }
  },

  /*
   * Fetch catalogue-wide aggregates (total products, low stock, inventory
   * value) from the backend.
   *
   * These CANNOT be derived from `products`: that array holds a single
   * paginated page, so any reduce over it answers a question about 10 rows
   * while pretending to answer one about 84.
   */
  fetchStats: async () => {
    set({ isStatsLoading: true, statsError: null });
    try {
      const response = await productApi.getStats();
      set({
        stats: response.data,
        isStatsLoading: false
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to load product stats');
      logError(error, 'productStore.fetchStats');

      set({
        statsError: errorMessage,
        isStatsLoading: false,
        // Drop stale numbers rather than showing them next to an error —
        // a confident wrong figure is worse than a visible failure.
        stats: null
      });
    }
  },

  getProductById: (id: number) => {
    return get().products.find(product => product.id === id);
  }
}));