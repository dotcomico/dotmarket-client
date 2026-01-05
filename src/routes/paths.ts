export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  CART: '/cart',
  PRODUCT_DETAILS: '/product/:id',
  CHECKOUT: '/checkout',
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
  },
  // User profile
  PROFILE: '/profile',
  ORDERS: '/orders',
} as const;