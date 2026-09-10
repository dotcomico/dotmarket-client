import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string | number;
  /**
   * Optional supporting line under the value.
   *
   * Omit it entirely when there is nothing true to say — the card renders
   * cleanly without it. Never pass a placeholder or a fabricated figure just
   * to keep the row occupied.
   */
  subtext?: string;
  /** Card background; also the only good/bad signal the card carries. */
  color: string;
}

/**
 * StatCard - the large coloured headline metric used on the admin dashboard.
 *
 * There is deliberately no `trend` / up-down arrow prop. The app stores no
 * historical or per-period data, so an arrow could only ever be decoration
 * pretending to be a period-over-period delta. Good/bad is signalled by
 * `color` instead, which claims nothing about direction.
 */
export const StatCard = ({ title, value, subtext, color }: StatCardProps) => (
  <div className="stat-card" style={{ backgroundColor: color }}>
    <div className="stat-card__title">{title}</div>
    <div className="stat-card__value">{value}</div>
    {subtext && <div className="stat-card__subtext">{subtext}</div>}
  </div>
);
