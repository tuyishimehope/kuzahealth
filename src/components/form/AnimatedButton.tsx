import {motion} from 'framer-motion';
import React from 'react';


const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};


const AnimatedButton = ({ 
  children, 
  className, 
  icon, 
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  icon?: string;
  [key: string]: unknown 
}) => {
  return (
    <motion.button
      className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${className}`}
      whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      variants={itemVariants}
      {...props}
    >
      {icon && <img src={icon} alt="icon" className="w-5 h-5 mr-2" />}
      {children}
    </motion.button>
  );
};

export default AnimatedButton;