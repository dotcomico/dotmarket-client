import { useEffect, useState, useMemo, useCallback } from 'react';
import './CategoryManagement.css';
import { useCategoryStore } from '../../../features/categories/categoryStore';
import { AdminHeader } from '../../../components/admin/AdminHeader/AdminHeader';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import { CategoryForm } from '../../../features/categories/components/CategoryForm/CategoryForm';
import type { Category } from '../../../features/categories/types/category.types';
import RefreshButton from '../../../components/admin/RefreshButton/RefreshButton';

const CategoryManagement = () => {
    // Store
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
        clearError
    } = useCategoryStore();

    // Local state
    const [searchQuery, setSearchQuery] = useState('');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Get flattened categories list for display
    const flatCategories = useMemo(() => getFlatCategories(), [getFlatCategories]);
    const parentCategories = useMemo(() => getParentCategories(), [getParentCategories]);
    const stats = useMemo(() => getCategoryStats(), [getCategoryStats]);

    // Filtered categories based on search
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return flatCategories;

        const query = searchQuery.toLowerCase();
        return flatCategories.filter(cat =>
            cat.name.toLowerCase().includes(query) ||
            cat.slug.toLowerCase().includes(query)
        );
    }, [flatCategories, searchQuery]);

    // Get parent name for display
    const getParentName = useCallback((parentId: number | null) => {
        if (!parentId) return '—';
        const parent = flatCategories.find(c => c.id === parentId);
        return parent?.name || '—';
    }, [flatCategories]);

    // Modal handlers
    const handleOpenAddModal = useCallback(() => {
        setEditingCategory(null);
        setShowCategoryModal(true);
        clearError();
    }, [clearError]);

    const handleEdit = useCallback((category: Category) => {
        setEditingCategory(category);
        setShowCategoryModal(true);
        clearError();
    }, [clearError]);

    const handleCloseModal = useCallback(() => {
        setShowCategoryModal(false);
        setEditingCategory(null);
    }, []);

    // Form submission handler
    const handleCategorySubmit = useCallback(async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
        setIsSubmitting(true);

        try {
            let result;

            if (editingCategory) {
                result = await updateCategory(editingCategory.id, formData);
            } else {
                result = await createCategory(formData);
            }

            if (result.success) {
                handleCloseModal();
            }

            return result;
        } catch (error) {
            console.error('Failed to save category:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to save category'
            };
        } finally {
            setIsSubmitting(false);
        }
    }, [editingCategory, createCategory, updateCategory, handleCloseModal]);

    // Delete handlers
    const handleDeleteClick = useCallback((category: Category) => {
        setDeleteConfirm(category);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteConfirm) return;

        setIsSubmitting(true);
        try {
            const result = await deleteCategory(deleteConfirm.id);
            if (result.success) {
                setDeleteConfirm(null);
            }
        } catch (error) {
            console.error('Failed to delete category:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [deleteConfirm, deleteCategory]);

    // Check if category has children (can't delete)
    const hasChildren = useCallback((categoryId: number) => {
        return flatCategories.some(c => c.parentId === categoryId);
    }, [flatCategories]);

    return (
        <>
            <AdminHeader title="Category Management" />

            <main className="admin-main">
                {/* Stats Cards */}
                <div className="category-stats">
                    <div className="category-stat-card category-stat-card--total">
                        <div className="category-stat-card__icon">🏷️</div>
                        <div className="category-stat-card__content">
                            <div className="category-stat-card__value">{stats.total}</div>
                            <div className="category-stat-card__label">Total Categories</div>
                        </div>
                    </div>
                    <div className="category-stat-card category-stat-card--parent">
                        <div className="category-stat-card__icon">📁</div>
                        <div className="category-stat-card__content">
                            <div className="category-stat-card__value">{stats.parents}</div>
                            <div className="category-stat-card__label">Parent Categories</div>
                        </div>
                    </div>
                    <div className="category-stat-card category-stat-card--child">
                        <div className="category-stat-card__icon">📂</div>
                        <div className="category-stat-card__content">
                            <div className="category-stat-card__value">{stats.children}</div>
                            <div className="category-stat-card__label">Subcategories</div>
                        </div>
                    </div>
                </div>

                <div className="admin-card">
                    {/* Header Section */}
                    <div className="category-management-header">
                        <div className="category-management-header__info">
                            <h2>Categories</h2>
                            <p className="subtitle">{filteredCategories.length} categories found</p>
                        </div>
                        <div className="category-management-header__actions">
                            <RefreshButton onClick={fetchCategories} isLoading={isLoading} />
                            <button
                                className="btn-primary"
                                onClick={handleOpenAddModal}
                            >
                                <span className="btn-icon">+</span>
                                New Category
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            <span>{error}</span>
                            <button onClick={clearError} className="error-message__close">×</button>
                        </div>
                    )}

                    {/* Filters Section - Reusing SearchBar from src/components/ui/SearchBar */}
                    <div className="filters-section">
                        <div className="admin-search-wrapper">
                            <SearchBar
                                placeholder="Search categories..."
                                navigateOnEnter={false}
                                value={searchQuery}
                                onChange={setSearchQuery}
                            />
                        </div>
                    </div>

                    {/* Categories Table */}
                    {isLoading ? (
                        <div className="loading-state">
                            <div className="spinner" />
                            <p>Loading categories...</p>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state__icon">🏷️</div>
                            <h3>No categories found</h3>
                            <p>{categories.length === 0
                                ? 'Create your first category to get started'
                                : 'Try adjusting your search criteria'}
                            </p>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Slug</th>
                                        <th>Parent</th>
                                        <th>Type</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.map(category => (
                                        <tr key={category.id}>
                                            <td>
                                                <div className="category-cell">
                                                    {category.image ? (
                                                        <img
                                                            src={category.image}
                                                            alt={category.name}
                                                            className="category-thumbnail"
                                                        />
                                                    ) : (
                                                        <div className="category-thumbnail category-thumbnail--placeholder">
                                                            {category.icon || '📁'}
                                                        </div>
                                                    )}
                                                    <div className="category-info">
                                                        <div className="category-name">{category.name}</div>
                                                        {category.icon && (
                                                            <div className="category-icon-display">{category.icon}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <code className="category-slug">{category.slug}</code>
                                            </td>
                                            <td className="parent-cell">
                                                {getParentName(category.parentId)}
                                            </td>
                                            <td>
                                                <span className={`type-badge ${category.parentId ? 'type-badge--child' : 'type-badge--parent'}`}>
                                                    {category.parentId ? 'Subcategory' : 'Parent'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="action-btn action-btn--edit"
                                                        onClick={() => handleEdit(category)}
                                                        title="Edit"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="action-btn action-btn--delete"
                                                        onClick={() => handleDeleteClick(category)}
                                                        title={hasChildren(category.id) ? "Cannot delete: has subcategories" : "Delete"}
                                                        disabled={hasChildren(category.id)}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Add/Edit Category Modal */}
                {showCategoryModal && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                                <button
                                    className="modal-close"
                                    onClick={handleCloseModal}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-body">
                                <CategoryForm
                                    category={editingCategory}
                                    parentCategories={parentCategories}
                                    onSubmit={handleCategorySubmit}
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
                                <h3>Delete Category</h3>
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
                                        This action cannot be undone. Products in this category will become uncategorized.
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

export default CategoryManagement;