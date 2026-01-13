import type { Category } from '../types/category.types';
import { API_ENDPOINTS } from '../../../api/apiConfig';
import axiosInstance from '../../../api/axiosInstance';

export const categoryApi = {
  getTree: () => 
    axiosInstance.get<Category[]>(API_ENDPOINTS.CATEGORIES_TREE),
  
  getAll: () => 
    axiosInstance.get<Category[]>(API_ENDPOINTS.CATEGORIES),
  
  getById: (id: number) => 
    axiosInstance.get<Category>(API_ENDPOINTS.CATEGORY_BY_ID(id))
};