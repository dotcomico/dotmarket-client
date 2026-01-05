import { NavLink } from "react-router-dom";
import ThemeToggle from "../../../ui/ThemeToggle/ThemeToggle";
import { PATHS } from "../../../../routes/paths";
import { UI_STRINGS } from "../../../../constants/uiStrings";
import "./Header.css";

const Header = () => {
  const cartCount = 3;

  return (
    <header className="header">
      <div className="header-container">
        <NavLink to={PATHS.HOME} className="logo">
          {UI_STRINGS.NAV.BRAND}
        </NavLink>

        <nav className="header-actions">
          <ThemeToggle />

          <NavLink to={PATHS.PROFILE} className="icon-btn">
            <img
              src="https://img.icons8.com/material-outlined/24/000000/user--v1.png"
              alt={UI_STRINGS.NAV.PROFILE}
            />
          </NavLink>

          <NavLink to={PATHS.ORDERS} className="icon-btn">
            <img
              src="https://img.icons8.com/material-outlined/24/000000/list.png"
              alt={UI_STRINGS.NAV.ORDERS}
            />
          </NavLink>

          <NavLink to={PATHS.CART} className="cart-wrapper">
            <img
              src="https://img.icons8.com/material-outlined/24/000000/shopping-cart--v1.png"
              alt={UI_STRINGS.NAV.CART}
            />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;