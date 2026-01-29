import { useCallback } from 'react';
import { useOrderStore } from '../../../store/orderStore';
import { useCartStore } from '../../../store/cartStore';
import type { CreateOrderData } from '../types/order.types';

/*
 * useCheckout - Hook for checkout/order placement
 * Used by: Checkout page
 * 
 * Single responsibility: Handle order creation during checkout
 */
export const useCheckout = () => {
  const {
    currentOrder,
    isLoading,
    error,
    createOrder,
    clearError,
    clearCurrentOrder,
  } = useOrderStore();

  const { clearCart } = useCartStore();

  /*
   * Place order with cart items
   */
  const placeOrder = useCallback(async (address: string) => {
    const cartItems = useCartStore.getState().items;

    if (cartItems.length === 0) {
      return {
        success: false,
        error: 'Cart is empty'
      };
    }

    const orderData: CreateOrderData = {
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      })),
      address
    };

    const result = await createOrder(orderData);

    if (result.success) {
      clearCart();
    }

    return result;
  }, [createOrder, clearCart]);

  return {
    // State
    currentOrder,
    isLoading,
    error,

    // Actions
    placeOrder,
    clearError,
    clearCurrentOrder,
  };
};
