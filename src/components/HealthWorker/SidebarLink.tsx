import { RiDashboardFill } from "react-icons/ri";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type SidebarLinkProps = {
  status?: boolean;
  name?: string;
  icon?: ReactNode;
  href?: string | null;
  currentPath?: string; // Add currentPath prop
};

const SidebarLink: React.FC<SidebarLinkProps> = ({
  name = "",
  icon = <RiDashboardFill className="w-8 h-10" />,
  href = null,
  currentPath,
}) => {
  const isActive = href === currentPath; // Check if the link is active

  if (!href) {
    return (
      <div
        className={`flex items-center space-x-4 py-2 pl-4 transition duration-200 ease-in-out cursor-not-allowed 
          ${isActive ? "bg-btnSignIn text-white" : "text-slate-900"}`}
      >
        <div>{icon}</div>
        <p className="text-xl">{name}</p>
      </div>
    );
  }

  return (
    <Link
      to={href}
      className={`flex items-center space-x-4 py-2 pl-4 transition duration-200 ease-in-out 
        ${
          isActive
            ? "bg-btnSignIn text-white"
            : "hover:bg-blue-700 hover:cursor-pointer hover:text-white"
        }`}
    >
      <div>{icon}</div>
      <p className="text-xl">{name}</p>
    </Link>
  );
};

export default SidebarLink;
