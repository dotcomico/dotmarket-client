import type { AdminUser } from '../../types/admin.types';
import {
  formatCurrency,
  formatRoleLabel,
  formatUserDate,
  getRoleBadgeClass,
  getUserInitials,
  getUserRelativeTime
} from '../../utils/userDisplay';

interface UsersTableProps {
  users: AdminUser[];
  /** Only full admins may change roles; managers get a read-only table. */
  canChangeRole: boolean;
  onViewDetails: (user: AdminUser) => void;
  onChangeRole: (user: AdminUser) => void;
}

/**
 * Presentational table of admin users. Owns no state — the page decides what
 * to show and what happens on click.
 *
 * Styling comes from the page-level `UserManagement.css` (global stylesheet,
 * not CSS modules), which also defines the shared `.admin-table` chrome.
 *
 * `ordersCount` / `totalSpent` are rendered without fallbacks on purpose: the
 * backend computes both for every user, so a missing value is a bug to surface,
 * not a case to paper over with a zero.
 */
export const UsersTable = ({ users, canChangeRole, onViewDetails, onChangeRole }: UsersTableProps) => (
  <div className="table-wrapper">
    <table className="admin-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Role</th>
          <th>Orders</th>
          <th>Total Spent</th>
          <th>Joined</th>
          <th>Last Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>
              <div className="user-cell">
                <div className="user-avatar">{getUserInitials(user.username)}</div>
                <div className="user-info">
                  <div className="user-name">{user.username}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
            </td>
            <td>
              <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                {formatRoleLabel(user.role)}
              </span>
            </td>
            <td className="orders-cell">{user.ordersCount}</td>
            <td className="spent-cell">{formatCurrency(user.totalSpent)}</td>
            <td className="date-cell">{formatUserDate(user.createdAt)}</td>
            <td className="activity-cell">{getUserRelativeTime(user.updatedAt)}</td>
            <td>
              <div className="action-buttons">
                <button
                  className="action-btn action-btn--view"
                  onClick={() => onViewDetails(user)}
                  title="View Details"
                  aria-label={`View details for ${user.username}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                {canChangeRole && (
                  <button
                    className="action-btn action-btn--edit"
                    onClick={() => onChangeRole(user)}
                    title="Change Role"
                    aria-label={`Change role for ${user.username}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
