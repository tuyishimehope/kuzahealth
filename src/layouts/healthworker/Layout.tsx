import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { IoMenuOutline } from "react-icons/io5";
import Navbar from "../../components/HealthWorker/Navbar";
import Sidebar from "../../components/HealthWorker/Sidebar";

// Define proper TypeScript interface for props
type LayoutProps = object

/**
 * Main layout component for the health worker dashboard
 * Handles sidebar toggling, authentication checks, and overall page structure
 */
const HealthWorkerLayout: React.FC<LayoutProps> = () => {
  // State for sidebar visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  // const location = useLocation();
  const navigate = useNavigate();

  // Authentication check on component mount
  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // navigate("/auth/signin");

      }
    };

    // Uncomment the following line to enable authentication
    checkAuthentication();
  }, [navigate]);

  // Toggle sidebar visibility
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar container with transition */}
      <div className="relative">
        <button
          aria-label="Toggle sidebar"
          className="absolute -right-5 mt-4 p-2 w-10 h-10 bg-white hover:bg-btnSignIn hover:text-white rounded-full shadow-md z-10 transition-colors duration-200"
          onClick={toggleSidebar}
        >
          <IoMenuOutline className="w-full h-full" />
        </button>
        <Sidebar active={isSidebarVisible} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="p-6 bg-gray-50 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HealthWorkerLayout;