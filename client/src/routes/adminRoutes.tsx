import type { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";

import DashboardLayout from "@/components/Layout/DashboardLayout";
import PageLoader from "@/components/page-loader";

/* ───────── Lazy Pages ───────── */

const AdminAnalyticsPage = lazy(() => import("@/features/admin/Dashboard"));

const TeacherPage = lazy(() => import("@/features/TeacherPage"));

const ApproveStudentPage = lazy(() => import("@/features/ApprovedStudentPage"));

const PendingStudentPage = lazy(() => import("@/features/PendingStudentPage"));

/* ───────── Routes ───────── */

export const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminAnalyticsPage />
          </Suspense>
        ),
      },
      {
        path: "teachers",
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeacherPage />
          </Suspense>
        ),
      },
      {
        path: "students/list",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ApproveStudentPage />
          </Suspense>
        ),
      },
      {
        path: "students/approval",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PendingStudentPage />
          </Suspense>
        ),
      },
    ],
  },
];
