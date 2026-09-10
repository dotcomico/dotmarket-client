import type { User, UserRole } from '../../../types';

// Re-export for convenience
export type { User, UserRole };

/*
 * NOTE: the old `DashboardStats` type lived here and bundled order aggregates
 * and product aggregates into one bag, which is what let the dashboard derive
 * catalogue-wide product numbers from a single paginated page. It was unused
 * outside its own re-export and has been removed: order aggregates are derived
 * in the page from fully-loaded state, product aggregates come from the
 * backend as `ProductStats` (features/products/types/product.types.ts).
 */

export type OrderStatus = 'completed' | 'processing' | 'pending' | 'cancelled';

export interface RecentOrder {
  id: number;
  customer: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

/**
 * Extended User for admin management views.
 *
 * `ordersCount` / `totalSpent` are REQUIRED: `GET /users` computes both in SQL
 * and sends them on every row, so an absent value would mean a broken response,
 * not "no data". They were optional while the store stubbed them to 0; keeping
 * them optional now would just preserve the `?? 0` fallbacks that hid the stub.
 *
 * Definitions (must match the dashboard revenue tile, or the two screens
 * disagree):
 * - `totalSpent` sums paid + shipped orders only (pending/cancelled excluded).
 * - `ordersCount` counts ALL orders placed, cancelled included.
 *
 * There is deliberately no `lastActive`: the app records no login/activity
 * events, so the only candidate was `updatedAt`, which is a row-mutation
 * timestamp wearing an activity label.
 */
export interface AdminUser extends User {
  createdAt: string;
  updatedAt: string;
  ordersCount: number;
  totalSpent: number;
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