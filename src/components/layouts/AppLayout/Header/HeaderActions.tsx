import { NavLink } from "react-router-dom";
import { PATHS } from "../../../../routes/paths";
import { UI_STRINGS } from "../../../../constants/uiStrings";
import ThemeToggle from "../../../ui/ThemeToggle/ThemeToggle";
import { useAuthStore } from "../../../../store/authStore";
import { ProfileDropdown } from "../../../../features/profile/components/ProfileDropdown/ProfileDropdown";

const HeaderActions = ({ cartCount }: { cartCount: number }) => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <nav className="header-actions" aria-label="Main navigation">
     
      <ThemeToggle />

      {isAuthenticated ? (
        <>
          {/* Profile Link */}
          <NavLink
            to={PATHS.PROFILE}
            className="icon-btn"
            aria-label={UI_STRINGS.NAV.PROFILE}
            title={user?.username || 'Profile'}
          >
           {user && <ProfileDropdown user={user} />}
          </NavLink>

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

          {/* Cart Link */}
          <NavLink
            to={PATHS.CART}
            className="cart-wrapper"
            aria-label={`${UI_STRINGS.NAV.CART}${
              cartCount > 0 ? `, ${cartCount} item${cartCount !== 1 ? "s" : ""}` : ""
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
  );
};

export default HeaderActions;