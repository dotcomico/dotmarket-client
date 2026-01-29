export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const API_TIMEOUT: number = 10000;
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',

  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (pid: number) => `/products/${pid}`,

  // Orders
  ORDERS: '/orders',
  ORDERS_BY_CURRENT_USER: `/orders/privet`,
  ORDER_BY_ID: (oid: number) => `/orders/${oid}`,

  // Categories
  CATEGORIES: '/categories',
  CATEGORIES_TREE: '/categories/tree',
  CATEGORY_BY_ID: (cid: number) => `/categories/${cid}`,

  // Admin
  ADMIN_USERS: '/users',
  ADMIN_UPDATE_ROLE: (uid: number) => `/users/${uid}/role`,
};