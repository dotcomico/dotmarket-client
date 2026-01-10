import { NavLink } from "react-router-dom";
import { PATHS } from "../../../../routes/paths";
import { UI_STRINGS } from "../../../../constants/uiStrings";
import "./HeaderX.css";
import SearchBarX from "../../../ui/SearchBarX/SearchBarX";
import { useState } from "react";
import HeaderActions from "../Header/HeaderAcrions";

const HeaderX = () => {
  const cartCount = 12; // Replace with actualcarCount
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const handleSearchFocusChange = (focused: boolean) => {
    setIsSearchActive(focused);
  };
  

return (
  <header className={`headerx ${isSearchActive ? "search-active" : ""}`} role="banner">
    <div className="header-container">
      <NavLink
        to={PATHS.HOME}
        className="logo"
        aria-label={`${UI_STRINGS.NAV.BRAND} home page`}
      >
        {UI_STRINGS.NAV.BRAND}
      </NavLink>

      <SearchBarX onFocusChange={ handleSearchFocusChange} />

      {isSearchActive &&
        <button
          className="cancel-btn"
          aria-label="Cancel search"
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

export default HeaderX;