import { create } from 'zustand';
import { productApi } from './api/productApi';
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
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch products';
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  getProductById: (id: number) => {
    return get().products.find(product => product.id === id);
  }
}));