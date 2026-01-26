import { StatCard } from '../../../../components/ui/StatCard/StatCard';
import './DashboardStats.css';

/**
 * DashboardStats - Displays key metrics on admin dashboard
 */
interface DashboardStatsProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    lowStockCount: number;
    totalProducts: number;
    pendingOrders?: number;
  };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  // Calculate change percentages (in a real app, compare with previous period)
  const getRevenueChange = () => {
    // Placeholder - in production, calculate from historical data
    return stats.totalRevenue > 0 ? '+12.5%' : 'No revenue yet';
  };

  const getOrderChange = () => {
    if (stats.pendingOrders && stats.pendingOrders > 0) {
      return `${stats.pendingOrders} pending`;
    }
    return stats.totalOrders > 0 ? '+4.2%' : 'No orders yet';
  };

  return (
    <div className="admin-stats">
      <StatCard
        title="Total Revenue"
        value={stats.totalRevenue > 0 
          ? `$${stats.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}` 
          : '$0'}
        change={getRevenueChange()}
        trend={stats.totalRevenue > 0 ? 'up' : 'down'}
        color="#10b981"
      />
      <StatCard
        title="Total Orders"
        value={stats.totalOrders.toString()}
        change={getOrderChange()}
        trend={stats.totalOrders > 0 ? 'up' : 'down'}
        color="#3b82f6"
      />
      <StatCard
        title="Low Stock Alert"
        value={stats.lowStockCount.toString()}
        change={stats.lowStockCount > 0 ? "Action needed" : "All good"}
        trend={stats.lowStockCount > 0 ? "down" : "up"}
        color={stats.lowStockCount > 0 ? "#ef4444" : "#10b981"}
      />
      <StatCard
        title="Total Products"
        value={stats.totalProducts.toString()}
        change={stats.totalProducts > 0 ? '+8.1%' : 'Add products'}
        trend={stats.totalProducts > 0 ? "up" : "down"}
        color="#8b5cf6"
      />
    </div>
  );
};