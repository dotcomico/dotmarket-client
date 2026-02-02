import { useNavigate, useLocation } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import { useAdminAccess } from '../../../features/admin/hooks/useAdminAccess';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import './AdminSidebar.css';

interface NavItem {
  id: string;
  path: string;
  icon: string;
  label: string;
  roles: ('admin' | 'manager')[];
}

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAdminAccess();
  const { logout } = useAuth();

  const navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      path: PATHS.ADMIN.DASHBOARD,
      icon: '📊',
      label: 'Dashboard',
      roles: ['admin', 'manager']
    },
    {
      id: 'orders',
      path: PATHS.ADMIN.ORDERS,
      icon: '🛒',
      label: 'Orders',
      roles: ['admin', 'manager']
    }, {
      id: 'products',
      path: PATHS.ADMIN.PRODUCTS,
      icon: '📦',
      label: 'Products',
      roles: ['admin', 'manager']
    }, {
      id: 'categories',
      path: PATHS.ADMIN.CATEGORIES,
      icon: '🏷️',
      label: 'Categories',
      roles: ['admin', 'manager']
    },
    {
      id: 'users',
      path: PATHS.ADMIN.USERS,
      icon: '👥',
      label: 'Users',
      roles: ['admin']
    },
  ];

  if (!user) return null;

  return (
    <div className="admin-sidebar">
      {/* Logo */}
      <div className="admin-sidebar__logo" onClick={() => navigate(PATHS.HOME)}>
        🛒 DotMarket
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar__nav">
        {navigationItems.map(item => {
          if (!item.roles.includes(user.role as 'admin' | 'manager')) return null;

          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`admin-sidebar__item ${isActive ? 'admin-sidebar__item--active' : ''}`}
            >
              <span className="admin-sidebar__icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sign Out */}
      <button onClick={logout} className="admin-sidebar__logout">
        <span className="admin-sidebar__icon">🚪</span>
        <span>Sign Out</span>
      </button>
    </div>
  );
};