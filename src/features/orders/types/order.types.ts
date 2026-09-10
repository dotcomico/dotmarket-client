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
  /** Shared request state for the customer/detail/create order calls. */
  isLoading: boolean;
  error: string | null;

  /* Request state for the admin `orders` list only. Kept separate from the
     shared pair above so an unrelated in-flight order request can neither
     spinner-out nor error-out the admin views — and so `fetchOrders`'
     re-entrancy guard only ever skips a duplicate of itself. */
  isOrdersLoading: boolean;
  ordersError: string | null;
  /**
   * True only after `fetchOrders` has SUCCEEDED in this session. Never
   * persisted, so a rehydrated `orders` array does not set it.
   *
   * `orders: []` is ambiguous on its own ("not fetched yet" vs. "no orders"),
   * so any aggregate presented to the user must be gated on this flag and
   * rendered as unknown while it is false — never as a confident zero.
   */
  ordersLoaded: boolean;

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

  /* Helpers
     Lookup only. Aggregates (totals, per-status counts, spend) are NOT
     exposed as getters — they are derived from the reactive `orders` slice at
     render time via `utils/orderStats.ts`. */
  getOrderById: (orderId: number) => Order | undefined;
  clearError: () => void;
  clearCurrentOrder: () => void;
  reset: () => void;
}


// Order Stats Summary - aggregate shown by the customer <OrderStats /> tiles.
// Derived from the orders array at render time (see utils/orderStats.ts),
// never stored: it is fully computable from state we already hold.

export interface OrderStatsSummary {
  /** Every order the user has, cancelled ones included. */
  totalOrders: number;
  /** Realized money only: paid + shipped (see REVENUE_ORDER_STATUSES). */
  totalSpent: number;
  pendingCount: number;
  shippedCount: number;
}
