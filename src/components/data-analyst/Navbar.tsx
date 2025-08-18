import { useEffect, useState } from "react";
import { Menu, Bell } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface NavbarProp {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const Navbar = ({ menuOpen, setMenuOpen }: NavbarProp) => {
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header
      className={cn(
        "h-16 bg-white flex items-center px-4 sticky top-0 z-20 transition-shadow duration-200",
        scrolled ? "shadow-md" : "shadow-sm"
      )}
    >
      <div className="w-full flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-purple-900 hover:bg-purple-100 mr-2"
            onClick={handleMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo & title */}
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-medium text-purple-900">Kuza Care</h1>
            <span className="hidden md:inline text-gray-400">|</span>
            <span className="hidden md:inline text-sm text-gray-500">Data analyst Portal</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-2">
          {/* Time */}
          <span className="hidden md:block px-3 text-sm text-gray-500">{currentTime}</span>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-purple-900 hover:bg-purple-100 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-purple-600" />
          </Button>

          {/* Profile */}
          <Button
            variant="ghost"
            className="text-gray-700 hover:text-purple-900 hover:bg-purple-100 flex items-center space-x-2 rounded-full"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-700 to-purple-900 flex items-center justify-center text-white font-medium">
              AK
            </div>
            <span className="hidden md:inline text-sm font-medium">Admin</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
