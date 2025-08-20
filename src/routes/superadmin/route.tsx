import SuperAdminLayout from "@/layouts/superadmin/SuperAdminLayout";
import AddDataAnalyst from "@/pages/superadmin/AddDataAnalyst";
import AddHealthWorker from "@/pages/superadmin/AddHealthWorker";
import AddParent from "@/pages/superadmin/AddParent";
import AdminLogs from "@/pages/superadmin/AdminLogs";
import Audit from "@/pages/superadmin/Audit";
import Dashboard from "@/pages/superadmin/Dashboard";
import Facilities from "@/pages/superadmin/Facilities";
import ManageUsers from "@/pages/superadmin/ManageUsers";
import Reports from "@/pages/superadmin/Reports";
import Settings from "@/pages/superadmin/Settings";
import ViewHealthWorkers from "@/pages/superadmin/ViewHealthWorkers";
import ViewParents from "@/pages/superadmin/ViewParents";

const SuperAdminRoutes = [
  {
    path: "/superadmin",
    element: <SuperAdminLayout />,
    children: [
      { path: "/superadmin/dashboard", element: <Dashboard /> },
      { path: "/superadmin/add-health-workers", element: <AddHealthWorker /> },
      { path: "/superadmin/health-workers", element: <ViewHealthWorkers /> },
      { path: "/superadmin/add-parent", element: <AddParent /> },
      { path: "/superadmin/parents", element: <ViewParents /> },
      { path: "/superadmin/add-data-analyst", element: <AddDataAnalyst /> },
      { path: "/superadmin/facilities", element: <Facilities /> },
      { path: "/superadmin/reports", element: <Reports /> },
      { path: "/superadmin/users", element: <ManageUsers /> },
      { path: "/superadmin/audit", element: <Audit /> },
      { path: "/superadmin/adminlogs", element: <AdminLogs /> },
      { path: "/superadmin/settings", element: <Settings /> },
    ],
  },
];

export default SuperAdminRoutes;
