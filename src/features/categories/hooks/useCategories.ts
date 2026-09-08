import { useCallback } from 'react';
import { useCategoryStore } from '../categoryStore';
import type { Category } from '../types/category.types';

/**
 * useCategories - admin-facing hook wrapping useCategoryStore.
 * The store already houses CRUD + the flat/parent/stats getters; this hook
 * adds the search-filtering and lookup helpers CategoryManagement previously
 * computed inline with useMemo/useCallback, so the page stays composition-only.
 */
export const useCategories = () => {
  const {
    categories,
    isLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getFlatCategories,
    getParentCategories,
    getCategoryStats,
    clearError,
  } = useCategoryStore();

  /**
   * Filter a flat category list by name/slug search text.
   */
  const filterCategories = useCallback((flatCategories: Category[], searchQuery: string): Category[] => {
    if (!searchQuery.trim()) return flatCategories;

    const query = searchQuery.toLowerCase();
    return flatCategories.filter(
      cat => cat.name.toLowerCase().includes(query) || cat.slug.toLowerCase().includes(query)
    );
  }, []);

  /**
   * Look up a parent category's display name, '—' if there isn't one.
   */
  const getParentName = useCallback(
    (flatCategories: Category[], parentId: number | null): string => {
      if (!parentId) return '—';
      const parent = flatCategories.find(c => c.id === parentId);
      return parent?.name || '—';
    },
    []
  );

  /**
   * Whether a category has children (blocks deletion in the UI).
   */
  const hasChildren = useCallback(
    (flatCategories: Category[], categoryId: number): boolean => {
      return flatCategories.some(c => c.parentId === categoryId);
    },
    []
  );

  return {
    // State
    categories,
    isLoading,
    error,

    // Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,

    // Helpers
    getFlatCategories,
    getParentCategories,
    getCategoryStats,
    filterCategories,
    getParentName,
    hasChildren,
  };
};
