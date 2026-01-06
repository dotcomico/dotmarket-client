import { NavLink } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import ThemeToggle from "../../../ui/ThemeToggle/ThemeToggle";
import SearchBar from "../../../ui/SearchBar/SearchBar";
import { PATHS } from "../../../../routes/paths";
import { UI_STRINGS } from "../../../../constants/uiStrings";
import "./Header.css";

const Header = () => {
  // TODO: Replace with actual cart count from state/context
  const cartCount: number = 3;
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const handleSearchTrigger = () => {
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);
      // TODO: Navigate to search results or trigger search action
    }
  };

  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };

  const handleCancel = () => {
    setSearchTerm("");
    setIsSearchActive(false);
    searchRef.current?.blur();
  };

  // Handle clicks outside search to deactivate
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchActive &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsSearchActive(false);
      }
    };

    if (isSearchActive) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSearchActive]);

  // Handle escape key to cancel search
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSearchActive) {
        handleCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchActive]);

  return (
    <header
      ref={headerRef}
      className={`header ${isSearchActive ? "search-active" : ""}`}
      role="banner"
    >
      <div className="header-container">
        <NavLink
          to={PATHS.HOME}
          className="logo"
          aria-label={`${UI_STRINGS.NAV.BRAND} home page`}
        >
          {UI_STRINGS.NAV.BRAND}
        </NavLink>

        <SearchBar
          ref={searchRef}
          value={searchTerm}
          onChange={setSearchTerm}
          onSearchClick={handleSearchTrigger}
          onFocus={handleSearchFocus}
          placeholder={UI_STRINGS.COMMON.SEARCH_PLACEHOLDER}
          aria-label="Search products"
        />

        {isSearchActive && (
          <button
            className="cancel-btn"
            onClick={handleCancel}
            aria-label="Cancel search"
            type="button"
          >
            {UI_STRINGS.COMMON.CANCEL}
          </button>
        )}

        {!isSearchActive && (
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
        )}
      </div>
    </header>
  );
};

export default Header;