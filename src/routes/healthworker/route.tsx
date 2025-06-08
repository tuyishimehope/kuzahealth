import HealthWorkerLayout from "@/layouts/healthworker/Layout";
import AnalyticsDashboard from "@/pages/HealthWorker/Analytics";
import Appointments from "@/pages/HealthWorker/Appointments";
import Dashboard from "@/pages/HealthWorker/Dashboard";
import InfantVaccination from "@/pages/HealthWorker/infants/InfantVaccination";
import ViewInfants from "@/pages/HealthWorker/infants/ViewInfants";
import AddMotherForm from "@/pages/HealthWorker/Mother/AddPatient";
import MaritimePatientDashboard from "@/pages/HealthWorker/Mother/ViewPatient";
import Profile from "@/pages/HealthWorker/Profile";
import Reports from "@/pages/HealthWorker/Reports";
import AddSchedule from "@/pages/HealthWorker/Schedule/AddSchedule";
import ViewSchedule from "@/pages/HealthWorker/Schedule/ViewSchedule";
import Settings from "@/pages/HealthWorker/Settings";

const HealthWorkerRoutes = [
  {
    path: "/healthworker",
    element: <HealthWorkerLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "analytics",
        element: <AnalyticsDashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "patient",
        element: <AddMotherForm />,
      },
      {
        path: "view-patient",
        element: <MaritimePatientDashboard />,
      },
      {
        path: "view-infants",
        element: <ViewInfants />,
      },
      {
        path: "infant-vaccination",
        element: <InfantVaccination />,
      },
      {
        path: "schedule",
        element: <AddSchedule />,
      },
      {
        path: "view-schedule",
        element: <ViewSchedule />,
      },
      {
        path: "appointments",
        element: <Appointments />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
];

export default HealthWorkerRoutes;
