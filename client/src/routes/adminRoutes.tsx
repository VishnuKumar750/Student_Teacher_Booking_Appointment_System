import type { RouteObject } from "react-router-dom";

import DashboardLayout from "@/components/Layout/DashboardLayout";
import Teachers from "@/features/admin/Teachers";
import Students from "@/features/admin/Students";
import ApproveStudents from "@/features/admin/ApproveStudents";
import AdminAnalyticsPage from "@/features/admin/Dashboard";

export const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <AdminAnalyticsPage /> },
      { path: "teachers", element: <Teachers /> },
      { path: "students/list", element: <Students /> },
      { path: "students/approval", element: <ApproveStudents /> },
    ],
  },
];
