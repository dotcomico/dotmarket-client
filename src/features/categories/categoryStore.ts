import { create } from 'zustand';
import { categoryApi } from './api/categoryApi';
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
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch categories';
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  getCategoryById: (id: number) => {
    // פונקציה רקורסיבית עם טיפוס מדויק
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