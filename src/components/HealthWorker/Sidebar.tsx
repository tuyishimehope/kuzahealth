import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/logo1.png";
import { IoMdLogOut } from "react-icons/io";
import SidebarItem from "./SidebarItem";
import MenuSection from "./MenuSection";
import { ROUTES, MENU_ITEMS, MOTHER_INFO_MENU, INFANT_INFO_MENU, SCHEDULE_MENU, SETTINGS_MENU } from "./sidebarConstants";

const Sidebar = ({ active: isCollapsed }: { active: boolean }) => {
  const location = useLocation();

  const [motherInfoExpanded, setMotherInfoExpanded] = useState(true);
  const [infantInfoExpanded, setInfantInfoExpanded] = useState(true);
  const [schedulesExpanded, setSchedulesExpanded] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = ROUTES.LOGOUT;
  };

  return (
    <motion.div
      initial={{ width: isCollapsed ? 80 : 250 }}
      animate={{ width: isCollapsed ? 80 : 250 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-purple-100 min-h-screen flex flex-col py-6 overflow-hidden shadow-md"
    >
      {/* Logo */}
      <div className="flex justify-center items-center mb-8">
        <img src={logo} alt="Kuza Health" className={`${isCollapsed ? "w-12" : "w-16"} transition-all duration-300`} />
      </div>

      {/* Menu */}
      <div className="flex-1 flex flex-col overflow-y-auto px-2">
        {MENU_ITEMS.map((item) => (
          <SidebarItem key={item.href} {...item} isActive={location.pathname === item.href} isCollapsed={isCollapsed} title={item.title}/>
        ))}

        <MenuSection title="Mother Information" expanded={motherInfoExpanded} toggleExpanded={() => setMotherInfoExpanded(!motherInfoExpanded)} isCollapsed={isCollapsed}>
          {MOTHER_INFO_MENU.map((item) => (
            <SidebarItem key={item.href} {...item} isActive={location.pathname === item.href} isCollapsed={isCollapsed} />
          ))}
        </MenuSection>

        <MenuSection title="Infant Information" expanded={infantInfoExpanded} toggleExpanded={() => setInfantInfoExpanded(!infantInfoExpanded)} isCollapsed={isCollapsed}>
          {INFANT_INFO_MENU.map((item) => (
            <SidebarItem key={item.href} {...item} isActive={location.pathname === item.href} isCollapsed={isCollapsed} />
          ))}
        </MenuSection>

        <MenuSection title="Schedules" expanded={schedulesExpanded} toggleExpanded={() => setSchedulesExpanded(!schedulesExpanded)} isCollapsed={isCollapsed}>
          {SCHEDULE_MENU.map((item) => (
            <SidebarItem key={item.href} {...item} isActive={location.pathname === item.href} isCollapsed={isCollapsed} />
          ))}
        </MenuSection>

        <MenuSection title="Settings" expanded={settingsExpanded} toggleExpanded={() => setSettingsExpanded(!settingsExpanded)} isCollapsed={isCollapsed}>
          {SETTINGS_MENU.map((item) => (
            <SidebarItem key={item.href} {...item} isActive={location.pathname === item.href} isCollapsed={isCollapsed} />
          ))}
        </MenuSection>
      </div>

      {/* Logout */}
      <div className="mt-auto px-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className={`flex items-center justify-center w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 ${isCollapsed ? "px-0" : "px-4"}`}
        >
          <IoMdLogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
