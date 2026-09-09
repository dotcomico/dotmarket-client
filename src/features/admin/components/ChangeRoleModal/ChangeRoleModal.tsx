import type { AdminUser, UserRole } from '../../types/admin.types';
import { getUserInitials } from '../../utils/userDisplay';

interface RoleOption {
  value: UserRole;
  icon: string;
  title: string;
  description: string;
}

/**
 * The three assignable roles, in ascending order of privilege. Local to this
 * modal — the only place a role is picked by hand.
 */
const ROLE_OPTIONS: RoleOption[] = [
  {
    value: 'customer',
    icon: '🛒',
    title: 'Customer',
    description: 'Can browse and purchase products'
  },
  {
    value: 'manager',
    icon: '👔',
    title: 'Manager',
    description: 'Can manage products and orders'
  },
  {
    value: 'admin',
    icon: '🛡️',
    title: 'Admin',
    description: 'Full access including user management'
  }
];

interface ChangeRoleModalProps {
  /** Always defined — the page owns the "is it open?" decision. */
  user: AdminUser;
  onSelectRole: (role: UserRole) => void;
  onClose: () => void;
}

/**
 * Role picker for a single user. Selecting a role fires immediately; the page
 * closes the modal once the update succeeds.
 */
export const ChangeRoleModal = ({ user, onSelectRole, onClose }: ChangeRoleModalProps) => (
  <div className="modal-overlay" onClick={onClose}>
    <div
      className="modal"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-role-title"
    >
      <div className="modal-header">
        <h3 id="change-role-title">Change User Role</h3>
        <button className="modal-close" onClick={onClose} aria-label="Close role picker">
          ×
        </button>
      </div>
      <div className="modal-body">
        <div className="role-change-user">
          <div className="user-avatar user-avatar--large">{getUserInitials(user.username)}</div>
          <div>
            <div className="user-name">{user.username}</div>
            <div className="user-email">{user.email}</div>
          </div>
        </div>

        <div className="role-selection">
          {ROLE_OPTIONS.map(option => (
            <label className="role-option" key={option.value}>
              <input
                type="radio"
                name="role"
                value={option.value}
                checked={user.role === option.value}
                onChange={() => onSelectRole(option.value)}
              />
              <div className="role-option__content">
                <span className="role-option__icon">{option.icon}</span>
                <div>
                  <div className="role-option__title">{option.title}</div>
                  <div className="role-option__desc">{option.description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);
