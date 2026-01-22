import { create } from 'zustand';
import { productApi } from './api/productApi';
import { getErrorMessage, logError } from '../../utils/errorHandler';
import type { ProductFilters, ProductState } from './types/product.types';

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  pagination: null,

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

  getProductById: (id: number) => {
    return get().products.find(product => product.id === id);
  }
}));