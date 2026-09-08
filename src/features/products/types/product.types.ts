export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  image360: string | null;
  categoryId: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * The product form's field values. Every field is a string because it mirrors
 * raw `<input>` values — parsing to number happens at validation/submit time.
 * Shared by the form component and its validation helper.
 */
export interface ProductFormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  getProductById: (id: number) => Product | undefined;
}