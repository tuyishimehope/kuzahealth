// src/components/layout/Section.tsx
import React from 'react';
import classNames from 'classnames';

/**
 * Predefined background styles for sections
 */
type BackgroundType = 'white' | 'light' | 'dark' | 'primary' | 'gradient' | 'gradient-dark' | string;

/**
 * Props for the Section component
 */
interface SectionProps {
  /** Section ID for navigation */
  id?: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Section content */
  children: React.ReactNode;
  
  /** Background style */
  background?: BackgroundType;
  
  /** Whether section should be full width */
  fullWidth?: boolean;
  
  /** Vertical padding */
  paddingY?: string;
}

/**
 * Mapping of background type names to CSS classes
 */
const BACKGROUND_CLASSES: Record<string, string> = {
  white: 'bg-white',
  light: 'bg-gray-50',
  dark: 'bg-gray-900 text-white',
  primary: 'bg-purple-900 text-white',
  gradient: 'bg-gradient-to-b from-gray-50 to-white',
  'gradient-dark': 'bg-gradient-to-r from-purple-900 to-purple-800 text-white',
};

/**
 * Reusable section component to maintain consistent spacing and styling
 * 
 * @example
 * ```tsx
 * <Section id="about" background="primary">
 *   <h2>About Us</h2>
 *   <p>Content goes here...</p>
 * </Section>
 * ```
 */
const Section: React.FC<SectionProps> = ({
  id,
  className = '',
  children,
  background = 'white',
  fullWidth = false,
  paddingY = 'py-16 md:py-24',
}) => {
  // Combine classes
  const sectionClasses = classNames(
    paddingY,
    BACKGROUND_CLASSES[background] || background,
    className
  );

  return (
    <section id={id} className={sectionClasses}>
      <div className={fullWidth ? 'w-full' : 'container mx-auto px-4 lg:px-8'}>
        {children}
      </div>
    </section>
  );
};

export default Section;