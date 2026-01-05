import { NavLink } from "react-router-dom";
import ThemeToggle from "../../../ui/ThemeToggle/ThemeToggle";
import { PATHS } from "../../../../routes/paths";
import "./Header.css";

const Header = () => {
  const cartCount = 3;

  return (
    <header className="header">
      <div className="header-container">
        <NavLink to={PATHS.HOME} className="logo">
          Supermarket
        </NavLink>

        <nav className="header-actions">
          <ThemeToggle />

          <NavLink to={PATHS.PROFILE} className="icon-btn">
            <img
              src="https://img.icons8.com/material-outlined/24/000000/user--v1.png"
              alt="Profile"
            />
          </NavLink>

          <NavLink to={PATHS.ORDERS} className="icon-btn">
            <img
              src="https://img.icons8.com/material-outlined/24/000000/list.png"
              alt="Orders"
            />
          </NavLink>

          <NavLink to={PATHS.CART} className="cart-wrapper">
            <img
              src="https://img.icons8.com/material-outlined/24/000000/shopping-cart--v1.png"
              alt="Cart"
            />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
