import { useState, useRef, useEffect } from 'react';
import { UserMenuPopup } from '../../../../components/ui/UserMenuPopup/UserMenuPopup';
import './ProfileDropdown.css';
import type { User } from '../../../../types';

interface ProfileDropdownProps {
  user: User;
  onLogout: () => void;
}

export const ProfileDropdown = ({ user, onLogout }: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button
        className="profile-dropdown__trigger"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="profile-dropdown__avatar">
          {user.username.substring(0, 2).toUpperCase()}
        </div>
        <svg
          className={`profile-dropdown__icon ${isOpen ? 'profile-dropdown__icon--open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <UserMenuPopup 
          user={user} 
          onClose={handleClose}
          onLogout={onLogout}
        />
      )}
    </div>
  );
};