import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/hooks/useAuth';
import { PATHS } from '../../../../routes/paths';
import './AccountActions.css';

export const AccountActions = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    // useAuth already navigates to login, but we can add a toast notification here
  };

  const handleViewOrders = () => {
    navigate(PATHS.ORDERS);
  };

  return (
    <>
      <div className="account-actions">
        <h2 className="account-actions__title">Quick Actions</h2>

        <div className="account-actions__grid">
          {/* View Orders */}
          <button
            className="account-action-card"
            onClick={handleViewOrders}
          >
            <div className="account-action-card__icon account-action-card__icon--orders">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div className="account-action-card__content">
              <h3>My Orders</h3>
              <p>View and track your orders</p>
            </div>
            <div className="account-action-card__arrow">→</div>
          </button>

          {/* Cart */}
          <button
            className="account-action-card"
            onClick={() => navigate(PATHS.CART)}
          >
            <div className="account-action-card__icon account-action-card__icon--cart">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <div className="account-action-card__content">
              <h3>Shopping Cart</h3>
              <p>View items in your cart</p>
            </div>
            <div className="account-action-card__arrow">→</div>
          </button>

          {/* Support */}
          <button className="account-action-card">
            <div className="account-action-card__icon account-action-card__icon--support">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div className="account-action-card__content">
              <h3>Help & Support</h3>
              <p>Get help with your account</p>
            </div>
            <div className="account-action-card__arrow">→</div>
          </button>

          {/* Logout */}
          <button
            className="account-action-card account-action-card--logout"
            onClick={() => setShowLogoutModal(true)}
          >
            <div className="account-action-card__icon account-action-card__icon--logout">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>
            <div className="account-action-card__content">
              <h3>Log Out</h3>
              <p>Sign out of your account</p>
            </div>
            <div className="account-action-card__arrow">→</div>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out of your account?</p>
            <div className="logout-modal__actions">
              <button
                className="logout-modal__btn logout-modal__btn--cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="logout-modal__btn logout-modal__btn--confirm"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};