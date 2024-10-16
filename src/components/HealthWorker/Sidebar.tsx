import { RiCalendarScheduleLine, RiDashboardFill } from "react-icons/ri";
import logo from "../../assets/logo1.png";
import SidebarLink from "./SidebarLink";
import { IoAddOutline } from "react-icons/io5";
import { FaUsersGear } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import Button from "../Button";
import { CgProfile } from "react-icons/cg";
import { TbVaccine } from "react-icons/tb";

// Properly type the props
type SidebarProps = {
  active: boolean; // Define active as a boolean
};

const Sidebar: React.FC<SidebarProps> = ({ active }) => {
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
              icon={<RiDashboardFill className="w-8 h-10" />}
              status={true}
            />
            <SidebarLink
              name="Add Patient"
              icon={<IoAddOutline className="w-8 h-10" />}
            />
            <SidebarLink
              name="View Patients"
              icon={<FaUsersGear className="w-8 h-10" />}
            />
            <SidebarLink
              name="Nutrition Info"
              icon={<FaInfoCircle className="w-8 h-10" />}
            />
            <SidebarLink
              name="Vaccinations"
              icon={<TbVaccine className="w-8 h-10" />}
            />
            <SidebarLink
              name="Add Schedule"
              icon={<IoAddOutline className="w-8 h-10" />}
            />
            <SidebarLink
              name="View Schedule"
              icon={<RiCalendarScheduleLine className="w-8 h-10" />}
            />
            <SidebarLink
              name="Profile"
              icon={<CgProfile className="w-8 h-10" />}
            />
          </div>
          <div className="pt-20">
            <Button
              name="Logout"
              className="bg-btnSignIn text-white px-12 py-4 rounded-md"
            />
          </div>
        </>
      ) : (
        <>
          {" "}
          <div className="flex-col pt-20 w-full flex space-y-6">
            <SidebarLink
              icon={<RiDashboardFill className="w-8 h-10" />}
              status={true}
            />
            <SidebarLink icon={<IoAddOutline className="w-8 h-10" />} />
            <SidebarLink icon={<FaUsersGear className="w-8 h-10" />} />
            <SidebarLink icon={<FaInfoCircle className="w-8 h-10" />} />
            <SidebarLink icon={<TbVaccine className="w-8 h-10" />} />
            <SidebarLink icon={<IoAddOutline className="w-8 h-10" />} />
            <SidebarLink
              icon={<RiCalendarScheduleLine className="w-8 h-10" />}
            />
            <SidebarLink icon={<CgProfile className="w-8 h-10" />} />
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
