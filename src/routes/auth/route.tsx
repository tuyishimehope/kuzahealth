import React from "react";
import {
  SignIn,
  SignUp,
  ForgotPassword,
  CreateNewPassword,
} from "../../pages/auth";
import OtpVerification from "@/pages/auth/OtpVerification";

interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

const AUTH_ROUTES = {
  SIGNIN: "/auth/signin",
  SIGNUP: "/auth/signup",
  FORGOT_PASSWORD: "/auth/forgot-password",
  CREATE_NEW_PASSWORD: "/auth/reset-password",
  OTP_VERIFICATION: "/auth/otp-verification",
};

const AuthRoutes: RouteConfig[] = [
  {
    path: AUTH_ROUTES.SIGNIN,
    element: <SignIn />,
  },
  {
    path: AUTH_ROUTES.SIGNUP,
    element: <SignUp />,
  },
  {
    path: AUTH_ROUTES.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: AUTH_ROUTES.CREATE_NEW_PASSWORD,
    element: <CreateNewPassword />,
  },
  {
    path: AUTH_ROUTES.OTP_VERIFICATION,
    element: <OtpVerification/>
  }
];

export default AuthRoutes;
