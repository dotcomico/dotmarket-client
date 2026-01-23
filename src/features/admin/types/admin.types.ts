// Admin Dashboard Types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  lowStockCount: number;
  totalProducts: number;
}

export interface RecentOrder {
  id: number;
  customer: string;
  amount: number;
  status: 'completed' | 'processing' | 'pending' | 'cancelled';
  date: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'customer';
}

// Admin Filters
export interface ProductFilter {
  search: string;
  category: string;
  stockStatus: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface OrderFilter {
  status: 'all' | 'completed' | 'processing' | 'pending' | 'cancelled';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}