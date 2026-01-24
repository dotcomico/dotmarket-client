import type { Product } from '../../products/types/product.types';
import type { User } from '../../../types';

/**
 * Order Status
 * Maps to backend ORDER_STATUS enum in src/config/constants.js
 */
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';

/**
 * Order Item - Individual product in an order
 * Maps to OrderItem model in backend
 */
export interface OrderItem {
  id: number;
  quantity: number;
  priceAtPurchase: number; // Price when order was placed
  ProductId: number;
  Product: Product;
}

/**
 * Order - Complete order with items
 * Maps to Order model in backend
 */
export interface Order {
  id: number;
  totalAmount: number;
  status: OrderStatus;
  address: string;
  createdAt: string;
  updatedAt: string;
  UserId: number;
  User?: User; // Only included for admin/manager views
  Products?: Product[]; // Many-to-many relationship
  OrderItems?: OrderItem[]; // Junction table with quantity/price
}

/**
 * Create Order Data - Payload for creating new order
 * Used in checkout process
 */
export interface CreateOrderData {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  address: string;
}

/**
 * Order State - Zustand store interface
 */
export interface OrderState {
  // State
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchOrders: () => Promise<void>;
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
  getTotalSpent: () => number;
  getOrdersCount: () => number;
  clearError: () => void;
  clearCurrentOrder: () => void;
  reset: () => void;
}