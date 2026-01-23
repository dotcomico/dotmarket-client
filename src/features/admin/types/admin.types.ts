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

export interface AdminUser extends User {
  createdAt?: string;
  updatedAt?: string;
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