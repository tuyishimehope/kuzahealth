import { RiDashboardLine, RiSettings4Line } from "react-icons/ri";
import { IoEyeOutline, IoAddOutline } from "react-icons/io5";
import { TbVaccine } from "react-icons/tb";
import { FaInfoCircle } from "react-icons/fa";

export const ROUTES = {
  DASHBOARD: "/healthworker/dashboard",
  ANALYTICS: "/healthworker/analytics",
  ADD_MOTHER: "/healthworker/patient",
  VIEW_MOTHERS: "/healthworker/view-patient",
  NUTRITION: "/healthworker/nutrition",
  ADD_INFANT: "/healthworker/add-infant",
  VIEW_INFANTS: "/healthworker/view-infants",
  INFANT_VACCINATION: "/healthworker/infant-vaccination",
  ADD_SCHEDULE: "/healthworker/schedule",
  VIEW_SCHEDULE: "/healthworker/view-schedule",
  PROFILE: "/healthworker/profile",
  LOGOUT: "/auth/signin",
};

export const MENU_ITEMS = [
  {
    title: "Dashboard",
    icon: <RiDashboardLine className="w-5 h-5" />,
    href: ROUTES.DASHBOARD,
  },
  {
    title: "Analytics",
    icon: <div className="flex items-center justify-center w-5 h-5 text-lg">📊</div>,
    href: ROUTES.ANALYTICS,
  },
];

export const MOTHER_INFO_MENU = [
  { label: "Add Mother", icon: <IoAddOutline className="w-5 h-5" />, href: ROUTES.ADD_MOTHER },
  { label: "View Mothers", icon: <IoEyeOutline className="w-5 h-5" />, href: ROUTES.VIEW_MOTHERS },
  { label: "Nutrition Info", icon: <FaInfoCircle className="w-5 h-5" />, href: ROUTES.NUTRITION },
];

export const INFANT_INFO_MENU = [
  { label: "Add Infant", icon: <IoAddOutline className="w-5 h-5" />, href: ROUTES.ADD_INFANT },
  { label: "View Infants", icon: <IoEyeOutline className="w-5 h-5" />, href: ROUTES.VIEW_INFANTS },
  { label: "Vaccinations", icon: <TbVaccine className="w-5 h-5" />, href: ROUTES.INFANT_VACCINATION },
];

export const SCHEDULE_MENU = [
  { label: "Add Schedule", icon: <IoAddOutline className="w-5 h-5" />, href: ROUTES.ADD_SCHEDULE },
  { label: "View Schedules", icon: <IoEyeOutline className="w-5 h-5" />, href: ROUTES.VIEW_SCHEDULE },
];

export const SETTINGS_MENU = [
  { label: "Update Profile", icon: <RiSettings4Line className="w-5 h-5" />, href: ROUTES.PROFILE },
];
