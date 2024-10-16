import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import SignUp from "../pages/auth/SignUp";
import SignIn from "../pages/auth/SignIn";
import ForgotPassword from "../pages/auth/ForgotPassword";
import OtpVerification from "../pages/auth/OtpVerification";
import CreateNewPassword from "../pages/auth/CreateNewPassword";
import Dashboard from "../pages/HealthWorker/Dashboard";
import Layout from "./Layout";
 // Import the Layout component

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
  },
]);

export default router;
