import { useState, useEffect } from 'react';
import { AdminHeader } from '../../../components/admin/AdminHeader/AdminHeader';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import type { AdminUser, UserRole } from '../../../features/admin/types/admin.types';
import { useAdminAccess } from '../../../features/admin/hooks/useAdminAccess';
import { useUsers } from '../../../features/admin/hooks/useUsers';
import { getRelativeTime as getRelativeTimeShared } from '../../../utils/formatters';
import './UserManagement.css';
import RefreshButton from '../../../components/admin/RefreshButton/RefreshButton';

const UserManagement = () => {
  const { isAdmin } = useAdminAccess();
  const { isLoading, error, loadUsers, refreshUsers, changeRole, filterUsers, getStats } = useUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showRoleModal, setShowRoleModal] = useState<AdminUser | null>(null);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = filterUsers(searchQuery, roleFilter);
  const stats = getStats();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Fallback to this page's own formatDate (shows year, not time) for the
  // >=7-day case, so output stays identical to before the dedupe.
  const getRelativeTime = (dateString: string) => getRelativeTimeShared(dateString, formatDate);

  const getRoleBadgeClass = (role: UserRole) => {
    const classes: Record<UserRole, string> = {
      admin: 'role-badge--admin',
      manager: 'role-badge--manager',
      customer: 'role-badge--customer'
    };
    return classes[role];
  };

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    const result = await changeRole(userId, newRole);
    if (result.success) {
      setShowRoleModal(null);
    } else {
      console.error('Failed to update role:', result.error);
    }
  };

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user);
  };

  return (
    <>
      <AdminHeader title="User Management" />

      <main className="admin-main">
        {/* Stats Summary */}
        <div className="user-stats">
          <div className="user-stat-card" onClick={() => setRoleFilter('all')}>
            <div className="user-stat-card__icon">👥</div>
            <div className="user-stat-card__content">
              <div className="user-stat-card__value">{stats.total}</div>
              <div className="user-stat-card__label">Total Users</div>
            </div>
          </div>
          <div className="user-stat-card user-stat-card--admin" onClick={() => setRoleFilter('admin')}>
            <div className="user-stat-card__icon">🛡️</div>
            <div className="user-stat-card__content">
              <div className="user-stat-card__value">{stats.admins}</div>
              <div className="user-stat-card__label">Admins</div>
            </div>
          </div>
          <div className="user-stat-card user-stat-card--manager" onClick={() => setRoleFilter('manager')}>
            <div className="user-stat-card__icon">👔</div>
            <div className="user-stat-card__content">
              <div className="user-stat-card__value">{stats.managers}</div>
              <div className="user-stat-card__label">Managers</div>
            </div>
          </div>
          <div className="user-stat-card user-stat-card--customer" onClick={() => setRoleFilter('customer')}>
            <div className="user-stat-card__icon">🛒</div>
            <div className="user-stat-card__content">
              <div className="user-stat-card__value">{stats.customers}</div>
              <div className="user-stat-card__label">Customers</div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          {/* Header Section */}
          <div className="user-management-header">
            <div className="user-management-header__info">
              <h2>Users</h2>
              <p className="subtitle">{filteredUsers.length} users found</p>
            </div>
            <RefreshButton onClick={refreshUsers} isLoading={isLoading} />
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            <div className="admin-search-wrapper">
              <SearchBar
                placeholder="Search by username or email..."
                navigateOnEnter={false}
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>

            <select
              className="role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'all' | UserRole)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
              <button onClick={refreshUsers} className="btn-link">Retry</button>
            </div>
          )}

          {/* Users Table */}
          {isLoading && filteredUsers.length === 0 ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">👤</div>
              <h3>No users found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Joined</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {user.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="user-info">
                            <div className="user-name">{user.username}</div>
                            <div className="user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="orders-cell">{user.ordersCount ?? 0}</td>
                      <td className="spent-cell">
                        {(user.totalSpent ?? 0) > 0 ? `$${(user.totalSpent ?? 0).toFixed(2)}` : '—'}
                      </td>
                      <td className="date-cell">{formatDate(user.createdAt)}</td>
                      <td className="activity-cell">{getRelativeTime(user.lastActive ?? user.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn action-btn--view"
                            onClick={() => handleViewDetails(user)}
                            title="View Details"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          {isAdmin && (
                            <button
                              className="action-btn action-btn--edit"
                              onClick={() => setShowRoleModal(user)}
                              title="Change Role"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          )}
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="modal modal--large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>User Details</h3>
                <button
                  className="modal-close"
                  onClick={() => setSelectedUser(null)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="user-detail-header">
                  <div className="user-detail-avatar">
                    {selectedUser.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="user-detail-info">
                    <h4>{selectedUser.username}</h4>
                    <p>{selectedUser.email}</p>
                    <span className={`role-badge ${getRoleBadgeClass(selectedUser.role)}`}>
                      {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="user-details-grid">
                  <div className="user-detail-section">
                    <h4>Account Information</h4>
                    <div className="detail-row">
                      <span className="detail-label">User ID:</span>
                      <span className="detail-value">#{selectedUser.id}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Joined:</span>
                      <span className="detail-value">{formatDate(selectedUser.createdAt)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Last Active:</span>
                      <span className="detail-value">{getRelativeTime(selectedUser.lastActive ?? selectedUser.createdAt)}</span>
                    </div>
                  </div>

                  <div className="user-detail-section">
                    <h4>Activity</h4>
                    <div className="detail-row">
                      <span className="detail-label">Total Orders:</span>
                      <span className="detail-value">{selectedUser.ordersCount ?? 0}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Total Spent:</span>
                      <span className="detail-value detail-value--highlight">
                        ${(selectedUser.totalSpent ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Avg. Order Value:</span>
                      <span className="detail-value">
                        {(selectedUser.ordersCount ?? 0) > 0
                          ? `$${((selectedUser.totalSpent ?? 0) / (selectedUser.ordersCount ?? 1)).toFixed(2)}`
                          : '—'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Change Role Modal */}
        {showRoleModal && isAdmin && (
          <div className="modal-overlay" onClick={() => setShowRoleModal(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Change User Role</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowRoleModal(null)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="role-change-user">
                  <div className="user-avatar user-avatar--large">
                    {showRoleModal.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="user-name">{showRoleModal.username}</div>
                    <div className="user-email">{showRoleModal.email}</div>
                  </div>
                </div>

                <div className="role-selection">
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="customer"
                      checked={showRoleModal.role === 'customer'}
                      onChange={() => handleRoleChange(showRoleModal.id, 'customer')}
                    />
                    <div className="role-option__content">
                      <span className="role-option__icon">🛒</span>
                      <div>
                        <div className="role-option__title">Customer</div>
                        <div className="role-option__desc">Can browse and purchase products</div>
                      </div>
                    </div>
                  </label>

                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="manager"
                      checked={showRoleModal.role === 'manager'}
                      onChange={() => handleRoleChange(showRoleModal.id, 'manager')}
                    />
                    <div className="role-option__content">
                      <span className="role-option__icon">👔</span>
                      <div>
                        <div className="role-option__title">Manager</div>
                        <div className="role-option__desc">Can manage products and orders</div>
                      </div>
                    </div>
                  </label>

                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={showRoleModal.role === 'admin'}
                      onChange={() => handleRoleChange(showRoleModal.id, 'admin')}
                    />
                    <div className="role-option__content">
                      <span className="role-option__icon">🛡️</span>
                      <div>
                        <div className="role-option__title">Admin</div>
                        <div className="role-option__desc">Full access including user management</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default UserManagement;
