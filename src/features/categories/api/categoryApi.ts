import type { Category } from '../types/category.types';
import { API_ENDPOINTS } from '../../../api/apiConfig';
import axiosInstance from '../../../api/axiosInstance';
import type { Product } from '../../products';

export interface CategoryProductsResponse {
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    image: string | null;
  };
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CategoryDetail extends Category {
  breadcrumbs: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export const categoryApi = {
  getTree: () =>
    axiosInstance.get<Category[]>(API_ENDPOINTS.CATEGORIES_TREE),

  getAll: () =>
    axiosInstance.get<Category[]>(API_ENDPOINTS.CATEGORIES),

  getById: (id: number) =>
    axiosInstance.get<Category>(API_ENDPOINTS.CATEGORY_BY_ID(id)),

  getBySlug: (slug: string) =>
    axiosInstance.get<CategoryDetail>(`/categories/${slug}`),

  getProducts: (slug: string, params?: {
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) =>
    axiosInstance.get<CategoryProductsResponse>(`/categories/${slug}/products`, { params }),
  create: (formData: FormData) =>
    axiosInstance.post<Category>(API_ENDPOINTS.CATEGORIES, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  update: (id: number, formData: FormData) =>
    axiosInstance.put<Category>(API_ENDPOINTS.CATEGORY_BY_ID(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  delete: (id: number) =>
    axiosInstance.delete(API_ENDPOINTS.CATEGORY_BY_ID(id))
};