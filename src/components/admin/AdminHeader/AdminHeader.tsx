import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAccess } from '../../../features/admin/hooks/useAdminAccess';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { PATHS } from '../../../routes/paths';
import ThemeToggle from '../../ui/ThemeToggle/ThemeToggle';
import './AdminHeader.css';
import { useUIStore } from '../../../store/uiStore';

interface AdminHeaderProps {
  title: string;
}

export const AdminHeader = ({ title }: AdminHeaderProps) => {
  const { user } = useAdminAccess();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { isSidebarCollapsed } = useUIStore();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsProfileOpen(false);
    };

    if (isProfileOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isProfileOpen]);

  if (!user) return null;

  return (
    <div className={`admin-header ${isSidebarCollapsed ? 'admin-header--sidebar-collapsed' : ''}`}>
    <h1 className="admin-header__title">{title}</h1>

      <div className="admin-header__actions">
        {/* Reusing shared ThemeToggle component */}
        <ThemeToggle />

        {/* Notifications */}
        <button className="admin-header__icon-btn" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="admin-header__badge" />
        </button>

        {/* Profile Dropdown */}
        <div className="admin-header__profile" ref={dropdownRef}>
          <button
            className="admin-header__profile-trigger"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
          >
            <div className="admin-header__avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="admin-header__info">
              <div className="admin-header__username">{user.username}</div>
              <div className="admin-header__role">{user.role}</div>
            </div>
            <svg
              className={`admin-header__chevron ${isProfileOpen ? 'admin-header__chevron--open' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="admin-header__dropdown">
              <button
                className="admin-header__dropdown-item"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate(PATHS.PROFILE);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                View Profile
              </button>

              <button
                className="admin-header__dropdown-item"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate(PATHS.HOME);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Back to Store
              </button>

              <div className="admin-header__dropdown-divider" />

              <button
                className="admin-header__dropdown-item admin-header__dropdown-item--danger"
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};