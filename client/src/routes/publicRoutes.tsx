import type { RouteObject } from "react-router-dom";
import LandingPage from "@/features/LandingPage/LandingPage";
import Login from "@/features/auth/login";
import Register from "@/features/auth/Register";

export const PublicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/signin",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Register />,
  },
];
