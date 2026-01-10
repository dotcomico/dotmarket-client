import { NavLink } from "react-router-dom";
import { PATHS } from "../../../../routes/paths";
import { UI_STRINGS } from "../../../../constants/uiStrings";
import ThemeToggle from "../../../ui/ThemeToggle/ThemeToggle";

const HeaderActions = ({ cartCount }: { cartCount: number }) => (
   <nav className="header-actions" aria-label="Main navigation">

          <ThemeToggle />

          <NavLink
            to={PATHS.PROFILE}
            className="icon-btn"
            aria-label={UI_STRINGS.NAV.PROFILE}
          >
            <img
              src="https://img.icons8.com/material-outlined/24/000000/user--v1.png"
              alt=""
              aria-hidden="true"
            />
          </NavLink>

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
        </nav>
);

export default HeaderActions;   