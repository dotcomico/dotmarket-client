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
  const { isLoading, error, hasLoaded, loadUsers, refreshUsers, changeRole, filterUsers, getStats } = useUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userBeingEdited, setUserBeingEdited] = useState<AdminUser | null>(null);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = filterUsers(searchQuery, roleFilter);
  const stats = getStats();

  /*
   * The list area has four mutually exclusive states. Deriving them as flags
   * (rather than nesting conditions in the JSX) is what guarantees two of them
   * can never render at once — the bug this replaced, where a failed fetch
   * showed the error banner *and* told the admin to adjust their filters.
   *
   * The error banner stays a sibling above this block on purpose:
   * `updateUserRole` sets `error` without clearing `users`, so a failed role
   * change must show the banner while the table is still on screen.
   */
  const hasRows = filteredUsers.length > 0;
  const showLoading = !hasRows && (!hasLoaded || isLoading);
  const showEmpty = !hasRows && hasLoaded && !isLoading && !error;
  /* Only claim a count we can stand behind — "0 users found" under a failed
     fetch reads as "the table is empty" rather than "the request failed". */
  const showCount = hasRows || (hasLoaded && !error);

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
              {showCount && <p className="subtitle">{filteredUsers.length} users found</p>}
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

          {showLoading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading users...</p>
            </div>
          ) : showEmpty ? (
            <div className="empty-state">
              <div className="empty-state__icon">👤</div>
              <h3>No users found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : hasRows ? (
            <UsersTable
              users={filteredUsers}
              canChangeRole={isAdmin}
              onViewDetails={setSelectedUser}
              onChangeRole={setUserBeingEdited}
            />
          ) : null /* Fetch failed with no rows — the error banner above is the whole story. */}
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
