import HealthWorkerLayout from "@/layouts/healthworker/Layout";
import AnalyticsDashboard from "@/pages/HealthWorker/Analytics";
import Appointments from "@/pages/HealthWorker/Appointments";
import Dashboard from "@/pages/HealthWorker/Dashboard";
import AddInfant from "@/pages/HealthWorker/infants/AddInfant";
import InfantVaccination from "@/pages/HealthWorker/infants/InfantVaccination";
import ViewInfantMother from "@/pages/HealthWorker/infants/ViewInfantMother";
import ViewInfants from "@/pages/HealthWorker/infants/ViewInfants";
import AddMotherForm from "@/pages/HealthWorker/Mother/AddPatient";
import PatientInfo from "@/pages/HealthWorker/Mother/PatientInfo";
import MaritimePatientDashboard from "@/pages/HealthWorker/Mother/ViewPatient";
import Nutrition from "@/pages/HealthWorker/Nutrition";
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
        path: "nutrition",
        element: <Nutrition />,
      },
        {
        path: "view-patient/:id",
        element: <PatientInfo />,
      },
      {
        path: "view-infants",
        element: <ViewInfants />,
      },
       {
        path: "view-infants/:id",
        element: <ViewInfantMother />,
      },
      {
        path:"add-infant",
        element: <AddInfant/>
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
