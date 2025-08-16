import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { IoMenuOutline } from "react-icons/io5";
import Navbar from "../../components/HealthWorker/Navbar";
import Sidebar from "../../components/HealthWorker/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

type LayoutProps = object;

const HealthWorkerLayout: React.FC<LayoutProps> = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth/signin");
  }, [navigate]);

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Desktop sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile sidebar with overlay */}
      <AnimatePresence>
        {isMobile && isSidebarVisible && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-30"
              onClick={toggleSidebar}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-64 bg-purple-100 shadow-md z-40"
            >
              <Sidebar  />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {isMobile && (
          <button
            aria-label="Toggle sidebar"
            className="absolute top-4 left-4 p-2 w-10 h-10 bg-white hover:bg-purple-600 hover:text-white rounded-full shadow-md z-50 transition-colors duration-200"
            onClick={toggleSidebar}
          >
            <IoMenuOutline className="w-full h-full" />
          </button>
        )}
        <Navbar />
        <main className="p-6 flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HealthWorkerLayout;
