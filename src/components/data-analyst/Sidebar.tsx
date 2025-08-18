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
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo1.png";
import { motion, AnimatePresence } from "framer-motion";

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
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse, menuOpen, setMenuOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobile && menuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobile, menuOpen]);

const SidebarLink = ({ link }: { link: typeof sidebarLinks[0] }) => {
  const Icon = link.icon;
  
  return (
    <NavLink
      to={link.href}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center transition-all duration-300 ease-out rounded-xl",
          "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:ring-offset-2 focus:ring-offset-white",
          isActive
            ? "bg-gradient-to-r from-purple-500  to-purple-600 text-white shadow-lg shadow-purple-500/25 transform scale-[0.98]"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-800 hover:shadow-md hover:shadow-slate-200/50 hover:-translate-y-0.5",
          collapsed ? "justify-center px-2 py-3 mx-1" : "px-4 py-3 mx-0"
        )
      }
      onClick={() => { 
        if (isMobile) setMenuOpen(false); 
      }}
    >
      {({ isActive }) => (
        <>
          {/* Icon Container */}
          <div className={cn(
            "relative flex items-center justify-center transition-all duration-200",
            collapsed ? "h-8 w-8" : "h-6 w-6 flex-shrink-0"
          )}>
            <Icon 
              className={cn(
                "transition-all duration-200",
                collapsed ? "h-5 w-5" : "h-5 w-5",
                isActive 
                  ? "text-white drop-shadow-sm" 
                  : "text-slate-500 group-hover:text-slate-700 group-hover:scale-110"
              )} 
            />
            
            {/* Active indicator dot for collapsed state */}
            {collapsed && isActive && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-white rounded-full shadow-sm animate-pulse" />
            )}
          </div>

          {/* Text Content */}
          {!collapsed && (
            <div className="flex flex-col ml-3 min-w-0 flex-1 animate-in slide-in-from-left-2 duration-300">
              <span className={cn(
                "text-sm font-semibold tracking-tight truncate transition-colors duration-200",
                isActive ? "text-white" : "text-slate-700 group-hover:text-slate-900"
              )}>
                {link.label}
              </span>
              {link.description && (
                <span className={cn(
                  "text-xs truncate transition-colors duration-200 mt-0.5",
                  isActive 
                    ? "text-purple-100" 
                    : "text-slate-400 group-hover:text-slate-500"
                )}>
                  {link.description}
                </span>
              )}
            </div>
          )}

          {/* Hover indicator line */}
          {!isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-purple-500 rounded-r-full transition-all duration-300 group-hover:h-8" />
          )}

          {/* Active state background glow */}
          {isActive && !collapsed && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent rounded-xl -z-10 animate-pulse" />
          )}

          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className={cn(
              "absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-lg",
              "opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200",
              "whitespace-nowrap z-50 pointer-events-none",
              "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:-translate-x-1",
              "before:border-4 before:border-transparent before:border-r-slate-900"
            )}>
              <div className="font-medium">{link.label}</div>
              {link.description && (
                <div className="text-xs text-slate-300 mt-0.5">{link.description}</div>
              )}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

  const SidebarFooter = () => (
    <div className="border-t border-slate-200 p-3 w-full">
      <Button
        variant="ghost"
        className={cn(
          "flex items-center transition-colors w-full",
          collapsed ? "justify-center px-0 py-4" : "px-4 py-4 text-slate-600 hover:bg-red-50 hover:text-red-600"
        )}
        onClick={() => setMenuOpen(false)}
      >
        <LogOut className="h-6 w-6 flex-shrink-0" />
        {!collapsed && <span className="ml-3 text-base font-medium" onClick={() => navigate('/auth/signin')}>Sign Out</span>}
      </Button>
    </div>
  );

  const SidebarContent = () => (
    <div
      className={cn(
        "h-full flex flex-col bg-gradient-to-b from-slate-50 to-white shadow-lg border-r border-slate-200 relative",
        collapsed ? "items-center" : "items-start"
      )}
    >
      {/* Brand */}
      <div className={cn("px-4 py-6 border-b border-slate-200 flex items-center", collapsed ? "justify-center" : "justify-start space-x-3")}>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md">
          <img src={logo} alt="logo" className="h-6 w-6" />
        </div>
        {!collapsed && (
          <div>
            <h2 className="font-bold text-slate-800 text-lg">Kuza Care</h2>
            <p className="text-xs text-slate-500">Data analyst Portal</p>
          </div>
        )}
      </div>

      {/* Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto w-full">
        {sidebarLinks.map((link) => <SidebarLink key={link.label} link={link} />)}
      </nav>

      <SidebarFooter />

      {!isMobile && (
        <Button
          variant="outline"
          size="sm"
          className="absolute -right-3 top-20 h-6 w-6 rounded-full p-0 bg-white border-2 border-slate-200 shadow-md"
          onClick={onCollapse}
        >
          {collapsed ? <ChevronRight className="h-3 w-3 text-slate-600" /> : <ChevronLeft className="h-3 w-3 text-slate-600" />}
        </Button>
      )}
    </div>
  );

  const MobileMenuButton = () => (
    <Button
      variant="outline"
      size="sm"
      className="fixed top-4 left-4 z-50 h-10 w-10 rounded-lg p-0 bg-red-500 border-2 border-slate-200 shadow-lg md:hidden"
      onClick={() => setMenuOpen(!menuOpen)}
    >
      {menuOpen ? <X className="h-5 w-5 text-slate-600" /> : <Menu className="h-5 w-5 text-slate-600" />}
    </Button>
  );

  return (
    <>
      <MobileMenuButton />

      <AnimatePresence>
        {isMobile && menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              id="sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 bg-white pointer-events-auto"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!isMobile && (
        <motion.div
          animate={{ width: collapsed ? 64 : 256 }}
          initial={false}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full"
        >
          <SidebarContent />
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;
