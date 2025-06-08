import SuperAdminLayout from "@/layouts/superadmin/SuperAdminLayout";
import AddHealthWorker from "@/pages/superadmin/AddHealthWorker";
import Dashboard from "@/pages/superadmin/Dashboard";
import Facilities from "@/pages/superadmin/Facilities";
import Reports from "@/pages/superadmin/Reports";
import Schedule from "@/pages/superadmin/Schedule";
import Settings from "@/pages/superadmin/Settings";
import ViewHealthWorkers from "@/pages/superadmin/ViewHealthWorkers";

const SuperAdminRoutes = [
  {
    path: "/superadmin",
    element: <SuperAdminLayout />,
    children: [
      { path: "/superadmin/dashboard", element: <Dashboard /> },
      { path: "/superadmin/add-health-workers", element: <AddHealthWorker /> },
      { path: "/superadmin/health-workers", element: <ViewHealthWorkers /> },
      { path: "/superadmin/schedules", element: <Schedule /> },
      { path: "/superadmin/facilities", element: <Facilities /> },
      { path: "/superadmin/reports", element: <Reports /> },
      { path: "/superadmin/settings", element: <Settings /> },
    ],
  },
];

export default SuperAdminRoutes;
