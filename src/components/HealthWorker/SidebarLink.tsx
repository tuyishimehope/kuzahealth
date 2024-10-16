import { RiDashboardFill } from "react-icons/ri";
import { ReactNode } from "react";

type SidebarLinkProps = {
  status?: boolean; 
  name?: string;
  icon?: ReactNode; 
};

const SidebarLink: React.FC<SidebarLinkProps> = ({
  status,
  name = "", // Set a default name if not provided
  icon = <RiDashboardFill className="w-8 h-10" /> // Default icon
}) => {
  return (
    <div
      className={`flex items-center space-x-4 py-2 pl-4 transition duration-200 ease-in-out 
        ${status ? 'bg-btnSignIn text-white' : 'hover:bg-blue-700 hover:cursor-pointer hover:text-white'} 
        `} 
    >
      <div>
        {icon} 
      </div>
      <p className="text-xl">{name}</p>
    </div>
  );
};

export default SidebarLink;
