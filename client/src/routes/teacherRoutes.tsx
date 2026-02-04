import type { RouteObject } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";

import StudentPage from "@/features/teacher/Students";
import TeacherAppointments from "@/features/teacher/Appointments";
import TeacherPendingAppointments from "@/features/teacher/pending-appointments";
import TeacherAnalyticsPage from "@/features/teacher/Dashboard";

export const TeacherRoutes: RouteObject[] = [
  {
    path: "/teacher",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <TeacherAnalyticsPage /> },
      { path: "students", element: <StudentPage /> },
      { path: "view-appointments", element: <TeacherAppointments /> },
      { path: "pending-appointments", element: <TeacherPendingAppointments /> },
    ],
  },
];
