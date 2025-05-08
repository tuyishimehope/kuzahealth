// src/components/sections/ServiceCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Props for the ServiceCard component
 */
interface ServiceCardProps {
  /** Image URL */
  image?: string;
  
  /** Service title */
  title: string;
  
  /** Service description */
  description: string;
  
  /** Optional link to service detail page */
  link?: string;
  
  /** Optional icon to display */
  icon?: React.ReactNode;
}

/**
 * Card component for displaying services with hover effects
 * 
 * @example
 * ```tsx
 * <ServiceCard
 *   image="/images/service.jpg"
 *   title="Vaccination Services"
 *   description="Comprehensive vaccination services for children and adults."
 *   link="/services/vaccination"
 * />
 * ```
 */
const ServiceCard: React.FC<ServiceCardProps> = ({
  image,
  title,
  description,
  link,
  icon,
}) => {
  const cardContent = (
    <>
      <div className="relative overflow-hidden rounded-t-xl group-hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {image && (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {icon && (
          <div className="flex items-center justify-center h-48 bg-purple-100">
            <div className="text-purple-600 text-6xl">
              {icon}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white group-hover:bg-purple-50 transition-colors duration-300 rounded-b-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        <div className="flex justify-end">
          <span className="inline-flex items-center text-purple-600 font-medium group-hover:translate-x-1 transition-transform duration-300">
            Learn more
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3" 
              />
            </svg>
          </span>
        </div>
      </div>
    </>
  );

  // Wrap in link if provided, otherwise return plain div
  return link ? (
    <Link to={link} className="group block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      {cardContent}
    </Link>
  ) : (
    <div className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      {cardContent}
    </div>
  );
};

export default ServiceCard;