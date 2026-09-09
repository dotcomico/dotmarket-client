import { create } from 'zustand';
import { categoryApi } from './api/categoryApi';
import { getErrorMessage, logError } from '../../utils/errorHandler';
import { flattenCategoryTree } from './utils/categoryTree';
import type { Category, CategoryState } from './types/category.types';

/** Pre-order flat list of every category. Depth is dropped — see `flattenCategoryTree`. */
const flattenCategories = (categories: Category[]): Category[] =>
  flattenCategoryTree(categories).map(({ category }) => category);

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
  },

  createCategory: async (formData: FormData) => {
    set({ error: null });
    try {
      await categoryApi.create(formData);
      // Refresh list
      await get().fetchCategories();
      return { success: true };
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to create category');
      logError(error, 'categoryStore.createCategory');
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  updateCategory: async (id: number, formData: FormData) => {
    set({ error: null });
    try {
      await categoryApi.update(id, formData);
      await get().fetchCategories();
      return { success: true };
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to update category');
      logError(error, 'categoryStore.updateCategory');

      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  deleteCategory: async (id: number) => {
    set({ error: null });
    try {
      await categoryApi.delete(id);
      // Refresh 
      await get().fetchCategories();
      return { success: true };
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to delete category');
      logError(error, 'categoryStore.deleteCategory');
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  getFlatCategories: () => {
    return flattenCategories(get().categories);
  },

  getParentCategories: () => {
    return get().categories; // Root level
  },

  getCategoryStats: () => {
    const flat = flattenCategories(get().categories);
    const parents = get().categories.length;
    const children = flat.length - parents;
    return {
      total: flat.length,
      parents,
      children
    };
  },

  clearError: () => {
    set({ error: null });
  }
}));