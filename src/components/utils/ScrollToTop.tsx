// src/components/utils/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Utility component to scroll window to top on route change
 * This is a common pattern needed because React Router doesn't
 * automatically scroll to top when navigating between routes
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top of page on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth', // Enable smooth scrolling
    });
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;