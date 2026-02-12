import type { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";

import DashboardLayout from "@/components/Layout/DashboardLayout";
import PageLoader from "@/components/page-loader";

/* ───────── Lazy Pages ───────── */

const StudentAnalyticsPage = lazy(() => import("@/features/student/Dashboard"));
const TeachersPage = lazy(() => import("@/features/TeacherPage"));
const MyAppointmentsPage = lazy(() => import("@/features/Appointments"));

const PendingAppointmentsPage = lazy(
  () => import("@/features/PendingAppointments"),
);

/* ───────── Routes ───────── */

export const StudentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <StudentAnalyticsPage />
          </Suspense>
        ),
      },
      {
        path: "teachers",
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeachersPage />
          </Suspense>
        ),
      },
      {
        path: "view-appointments",
        element: (
          <Suspense fallback={<PageLoader />}>
            <MyAppointmentsPage />
          </Suspense>
        ),
      },
      {
        path: "pending-appointments",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PendingAppointmentsPage />
          </Suspense>
        ),
      },
    ],
  },
];
