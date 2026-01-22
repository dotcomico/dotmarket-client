import { NavLink } from "react-router-dom";
import { PATHS } from "../../../../routes/paths";
import { UI_STRINGS } from "../../../../constants/uiStrings";
import "./Header.css";
import SearchBar from "../../../ui/SearchBar/SearchBar";
import HeaderActions from "./HeaderActions";
import { useSearchState } from "../../../../hooks/useSearchState";
import { useScrollDetection } from "../../../../hooks/useScrollDetection";
import { useHeaderHeight } from "./useHeaderHeight";
import { CategoryNav } from "../../../../features/categories";
import { useCart } from "../../../../features/cart/hooks/useCart";

const Header = () => {
  const { itemCount } = useCart(); // Get cart count from store

  // Custom hooks for search and scroll behavior
  const {
    isSearchActive,
    headerRef,
    handleSearchFocusChange,
    handleCancel
  } = useSearchState();

  const scrolled = useScrollDetection();

  // Set CSS variable for header height
  useHeaderHeight(headerRef);

  const handleSearchSuggestions = (searchTerm: string) => {
    console.log(searchTerm); //Todo - create suggestions view logic
  };

  return (
    <header
      ref={headerRef}
      className={`header ${isSearchActive ? "search-active" : ""} ${scrolled ? 'scrolled' : ''}`} 
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
          onFocusChange={handleSearchFocusChange}
          onSearch={handleSearchSuggestions}
        />

        {isSearchActive &&
          <button
            className="cancel-btn"
            aria-label="Cancel search"
            onClick={handleCancel}
            type="button"
          >
            {UI_STRINGS.COMMON.CANCEL}
          </button>
        }

        {!isSearchActive && <HeaderActions cartCount={itemCount} />}
      </div>
      {scrolled && <CategoryNav />}
    </header>
  );
};

export default Header;