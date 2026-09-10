import { useCallback } from 'react';
import { useProductStore } from '../productStore';
import { productApi } from '../api/productApi';
import { getErrorMessage, logError } from '../../../utils/errorHandler';
import type { Product } from '../types/product.types';

/**
 * useProducts - admin-facing hook wrapping useProductStore.
 * Mirrors the useCart/useMyOrders shape: the store holds raw state + fetch,
 * this hook adds filtering, derived options, and the create/update/delete
 * orchestration (API call + refetch) that ProductManagement previously did
 * inline against `productApi` directly.
 */
export const useProducts = () => {
  const {
    products,
    isLoading,
    error,
    pagination,
    stats,
    isStatsLoading,
    statsError,
    fetchProducts,
    fetchStats
  } = useProductStore();

  /**
   * Filter products by free-text search (name/description) and category name.
   */
  const filterProducts = useCallback(
    (searchQuery: string, selectedCategory: string): Product[] => {
      return products.filter(product => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'all' || product.category?.name === selectedCategory;

        return matchesSearch && matchesCategory;
      });
    },
    [products]
  );

  /**
   * Unique category names present in the current product list, for the
   * category filter dropdown ('all' always first).
   */
  const getCategoryOptions = useCallback((): string[] => {
    const uniqueCategories = new Set(
      products.map(p => p.category?.name).filter((name): name is string => Boolean(name))
    );
    return ['all', ...Array.from(uniqueCategories)];
  }, [products]);

  /**
   * Create a product, then refresh the list.
   */
  const createProduct = useCallback(
    async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
      try {
        await productApi.create(formData);
        await fetchProducts();
        return { success: true };
      } catch (error) {
        const errorMessage = getErrorMessage(error, 'Failed to save product');
        logError(error, 'useProducts.createProduct');
        return { success: false, error: errorMessage };
      }
    },
    [fetchProducts]
  );

  /**
   * Update a product, then refresh the list.
   */
  const updateProduct = useCallback(
    async (id: number, formData: FormData): Promise<{ success: boolean; error?: string }> => {
      try {
        await productApi.update(id, formData);
        await fetchProducts();
        return { success: true };
      } catch (error) {
        const errorMessage = getErrorMessage(error, 'Failed to save product');
        logError(error, 'useProducts.updateProduct');
        return { success: false, error: errorMessage };
      }
    },
    [fetchProducts]
  );

  /**
   * Delete a product, then refresh the list.
   */
  const deleteProduct = useCallback(
    async (id: number): Promise<{ success: boolean; error?: string }> => {
      try {
        await productApi.delete(id);
        await fetchProducts();
        return { success: true };
      } catch (error) {
        const errorMessage = getErrorMessage(error, 'Failed to delete product');
        logError(error, 'useProducts.deleteProduct');
        return { success: false, error: errorMessage };
      }
    },
    [fetchProducts]
  );

  return {
    // State
    products,
    isLoading,
    error,
    pagination,
    /*
     * Catalogue-wide aggregates from the backend. Exposed alongside `products`
     * but deliberately NOT derived from it: `products` is one paginated page,
     * so any total computed here would describe a fraction of the catalogue.
     */
    stats,
    isStatsLoading,
    statsError,

    // Actions
    fetchProducts,
    fetchStats,
    createProduct,
    updateProduct,
    deleteProduct,

    // Helpers
    filterProducts,
    getCategoryOptions,
  };
};
