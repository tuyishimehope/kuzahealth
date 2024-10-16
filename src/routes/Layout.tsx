import { IoMenuOutline } from "react-icons/io5";
import Navbar from "../components/HealthWorker/Navbar";
import Sidebar from "../components/HealthWorker/Sidebar";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = () => {
  const [active, setActive] = useState(false);
  const location = useLocation();

  return (
    <div className="flex">
      <div className="relative">
        <IoMenuOutline
          className="absolute -right-5 p-2 mt-4 hover:bg-btnSignIn hover:cursor-pointer w-10 h-10 bg-white hover:text-white rounded-full"
          onClick={() => setActive(!active)}
        />

        <Sidebar active={active} currentPath={location.pathname} />
      </div>
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 bg-gray-50 flex-1">
          {" "}
          <Outlet />{" "}
        </main>
      </div>
    </div>
  );
};

export default Layout;
