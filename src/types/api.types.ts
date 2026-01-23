/**
 * Global API type definitions
 * Shared response wrappers and API utilities
 */

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  errors?: Array<{ msg: string }>;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}