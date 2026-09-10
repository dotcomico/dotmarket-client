import type { ProductStats } from '../../../../features/products';
import './QuickStatsGrid.css';

/**
 * QuickStatsGrid - the secondary catalogue summary row.
 *
 * Every figure here is catalogue-wide, so all three come from the backend
 * stats response rather than from the paginated `products` array. `null`
 * means "not loaded yet" and renders as a dash — showing 0 while the request
 * is in flight would state something false with full confidence.
 */
interface QuickStatsGridProps {
  stats: ProductStats | null;
}

/** Placeholder for a backend figure that hasn't arrived (or failed to). */
const UNKNOWN = '—';

export const QuickStatsGrid = ({ stats }: QuickStatsGridProps) => (
  <div className="dashboard-grid dashboard-grid--3col">
    <div className="admin-card admin-card--highlight">
      <div className="quick-stat">
        <div className="quick-stat__icon" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
          📦
        </div>
        <div className="quick-stat__info">
          <div className="quick-stat__value">{stats ? stats.totalProducts : UNKNOWN}</div>
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
          <div className="quick-stat__value">{stats ? stats.lowStockCount : UNKNOWN}</div>
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
          {/* Was fed `totalRevenue` while labelled "Inventory Value" - two
              different numbers under one label. Now it is the real thing. */}
          <div className="quick-stat__value">
            {stats
              ? `$${stats.inventoryValue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`
              : UNKNOWN}
          </div>
          <div className="quick-stat__label">Inventory Value</div>
        </div>
      </div>
    </div>
  </div>
);
