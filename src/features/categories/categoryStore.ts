import { create } from 'zustand';
import { categoryApi } from './api/categoryApi';
import { getErrorMessage, logError } from '../../utils/errorHandler';
import type { Category, CategoryState } from './types/category.types';

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryApi.getTree();
      set({ categories: response.data, isLoading: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to load categories');
      logError(error, 'categoryStore.fetchCategories');
      
      set({ 
        error: errorMessage,
        isLoading: false,
        categories: []
      });
    }
  },

  getCategoryById: (id: number) => {
    const findCategory = (categories: Category[]): Category | undefined => {
      for (const cat of categories) {
        if (cat.id === id) return cat;
        if (cat.children) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    
    return findCategory(get().categories);
  }
}));