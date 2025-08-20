import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo1.png";
import { IoMdLogOut } from "react-icons/io";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoMenuOutline } from "react-icons/io5";
import SidebarItem from "./SidebarItem";
import MenuSection from "./MenuSection";
import {
  ROUTES,
  MENU_ITEMS,
  MOTHER_INFO_MENU,
  INFANT_INFO_MENU,
  SCHEDULE_MENU,
  SETTINGS_MENU,
} from "./sidebarConstants";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  desktopCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ desktopCollapsed = false }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(desktopCollapsed);

  const [motherInfoExpanded, setMotherInfoExpanded] = useState(true);
  const [infantInfoExpanded, setInfantInfoExpanded] = useState(true);
  const [schedulesExpanded, setSchedulesExpanded] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(true);
  const {t} = useTranslation()

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = ROUTES.LOGOUT;
  };

  // Always show full menu on mobile
  const isCollapsed = isMobile ? false : collapsed;

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-50 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-md"
        >
          <IoMenuOutline className="w-6 h-6" />
        </button>
      )}

      <AnimatePresence>
        {(mobileOpen || isMobile || !isMobile) && (
          <>
            {/* Mobile overlay */}
            {isMobile && mobileOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black z-40"
              />
            )}

            {/* Sidebar container */}
            <motion.div
              initial={{ x: isMobile ? "-100%" : 0 }}
              animate={{ x: 0 }}
              exit={{ x: isMobile ? "-100%" : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`
                ${isMobile ? "fixed top-0 left-0 z-50 h-full w-64" : "flex-shrink-0 h-full"}
                bg-purple-100 shadow-md flex flex-col py-6
              `}
              style={{ width: isMobile ? undefined : collapsed ? 80 : 250 }}
            >
              {/* Logo and Collapse Button */}
              <div className="flex items-center justify-between px-4 mb-8">
                <img
                  src={logo}
                  alt="Kuza Health"
                  className={`transition-all duration-300 ${isCollapsed ? "w-12" : "w-16"}`}
                />
                {!isMobile && (
                  <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 rounded-full bg-white shadow-md text-purple-600 hover:bg-purple-200 transition-colors"
                  >
                    {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                  </button>
                )}
              </div>

              {/* Menu */}
              <div className="flex-1 flex flex-col overflow-y-auto px-2">
                {MENU_ITEMS(t).map((item) => (
                  <SidebarItem
                    key={item.href}
                    {...item}
                    isActive={location.pathname === item.href}
                    isCollapsed={isCollapsed}
                    title={item.title}
                  />
                ))}

                <MenuSection
                  title={t("sidebar.mother-information")}
                  expanded={motherInfoExpanded}
                  toggleExpanded={() => setMotherInfoExpanded(!motherInfoExpanded)}
                  isCollapsed={isCollapsed}
                >
                  {MOTHER_INFO_MENU(t).map((item) => (
                    <SidebarItem
                      key={item.href}
                      {...item}
                      isActive={location.pathname === item.href}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </MenuSection>

                <MenuSection
                  title={t("sidebar.infant-information")}
                  expanded={infantInfoExpanded}
                  toggleExpanded={() => setInfantInfoExpanded(!infantInfoExpanded)}
                  isCollapsed={isCollapsed}
                >
                  {INFANT_INFO_MENU(t).map((item) => (
                    <SidebarItem
                      key={item.href}
                      {...item}
                      isActive={location.pathname === item.href}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </MenuSection>

                <MenuSection
                  title={t("sidebar.schedules")}
                  expanded={schedulesExpanded}
                  toggleExpanded={() => setSchedulesExpanded(!schedulesExpanded)}
                  isCollapsed={isCollapsed}
                >
                  {SCHEDULE_MENU(t).map((item) => (
                    <SidebarItem
                      key={item.href}
                      {...item}
                      isActive={location.pathname === item.href}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </MenuSection>

                <MenuSection
                  title={t("sidebar.settings")}
                  expanded={settingsExpanded}
                  toggleExpanded={() => setSettingsExpanded(!settingsExpanded)}
                  isCollapsed={isCollapsed}
                >
                  {SETTINGS_MENU(t).map((item) => (
                    <SidebarItem
                      key={item.href}
                      {...item}
                      isActive={location.pathname === item.href}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </MenuSection>
              </div>

              {/* Logout */}
              <div className="mt-auto px-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className={`flex items-center justify-center w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 ${
                    isCollapsed ? "px-0" : "px-4"
                  }`}
                >
                  <IoMdLogOut className="w-5 h-5" />
                  {!isCollapsed && <span className="ml-2">{t("sidebar.logout")}</span>}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
