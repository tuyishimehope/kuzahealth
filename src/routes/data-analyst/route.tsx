import DataanalystLayout from "@/layouts/data-analyst/Data-analyst";
import AddHealthWorker from "@/pages/data-analyst/AddHealthWorker";
import AddPatient from "@/pages/data-analyst/AddPatient";
import Dashboard from "@/pages/data-analyst/Dashboard";
import Facilities from "@/pages/data-analyst/Facilities";
import Reports from "@/pages/data-analyst/Reports";
import Schedule from "@/pages/data-analyst/Schedule";
import Settings from "@/pages/data-analyst/Settings";
import ViewHealthWorkers from "@/pages/data-analyst/ViewHealthWorkers";
import ViewParents from "@/pages/data-analyst/ViewParents";

const DataAnalystRoutes = [
  {
    path: "/data-analyst",
    element: <DataanalystLayout />,
    children: [
      { path: "/data-analyst/dashboard", element: <Dashboard /> },
      { path: "/data-analyst/add-health-workers", element: <AddHealthWorker /> },
      { path: "/data-analyst/health-workers", element: <ViewHealthWorkers /> },
      { path: "/data-analyst/schedules", element: <Schedule /> },
      { path: "/data-analyst/add-parent", element: <AddPatient /> },
      { path: "/data-analyst/parents", element: <ViewParents /> },
      { path: "/data-analyst/facilities", element: <Facilities /> },
      { path: "/data-analyst/reports", element: <Reports /> },
      { path: "/data-analyst/settings", element: <Settings /> },
    ],
  },
];

export default DataAnalystRoutes;
