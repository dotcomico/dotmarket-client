import type { Category } from '../../types/category.types';

interface DeleteCategoryModalProps {
    /** Always defined — the page owns the "is it open?" decision. */
    category: Category;
    isDeleting: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

/** Confirmation modal shown before a category is deleted. */
export const DeleteCategoryModal = ({ category, isDeleting, onConfirm, onClose }: DeleteCategoryModalProps) => (
    <div className="modal-overlay" onClick={onClose}>
        <div
            className="modal modal--small"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-category-title"
        >
            <div className="modal-header">
                <h3 id="delete-category-title">Delete Category</h3>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    ×
                </button>
            </div>
            <div className="modal-body">
                <div className="delete-confirm">
                    <div className="delete-confirm__icon">🗑️</div>
                    <p className="delete-confirm__message">
                        Are you sure you want to delete <strong>"{category.name}"</strong>?
                    </p>
                    <p className="delete-confirm__warning">
                        This action cannot be undone. Products in this category will become uncategorized.
                    </p>
                    <div className="delete-confirm__actions">
                        <button
                            className="btn-secondary"
                            onClick={onClose}
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn-danger"
                            onClick={onConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
