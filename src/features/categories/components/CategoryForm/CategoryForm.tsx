import { useState, useEffect, useMemo } from 'react';
import type { Category } from '../../types/category.types';
import './CategoryForm.css';

interface CategoryFormProps {
  category?: Category | null;
  parentCategories: Category[];
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CategoryForm = ({
  category,
  parentCategories,
  onSubmit,
  onCancel,
  isLoading = false
}: CategoryFormProps) => {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [icon, setIcon] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(category);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setParentId(category.parentId?.toString() || '');
      setIcon(category.icon || '');
      setImagePreview(category.image);
      setRemoveImage(false);
    } else {
      // Reset form for new category
      setName('');
      setParentId('');
      setIcon('');
      setImageFile(null);
      setImagePreview(null);
      setRemoveImage(false);
    }
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category?.id]); 

  useEffect(() => {
    return () => {
      if (imagePreview && imageFile) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, imageFile]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      // Create new URL
      const newUrl = URL.createObjectURL(file);
      setImagePreview(newUrl);
      setRemoveImage(false);
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    
    if (isEditing) {
      formData.append('parentId', parentId);
    } else if (parentId) {
      formData.append('parentId', parentId);
    }
    
    if (icon.trim()) {
      formData.append('icon', icon.trim());
    }
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    if (removeImage) {
      formData.append('removeImage', 'true');
    }

    const result = await onSubmit(formData);
    
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  const availableParents = useMemo(() => {
    return parentCategories.filter(
      cat => !category || cat.id !== category.id
    );
  }, [parentCategories, category]);

  return (
    <form onSubmit={handleSubmit} className="category-form">
      {error && (
        <div className="category-form__error">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Name Field */}
      <div className="category-form__group">
        <label htmlFor="category-name" className="category-form__label">
          Category Name <span className="required">*</span>
        </label>
        <input
          id="category-name"
          type="text"
          className="category-form__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          disabled={isLoading}
          autoFocus
        />
      </div>

      {/* Parent Category Field */}
      <div className="category-form__group">
        <label htmlFor="category-parent" className="category-form__label">
          Parent Category
        </label>
        <select
          id="category-parent"
          className="category-form__select"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          disabled={isLoading}
        >
          <option value="">None (Root Category)</option>
          {availableParents.map(parent => (
            <option key={parent.id} value={parent.id}>
              {parent.name}
            </option>
          ))}
        </select>
        <span className="category-form__hint">
          Leave empty to create a top-level category
        </span>
      </div>

      {/* Icon Field */}
      <div className="category-form__group">
        <label htmlFor="category-icon" className="category-form__label">
          Icon (Emoji or URL)
        </label>
        <input
          id="category-icon"
          type="text"
          className="category-form__input"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="📱 or icon URL"
          disabled={isLoading}
        />
        <span className="category-form__hint">
          Enter an emoji or image URL for the category icon
        </span>
      </div>

      {/* Image Upload Field */}
      <div className="category-form__group">
        <label className="category-form__label">
          Category Image
        </label>
        
        {imagePreview && !removeImage ? (
          <div className="category-form__image-preview">
            <img src={imagePreview} alt="Category preview" />
            <button
              type="button"
              className="category-form__image-remove"
              onClick={handleRemoveImage}
              disabled={isLoading}
            >
              ✕ Remove
            </button>
          </div>
        ) : (
          <div className="category-form__image-upload">
            <input
              type="file"
              id="category-image"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
              className="category-form__file-input"
            />
            <label htmlFor="category-image" className="category-form__file-label">
              <span className="category-form__file-icon">📷</span>
              <span>Click to upload image</span>
              <span className="category-form__file-hint">PNG, JPG up to 5MB</span>
            </label>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="category-form__actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="btn-spinner" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Category' : 'Create Category'
          )}
        </button>
      </div>
    </form>
  );
};