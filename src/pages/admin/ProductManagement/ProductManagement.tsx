import { useEffect, useState, useMemo, useCallback } from 'react';
import './ProductManagement.css';
import { useProductStore, productApi, type Product } from '../../../features/products';
import { AdminHeader } from '../../../components/admin/AdminHeader/AdminHeader';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import { ProductForm } from '../../../features/products/components/ProductForm/ProductForm';

/**
 * ProductManagement - Admin page for managing products
 */
const ProductManagement = () => {
  const { products, fetchProducts, isLoading } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  useEffect(() => {
    if (products.length === 0) {
        fetchProducts({ limit: 1000 });
    }
  }, [products.length, fetchProducts]);

  // Memoize categories to prevent recomputation on every render
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      products
        .map(p => p.category?.name)
        .filter((name): name is string => Boolean(name))
    );
    return ['all', ...Array.from(uniqueCategories)];
  }, [products]);

  // Memoize filtered products
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
            <button 
              className="btn-primary"
              onClick={handleOpenAddModal}
            >
              <span className="btn-icon">+</span>
              New Product
            </button>
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
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => {
                    const stockStatus = getStockStatus(product.stock);
                    
                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="product-cell">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="product-thumbnail"
                              />
                            ) : (
                              <div className="product-thumbnail product-thumbnail--placeholder">
                                📦
                              </div>
                            )}
                            <div className="product-info">
                              <div className="product-name">{product.name}</div>
                              {product.description && (
                                <div className="product-description">
                                  {product.description.substring(0, 50)}
                                  {product.description.length > 50 ? '...' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="category-badge">
                            {product.category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="price-cell">${product.price.toFixed(2)}</td>
                        <td className="stock-cell">{product.stock}</td>
                        <td>
                          <span className={`stock-status ${stockStatus.class}`}>
                            {stockStatus.label}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn action-btn--edit"
                              onClick={() => handleEdit(product)}
                              title="Edit"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              className="action-btn action-btn--delete"
                              onClick={() => handleDeleteClick(product)}
                              title="Delete"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Product Modal */}
        {showProductModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button 
                  className="modal-close"
                  onClick={handleCloseModal}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <ProductForm
                  product={editingProduct}
                  onSubmit={handleProductSubmit}
                  onCancel={handleCloseModal}
                  isLoading={isSubmitting}
                />
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="modal modal--small" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Delete Product</h3>
                <button 
                  className="modal-close"
                  onClick={() => setDeleteConfirm(null)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="delete-confirm">
                  <div className="delete-confirm__icon">🗑️</div>
                  <p className="delete-confirm__message">
                    Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>?
                  </p>
                  <p className="delete-confirm__warning">
                    This action cannot be undone.
                  </p>
                  <div className="delete-confirm__actions">
                    <button
                      className="btn-secondary"
                      onClick={() => setDeleteConfirm(null)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-danger"
                      onClick={handleConfirmDelete}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default ProductManagement;