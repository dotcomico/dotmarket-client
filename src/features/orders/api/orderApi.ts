import axiosInstance from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../api/apiConfig';
import type { Order, CreateOrderData, OrderStatus } from '../types/order.types';


// Handles all order-related API calls

export const orderApi = {

  //  Customers see only their orders
  // Admin/Manager see all orders

  getAll: async () => {
    const response = await axiosInstance.get<Order[]>(API_ENDPOINTS.ORDERS);
    return response;
  },
  getAllOfCurrentUser: async () => {
    const response = await axiosInstance.get<Order[]>(API_ENDPOINTS.ORDERS_BY_CURRENT_USER);
    return response;
  },


  // Get specific order by ID
  // Only order owner or admin/manager can view

  getById: async (orderId: number) => {
    const response = await axiosInstance.get<Order>(
      API_ENDPOINTS.ORDER_BY_ID(orderId)
    );
    return response;
  },



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


  // Update order status (Admin/Manager only)

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


  // Delete order (Admin only)

  delete: async (orderId: number) => {
    const response = await axiosInstance.delete<{
      message: string;
    }>(API_ENDPOINTS.ORDER_BY_ID(orderId));

    return response;
  }
};

export type { Order, CreateOrderData, OrderStatus };