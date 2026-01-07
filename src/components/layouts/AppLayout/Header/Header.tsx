import { NavLink } from "react-router-dom";
import SearchBar from "../../../ui/SearchBar/SearchBar";
import { PATHS } from "../../../../routes/paths";
import { UI_STRINGS } from "../../../../constants/uiStrings";
import "./Header.css";
import { useSearchState } from "./useSearchState";
import HeaderActions from "./HeaderAcrions";

const Header = () => {
  // TODO: Replace with actual cart count from state/context
  const cartCount: number = 3;
  
  // Use the custom hook for search state management
  const {
    searchTerm,
    setSearchTerm,
    isSearchActive,
    searchRef,
    handleSearchFocus,
    handleCancel,
  } = useSearchState();

  const handleSearchTrigger = () => {
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);
      // TODO: Navigate to search results or trigger search action
    }
  };

  return (
    <header
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

        {!isSearchActive && <HeaderActions cartCount={cartCount} />}
      </div>
    </header>
  );
};

export default Header;