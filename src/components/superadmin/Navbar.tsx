import  { useEffect, useState } from "react";
import { Menu, Bell } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Handle header shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      setCurrentTime(now.toLocaleTimeString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      {/* Header */}
      <header
        className={cn(
          "h-16 bg-white flex items-center px-4 sticky top-0 z-10 transition-shadow duration-200",
          scrolled ? "shadow-md" : "shadow-sm"
        )}
      >
        <div className="w-full flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-purple-900 hover:bg-purple-100 mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden md:flex items-center ml-2">
              <h1 className="text-lg font-medium text-purple-900">
                Kuza Health
              </h1>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-sm font-medium text-gray-500">
                Super Admin Portal
              </span>
            </div>

            <div className="md:hidden">
              <h1 className="text-lg font-medium text-purple-900">
                Kuza Health
              </h1>
            </div>
          </div>

          {/* Right section - search, notifications, profile */}
          <div className="flex items-center space-x-1">

            {/* Time */}
            <div className="hidden md:block px-3 text-sm text-gray-500">
              {currentTime}
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-purple-900 hover:bg-purple-100 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-purple-600"></span>
            </Button>

            {/* Profile */}
            <div className="flex items-center ml-2">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-purple-900 hover:bg-purple-100 flex items-center space-x-2 rounded-full"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-700 to-purple-900 flex items-center justify-center text-white font-medium">
                  AK
                </div>
                <span className="hidden md:inline text-sm font-medium">
                  Admin
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
