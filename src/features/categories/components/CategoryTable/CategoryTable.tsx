import type { Category } from '../../types/category.types';

interface CategoryTableProps {
    categories: Category[];
    getParentName: (parentId: number | null) => string;
    hasChildren: (categoryId: number) => boolean;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

/**
 * Presentational table of flattened categories. Owns no state — the page
 * decides what to show and what happens on click.
 *
 * Styling comes from the page-level `CategoryManagement.css` (global
 * stylesheet, not CSS modules), which also defines the shared `.admin-table`
 * chrome.
 */
export const CategoryTable = ({ categories, getParentName, hasChildren, onEdit, onDelete }: CategoryTableProps) => (
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
                {categories.map(category => (
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
                                    onClick={() => onEdit(category)}
                                    title="Edit"
                                    aria-label={`Edit ${category.name}`}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                </button>
                                <button
                                    className="action-btn action-btn--delete"
                                    onClick={() => onDelete(category)}
                                    title={hasChildren(category.id) ? 'Cannot delete: has subcategories' : 'Delete'}
                                    aria-label={`Delete ${category.name}`}
                                    disabled={hasChildren(category.id)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
);
