// src/components/sections/ContactInfoCard.tsx
import React from 'react';

/**
 * Props interface for the ContactInfoCard component
 */
interface ContactInfoCardProps {
  /** Card title */
  title: string;
  
  /** Card description */
  description: string;
  
  /** Main contact information */
  detail: string;
  
  /** Icon to display */
  icon?: React.ReactNode;
  
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Card component for displaying contact information
 * 
 * @example
 * ```tsx
 * <ContactInfoCard
 *   title="Call Us"
 *   description="Our team is available Mon-Fri, 9am to 5pm"
 *   detail="+250 78 999 9999"
 *   icon={<PhoneIcon />}
 *   onClick={() => window.open('tel:+250789999999')}
 * />
 * ```
 */
const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  title,
  description,
  detail,
  icon,
  onClick,
}) => {
  const handleClick = (): void => {
    if (onClick) onClick();
  };

  return (
    <div
      className={`
        bg-white/5 backdrop-blur-sm border border-white/10 
        rounded-xl p-6 hover:bg-white/10 transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start">
        {icon && (
          <div className="flex-shrink-0 p-3 bg-white rounded-full mr-4">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-white/70 mb-2">
            {description}
          </p>
          <p className="text-white font-medium">
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoCard;