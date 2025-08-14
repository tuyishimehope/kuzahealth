import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Sidebar from "@/components/data-analyst/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/data-analyst/Navbar";
import { cn } from "@/lib/utils";

const DataanalystLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 bg-white border-r border-gray-200 w-72 sm:max-w-sm"
        >
          <Sidebar collapsed={false} onCollapse={toggleSidebar} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:block transition-all duration-300 ease-in-out border-r border-gray-200",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <Sidebar collapsed={collapsed} onCollapse={toggleCollapse} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <Navbar />
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto px-4 md:px-6 py-6">
          <div className="">
           
            <div className="outlet-container">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DataanalystLayout;
