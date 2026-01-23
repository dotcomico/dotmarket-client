import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../../store/uiStore';
import { PATHS } from '../../../routes/paths';
import './UserMenuPopup.css';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'customer';
}

interface UserMenuPopupProps {
  user: User;
  onClose: () => void;
  onLogout: () => void;
}

export const UserMenuPopup = ({ user, onClose, onLogout }: UserMenuPopupProps) => {
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useUIStore(); // Kept isDark for the toggle icon logic

  const handleMenuItemClick = (action: () => void) => {
    onClose();
    action();
  };

  const getRoleBadge = () => {
    const roleClasses = {
      admin: 'user-menu-popup__badge--admin',
      manager: 'user-menu-popup__badge--manager',
      customer: 'user-menu-popup__badge--customer'
    };

    return (
      <span className={`user-menu-popup__badge ${roleClasses[user.role]}`}>
        {user.role}
      </span>
    );
  };

  return (
    <div className="user-menu-popup">
      {/* User Info Header */}
      <div 
        className="user-menu-popup__header" 
        onClick={() => handleMenuItemClick(() => navigate(PATHS.PROFILE))}
      >
        <div className="user-menu-popup__avatar">
          {user.username.substring(0, 2).toUpperCase()}
        </div>
        <div className="user-menu-popup__user-info">
          <div className="user-menu-popup__username">{user.username}</div>
          <div className="user-menu-popup__email">{user.email}</div>
          {getRoleBadge()}
        </div>
        <div className="user-menu-popup__arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>

      <div className="user-menu-popup__divider" />

      {/* Settings Section */}
      <div className="user-menu-popup__section">
        <button 
          className="user-menu-popup__item"
          onClick={() => handleMenuItemClick(() => navigate(PATHS.PROFILE))}
        >
          <div className="user-menu-popup__item-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m5.657-13.657l-4.243 4.243m0 6l-4.243 4.243M23 12h-6m-6 0H1m18.364-5.657l-4.243 4.243m0 6l-4.243 4.243"></path>
            </svg>
          </div>
          <div className="user-menu-popup__item-content">
            <div className="user-menu-popup__item-label">Account Settings</div>
          </div>
          <svg className="user-menu-popup__item-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <button 
          className="user-menu-popup__item"
          onClick={() => handleMenuItemClick(toggleTheme)}
        >
          <div className="user-menu-popup__item-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isDark ? (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              ) : (
                <>
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </>
              )}
            </svg>
          </div>
          <div className="user-menu-popup__item-content">
            <div className="user-menu-popup__item-label">{isDark ? 'Light Mode' : 'Dark Mode'}</div>
          </div>
        </button>

        <button className="user-menu-popup__item" onClick={onClose}>
          <div className="user-menu-popup__item-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
              <path d="M12 8h.01"></path>
              <path d="M11 12h1v4h1"></path>
            </svg>
          </div>
          <div className="user-menu-popup__item-content">
            <div className="user-menu-popup__item-label">Language</div>
            <div className="user-menu-popup__item-description">English</div>
          </div>
          <svg className="user-menu-popup__item-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div className="user-menu-popup__divider" />

      {/* Logout */}
      <button 
        className="user-menu-popup__item user-menu-popup__item--danger"
        onClick={() => handleMenuItemClick(onLogout)}
      >
        <div className="user-menu-popup__item-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>
        <div className="user-menu-popup__item-content">
          <div className="user-menu-popup__item-label">Log out</div>
        </div>
      </button>
    </div>
  );
};