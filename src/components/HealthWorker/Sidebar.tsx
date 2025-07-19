import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RiDashboardLine, RiSettings4Line } from "react-icons/ri";
import { IoEyeOutline, IoAddOutline, IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { TbVaccine } from "react-icons/tb";
// import { FaInfoCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import logo from "../../assets/logo1.png";

type SidebarProps = {
  active: boolean;
  toggleSidebar?: () => void;
};

type MenuSectionProps = {
  title: string;
  expanded: boolean;
  toggleExpanded: () => void;
  children: React.ReactNode;
  isCollapsed: boolean;
};

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
};

const MenuSection = ({ title, expanded, toggleExpanded, children, isCollapsed }: MenuSectionProps): JSX.Element => {
  if (isCollapsed) {
    return <>{children}</>;
  }

  return (
    <div className="w-full mb-6">
      <div 
        className="flex items-center justify-between px-4 py-2 cursor-pointer"
        onClick={toggleExpanded}
      >
        <h3 className="text-gray-700 font-medium text-sm uppercase tracking-wider">{title}</h3>
        {expanded ? (
          <IoChevronUpOutline className="w-4 h-4 text-gray-500" />
        ) : (
          <IoChevronDownOutline className="w-4 h-4 text-gray-500" />
        )}
      </div>
      {expanded && (
        <div className="mt-1">
          {children}
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ icon, label, href, isActive, isCollapsed }: SidebarItemProps): JSX.Element => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={() => navigate(href)}
      className={`flex items-center px-4 py-3 cursor-pointer
        ${isActive 
          ? "bg-purple-500 text-white rounded-md mx-2" 
          : "text-gray-700 hover:bg-purple-100 hover:text-purple-600 rounded-md mx-2"
        }
        ${isCollapsed ? "justify-center" : ""}
      `}
    >
      <div className={`${isActive ? "text-white" : "text-purple-500"}`}>
        {icon}
      </div>
      {!isCollapsed && (
        <span className={`ml-3 font-medium ${isActive ? "text-white" : ""}`}>
          {label}
        </span>
      )}
    </motion.div>
  );
};

const Sidebar = ({ active: isCollapsed }: SidebarProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [motherInfoExpanded, setMotherInfoExpanded] = useState(true);
  const [infantInfoExpanded, setInfantInfoExpanded] = useState(true);
  const [schedulesExpanded, setSchedulesExpanded] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(true);

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    navigate("/auth/signin");
  };

  return (
    <motion.div
      initial={{ width: isCollapsed ? 80 : 250 }}
      animate={{ width: isCollapsed ? 80 : 250 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`bg-purple-100 min-h-screen flex flex-col py-6 overflow-hidden shadow-md`}
    >
      {/* Logo */}
      <div className="flex justify-center items-center mb-8">
        <img src={logo} alt="Kuza Health" className={`${isCollapsed ? "w-12" : "w-16"} transition-all duration-300`} />
      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="px-2 mb-6">
          <SidebarItem
            icon={<RiDashboardLine className="w-5 h-5" />}
            label="Dashboard"
            href="/healthworker/dashboard"
            isActive={location.pathname === "/healthworker/dashboard"}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem
            icon={<div className="flex items-center justify-center w-5 h-5 text-lg">📊</div>}
            label="Analytics"
            href="/healthworker/analytics"
            isActive={location.pathname === "/healthworker/dashboard/analytics"}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Mother Information Section */}
        <MenuSection 
          title="Mother Information" 
          expanded={motherInfoExpanded} 
          toggleExpanded={() => setMotherInfoExpanded(!motherInfoExpanded)}
          isCollapsed={isCollapsed}
        >
          <SidebarItem
            icon={<IoAddOutline className="w-5 h-5" />}
            label="Add Patient"
            href="/healthworker/patient"
            isActive={location.pathname === "/healthworker/dashboard/patient"}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem
            icon={<IoEyeOutline className="w-5 h-5" />}
            label="View Patients"
            href="/healthworker/view-patient"
            isActive={location.pathname === "/healthworker/dashboard/view-patient"}
            isCollapsed={isCollapsed}
          />
          
          {/* <SidebarItem
            icon={<FaInfoCircle className="w-5 h-5" />}
            label="Nutrition Info"
            href="/healthworker/dashboard/nutrition"
            isActive={location.pathname === "/healthworker/dashboard/nutrition"}
            isCollapsed={isCollapsed}
          /> */}
        </MenuSection>

        {/* Infant Information */}
        <MenuSection 
          title="Infant Information" 
          expanded={infantInfoExpanded} 
          toggleExpanded={() => setInfantInfoExpanded(!infantInfoExpanded)}
          isCollapsed={isCollapsed}
        >
           <SidebarItem
            icon={<IoEyeOutline className="w-5 h-5" />}
            label="Add Infant"
            href="/healthworker/add-infant"
            isActive={location.pathname === "/healthworker/dashboard/add-infant"}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<IoEyeOutline className="w-5 h-5" />}
            label="View Infants"
            href="/healthworker/view-infants"
            isActive={location.pathname === "/healthworker/dashboard/view-infants"}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem
            icon={<TbVaccine className="w-5 h-5" />}
            label="Vaccinations"
            href="/healthworker/infant-vaccination"
            isActive={location.pathname === "/healthworker/dashboard/infant-vaccination"}
            isCollapsed={isCollapsed}
          />
        </MenuSection>

        {/* Schedules */}
        <MenuSection 
          title="Schedules" 
          expanded={schedulesExpanded} 
          toggleExpanded={() => setSchedulesExpanded(!schedulesExpanded)}
          isCollapsed={isCollapsed}
        >
          <SidebarItem
            icon={<IoAddOutline className="w-5 h-5" />}
            label="Add Schedule"
            href="/healthworker/schedule"
            isActive={location.pathname === "/healthworker/schedule"}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem
            icon={<IoEyeOutline className="w-5 h-5" />}
            label="View Schedules"
            href="/healthworker/view-schedule"
            isActive={location.pathname === "/healthworker/view-schedule"}
            isCollapsed={isCollapsed}
          />
        </MenuSection>

        {/* Settings */}
        <MenuSection 
          title="Settings" 
          expanded={settingsExpanded} 
          toggleExpanded={() => setSettingsExpanded(!settingsExpanded)}
          isCollapsed={isCollapsed}
        >
          <SidebarItem
            icon={<RiSettings4Line className="w-5 h-5" />}
            label="Update Profile"
            href="/healthworker/profile"
            isActive={location.pathname === "/healthworker/profile"}
            isCollapsed={isCollapsed}
          />
          
          {/* <SidebarItem
            icon={<div className="flex items-center justify-center w-5 h-5 text-lg">🔔</div>}
            label="Alerts"
            href="/healthworker/dashboard/alerts"
            isActive={location.pathname === "/healthworker/dashboard/alerts"}
            isCollapsed={isCollapsed}
          /> */}
        </MenuSection>
      </div>

      {/* Logout Button */}
      <div className="mt-auto px-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className={`flex items-center justify-center w-full py-3 bg-purple-600 text-white rounded-lg
            hover:bg-purple-700 transition-colors duration-200
            ${isCollapsed ? "px-0" : "px-4"}`}
        >
          <IoMdLogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;