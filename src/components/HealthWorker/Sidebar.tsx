import { RiCalendarScheduleLine, RiDashboardFill } from "react-icons/ri";
import logo from "../../assets/logo1.png";
import SidebarLink from "./SidebarLink";
import { IoAddOutline } from "react-icons/io5";
import { FaUsersGear } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import Button from "../Button";
import { CgProfile } from "react-icons/cg";
import { TbVaccine } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation

// Properly type the props
type SidebarProps = {
  active: boolean;
  currentPath?: string;
};

const Sidebar: React.FC<SidebarProps> = ({ active, currentPath }) => {
  const location = useLocation(); // Get the current path
  const navigate = useNavigate();

  return (
    <div
      className={`bg-bgSidebar flex flex-col space-y-6 ${
        active ? "w-20" : "w-56"
      } min-h-screen items-center`}
    >
      <div>
        <img src={logo} alt="logo" className="w-20 object-cover" />
      </div>
      {!active ? (
        <>
          <div className="flex-col pt-20 w-full flex space-y-6">
            <SidebarLink
              name="Dashboard"
              href="/healthworker/dashboard"
              status={location.pathname === "/healthworker/dashboard"} 
            />
            <SidebarLink
              name="Add Patient"
              icon={<IoAddOutline className="w-8 h-10" />}
              href={"/healthworker/dashboard/patient"} 
              currentPath={currentPath}
            />

            <SidebarLink
              name="View Patients"
              icon={<FaUsersGear className="w-8 h-10" />}
              status={
                location.pathname === "/healthworker/dashboard/view-patient"
              } 
              href={"/healthworker/dashboard/view-patient"} 
              currentPath={currentPath}
            />
            <SidebarLink
              name="Nutrition Info"
              icon={<FaInfoCircle className="w-8 h-10" />}
              status={location.pathname === "/healthworker/dashboard/nutrition"}
              currentPath={currentPath}
              href={"/healthworker/dashboard/nutrition"} 

            />
            <SidebarLink
              name="Vaccinations"
              icon={<TbVaccine className="w-8 h-10" />}
              status={
                location.pathname === "/healthworker/dashboard/vaccination"
              } 
              currentPath={currentPath}
              href={"/healthworker/dashboard/vaccination"} 
            />
            <SidebarLink
              name="Add Schedule"
              icon={<IoAddOutline className="w-8 h-10" />}
              status={
                location.pathname === "/healthworker/dashboard/schedule"
              } 
              currentPath={currentPath}
              href={"/healthworker/dashboard/schedule"} 
            />
            <SidebarLink
              name="View Schedule"
              icon={<RiCalendarScheduleLine className="w-8 h-10" />}
              status={
                location.pathname === "/healthworker/dashboard/view-schedule"
              }
              currentPath={currentPath}
              href={"/healthworker/dashboard/view-schedule"}  
            />
            <SidebarLink
              name="Profile"
              icon={<CgProfile className="w-8 h-10" />}
              status={location.pathname === "/healthworker/dashboard/profile"}
              currentPath={currentPath}
              href={"/healthworker/dashboard/profile"} 
            />
          </div>
          <div className="pt-20">
            <Button
              name="Logout"
              className="bg-btnSignIn text-white px-12 py-4 rounded-md"
              onClick={() => navigate("/auth/signin")}
            />
          </div>
        </>
      ) : (
        <>
          {" "}
          <div className="flex-col pt-20 w-full flex space-y-6">
            <SidebarLink
              icon={<RiDashboardFill className="w-8 h-10" />}
              status={location.pathname === "/healthworker/dashboard"} // Active status
            />
            <SidebarLink
              icon={<IoAddOutline className="w-8 h-10" />}
              status={location.pathname === "/healthworker/dashboard/patient"} // Active status for add patient
            />
            <SidebarLink
              icon={<FaUsersGear className="w-8 h-10" />}
              status={
                location.pathname === "/healthworker/dashboard/viewpatients"
              } // Active status for view patients
            />
            <SidebarLink
              icon={<FaInfoCircle className="w-8 h-10" />}
              status={location.pathname === "/healthworker/dashboard/nutrition"} // Active status for nutrition
            />
            <SidebarLink
              icon={<TbVaccine className="w-8 h-10" />}
              status={
                location.pathname === "/healthworker/dashboard/vaccinations"
              } // Active status for vaccinations
            />
            <SidebarLink
              icon={<IoAddOutline className="w-8 h-10" />}
              status={
                location.pathname === "/healthworker/dashboard/addschedule"
              } // Active status for add schedule
            />
            <SidebarLink
              icon={<RiCalendarScheduleLine className="w-8 h-10" />}
              status={
                location.pathname === "/healthworker/dashboard/viewschedule"
              } // Active status for view schedule
            />
            <SidebarLink
              icon={<CgProfile className="w-8 h-10" />}
              status={location.pathname === "/healthworker/dashboard/profile"} // Active status for profile
            />
          </div>
          <div className="pt-20 ">
            <Button
              name="Logout"
              className="bg-btnSignIn text-white px-4 py-4 rounded-md"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
