import { createBrowserRouter } from "react-router-dom";
import SuperAdminLayout from "../layouts/SuperAdminLayout";
import { default as ForgotPassword, default as ResetPassword } from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/SignIn";
import Register from "../pages/auth/SignUp";
import AnalyticsDashboard from "../pages/HealthWorker/Analytics";
import Appointments from "../pages/HealthWorker/Appointments";
import HealthWorkerDashboard from "../pages/HealthWorker/Dashboard";
import InfantVaccination from "../pages/HealthWorker/infants/InfantVaccination";
import ViewInfants from "../pages/HealthWorker/infants/ViewInfants";
import AddPatient from "../pages/HealthWorker/Mother/AddPatient";
import ViewPatient from "../pages/HealthWorker/Mother/ViewPatient";
import Profile from "../pages/HealthWorker/Profile";
import Reports from "../pages/HealthWorker/Reports";
import AddSchedule from "../pages/HealthWorker/Schedule/AddSchedule";
import ViewSchedule from "../pages/HealthWorker/Schedule/ViewSchedule";
import Settings from "../pages/HealthWorker/Settings";
import Home from "../pages/Home";
import AddHealthWorker from "../pages/superadmin/AddHealthWorker";
import SuperAdminDashboard from "../pages/superadmin/Dashboard";
import ViewHealthWorkers from "../pages/superadmin/ViewHealthWorkers";
import HealthWorkerLayout from "../routes/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth/signin",
    element: <Login />,
  },
  {
    path: "/auth/signup",
    element: <Register />,
  },
  {
    path: "/auth/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/auth/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/superadmin",
    element: <SuperAdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <SuperAdminDashboard />,
      },
      {
        path: "health-workers",
        element: <ViewHealthWorkers />,
      },
      {
        path: "health-workers/active",
        element: <ViewHealthWorkers />,
      },
      {
        path: "health-workers/inactive",
        element: <ViewHealthWorkers />,
      },
      {
        path: "add-health-worker",
        element: <AddHealthWorker />,
      },
      {
        path: "facilities",
        element: <div>Facilities Management</div>, // TODO: Create Facilities component
      },
      {
        path: "reports",
        element: <div>Reports Overview</div>, // TODO: Create Reports component
      },
      {
        path: "reports/analytics",
        element: <div>Analytics Dashboard</div>, // TODO: Create Analytics component
      },
      {
        path: "reports/activity",
        element: <div>Activity Logs</div>, // TODO: Create ActivityLogs component
      },
      {
        path: "settings",
        element: <div>Settings</div>, // TODO: Create Settings component
      },
    ],
  },
  {
    path: "/healthworker",
    element: <HealthWorkerLayout />,
    children: [
      {
        path: "dashboard",
        element: <HealthWorkerDashboard />,
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
        element: <AddPatient />,
      },
      {
        path: "view-patient",
        element: <ViewPatient />,
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
]);