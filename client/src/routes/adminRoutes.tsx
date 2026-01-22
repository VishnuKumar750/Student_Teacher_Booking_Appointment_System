import type { RouteObject } from "react-router-dom";

import Dashboard from "@/features/admin/Dashboard";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import Teachers from "@/features/admin/Teachers";
import Students from "@/features/admin/Students";
import ApproveStudents from "@/features/admin/ApproveStudents";

export const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "teachers", element: <Teachers /> },
      { path: "students", element: <Students /> },
      { path: "students/approve", element: <ApproveStudents /> },
    ],
  },
];
