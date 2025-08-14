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

  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={() => navigate(href)}
      className={`flex items-center px-4 py-3 cursor-pointer
        ${
          isActive
            ? "bg-purple-500 text-white rounded-md mx-2"
            : "text-gray-700 hover:bg-purple-100 hover:text-purple-600 rounded-md mx-2"
        }
        ${isCollapsed ? "justify-center" : ""}
      `}
    >
      <div className={`${isActive ? "text-white" : "text-purple-500"}`}>
        {icon}
      </div>
      {!isCollapsed && title && (
        <span className={`ml-3 font-medium ${isActive ? "text-white" : ""}`}>
          {title}{" "}
        </span>
      )}
      {!isCollapsed && label && (
        <span className={`ml-3 font-medium ${isActive ? "text-white" : ""}`}>
          {" "}
          {label}
        </span>
      )}
    </motion.div>
  );
};

export default SidebarItem;
