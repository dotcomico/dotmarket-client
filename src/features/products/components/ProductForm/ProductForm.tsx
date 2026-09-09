import { useEffect, useState, useMemo, type FormEvent } from 'react';
import { useCategoryStore, flattenCategoryTree } from '../../../categories';
import type { Product, ProductFormState } from '../../types/product.types';
import {
  validateProductForm,
  validateImageFile,
  toAcceptAttribute,
  MAIN_IMAGE_RULES,
  IMAGE_360_RULES,
  type ProductFormErrors
} from '../../utils/productFormValidation';
import { ProductImageUpload } from './ProductImageUpload';
import { ProductFormFields } from './ProductFormFields';
import './ProductForm.css';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProductForm = ({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) => {
  const { categories, fetchCategories } = useCategoryStore();

  const [formData, setFormData] = useState<ProductFormState>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price.toString() || '',
    stock: product?.stock.toString() || '0',
    categoryId: product?.categoryId.toString() || '',
  });

  // Main image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const [imageRemoved, setImageRemoved] = useState(false);

  // 360° image state
  const [image360File, setImage360File] = useState<File | null>(null);
  const [image360Preview, setImage360Preview] = useState<string | null>(product?.image360 || null);
  const [image360Removed, setImage360Removed] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ProductFormErrors>({});

  const isEditMode = Boolean(product);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  const flatCategories = useMemo(() => flattenCategoryTree(categories), [categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (validationErrors[name as keyof ProductFormState]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setError(null);
  };

  const handleImageSelect = (file: File) => {
    const fileError = validateImageFile(file, MAIN_IMAGE_RULES);
    if (fileError) {
      setError(fileError);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleImage360Select = (file: File) => {
    const fileError = validateImageFile(file, IMAGE_360_RULES);
    if (fileError) {
      setError(fileError);
      return;
    }

    setImage360File(file);
    setImage360Preview(URL.createObjectURL(file));
    setError(null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (isEditMode && product?.image) {
      setImageRemoved(true);
    }
  };

  const removeImage360 = () => {
    setImage360File(null);
    setImage360Preview(null);
    if (isEditMode && product?.image360) {
      setImage360Removed(true);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const errors = validateProductForm(formData);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const submitData = new FormData();
    submitData.append('name', formData.name.trim());
    submitData.append('description', formData.description.trim());
    submitData.append('price', formData.price);
    submitData.append('stock', formData.stock || '0');
    submitData.append('categoryId', formData.categoryId);

    if (imageFile) {
      submitData.append('image', imageFile);
    } else if (imageRemoved) {
      // Signal backend to remove the image
      submitData.append('removeImage', 'true');
    }

    if (image360File) {
      submitData.append('image360', image360File);
    } else if (image360Removed) {
      submitData.append('removeImage360', 'true');
    }

    const result = await onSubmit(submitData);

    if (!result.success) {
      setError(result.error || 'Failed to save product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {error && (
        <div className="product-form__error" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* Images Row */}
      <div className="product-form__images-row">
        <ProductImageUpload
          label="Product Image"
          preview={imagePreview}
          previewAlt="Preview"
          accept={toAcceptAttribute(MAIN_IMAGE_RULES)}
          icon="📷"
          placeholder="Product Photo"
          hint={MAIN_IMAGE_RULES.hint}
          removeLabel="Remove image"
          disabled={isLoading}
          onSelect={handleImageSelect}
          onRemove={removeImage}
        />

        <ProductImageUpload
          label="360° View (Optional)"
          preview={image360Preview}
          previewAlt="360° Preview"
          accept={toAcceptAttribute(IMAGE_360_RULES)}
          icon="🔄"
          placeholder="360° GIF"
          hint={IMAGE_360_RULES.hint}
          removeLabel="Remove 360° image"
          disabled={isLoading}
          showBadge
          previewClassName="product-form__image-preview--360"
          dropzoneClassName="product-form__image-dropzone--360"
          onSelect={handleImage360Select}
          onRemove={removeImage360}
        />
      </div>

      <ProductFormFields
        values={formData}
        errors={validationErrors}
        categories={flatCategories}
        disabled={isLoading}
        onChange={handleChange}
      />

      {/* Actions */}
      <div className="product-form__actions">
        <button
          type="button"
          className="product-form__btn product-form__btn--cancel"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="product-form__btn product-form__btn--submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};
