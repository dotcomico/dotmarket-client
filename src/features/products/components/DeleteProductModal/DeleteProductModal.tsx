import type { Product } from '../../types/product.types';

interface DeleteProductModalProps {
  /** Always defined — the page owns the "is it open?" decision. */
  product: Product;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/** Confirmation modal shown before a product is deleted. */
export const DeleteProductModal = ({ product, isDeleting, onConfirm, onClose }: DeleteProductModalProps) => (
  <div className="modal-overlay" onClick={onClose}>
    <div
      className="modal modal--small"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-product-title"
    >
      <div className="modal-header">
        <h3 id="delete-product-title">Delete Product</h3>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <div className="modal-body">
        <div className="delete-confirm">
          <div className="delete-confirm__icon">🗑️</div>
          <p className="delete-confirm__message">
            Are you sure you want to delete <strong>"{product.name}"</strong>?
          </p>
          <p className="delete-confirm__warning">
            This action cannot be undone.
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
