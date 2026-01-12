import { useEffect, type RefObject } from "react";

/**
 * Hook to measure an element's height and sync it to a CSS variable.
 * @param ref - The ref of the element to measure (e.g., the header)
 * @param cssVar - The name of the CSS variable to update (default: '--header-height')
 */
export const useHeaderHeight = (
  ref: RefObject<HTMLElement | null>,
  cssVar: string = '--header-height'
) => {
  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        const height = ref.current.offsetHeight;
        document.documentElement.style.setProperty(cssVar, `${height}px`);
      }
    };

    // Initial measurement
    updateHeight();

    // Listen for window resizing
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [ref, cssVar]); 
};