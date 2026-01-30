import { useEffect, useState, useMemo, type FormEvent } from 'react';
import { useCategoryStore, type Category } from '../../../categories';
import type { Product } from '../../types/product.types';
import './ProductForm.css';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
}

export const ProductForm = ({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) => {
  const { categories, fetchCategories } = useCategoryStore();

  const [formData, setFormData] = useState<FormState>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price.toString() || '',
    stock: product?.stock.toString() || '0',
    categoryId: product?.categoryId.toString() || '',
  });

  // Main image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);

  // 360° image state
  const [image360File, setImage360File] = useState<File | null>(null);
  const [image360Preview, setImage360Preview] = useState<string | null>(product?.image360 || null);

  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<FormState>>({});

  const isEditMode = Boolean(product);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  const flatCategories = useMemo(() => {
    const flatten = (cats: Category[], depth = 0): { id: number; name: string; depth: number }[] => {
      return cats.reduce((acc, cat) => {
        acc.push({ id: cat.id, name: cat.name, depth });
        if (cat.children && cat.children.length > 0) {
          acc.push(...flatten(cat.children, depth + 1));
        }
        return acc;
      }, [] as { id: number; name: string; depth: number }[]);
    };
    return flatten(categories);
  }, [categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (validationErrors[name as keyof FormState]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setError(null);
  };

  // Main image handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  // 360° image handler (GIF only)
  const handleImage360Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/gif') {
        setError('360° view must be a GIF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('360° image must be less than 10MB');
        return;
      }

      setImage360File(file);
      setImage360Preview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const [imageRemoved, setImageRemoved] = useState(false);
  const [image360Removed, setImage360Removed] = useState(false);

  // Update removeImage functions
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

  const validate = (): boolean => {
    const errors: Partial<FormState> = {};

    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    const priceNum = parseFloat(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (!formData.categoryId) {
      errors.categoryId = 'Please select a category';
    }

    if (formData.stock && parseInt(formData.stock) < 0) {
      errors.stock = 'Stock cannot be negative';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

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
        {/* Main Image Upload */}
        <div className="product-form__image-section">
          <label className="product-form__label">Product Image</label>
          <div className="product-form__image-upload">
            {imagePreview ? (
              <div className="product-form__image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="product-form__image-remove"
                  onClick={removeImage}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="product-form__image-dropzone">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
                <div className="product-form__image-placeholder">
                  <span className="product-form__image-icon">📷</span>
                  <span>Product Photo</span>
                  <span className="product-form__image-hint">JPEG, PNG, GIF, WebP (max 5MB)</span>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* 360° Image Upload */}
        <div className="product-form__image-section">
          <label className="product-form__label">360° View (Optional)</label>
          <div className="product-form__image-upload">
            {image360Preview ? (
              <div className="product-form__image-preview product-form__image-preview--360">
                <img src={image360Preview} alt="360° Preview" />
                <button
                  type="button"
                  className="product-form__image-remove"
                  onClick={removeImage360}
                  aria-label="Remove 360° image"
                >
                  ×
                </button>
                <span className="product-form__360-badge">360°</span>
              </div>
            ) : (
              <label className="product-form__image-dropzone product-form__image-dropzone--360">
                <input
                  type="file"
                  accept="image/gif"
                  onChange={handleImage360Change}
                  disabled={isLoading}
                />
                <div className="product-form__image-placeholder">
                  <span className="product-form__image-icon">🔄</span>
                  <span>360° GIF</span>
                  <span className="product-form__image-hint">GIF only (max 10MB)</span>
                </div>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="product-form__group">
        <label htmlFor="name" className="product-form__label">
          Product Name <span className="required">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          disabled={isLoading}
          className={validationErrors.name ? 'input--error' : ''}
        />
        {validationErrors.name && (
          <span className="product-form__field-error">{validationErrors.name}</span>
        )}
      </div>

      {/* Description */}
      <div className="product-form__group">
        <label htmlFor="description" className="product-form__label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description (optional)"
          rows={3}
          disabled={isLoading}
        />
      </div>

      {/* Price & Stock Row */}
      <div className="product-form__row">
        <div className="product-form__group">
          <label htmlFor="price" className="product-form__label">
            Price ($) <span className="required">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            disabled={isLoading}
            className={validationErrors.price ? 'input--error' : ''}
          />
          {validationErrors.price && (
            <span className="product-form__field-error">{validationErrors.price}</span>
          )}
        </div>

        <div className="product-form__group">
          <label htmlFor="stock" className="product-form__label">
            Stock Quantity
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            disabled={isLoading}
            className={validationErrors.stock ? 'input--error' : ''}
          />
          {validationErrors.stock && (
            <span className="product-form__field-error">{validationErrors.stock}</span>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="product-form__group">
        <label htmlFor="categoryId" className="product-form__label">
          Category <span className="required">*</span>
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          disabled={isLoading}
          className={validationErrors.categoryId ? 'input--error' : ''}
        >
          <option value="">Select a category</option>
          {flatCategories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {'\u00A0'.repeat(cat.depth * 2)} {cat.depth > 0 ? '↳ ' : ''}{cat.name}
            </option>
          ))}
        </select>
        {validationErrors.categoryId && (
          <span className="product-form__field-error">{validationErrors.categoryId}</span>
        )}
      </div>

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