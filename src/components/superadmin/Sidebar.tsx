import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
}
interface OpenSections {
  'health-workers': boolean;
  'reports': boolean;
  [key: string]: boolean;
}

interface NavItemProps {
  href: string;
  icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  children: React.ReactNode;
  indent?: boolean;
  active?: boolean;
}
interface SectionHeaderProps {
  title: string;
  section: keyof OpenSections;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

// Sidebar component with navigation based on routes
const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
 const [openSections, setOpenSections] = useState<OpenSections>({
    'health-workers': false,
    'reports': false
  });

  const toggleSection = (section: keyof OpenSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Navigation item component
const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, children, indent = false, active = false }) => {
    return (
      <Link 
        to={href} 
        className={cn(
          "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
          "hover:bg-purple-100 hover:text-purple-900", 
          active ? "bg-purple-100 text-purple-900 font-medium" : "text-gray-700",
          indent ? "pl-9" : "",
          collapsed && !indent ? "justify-center" : "justify-start"
        )}
      >
        {Icon && <Icon className="h-5 w-5 mr-2 flex-shrink-0" />}
        {(!collapsed || indent) && <span>{children}</span>}
      </Link>
    );
  };
  
  // Section header component with toggle
  const SectionHeader: React.FC<SectionHeaderProps>  = ({ title, section, icon:Icon }) => {
    const isOpen = openSections[section];
    
    return (
      <button 
        onClick={() => !collapsed && toggleSection(section)}
        className={cn(
          "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
          "hover:bg-purple-100 hover:text-purple-900 text-gray-700 font-medium",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
         <div className="flex items-center">
          <Icon className="h-5 w-5 mr-2 flex-shrink-0" />
          {!collapsed && <span>{title}</span>}
        </div>
        {!collapsed && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : "")} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
    );
  };

  return (
    <div className={cn(
      "h-full bg-white flex flex-col py-4 border-r",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo/Brand */}
      <div className="px-3 py-2 mb-6 flex items-center justify-center">
        {collapsed ? (
          <div className="h-8 w-8 rounded-full bg-purple-900 flex items-center justify-center">
            <span className="text-white font-bold">K</span>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-purple-900 flex items-center justify-center mr-2">
              <span className="text-white font-bold">K</span>
            </div>
            <h2 className="text-lg font-bold text-purple-900">Kuza Health</h2>
          </div>
        )}
      </div>
      
      {/* Nav Items */}
      <div className="space-y-1 px-3 flex-1 overflow-y-auto">
        {/* Dashboard */}
        <NavItem href="/superadmin/dashboard" icon={(props) => (
          <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )}>
          Dashboard
        </NavItem>

        {/* Health Workers Section */}
        <div className="pt-2">
          <SectionHeader 
            title="Health Workers" 
            section="health-workers" 
            icon={(props) => (
              <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )} 
          />
          
          {(openSections['health-workers'] || collapsed) && (
            <div className={cn("mt-1 space-y-1", collapsed ? "pl-0" : "")}>
              <NavItem href="/superadmin/health-workers" indent={!collapsed}>All Workers</NavItem>
              <NavItem href="/superadmin/health-workers/active" indent={!collapsed}>Active Workers</NavItem>
              <NavItem href="/superadmin/health-workers/inactive" indent={!collapsed}>Inactive Workers</NavItem>
              <NavItem href="/superadmin/add-health-worker" indent={!collapsed}>Add New Worker</NavItem>
            </div>
          )}
        </div>

        {/* Facilities */}
        <NavItem href="/superadmin/facilities" icon={(props) => (
          <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )}>
          Facilities
        </NavItem>

        {/* Reports Section */}
        <div className="pt-2">
          <SectionHeader 
            title="Reports" 
            section="reports" 
            icon={(props) => (
              <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )} 
          />
          
          {(openSections['reports'] || collapsed) && (
            <div className={cn("mt-1 space-y-1", collapsed ? "pl-0" : "")}>
              <NavItem href="/superadmin/reports" indent={!collapsed}>Overview</NavItem>
              <NavItem href="/superadmin/reports/analytics" indent={!collapsed}>Analytics</NavItem>
              <NavItem href="/superadmin/reports/activity" indent={!collapsed}>Activity Logs</NavItem>
            </div>
          )}
        </div>

        {/* Settings */}
        <NavItem href="/superadmin/settings" icon={(props) => (
          <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}>
          Settings
        </NavItem>
      </div>
      
      {/* Collapse Button */}
      <div className="border-t pt-4 px-3">
        <Button 
          variant="outline" 
          className={cn(
            "w-full text-gray-700 border-gray-200 hover:bg-purple-100 hover:text-purple-900",
            collapsed ? "justify-center" : "justify-start"
          )}
          onClick={onCollapse}
        >
          {!collapsed ? (
            <>
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              Collapse
            </>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;