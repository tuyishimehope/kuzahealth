import { useState } from "react";
import Sidebar from "@/components/superadmin/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/superadmin/Navbar";
import { cn } from "@/lib/utils";

const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false); // Mobile only
  const [collapsed, setCollapsed] = useState<boolean>(false); // Desktop only

  // const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:block transition-all duration-300 ease-in-out border-r border-gray-200",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <Sidebar
          collapsed={collapsed}
          onCollapse={toggleCollapse}
          menuOpen={sidebarOpen}
          setMenuOpen={setSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Pass mobile toggle to Navbar */}
        <Navbar menuOpen={sidebarOpen} setMenuOpen={setSidebarOpen} />

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <Sidebar
            collapsed={collapsed} 
            onCollapse={() => setSidebarOpen(!collapsed)}
            menuOpen={sidebarOpen}
            setMenuOpen={setSidebarOpen}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto px-4 md:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
