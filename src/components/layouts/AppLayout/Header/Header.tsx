import { NavLink } from "react-router-dom";
import { PATHS } from "../../../../routes/paths";
import { UI_STRINGS } from "../../../../constants/uiStrings";
import "./Header.css";
import SearchBar from "../../../ui/SearchBar/SearchBar";
import { useEffect, useRef, useState } from "react";
import HeaderActions from "./HeaderActions";

const Header = () => {
  const cartCount = 12; // Replace with actualcarCount
  const [isSearchActive, setIsSearchActive] = useState(false);
  const headerRef = useRef<HTMLHeadingElement>(null);

  const handleSearchFocusChange = (focused: boolean) => {
    setIsSearchActive(focused);
  };

  useEffect(() => {
    // Handler to call on outside click
    const handleClickOutside = (event:MouseEvent) => {
      // Check if the click is outside the header
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

const handleSearchByTerm = (searchTerm: string) => {
console.log('Searching for:', searchTerm);
};

return (
  <header 
  ref={headerRef}
  className={`header ${isSearchActive ? "search-active" : ""}`} role="banner">
    <div className="header-container">
      <NavLink
        to={PATHS.HOME}
        className="logo"
        aria-label={`${UI_STRINGS.NAV.BRAND} home page`}
      >
        {UI_STRINGS.NAV.BRAND}
      </NavLink>

      <SearchBar onFocusChange={ handleSearchFocusChange} onSearch={handleSearchByTerm}/>

      {isSearchActive &&
        <button
          className="cancel-btn"
          aria-label="Cancel search"
          onClick={() => setIsSearchActive(false)}
          type="button"
        >
          {UI_STRINGS.COMMON.CANCEL}
        </button>
      }

      {!isSearchActive && <HeaderActions cartCount={cartCount} />}
    </div>
  </header>
);
};

export default Header;