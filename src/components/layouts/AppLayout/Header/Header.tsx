import { NavLink } from "react-router-dom";
import { PATHS } from "../../../../routes/paths";
import { UI_STRINGS } from "../../../../constants/uiStrings";
import "./Header.css";
import SearchBar from "../../../ui/SearchBar/SearchBar";
import HeaderActions from "./HeaderActions";
import { useSearchState } from "../../../../hooks/useSearchState";
import { useScrollDetection } from "../../../../hooks/useScrollDetection";

const Header = () => {
const cartCount = 12; // TODO: Replace with actual cart count from state/context

// Custom hooks for search and scroll behavior
  const { 
    isSearchActive, 
    headerRef, 
    handleSearchFocusChange, 
    handleCancel 
  } = useSearchState();

 const scrolled = useScrollDetection();

const handleSearchByTerm = (searchTerm: string) => {
console.log('Searching for:', searchTerm);
 // TODO: Navigate to search results or trigger search action
};

return (
  <header 
  ref={headerRef}
  className={`header ${isSearchActive ? "search-active" : ""} ${scrolled? 'scrolled' : ''}`} role="banner">
    <div className="header-container">
      <NavLink
        to={PATHS.HOME}
        className="logo"
        aria-label={`${UI_STRINGS.NAV.BRAND} home page`}
      >
        {UI_STRINGS.NAV.BRAND}
      </NavLink>

      <SearchBar
       onFocusChange={handleSearchFocusChange} 
         onSearch={handleSearchByTerm}
         />

      {isSearchActive &&
        <button
          className="cancel-btn"
          aria-label="Cancel search"
          onClick={() => handleCancel}
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