export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  
  // Orders
  ORDERS: '/orders',
  ORDER_BY_ID: (id: number) => `/orders/${id}`,
  
  // Admin
  ADMIN_USERS: '/users',
  ADMIN_UPDATE_ROLE: (id: number) => `/users/${id}/role`,
};