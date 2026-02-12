import type { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";

import DashboardLayout from "@/components/Layout/DashboardLayout";
import PageLoader from "@/components/page-loader";

/* ───────── Lazy Pages ───────── */

const TeacherAnalyticsPage = lazy(() => import("@/features/teacher/Dashboard"));

const AppointmentPage = lazy(() => import("@/features/Appointments"));

const ApprovedStudentPage = lazy(
  () => import("@/features/ApprovedStudentPage"),
);

const PendgingAppointmentPage = lazy(
  () => import("@/features/PendingAppointments"),
);

/* ───────── Routes ───────── */

export const TeacherRoutes: RouteObject[] = [
  {
    path: "/teacher",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeacherAnalyticsPage />
          </Suspense>
        ),
      },
      {
        path: "students",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ApprovedStudentPage />
          </Suspense>
        ),
      },
      {
        path: "view-appointments",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AppointmentPage />
          </Suspense>
        ),
      },
      {
        path: "pending-appointments",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PendgingAppointmentPage />
          </Suspense>
        ),
      },
    ],
  },
];
