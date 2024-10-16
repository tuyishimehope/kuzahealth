import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import SignUp from "../pages/auth/SignUp";
import SignIn from "../pages/auth/SignIn";
import ForgotPassword from "../pages/auth/ForgotPassword";
import OtpVerification from "../pages/auth/OtpVerification";
import CreateNewPassword from "../pages/auth/CreateNewPassword";
import Dashboard from "../pages/HealthWorker/Dashboard";
import Layout from "./Layout";
import AddPatient from "../pages/HealthWorker/AddPatient";
import Nutrition from "../pages/HealthWorker/Nutrition";
import Vaccination from "../pages/HealthWorker/Vaccination";
import AddSchedule from "../pages/HealthWorker/AddSchedule";
import Profile from "../pages/HealthWorker/Profile";
import EditProfile from "../pages/HealthWorker/EditProfile";
import ViewSchedule from "../pages/HealthWorker/ViewSchedule";
import ViewPatient from "../pages/HealthWorker/ViewPatient";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth/signup",
    element: <SignUp />,
  },
  {
    path: "/auth/signin",
    element: <SignIn />,
  },
  {
    path: "/auth/forgotpassword",
    element: <ForgotPassword />,
  },
  {
    path: "/auth/otpverification",
    element: <OtpVerification />,
  },
  {
    path: "/auth/createnewpassword",
    element: <CreateNewPassword />,
  },
  {
    path: "/healthworker/dashboard",
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
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
        path: "nutrition",
        element: <Nutrition />,
      },
      {
        path: "vaccination",
        element: <Vaccination />,
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
        path: "profile",
        element: <Profile />,
        children: [
          {
            path: "edit",
            element: <EditProfile />,
          },
        ],
      },
    ],
  },
]);

export default router;
