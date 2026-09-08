import type { AdminUser } from '../../types/admin.types';
import {
  formatRoleLabel,
  formatUserDate,
  getRoleBadgeClass,
  getUserInitials,
  getUserRelativeTime
} from '../../utils/userDisplay';

interface UserDetailsModalProps {
  /** Always defined — the page owns the "is it open?" decision. */
  user: AdminUser;
  onClose: () => void;
}

/** Read-only summary of a single user. Styling lives in `UserManagement.css`. */
export const UserDetailsModal = ({ user, onClose }: UserDetailsModalProps) => {
  const ordersCount = user.ordersCount ?? 0;
  const totalSpent = user.totalSpent ?? 0;
  const avgOrderValue = ordersCount > 0 ? `$${(totalSpent / ordersCount).toFixed(2)}` : '—';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal--large"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-details-title"
      >
        <div className="modal-header">
          <h3 id="user-details-title">User Details</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close user details">
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="user-detail-header">
            <div className="user-detail-avatar">{getUserInitials(user.username)}</div>
            <div className="user-detail-info">
              <h4>{user.username}</h4>
              <p>{user.email}</p>
              <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                {formatRoleLabel(user.role)}
              </span>
            </div>
          </div>

          <div className="user-details-grid">
            <div className="user-detail-section">
              <h4>Account Information</h4>
              <div className="detail-row">
                <span className="detail-label">User ID:</span>
                <span className="detail-value">#{user.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Joined:</span>
                <span className="detail-value">{formatUserDate(user.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Last Active:</span>
                <span className="detail-value">
                  {getUserRelativeTime(user.lastActive ?? user.createdAt)}
                </span>
              </div>
            </div>

            <div className="user-detail-section">
              <h4>Activity</h4>
              <div className="detail-row">
                <span className="detail-label">Total Orders:</span>
                <span className="detail-value">{ordersCount}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Spent:</span>
                <span className="detail-value detail-value--highlight">
                  ${totalSpent.toFixed(2)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Avg. Order Value:</span>
                <span className="detail-value">{avgOrderValue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
