import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

//  Automatically scrolls to top when route changes

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};