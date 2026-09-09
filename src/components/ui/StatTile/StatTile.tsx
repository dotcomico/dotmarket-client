import type { ReactNode } from 'react';
import './StatTile.css';

/**
 * StatTile - shared "icon/value/label" summary card used by admin list
 * pages (Users, Categories, Orders) for their stats-row filters.
 *
 * Distinct from `StatCard` (components/ui/StatCard), which renders the
 * trend/percentage-change cards used on the Dashboard — different data
 * shape, different visual pattern, kept separate rather than overloaded
 * into one component.
 */
interface StatTileProps {
  icon?: string;
  value: string | number;
  label: string;
  onClick?: () => void;
  /** Icon box size — 'lg' matches UserManagement, 'md' (default) matches CategoryManagement. */
  iconSize?: 'md' | 'lg';
  /** Page-supplied modifier class(es) for per-variant color tinting. */
  className?: string;
}

export const StatTile = ({ icon, value, label, onClick, iconSize = 'md', className = '' }: StatTileProps) => {
  const classes = [
    'stat-tile',
    icon ? 'stat-tile--with-icon' : 'stat-tile--text-only',
    onClick ? 'stat-tile--clickable' : '',
    iconSize === 'lg' ? 'stat-tile--icon-lg' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {icon && <div className="stat-tile__icon">{icon}</div>}
      <div className="stat-tile__content">
        <div className="stat-tile__value">{value}</div>
        <div className="stat-tile__label">{label}</div>
      </div>
    </div>
  );
};

interface StatTileGridProps {
  /** Desktop column count; collapses to 2 at 1024px and 1 at 768px. */
  cols: 3 | 4;
  children: ReactNode;
}

export const StatTileGrid = ({ cols, children }: StatTileGridProps) => (
  <div className={`stat-tile-grid stat-tile-grid--cols-${cols}`}>{children}</div>
);
