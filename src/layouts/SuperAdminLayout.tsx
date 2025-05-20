import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu, Bell, Search } from "lucide-react";
import Sidebar from '@/components/superadmin/Sidebar';
import { Outlet } from 'react-router-dom';

export const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  
  // Handle header shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      };
      setCurrentTime(now.toLocaleTimeString('en-US', options));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 bg-white border-r border-gray-200 w-72 sm:max-w-sm">
          <Sidebar collapsed={false} onCollapse={toggleSidebar} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:block transition-all duration-300 ease-in-out border-r border-gray-200",
        collapsed ? "w-16" : "w-64"
      )}>
        <Sidebar collapsed={collapsed} onCollapse={toggleCollapse} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Header */}
        <header className={cn(
          "h-16 bg-white flex items-center px-4 sticky top-0 z-10 transition-shadow duration-200",
          scrolled ? "shadow-md" : "shadow-sm"
        )}>
          <div className="w-full flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-purple-900 hover:bg-purple-100 mr-2"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="hidden md:flex items-center ml-2">
                <h1 className="text-lg font-medium text-purple-900">Kuza Health</h1>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm font-medium text-gray-500">Super Admin Portal</span>
              </div>
              
              <div className="md:hidden">
                <h1 className="text-lg font-medium text-purple-900">Kuza Health</h1>
              </div>
            </div>
            
            {/* Right section - search, notifications, profile */}
            <div className="flex items-center space-x-1">
              {/* Search */}
              <div className="hidden md:flex items-center relative mr-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="border border-gray-200 rounded-full py-1 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-40 lg:w-64"
                />
              </div>
              
              {/* Time */}
              <div className="hidden md:block px-3 text-sm text-gray-500">
                {currentTime}
              </div>
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-purple-900 hover:bg-purple-100 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-purple-600"></span>
              </Button>
              
              {/* Profile */}
              <div className="flex items-center ml-2">
                <Button variant="ghost" className="text-gray-700 hover:text-purple-900 hover:bg-purple-100 flex items-center space-x-2 rounded-full">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-700 to-purple-900 flex items-center justify-center text-white font-medium">
                    AK
                  </div>
                  <span className="hidden md:inline text-sm font-medium">Admin</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto px-4 md:px-6 py-6">
          <div className="mx-auto max-w-7xl">
            <div className="pb-4 mb-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back to Kuza Health admin portal</p>
            </div>
            {/* Router outlet */}
            <div className="outlet-container">
              <Outlet/>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;