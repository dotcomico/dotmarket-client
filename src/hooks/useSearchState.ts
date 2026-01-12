import { useEffect, useRef, useState } from "react";

export const useSearchState = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const headerRef = useRef<HTMLHeadingElement>(null);
  
  const handleSearchFocusChange = (focused: boolean) => {
    setIsSearchActive(focused);
  };

  const handleCancel = () => {
    setIsSearchActive(false);
  };
  
  // Handle clicks outside header to deactivate search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    isSearchActive,
    headerRef,
    handleSearchFocusChange,
    handleCancel
  };
};