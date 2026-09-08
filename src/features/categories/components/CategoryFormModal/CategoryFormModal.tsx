import { CategoryForm } from '../CategoryForm/CategoryForm';
import type { Category } from '../../types/category.types';

interface CategoryFormModalProps {
    /** null means "add new category"; a Category means "editing this one". */
    category: Category | null;
    parentCategories: Category[];
    isSubmitting: boolean;
    onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
    onClose: () => void;
}

/** Add/edit category modal. Delegates the actual form fields to `CategoryForm`. */
export const CategoryFormModal = ({ category, parentCategories, isSubmitting, onSubmit, onClose }: CategoryFormModalProps) => (
    <div className="modal-overlay" onClick={onClose}>
        <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-form-title"
        >
            <div className="modal-header">
                <h3 id="category-form-title">{category ? 'Edit Category' : 'Add New Category'}</h3>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    ×
                </button>
            </div>
            <div className="modal-body">
                <CategoryForm
                    category={category}
                    parentCategories={parentCategories}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    </div>
);
