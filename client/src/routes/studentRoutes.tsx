import type { RouteObject } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import FindTeachers from "@/features/student/FindTeachers";
import PendingAppointments from "@/features/student/request-appointments";
import MyAppointments from "@/features/student/view-appointment";
import StudentAnalyticsPage from "@/features/student/Dashboard";

export const StudentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <StudentAnalyticsPage /> },
      { path: "teachers", element: <FindTeachers /> },
      { path: "view-appointments", element: <MyAppointments /> },
      { path: "pending-appointments", element: <PendingAppointments /> },
    ],
  },
];
