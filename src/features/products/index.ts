export { ProductCard } from './components/ProductCard/ProductCard';
export { ProductGrid} from './components/ProductGrid/ProductGrid';
export { ProductForm } from './components/ProductForm/ProductForm';
export { ProductTable } from './components/ProductTable/ProductTable';
export { ProductFormModal } from './components/ProductFormModal/ProductFormModal';
export { DeleteProductModal } from './components/DeleteProductModal/DeleteProductModal';
export { useProductStore } from './productStore';
export { useProducts } from './hooks/useProducts';
export { productApi } from './api/productApi';

// Form validation (pure helpers — safe to use outside React)
export {
  validateProductForm,
  validateImageFile,
  toAcceptAttribute,
  MAIN_IMAGE_RULES,
  IMAGE_360_RULES
} from './utils/productFormValidation';
export type { ImageUploadRules, ProductFormErrors } from './utils/productFormValidation';

export type { Product, ProductsResponse, ProductFilters as ProductFilterParams, ProductState, ProductFormState } from './types/product.types';