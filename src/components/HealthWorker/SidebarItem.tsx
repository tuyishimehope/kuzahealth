import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ReactNode;
  label?: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
  title?: string;
}

const SidebarItem = ({
  icon,
  label,
  href,
  isActive,
  isCollapsed,
  title,
}: SidebarItemProps) => {
  const navigate = useNavigate();

  // Determine text color
  const textColor = isActive ? "text-white" : "text-gray-700";

  // Determine background classes
  const bgClasses = isActive
    ? "bg-purple-500 text-white rounded-md mx-2"
    : "hover:bg-purple-100 hover:text-purple-600 rounded-md mx-2";

  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={() => navigate(href)}
      className={`flex items-center px-3 py-2 cursor-pointer ${bgClasses} ${
        isCollapsed ? "justify-center" : ""
      }`}
    >
      <div className={`text-md ${isActive ? "text-white" : "text-purple-500"}`}>
        {icon}
      </div>

      {!isCollapsed && (title || label) && (
        <span className={`ml-3 font-medium text-sm ${textColor}`}>
          {title || label}
        </span>
      )}
    </motion.div>
  );
};

export default SidebarItem;
