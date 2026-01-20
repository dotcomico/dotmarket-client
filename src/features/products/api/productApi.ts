import axiosInstance from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../api/apiConfig';
import type { Product, ProductsResponse, ProductFilters } from '../types/product.types';

export const productApi = {
  // Get all products with optional filters
  getAll: (filters?: ProductFilters) => 
    axiosInstance.get<ProductsResponse>(API_ENDPOINTS.PRODUCTS, { 
      params: filters 
    }),
  
  // Get single product by ID
  getById: (id: number) => 
    axiosInstance.get<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id)),
  
  // Create new product (Admin only)
  create: (formData: FormData) =>
    axiosInstance.post<Product>(API_ENDPOINTS.PRODUCTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Update product (Admin only)
  update: (id: number, formData: FormData) =>
    axiosInstance.put<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Delete product (Admin only)
  delete: (id: number) =>
    axiosInstance.delete(API_ENDPOINTS.PRODUCT_BY_ID(id))
};