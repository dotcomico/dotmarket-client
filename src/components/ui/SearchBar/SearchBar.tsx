import React from 'react';
import './SearchBar.css';
import { UI_STRINGS } from '../../../constants/uiStrings';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearchClick?: () => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  onSearchClick, 
  placeholder = UI_STRINGS.COMMON.SEARCH_GENERIC,
  className = "" 
}) => {
  
  const handleClear = () => {
    onChange(""); // Resets the input 
  };

  return (
    <div className={`search-container ${className}`}>
      {/* Search Icon */}
      <div className="search-icon-leading">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearchClick?.()}
      />

      {/* Clear Button */}
      {value.length > 0 && (
        <button 
          className="clear-btn" 
          onClick={handleClear}
          type="button"
          aria-label="Clear search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;