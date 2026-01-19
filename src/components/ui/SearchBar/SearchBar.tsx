import { useRef, useState } from 'react';
import { UI_STRINGS } from '../../../constants/uiStrings';
import './SearchBar.css';
import { useAppNavigation } from '../../../hooks/useAppNavigation ';

type SearchBarProps = {
  onFocusChange: (focused: boolean) => void;
  onSearch?: (searchTerm: string) => void;  // for adding suggestion view - onSearch called while typing
};

const SearchBar = ({ onFocusChange, onSearch }: SearchBarProps) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { goToProducts } = useAppNavigation();

  const clearInput = () => {
    setValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecuteSearch();
    }
    if (e.key === 'Escape') {
      inputRef.current?.blur();
      onFocusChange(false);
    }
  };

  const handleExecuteSearch = () => {
    if (value.trim())
      goToProducts(value);
    // inputRef.current?.blur();
    // onFocusChange(false);
  };

  const handleTypingSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`search-container`} role="search"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="search-icon-leading" aria-hidden="true" onClick={handleExecuteSearch}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder={UI_STRINGS.COMMON.SEARCH_PLACEHOLDER}
        aria-label="Search"
        onFocus={() => onFocusChange(true)}
        onChange={(e) => handleTypingSearch(e)}
        value={value}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {value.length > 0 && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={clearInput}
          className="clear-btn"
          aria-label="Clear search input"
        // tabIndex={-1}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;