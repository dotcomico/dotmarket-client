import axiosInstance from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../api/apiConfig';
import type { Order, CreateOrderData, OrderStatus } from '../types/order.types';

/**
 * Order API Service
 * Handles all order-related API calls
 */
export const orderApi = {
  /**
   * Get all orders
   * - Customers see only their orders
   * - Admin/Manager see all orders
   */
  getAll: async () => {
    const response = await axiosInstance.get<Order[]>(API_ENDPOINTS.ORDERS);
    return response;
  },

  /**
   * Get specific order by ID
   * - Only order owner or admin/manager can view
   */
  getById: async (orderId: number) => {
    const response = await axiosInstance.get<Order>(
      API_ENDPOINTS.ORDER_BY_ID(orderId)
    );
    return response;
  },

  /**
   * Create new order (Checkout)
   * - Validates products and stock
   * - Calculates total amount
   * - Creates order and order items
   * - Reduces product stock
   */
  create: async (orderData: CreateOrderData) => {
    const response = await axiosInstance.post<{
      message: string;
      order: Order;
    }>(API_ENDPOINTS.ORDERS, orderData);
    
    return {
      ...response,
      data: response.data.order // Extract order from response
    };
  },

  /**
   * Update order status (Admin/Manager only)
   */
  updateStatus: async (orderId: number, status: OrderStatus) => {
    const response = await axiosInstance.put<{
      message: string;
      order: Order;
    }>(API_ENDPOINTS.ORDER_BY_ID(orderId), { status });
    
    return {
      ...response,
      data: response.data.order
    };
  },

  /**
   * Delete order (Admin only)
   */
  delete: async (orderId: number) => {
    const response = await axiosInstance.delete<{
      message: string;
    }>(API_ENDPOINTS.ORDER_BY_ID(orderId));
    
    return response;
  }
};

export type { Order, CreateOrderData, OrderStatus };