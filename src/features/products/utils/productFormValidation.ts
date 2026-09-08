import type { ProductFormState } from '../types/product.types';

/** Field-keyed validation messages. A missing key means that field is valid. */
export type ProductFormErrors = Partial<ProductFormState>;

/**
 * Pure validation for the product form — no state, no side effects, so it can
 * be reasoned about (and eventually unit-tested) without rendering React.
 * The caller owns storing the result and deciding whether to submit.
 */
export const validateProductForm = (data: ProductFormState): ProductFormErrors => {
  const errors: ProductFormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Product name is required';
  } else if (data.name.length < 3) {
    errors.name = 'Name must be at least 3 characters';
  }

  const priceNum = parseFloat(data.price);
  if (!data.price || isNaN(priceNum) || priceNum <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  if (!data.categoryId) {
    errors.categoryId = 'Please select a category';
  }

  if (data.stock && parseInt(data.stock) < 0) {
    errors.stock = 'Stock cannot be negative';
  }

  return errors;
};

/**
 * Everything that defines an accepted upload for one image slot: what the
 * browser file picker offers, what the code enforces, what the user is told.
 * Keeping them in one object is the point — the hint can't drift from the limit.
 */
export interface ImageUploadRules {
  allowedTypes: string[];
  maxBytes: number;
  /** Shown under the dropzone icon. */
  hint: string;
  typeError: string;
  sizeError: string;
}

const MB = 1024 * 1024;

export const MAIN_IMAGE_RULES: ImageUploadRules = {
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  maxBytes: 5 * MB,
  hint: 'JPEG, PNG, GIF, WebP (max 5MB)',
  typeError: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)',
  sizeError: 'Image must be less than 5MB'
};

export const IMAGE_360_RULES: ImageUploadRules = {
  allowedTypes: ['image/gif'],
  maxBytes: 10 * MB,
  hint: 'GIF only (max 10MB)',
  typeError: '360° view must be a GIF file',
  sizeError: '360° image must be less than 10MB'
};

/** Returns an error message for a rejected file, or `null` when the file is fine. */
export const validateImageFile = (file: File, rules: ImageUploadRules): string | null => {
  if (!rules.allowedTypes.includes(file.type)) return rules.typeError;
  if (file.size > rules.maxBytes) return rules.sizeError;
  return null;
};

/** `accept` attribute for a file input governed by these rules. */
export const toAcceptAttribute = (rules: ImageUploadRules) => rules.allowedTypes.join(',');
