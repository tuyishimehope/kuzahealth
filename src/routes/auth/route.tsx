import Login from "../../pages/auth/SignIn";
import Register from "../../pages/auth/SignUp";
import {
  default as ForgotPassword
} from "../../pages/auth/ForgotPassword";
import CreateNewPassword from "@/pages/auth/CreateNewPassword";

const AuthRoutes = [
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
    element: <CreateNewPassword />,
  },
];

export default AuthRoutes;
