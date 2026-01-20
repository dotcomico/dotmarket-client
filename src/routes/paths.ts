export const PATHS = {
   HOME: '/',
  PRODUCTS: '/products',
  LOGIN: '/login',
  CART: '/cart',
  PRODUCT_DETAILS: '/product/:id',
  CHECKOUT: '/checkout',
  CATEGORY_DETAILS: '/categories/:slug',
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
  },
  // User profile
  PROFILE: '/profile',
  ORDERS: '/orders',
} as const;

export const buildPath = {
  productDetail: (id: number | string) => `/product/${id}`,
  categoryDetail: (slug: string) => `/categories/${slug}/products`,
  productsWithSearch: (searchTerm: string) => `/products?search=${encodeURIComponent(searchTerm)}`,
};