import { useEffect, useState, useMemo, useCallback } from 'react';
import './ProductManagement.css';
import {
  useProductStore,
  productApi,
  ProductTable,
  ProductFormModal,
  DeleteProductModal,
  type Product
} from '../../../features/products';
import { AdminHeader } from '../../../components/admin/AdminHeader/AdminHeader';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import RefreshButton from '../../../components/admin/RefreshButton/RefreshButton';

const ProductManagement = () => {
  const { products, fetchProducts, isLoading } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts({ limit: 1000 });
  }, [fetchProducts]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      products
        .map(p => p.category?.name)
        .filter((name): name is string => Boolean(name))
    );
    return ['all', ...Array.from(uniqueCategories)];
  }, [products]);

  // filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' ||
        product.category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const getStockStatus = useCallback((stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'stock-status--critical' };
    if (stock < 10) return { label: 'Low Stock', class: 'stock-status--warning' };
    return { label: 'In Stock', class: 'stock-status--success' };
  }, []);

  // Open modal for adding new product
  const handleOpenAddModal = useCallback(() => {
    setEditingProduct(null);
    setShowProductModal(true);
  }, []);

  // Open modal for editing existing product
  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  }, []);

  // Close product modal
  const handleCloseModal = useCallback(() => {
    setShowProductModal(false);
    setEditingProduct(null);
  }, []);

  // Handle form submission (create or update)
  const handleProductSubmit = useCallback(async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true);

    try {
      if (editingProduct) {
        // Update existing product
        await productApi.update(editingProduct.id, formData);
      } else {
        // Create new product
        await productApi.create(formData);
      }

      // Refresh products list
      await fetchProducts();
      handleCloseModal();

      return { success: true };
    } catch (error) {
      console.error('Failed to save product:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save product'
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [editingProduct, fetchProducts, handleCloseModal]);

  // Open delete confirmation modal
  const handleDeleteClick = useCallback((product: Product) => {
    setDeleteConfirm(product);
  }, []);

  // Confirm and execute delete
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteConfirm) return;

    setIsSubmitting(true);
    try {
      await productApi.delete(deleteConfirm.id);
      await fetchProducts();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      // Could add toast notification here
    } finally {
      setIsSubmitting(false);
    }
  }, [deleteConfirm, fetchProducts]);

  return (
    <>
      <AdminHeader title="Product Management" />

      <main className="admin-main">
        <div className="admin-card">
          {/* Header Section */}
          <div className="product-management-header">
            <div className="product-management-header__info">
              <h2>Product Catalog</h2>
              <p className="subtitle">{filteredProducts.length} products found</p>
            </div>
            <div className="product-management-header__actions">
              <RefreshButton onClick={fetchProducts} isLoading={isLoading} />
              <button
                className="btn-primary"
                onClick={handleOpenAddModal}
              >
                <span className="btn-icon">+</span>
                New Product
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            {/* Global SearchBar Component - reusing from src/components/ui/SearchBar */}
            <div className="admin-search-wrapper">
              <SearchBar
                placeholder="Search products..."
                navigateOnEnter={false}
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>

            {/* Category Filter */}
            <select
              className="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Products Table */}
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📦</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              getStockStatus={getStockStatus}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          )}
        </div>

        {/* Add/Edit Product Modal */}
        {showProductModal && (
          <ProductFormModal
            product={editingProduct}
            isSubmitting={isSubmitting}
            onSubmit={handleProductSubmit}
            onClose={handleCloseModal}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <DeleteProductModal
            product={deleteConfirm}
            isDeleting={isSubmitting}
            onConfirm={handleConfirmDelete}
            onClose={() => setDeleteConfirm(null)}
          />
        )}
      </main>
    </>
  );
};

export default ProductManagement;
