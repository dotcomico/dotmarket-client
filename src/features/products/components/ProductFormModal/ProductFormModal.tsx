import { ProductForm } from '../ProductForm/ProductForm';
import type { Product } from '../../types/product.types';

interface ProductFormModalProps {
  /** null means "add new product"; a Product means "editing this one". */
  product: Product | null;
  isSubmitting: boolean;
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
}

/** Add/edit product modal. Delegates the actual form fields to `ProductForm`. */
export const ProductFormModal = ({ product, isSubmitting, onSubmit, onClose }: ProductFormModalProps) => (
  <div className="modal-overlay" onClick={onClose}>
    <div
      className="modal"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
    >
      <div className="modal-header">
        <h3 id="product-form-title">{product ? 'Edit Product' : 'Add New Product'}</h3>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <div className="modal-body">
        <ProductForm
          product={product}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  </div>
);
