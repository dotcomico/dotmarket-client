import { useEffect, useRef, useState } from "react";

export const useSearchState = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  
  const handleSearchFocus = () => setIsSearchActive(true);
  
  const handleCancel = () => {
    setSearchTerm("");
    setIsSearchActive(false);
    searchRef.current?.blur();
  };
  
  // Handle clicks outside search to deactivate
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchActive && searchRef.current) {
        // Find the header element that contains the search
        const headerElement = searchRef.current.closest('.header');
        
        if (headerElement && !headerElement.contains(event.target as Node)) {
          setIsSearchActive(false);
        }
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
  
  return {
    searchTerm,
    setSearchTerm,
    isSearchActive,
    searchRef,
    handleSearchFocus,
    handleCancel
  };
};