import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

export const StatCard = ({ title, value, change, trend, color }: StatCardProps) => (
  <div className="stat-card" style={{ backgroundColor: color }}>
    <div className="stat-card__title">{title}</div>
    <div className="stat-card__value">{value}</div>
    <div className="stat-card__change">
      {trend === 'up' ? '↗' : '↘'} {change}
    </div>
  </div>
);