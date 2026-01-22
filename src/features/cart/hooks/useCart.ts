import { useCartStore } from '../../../store/cartStore';
import type { Product } from '../../products/types/product.types';

/**
 * Custom hook for cart operations
 * Provides a clean API for working with the cart
 */
export const useCart = () => {
  const {
    items,
    isLoading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getItemQuantity,
  } = useCartStore();

  /**
   * Add product to cart with optional quantity
   */
  const addToCart = (product: Product, quantity: number = 1) => {
    if (quantity <= 0) return;
    if (quantity > product.stock) {
      console.warn('Cannot add more than available stock');
      return;
    }
    addItem(product, quantity);
  };

  /**
   * Remove product from cart
   */
  const removeFromCart = (productId: number) => {
    removeItem(productId);
  };

  /**
   * Update quantity of item in cart
   */
  const changeQuantity = (productId: number, quantity: number) => {
    if (quantity < 0) return;
    
    const item = items.find(item => item.product.id === productId);
    if (item && quantity > item.product.stock) {
      console.warn('Cannot exceed available stock');
      return;
    }
    
    updateQuantity(productId, quantity);
  };

  /**
   * Increment item quantity
   */
  const incrementItem = (productId: number) => {
    const currentQuantity = getItemQuantity(productId);
    changeQuantity(productId, currentQuantity + 1);
  };

  /**
   * Decrement item quantity
   */
  const decrementItem = (productId: number) => {
    const currentQuantity = getItemQuantity(productId);
    if (currentQuantity > 0) {
      changeQuantity(productId, currentQuantity - 1);
    }
  };

  /**
   * Check if product is in cart
   */
  const isInCart = (productId: number): boolean => {
    return items.some(item => item.product.id === productId);
  };

  /**
   * Get cart item count for a specific product
   */
  const getProductQuantity = (productId: number): number => {
    return getItemQuantity(productId);
  };

  return {
    // State
    items,
    isLoading,
    error,
    cartTotal: getTotalPrice(),
    itemCount: getTotalItems(),

    // Actions
    addToCart,
    removeFromCart,
    changeQuantity,
    incrementItem,
    decrementItem,
    clearCart,

    // Helpers
    isInCart,
    getProductQuantity,
  };
};