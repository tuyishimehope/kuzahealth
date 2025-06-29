import React from "react";
import { motion } from "framer-motion";


const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

const AnimatedInput = React.forwardRef<HTMLInputElement, {
  label: string;
  error?: string;
  type?: string;
  placeholder?: string;
  name?: string;
}>(({ label, error, ...props }, ref) => {
  return (
    <motion.div 
      className="flex flex-col space-y-2"
      variants={itemVariants}
    >
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          ref={ref} // Now ref works correctly!
          className={`w-full px-4 py-3 bg-gray-50 border ${
            error ? "border-red-300" : "border-gray-200"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-red-500 text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
});

AnimatedInput.displayName = "AnimatedInput"; // Required for forwardRef components

export default AnimatedInput;
