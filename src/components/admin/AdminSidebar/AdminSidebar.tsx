import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import { useAdminAccess } from '../../../features/admin/hooks/useAdminAccess';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import './AdminSidebar.css';
import { useUIStore } from '../../../store/uiStore';
import { useEffect } from 'react';

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

  // collapse state
  const { isSidebarCollapsed, toggleSidebar, collapseSidebar } = useUIStore();

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        collapseSidebar();
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapseSidebar]);


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
    <div className={`admin-sidebar ${isSidebarCollapsed ? 'admin-sidebar--collapsed' : ''}`}>
      {/* 🆕 Toggle button */}
      <button
        className="admin-sidebar__toggle"
        onClick={toggleSidebar}
        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isSidebarCollapsed ? (
            <path d="M9 18l6-6-6-6" />
          ) : (
            <path d="M15 18l-6-6 6-6" />
          )}
        </svg>
      </button>

      {/* 🆕 Brand logo instead of Dashboard */}
      <Link to={PATHS.HOME} className="admin-sidebar__logo" aria-label="DotMarket home">
        {isSidebarCollapsed ? '🛒' : '🛒 DotMarket'}
      </Link>

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
              title={isSidebarCollapsed ? item.label : undefined}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="admin-sidebar__icon" aria-hidden="true">{item.icon}</span>
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Sign Out */}
      <button
        onClick={logout}
        className="admin-sidebar__logout"
        title={isSidebarCollapsed ? 'Sign Out' : undefined}
        aria-label="Sign Out"
      >
        <span className="admin-sidebar__icon" aria-hidden="true">🚪</span>
        {!isSidebarCollapsed && <span>Sign Out</span>}
      </button>
    </div>
  );
};