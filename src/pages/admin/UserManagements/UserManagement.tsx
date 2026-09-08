import { useState, useEffect } from 'react';
import { AdminHeader } from '../../../components/admin/AdminHeader/AdminHeader';
import RefreshButton from '../../../components/admin/RefreshButton/RefreshButton';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import { StatTile, StatTileGrid } from '../../../components/ui/StatTile/StatTile';
import {
  useAdminAccess,
  useUsers,
  UsersTable,
  UserDetailsModal,
  ChangeRoleModal
} from '../../../features/admin';
import type { AdminUser, UserRole } from '../../../features/admin';
import './UserManagement.css';

const UserManagement = () => {
  const { isAdmin } = useAdminAccess();
  const { isLoading, error, loadUsers, refreshUsers, changeRole, filterUsers, getStats } = useUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userBeingEdited, setUserBeingEdited] = useState<AdminUser | null>(null);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = filterUsers(searchQuery, roleFilter);
  const stats = getStats();

  const handleRoleChange = async (newRole: UserRole) => {
    if (!userBeingEdited) return;

    const result = await changeRole(userBeingEdited.id, newRole);
    if (result.success) {
      setUserBeingEdited(null);
    } else {
      console.error('Failed to update role:', result.error);
    }
  };

  return (
    <>
      <AdminHeader title="User Management" />

      <main className="admin-main">
        {/* Stats double as role filters */}
        <StatTileGrid cols={4}>
          <StatTile
            icon="👥"
            iconSize="lg"
            value={stats.total}
            label="Total Users"
            className="user-stat-card"
            onClick={() => setRoleFilter('all')}
          />
          <StatTile
            icon="🛡️"
            iconSize="lg"
            value={stats.admins}
            label="Admins"
            className="user-stat-card user-stat-card--admin"
            onClick={() => setRoleFilter('admin')}
          />
          <StatTile
            icon="👔"
            iconSize="lg"
            value={stats.managers}
            label="Managers"
            className="user-stat-card user-stat-card--manager"
            onClick={() => setRoleFilter('manager')}
          />
          <StatTile
            icon="🛒"
            iconSize="lg"
            value={stats.customers}
            label="Customers"
            className="user-stat-card user-stat-card--customer"
            onClick={() => setRoleFilter('customer')}
          />
        </StatTileGrid>

        <div className="admin-card">
          <div className="user-management-header">
            <div className="user-management-header__info">
              <h2>Users</h2>
              <p className="subtitle">{filteredUsers.length} users found</p>
            </div>
            <RefreshButton onClick={refreshUsers} isLoading={isLoading} />
          </div>

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
              aria-label="Filter users by role"
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
            <UsersTable
              users={filteredUsers}
              canChangeRole={isAdmin}
              onViewDetails={setSelectedUser}
              onChangeRole={setUserBeingEdited}
            />
          )}
        </div>

        {selectedUser && (
          <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        )}

        {userBeingEdited && isAdmin && (
          <ChangeRoleModal
            user={userBeingEdited}
            onSelectRole={handleRoleChange}
            onClose={() => setUserBeingEdited(null)}
          />
        )}
      </main>
    </>
  );
};

export default UserManagement;
