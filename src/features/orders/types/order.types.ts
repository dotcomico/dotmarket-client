import type { Product } from '../../products/types/product.types';
import type { User } from '../../../types';


// Order Status

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';


// Order Item - Individual product

export interface OrderItem {
  id: number;
  quantity: number;
  priceAtPurchase: number;
  ProductId: number;
  Product: Product;
}


 // Order - Complete order with items
 
export interface Order {
  id: number;
  totalAmount: number;
  status: OrderStatus;
  address: string;
  createdAt: string;
  updatedAt: string;
  UserId: number;
  User?: User;
  Products?: Product[];
  OrderItems?: OrderItem[];
}


 // Create Order Data - for creating new order
 
export interface CreateOrderData {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  address: string;
}


//order State - order store zustand

export interface OrderState {
  // State
  orders: Order[];
  currentUserOrders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchOrders: () => Promise<void>;
  fetchOrdersOfCurrentUser: () => Promise<void>;
  fetchOrderById: (orderId: number) => Promise<Order>;
  createOrder: (orderData: CreateOrderData) => Promise<{
    success: boolean;
    order?: Order;
    error?: string;
  }>;
  updateOrderStatus: (orderId: number, status: OrderStatus) => Promise<{
    success: boolean;
    order?: Order;
    error?: string;
  }>;

  // Helpers
  getOrderById: (orderId: number) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getCurrentUserOrdersByStatus: (status: OrderStatus) => Order[];
  getTotalSpent: () => number;
  getCurrentUserTotalSpent: () => number;
  getOrdersCount: () => number;
  getCurrentUserOrdersCount: () => number;
  clearError: () => void;
  clearCurrentOrder: () => void;
  reset: () => void;
}