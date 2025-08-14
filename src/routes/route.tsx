import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import SuperAdminRoutes from "./superadmin/route";
import HealthWorkerRoutes from "./healthworker/route";
import AuthRoutes from "./auth/route";
import DataAnalystRoutes from "./data-analyst/route";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  ...AuthRoutes,
  ...HealthWorkerRoutes,
  ...SuperAdminRoutes,
  ...DataAnalystRoutes
]);