/* eslint-disable tsdoc/syntax */
// src/hooks/useSectionHighlight.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to track active section on scroll
 * 
 * @param {Array} sectionIds - Array of section IDs to track
 * @param {number} offset - Offset from the top to consider a section active
 * @returns {string} - ID of the currently active section
 */
const useSectionHighlight = (sectionIds = [], offset = 100) => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    // Skip effect if no section IDs are provided
    if (!sectionIds.length) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;
      
      // Find the current visible section
      for (let i = 0; i < sectionIds.length; i++) {
        const sectionId = sectionIds[i];
        const section = document.getElementById(sectionId);
        
        if (!section) continue;
        
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        // Check if we're in the current section
        if (
          scrollPosition >= sectionTop && 
          scrollPosition < sectionTop + sectionHeight
        ) {
          if (activeSection !== sectionId) {
            setActiveSection(sectionId);
          }
          break;
        }
        
        // If we're above the first section
        if (i === 0 && scrollPosition < sectionTop) {
          if (activeSection !== sectionId) {
            setActiveSection(sectionId);
          }
          break;
        }
        
        // If we're below the last section
        if (
          i === sectionIds.length - 1 && 
          scrollPosition >= sectionTop + sectionHeight
        ) {
          if (activeSection !== sectionId) {
            setActiveSection(sectionId);
          }
        }
      }
    };

    // Run once on mount
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, activeSection, offset]);

  return activeSection;
};

export default useSectionHighlight;