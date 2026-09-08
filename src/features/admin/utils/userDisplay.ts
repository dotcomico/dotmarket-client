import { getRelativeTime as getRelativeTimeShared } from '../../../utils/formatters';
import type { UserRole } from '../types/admin.types';

/**
 * Long-form date (month/day/year, no time) used by the user admin views.
 * Deliberately different from the shared `formatDate`, which shows a time
 * instead of a year — user rows care about the join date, not the hour.
 */
export const formatUserDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/** Relative time ("3h ago") that falls back to `formatUserDate` past 7 days. */
export const getUserRelativeTime = (dateString: string) =>
  getRelativeTimeShared(dateString, formatUserDate);

/** Avatar initials, e.g. "dotan" -> "DO". */
export const getUserInitials = (username: string) =>
  username.substring(0, 2).toUpperCase();

/** "admin" -> "Admin" */
export const formatRoleLabel = (role: UserRole) =>
  role.charAt(0).toUpperCase() + role.slice(1);

export const getRoleBadgeClass = (role: UserRole) => {
  const classes: Record<UserRole, string> = {
    admin: 'role-badge--admin',
    manager: 'role-badge--manager',
    customer: 'role-badge--customer'
  };
  return classes[role];
};
