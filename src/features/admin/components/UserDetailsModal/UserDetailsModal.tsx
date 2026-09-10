import type { AdminUser } from '../../types/admin.types';
import {
  formatCurrency,
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
export const UserDetailsModal = ({ user, onClose }: UserDetailsModalProps) => (
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
            {/*
              This row was labelled "Last Active" over `updatedAt`. The app
              records no login or activity events, so that label promised data
              the system does not have. It now says what the timestamp is.
            */}
            <div className="detail-row">
              <span className="detail-label">Last Updated:</span>
              <span className="detail-value">{getUserRelativeTime(user.updatedAt)}</span>
            </div>
          </div>

          <div className="user-detail-section">
            <h4>Activity</h4>
            <div className="detail-row">
              <span className="detail-label">Total Orders:</span>
              <span className="detail-value">{user.ordersCount}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Spent:</span>
              <span className="detail-value detail-value--highlight">
                {formatCurrency(user.totalSpent)}
              </span>
            </div>
            {/*
              An "Avg. Order Value" row used to sit here as
              totalSpent / ordersCount. That divides paid+shipped money by a
              count that also includes cancelled orders, so it silently
              under-reports for anyone with a cancellation. The two numbers
              answer different questions and cannot be divided; the note below
              states the definitions instead of inventing a third figure.
            */}
            <p className="detail-note">
              Spend counts paid and shipped orders. The order count includes
              cancelled orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
