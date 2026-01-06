import { useRef } from 'react';
import { UI_STRINGS } from '../../../constants/uiStrings';
import './SearchBar.css';

interface SearchBarProps {
  ref?: React.Ref<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
  onSearchClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
}

const SearchBar = (props: SearchBarProps) => {
  const {
    ref,
    value,
    onChange,
    onSearchClick,
    onFocus,
    onBlur,
    placeholder = UI_STRINGS.COMMON.SEARCH_PLACEHOLDER,
    className = '',
    'aria-label': ariaLabel,
  } = props;

  const internalRef = useRef<HTMLInputElement>(null);

  // Merge external ref with internal ref
  const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchClick) {
      e.preventDefault();
      onSearchClick();
    }
  };

  return (
    <div
      className={`search-container ${className}`}
      onClick={handleContainerClick}
      role="search"
    >
      <div className="search-icon-leading" aria-hidden="true">
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
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {value.length > 0 && (
        <button
          className="clear-btn"
          onClick={handleClear}
          type="button"
          aria-label="Clear search input"
          tabIndex={-1}
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