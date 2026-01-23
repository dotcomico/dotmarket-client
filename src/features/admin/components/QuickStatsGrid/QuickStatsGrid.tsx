import './QuickStatsGrid.css';

interface QuickStatsGridProps {
  stats: {
    totalProducts: number;
    lowStockCount: number;
    totalRevenue: number;
  };
}

export const QuickStatsGrid = ({ stats }: QuickStatsGridProps) => {
  return (
    <div className="dashboard-grid dashboard-grid--3col">
      <div className="admin-card admin-card--highlight">
        <div className="quick-stat">
          <div className="quick-stat__icon" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
            📦
          </div>
          <div className="quick-stat__info">
            <div className="quick-stat__value">{stats.totalProducts}</div>
            <div className="quick-stat__label">Total Products</div>
          </div>
        </div>
      </div>

      <div className="admin-card admin-card--highlight">
        <div className="quick-stat">
          <div className="quick-stat__icon" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
            ⚠️
          </div>
          <div className="quick-stat__info">
            <div className="quick-stat__value">{stats.lowStockCount}</div>
            <div className="quick-stat__label">Need Restock</div>
          </div>
        </div>
      </div>

      <div className="admin-card admin-card--highlight">
        <div className="quick-stat">
          <div className="quick-stat__icon" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
            💰
          </div>
          <div className="quick-stat__info">
            <div className="quick-stat__value">${(stats.totalRevenue / 1000).toFixed(1)}K</div>
            <div className="quick-stat__label">Inventory Value</div>
          </div>
        </div>
      </div>
    </div>
  );
};