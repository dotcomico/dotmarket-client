import { useState, useEffect } from 'react';
import { AdminHeader } from '../../../components/admin/AdminHeader/AdminHeader';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import type { User, UserRole } from '../../../types';
import { useAdminAccess } from '../../../features/admin/hooks/useAdminAccess';
import { userApi } from '../../../features/admin/api/userApi';
import './UserManagement.css';
import RefreshButton from '../../../components/admin/RefreshButton/RefreshButton';

interface AdminUser extends User {
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
  lastActive: string;
}

const UserManagement = () => {
  const { isAdmin } = useAdminAccess();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showRoleModal, setShowRoleModal] = useState<AdminUser | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.getAll();
      const mappedUsers: AdminUser[] = response.data.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        ordersCount: 0,
        totalSpent: 0,
        lastActive: user.updatedAt || user.createdAt,
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  const getRoleBadgeClass = (role: UserRole) => {
    const classes: Record<UserRole, string> = {
      admin: 'role-badge--admin',
      manager: 'role-badge--manager',
      customer: 'role-badge--customer'
    };
    return classes[role];
  };

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    try {
      await userApi.updateRole(userId, newRole);
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setShowRoleModal(null);
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user);
  };

  // Calculate summary stats
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    managers: users.filter(u => u.role === 'manager').length,
    customers: users.filter(u => u.role === 'customer').length,
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
            <RefreshButton onClick={fetchUsers} isLoading={isLoading} />
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

          {/* Users Table */}
          {isLoading ? (
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
                      <td className="orders-cell">{user.ordersCount}</td>
                      <td className="spent-cell">
                        {user.totalSpent > 0 ? `$${user.totalSpent.toFixed(2)}` : '—'}
                      </td>
                      <td className="date-cell">{formatDate(user.createdAt)}</td>
                      <td className="activity-cell">{getRelativeTime(user.lastActive)}</td>
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
                      <span className="detail-value">{getRelativeTime(selectedUser.lastActive)}</span>
                    </div>
                  </div>

                  <div className="user-detail-section">
                    <h4>Activity</h4>
                    <div className="detail-row">
                      <span className="detail-label">Total Orders:</span>
                      <span className="detail-value">{selectedUser.ordersCount}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Total Spent:</span>
                      <span className="detail-value detail-value--highlight">
                        ${selectedUser.totalSpent.toFixed(2)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Avg. Order Value:</span>
                      <span className="detail-value">
                        {selectedUser.ordersCount > 0
                          ? `$${(selectedUser.totalSpent / selectedUser.ordersCount).toFixed(2)}`
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