import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import React from "react";

const itemVariants:Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

type Option = {
  label: string;
  value: string | number;
};

type AnimatedSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: Option[];
};

const AnimatedSelect = React.forwardRef<HTMLSelectElement, AnimatedSelectProps>(
  ({ label, error, options, ...props }, ref) => {
    return (
      <motion.div
        className="flex flex-col space-y-2"
        variants={itemVariants}
      >
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="relative">
          <select
            ref={ref}
            className={`w-full px-4 py-3 bg-gray-50 border ${
              error ? "border-red-300" : "border-gray-200"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
  }
);


AnimatedSelect.displayName = "AnimatedSelect";

export default AnimatedSelect;
