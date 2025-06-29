// src/components/layout/SectionHeader.tsx
import React from 'react';
import classNames from 'classnames';

/**
 * Alignment options for section header
 */
type AlignType = 'center' | 'left' | 'right';

/**
 * Title size variants
 */
type TitleSizeType = 'small' | 'default' | 'large';

/**
 * Props for the SectionHeader component
 */
interface SectionHeaderProps {
  /** Section title */
  title: string;
  
  /** Optional section subtitle */
  subtitle?: string;
  
  /** Optional badge text */
  badge?: string;
  
  /** Text alignment */
  align?: AlignType;
  
  /** Whether to show divider below title */
  withDivider?: boolean;
  
  /** Title size variant */
  titleSize?: TitleSizeType;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Mapping of alignment types to CSS classes
 */
const ALIGN_CLASSES: Record<AlignType, string> = {
  center: 'text-center mx-auto',
  left: 'text-left',
  right: 'text-right ml-auto',
};

/**
 * Mapping of title size variants to CSS classes
 */
const TITLE_CLASSES: Record<TitleSizeType, string> = {
  small: 'text-2xl md:text-3xl',
  default: 'text-3xl md:text-4xl',
  large: 'text-4xl md:text-5xl',
};

/**
 * Consistent section header with title, subtitle, and optional badge
 * 
 * @example
 * ```tsx
 * <SectionHeader
 *   title="Our Services"
 *   subtitle="Comprehensive healthcare solutions focused on maternal and child well-being"
 *   badge="What We Offer"
 *   align="center"
 * />
 * ```
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  align = 'center',
  withDivider = true,
  titleSize = 'default',
  className = '',
}) => {
  // Container classes
  const containerClasses = classNames(
    ALIGN_CLASSES[align],
    'max-w-3xl mb-12',
    className
  );

  return (
    <div className={containerClasses}>
      {badge && (
        <div className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium mb-4">
          {badge}
        </div>
      )}
      
      <h2 className={`font-bold text-gray-200 mb-4 ${TITLE_CLASSES[titleSize]}`}>
        {title}
      </h2>
      
      {withDivider && (
        <div
          className={`w-20 h-1 bg-purple-500 rounded-full mb-6 ${
            align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''
          }`}
        />
      )}
      
      {subtitle && (
        <p className="text-gray-300 text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;