import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartState } from '../features/cart/types/cart.types';
import type { Product } from '../features/products/types/product.types';

/*
 * Cart Store - Manages shopping cart state
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      // Add item to cart or increment quantity if already exists
      addItem: (product: Product, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            // Increment quantity
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          // Add new item
          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },

      // Remove item completely from cart
      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      // Update item quantity (or remove if 0)
      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      /**
       * Clear entire cart
       */
      clearCart: () => {
        set({ items: [] });
        localStorage.removeItem('cart-storage');
      },

      // Get total number of items
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Get total price
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      // Get quantity of specific item
      getItemQuantity: (productId: number) => {
        const item = get().items.find((item) => item.product.id === productId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);