import { useState } from "react";
import { NavLink } from "react-router-dom";
import { PATHS } from "../../../../routes/paths";
import { UI_STRINGS } from "../../../../constants/uiStrings";
import ThemeToggle from "../../../ui/ThemeToggle/ThemeToggle";
import { useAuthStore } from "../../../../store/authStore";
import { useAuth } from "../../../../features/auth/hooks/useAuth";
import { ProfileDropdown } from "../../../../features/profile/components/ProfileDropdown/ProfileDropdown";

const HeaderActions = ({ cartCount }: { cartCount: number }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <>
      <nav className="header-actions" aria-label="Main navigation">
        <ThemeToggle />

        {isAuthenticated ? (
          <>
            {/* Orders Link */}
            <NavLink
              to={PATHS.ORDERS}
              className="icon-btn"
              aria-label={UI_STRINGS.NAV.ORDERS}
            >
              <img
                src="https://img.icons8.com/material-outlined/24/000000/list.png"
                alt=""
                aria-hidden="true"
              />
            </NavLink>

            {/* Admin Dashboard Link - Only for admin/manager */}
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <NavLink
                to={PATHS.ADMIN.DASHBOARD}
                className="icon-btn"
                aria-label="Admin Dashboard"
              >
                <img
                  src="https://img.icons8.com/material-outlined/24/000000/control-panel.png"
                  alt=""
                  aria-hidden="true"
                />
              </NavLink>
            )}
            
            {/* Cart Link */}
            <NavLink
              to={PATHS.CART}
              className="cart-wrapper"
              aria-label={`${UI_STRINGS.NAV.CART}${cartCount > 0 ? `, ${cartCount} item${cartCount !== 1 ? "s" : ""}` : ""
                }`}
            >
              <img
                src="https://img.icons8.com/material-outlined/24/000000/shopping-cart--v1.png"
                alt=""
                aria-hidden="true"
              />
              {cartCount > 0 && (
                <span className="badge" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* Profile Dropdown with Popup */}
            {user && <ProfileDropdown user={user} onLogout={handleLogout} />}
          </>
        ) : (
          <>
            {/* Login Link (when not authenticated) */}
            <NavLink
              to={PATHS.LOGIN}
              className="icon-btn"
              aria-label={UI_STRINGS.AUTH.LOGIN}
            >
              <img
                src="https://img.icons8.com/material-outlined/24/000000/login-rounded-right.png"
                alt=""
                aria-hidden="true"
              />
            </NavLink>

            {/* Cart still visible when not logged in */}
            <NavLink
              to={PATHS.CART}
              className="cart-wrapper"
              aria-label={UI_STRINGS.NAV.CART}
            >
              <img
                src="https://img.icons8.com/material-outlined/24/000000/shopping-cart--v1.png"
                alt=""
                aria-hidden="true"
              />
              {cartCount > 0 && (
                <span className="badge" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </NavLink>
          </>
        )}
      </nav>

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
                onClick={confirmLogout}
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

export default HeaderActions;