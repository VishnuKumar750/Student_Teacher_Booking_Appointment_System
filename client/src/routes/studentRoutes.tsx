import type { RouteObject } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import FindTeachers from "@/features/student/FindTeachers";
import StudentDashboard from "@/features/student/Dashboard";
import StudentAppointments from "@/features/student/MyAppointments";

export const StudentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <StudentDashboard /> },
      { path: "teachers", element: <FindTeachers /> },
      { path: "view-appointments", element: <StudentAppointments /> },
    ],
  },
];
