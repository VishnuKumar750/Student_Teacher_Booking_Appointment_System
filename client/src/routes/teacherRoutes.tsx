import type { RouteObject } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";

import Dashboard from "@/features/teacher/Dashboard";
import StudentPage from "@/features/teacher/Students";
import TeacherAppointments from "@/features/teacher/Appointments";

export const TeacherRoutes: RouteObject[] = [
  {
    path: "/teacher",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "students", element: <StudentPage /> },
      { path: "view-appointments", element: <TeacherAppointments /> },
    ],
  },
];
