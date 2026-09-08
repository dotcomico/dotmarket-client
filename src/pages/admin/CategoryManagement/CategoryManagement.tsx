import { useEffect, useState, useMemo, useCallback } from 'react';
import './CategoryManagement.css';
import {
    useCategoryStore,
    CategoryTable,
    CategoryFormModal,
    DeleteCategoryModal
} from '../../../features/categories';
import type { Category } from '../../../features/categories';
import { AdminHeader } from '../../../components/admin/AdminHeader/AdminHeader';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import RefreshButton from '../../../components/admin/RefreshButton/RefreshButton';
import { StatTile, StatTileGrid } from '../../../components/ui/StatTile/StatTile';

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

    const flatCategories = useMemo(() => {
        return getFlatCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories, getFlatCategories]);

    const parentCategories = useMemo(() => {
        return getParentCategories();
    }, [getParentCategories]);

    const stats = useMemo(() => {
        return getCategoryStats();
    }, [getCategoryStats]);

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

    // Check if category has children (can't delete)
    const hasChildren = useCallback((categoryId: number) => {
        return flatCategories.some(c => c.parentId === categoryId);
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

    return (
        <>
            <AdminHeader title="Category Management" />

            <main className="admin-main">
                {/* Stats Cards */}
                <StatTileGrid cols={3}>
                    <StatTile
                        icon="🏷️"
                        value={stats.total}
                        label="Total Categories"
                        className="category-stat-card category-stat-card--total"
                    />
                    <StatTile
                        icon="📁"
                        value={stats.parents}
                        label="Parent Categories"
                        className="category-stat-card category-stat-card--parent"
                    />
                    <StatTile
                        icon="📂"
                        value={stats.children}
                        label="Subcategories"
                        className="category-stat-card category-stat-card--child"
                    />
                </StatTileGrid>

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
                        <CategoryTable
                            categories={filteredCategories}
                            getParentName={getParentName}
                            hasChildren={hasChildren}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />
                    )}
                </div>

                {showCategoryModal && (
                    <CategoryFormModal
                        category={editingCategory}
                        parentCategories={parentCategories}
                        isSubmitting={isSubmitting}
                        onSubmit={handleCategorySubmit}
                        onClose={handleCloseModal}
                    />
                )}

                {deleteConfirm && (
                    <DeleteCategoryModal
                        category={deleteConfirm}
                        isDeleting={isSubmitting}
                        onConfirm={handleConfirmDelete}
                        onClose={() => setDeleteConfirm(null)}
                    />
                )}
            </main>
        </>
    );
};

export default CategoryManagement;
