// src/hooks/useMediaQuery.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if a media query matches
 * 
 * @param {string} query - Media query to check
 * @returns {boolean} - Whether the media query matches
 * 
 * @example
 * // Check if viewport is mobile size
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * 
 * // Check if viewport is desktop size
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * 
 * // Check if user prefers dark mode
 * const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 */
const useMediaQuery = (query: string): boolean => {
  // Initialize with the current match state if in browser environment
  const getMatches = () => {
    // Check if window is defined (to avoid SSR issues)
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    // Avoid running on server
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Update matches state based on media query changes
    const handleChange = () => {
      setMatches(mediaQuery.matches);
    };

    // Listen for changes
    if (mediaQuery.addEventListener) {
      // Modern browsers
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Run once on mount to set initial state
    handleChange();

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
};

// Predefined media query hooks for common breakpoints
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsWideScreen = () => useMediaQuery('(min-width: 1280px)');
export const usePrefersDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');

export default useMediaQuery;