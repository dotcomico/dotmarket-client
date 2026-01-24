import type { User, UserRole } from '../../../types';

// Re-export for convenience
export type { User, UserRole };

// Admin Dashboard Types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  lowStockCount: number;
  totalProducts: number;
}

export type OrderStatus = 'completed' | 'processing' | 'pending' | 'cancelled';

export interface RecentOrder {
  id: number;
  customer: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

// Extended User for admin management views
export interface AdminUser extends User {
  createdAt: string;
  updatedAt?: string;
  ordersCount?: number;
  totalSpent?: number;
  lastActive?: string;
}

// Order with customer details for management view
export interface AdminOrder {
  id: number;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  items: number;
  amount: number;
  status: OrderStatus;
  address: string;
  createdAt: string;
  updatedAt: string;
}

// Admin Filters
export interface ProductFilter {
  search: string;
  category: string;
  stockStatus: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface OrderFilter {
  status: 'all' | OrderStatus;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface UserFilter {
  search: string;
  role: 'all' | UserRole;
}