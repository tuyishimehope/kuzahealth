import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Users2,
  Menu,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo1.png";
import { motion } from "framer-motion";

const sidebarLinks = [
  { href: "/data-analyst/dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Overview & Analytics" },
  { href: "/data-analyst/health-workers", label: "View Health Workers", icon: Users, description: "Staff Management" },
  { href: "/data-analyst/schedules", label: "Schedules", icon: Calendar, description: "View All Schedules" },
  { href: "/data-analyst/parents", label: "Mothers", icon: Users2, description: "View Mothers" },
  { href: "/data-analyst/reports", label: "Reports", icon: BarChart3, description: "Analytics & Insights" },
  { href: "/data-analyst/settings", label: "Settings", icon: Settings, description: "System Configuration" },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
  activeRoute?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow-md"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <motion.div
        animate={{ width: collapsed ? 64 : 256 }}
        initial={false}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "h-full bg-gradient-to-b from-slate-50 to-white flex flex-col shadow-lg border-r border-slate-200 relative z-50",
          "fixed md:static top-0 left-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "transition-transform duration-300 ease-in-out"
        )}
      >
        {/* Brand Header */}
        <div className="px-4 py-6 border-b border-slate-200">
          <div className="flex items-center justify-center">
            {collapsed ? (
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md">
                <img src={logo} alt="logo" />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md">
                  <img src={logo} alt="logo" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Kuza Care</h2>
                  <p className="text-xs text-slate-500">Data analyst Portal</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isHovered = hoveredItem === link.href;
            const isActive = window.location.pathname === link.href;

            return (
              <NavLink
                to={link.href}
                key={link.label}
                className={({ isActive }) => (isActive ? "relative" : "")}
                onMouseEnter={() => setHoveredItem(link.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start px-3 py-3 h-auto transition-all duration-200 group relative",
                    collapsed ? "px-3" : "px-4",
                    isActive
                      ? "bg-purple-100 text-purple-700 shadow-sm border border-purple-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 rounded-r-full" />
                  )}

                  <div
                    className={cn(
                      "flex items-center",
                      collapsed ? "justify-center" : "space-x-3"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors flex-shrink-0",
                        isActive
                          ? "text-purple-600"
                          : "text-slate-500 group-hover:text-slate-700"
                      )}
                    />
                    {!collapsed && (
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium leading-none">{link.label}</span>
                        <span className="text-xs text-slate-400 mt-0.5">{link.description}</span>
                      </div>
                    )}
                  </div>
                </Button>

                {collapsed && isHovered && (
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2 z-50">
                    <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                      <div className="font-medium">{link.label}</div>
                      <div className="text-xs text-slate-300">{link.description}</div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="border-t border-slate-200 p-3">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start px-3 py-3 h-auto text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors group",
              collapsed ? "px-3" : "px-4"
            )}
            onClick={() => {
              navigate("/");
            }}
          >
            <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-3")}>
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
            </div>
          </Button>
        </div>

        {/* Collapse Toggle */}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "absolute -right-3 top-20 h-6 w-6 rounded-full p-0 bg-white border-2 border-slate-200 shadow-md hover:shadow-lg transition-all duration-200",
            "hover:border-purple-300 hover:bg-purple-50"
          )}
          onClick={onCollapse}
        >
          {collapsed ? <ChevronRight className="h-3 w-3 text-slate-600" /> : <ChevronLeft className="h-3 w-3 text-slate-600" />}
        </Button>

        {/* Close button for mobile */}
        {mobileOpen && (
          <button
            className="absolute top-4 right-4 md:hidden z-50 p-2 rounded-full bg-white shadow-md"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-6 w-6 text-slate-600" />
          </button>
        )}
      </motion.div>
    </>
  );
};

export default Sidebar;
