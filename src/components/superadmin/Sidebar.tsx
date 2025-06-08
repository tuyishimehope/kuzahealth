import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo1.png";

// Link configuration with icons and metadata
const sidebarLinks = [
  {
    href: "/superadmin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & Analytics",
  },
   {
    href: "/superadmin/add-health-workers",
    label: "Health Workers",
    icon: Users,
    description: "Staff Management",
  },
  {
    href: "/superadmin/health-workers",
    label: "View Health Workers",
    icon: Users,
    description: "Staff Management",
  },
  {
    href: "/superadmin/schedules",
    label: "Schedules",
    icon: Calendar,
    description: "Shift Planning",
  },
  {
    href: "/superadmin/facilities",
    label: "Facilities",
    icon: Building2,
    description: "Location Management",
  },
  {
    href: "/superadmin/reports",
    label: "Reports",
    icon: BarChart3,
    description: "Analytics & Insights",
  },
  {
    href: "/superadmin/settings",
    label: "Settings",
    icon: Settings,
    description: "System Configuration",
  },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
  activeRoute?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "h-full bg-gradient-to-b from-slate-50 to-white flex flex-col shadow-lg border-r border-slate-200 transition-all duration-300 ease-in-out relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="px-4 py-6 border-b border-slate-200">
        <div className="flex items-center justify-center">
          {collapsed ? (
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md">
              <img src={logo} alt="logo"/>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md">
                <img src={logo} alt="logo"/>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Kuza Health
                </h2>
                <p className="text-xs text-slate-500">Super Admin Portal</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
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
                {/* Active indicator */}
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
                      <span className="text-sm font-medium leading-none">
                        {link.label}
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5">
                        {link.description}
                      </span>
                    </div>
                  )}
                </div>
              </Button>

              {/* Tooltip for collapsed state */}
              {collapsed && isHovered && (
                <div className="absolute left-16 top-1/2 transform -translate-y-1/2 z-50">
                  <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                    <div className="font-medium">{link.label}</div>
                    <div className="text-xs text-slate-300">
                      {link.description}
                    </div>
                    {/* Tooltip arrow */}
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
            // Handle logout logic
            console.log("Logout clicked");
          }}
        >
          <div
            className={cn(
              "flex items-center",
              collapsed ? "justify-center" : "space-x-3"
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium">Sign Out</span>
            )}
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
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-slate-600" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-slate-600" />
        )}
      </Button>
    </div>
  );
};

export default Sidebar;
