import { NavLink } from "react-router-dom";
import ThemeToggle from "../../../ui/ThemeToggle/ThemeToggle";
import { PATHS } from "../../../../routes/paths";
import { UI_STRINGS } from "../../../../constants/uiStrings";
import "./Header.css";
import { useRef, useState } from "react";
import SearchBar from "../../../ui/SearchBar/SearchBar";

const Header = () => {
  const cartCount = 3;
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearchTrigger = () => {
    console.log("Searching for:", searchTerm);
  };
  const handleCancel = () => {
    setSearchTerm("");
    setIsFocused(false);
    searchRef.current?.blur(); // Force the input to lose focus
  };

  return (
    <header className="header" role="banner">
      <div className="header-container">
        <NavLink to={PATHS.HOME} className="logo" aria-label={`${UI_STRINGS.NAV.BRAND} home page`}>
          {UI_STRINGS.NAV.BRAND}
        </NavLink>

        <SearchBar
          ref={searchRef}
          value={searchTerm}
          onChange={setSearchTerm}
          onSearchClick={handleSearchTrigger}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          aria-label={UI_STRINGS.COMMON.SEARCH_PLACEHOLDER}
        />
        {isFocused && (
          <button className="cancel-btn" onClick={handleCancel}  aria-label="cancel search">
            {UI_STRINGS.COMMON.CANCEL}
          </button>
        )}

        {!isFocused && (<nav className="header-actions" aria-label="main navigation">
          <ThemeToggle />
          <NavLink to={PATHS.PROFILE} className="icon-btn" aria-label={UI_STRINGS.NAV.PROFILE}>
            <img
              src="https://img.icons8.com/material-outlined/24/000000/user--v1.png"
              alt="" aria-hidden="true"
            />
          </NavLink>

          <NavLink to={PATHS.ORDERS} className="icon-btn" aria-label={UI_STRINGS.NAV.ORDERS}>
            <img
              src="https://img.icons8.com/material-outlined/24/000000/list.png"
              alt="" aria-hidden="true"
            />
          </NavLink>

          <NavLink to={PATHS.CART} className="cart-wrapper" aria-label={`${UI_STRINGS.NAV.CART}, ${cartCount} product in cart`}>
            <img
              src="https://img.icons8.com/material-outlined/24/000000/shopping-cart--v1.png"
              alt="" aria-hidden="true"
            />
            {cartCount > 0 && <span className="badge" aria-hidden="true">{cartCount}</span>}
          </NavLink>
        </nav>)}
      </div>
    </header>
  );
};

export default Header;