import { StatCard } from '../../../../components/ui/StatCard/StatCard';
import './DashboardStats.css';

interface DashboardStatsProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    lowStockCount: number;
    totalProducts: number;
  };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="admin-stats">
      <StatCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
        change="+12.5%"
        trend="up"
        color="#10b981"
      />
      <StatCard
        title="Active Orders"
        value={stats.totalOrders.toString()}
        change="+4.2%"
        trend="up"
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
        change="+8.1%"
        trend="up"
        color="#8b5cf6"
      />
    </div>
  );
};