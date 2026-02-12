import { PageHeader } from "@/components/page-header";
import { PageLayout } from "./page-layout";
import { Label } from "@/components/ui/label";
import TableSkeleton from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { RefreshCcwIcon } from "lucide-react";
import DataTable from "@/components/Table";

import { getTeacherPendingColumns } from "@/components/user/teacher/teacher-pending-columns";
import { useAuth } from "@/hooks/use-auth";
import { usePendingAppointments } from "@/hooks/use-fetch-appointment";
import { useMemo } from "react";
import { getPendingAppointmentsColumns } from "@/components/user/student/pending-appointment-columns";

export default function PendingAppointments() {
  const { user } = useAuth();
  const {
    data: pendingAppointments = [],
    isLoading,
    isError,
    refetch,
  } = usePendingAppointments();

  const columns = useMemo(() => {
    if (user?.role === "teacher") {
      return getTeacherPendingColumns();
    }
    if (user?.role === "student") {
      return getPendingAppointmentsColumns();
    }

    return [];
  }, [user?.role]);

  const header = (
    <PageHeader
      title="Pending Appointments"
      description={
        user?.role === "teacher"
          ? "Manage Appointments, book Appointments, cancel Appointments"
          : "Manage Appointments"
      }
    />
  );

  if (isLoading) {
    return (
      <PageLayout header={header}>
        <section className="space-y-4 mt-9">
          <Label className="text-sm tracking-tight font-medium">
            List of Appointments
          </Label>
          <TableSkeleton />
        </section>
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout header={header}>
        <div className="mt-6 space-y-2">
          <p>Something went wrong. Try again.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Reload
          </Button>
        </div>
      </PageLayout>
    );
  }

  if (pendingAppointments.length === 0) {
    return (
      <PageLayout header={header}>
        <Empty className="bg-muted/30 h-[60vh]">
          <EmptyHeader>
            <EmptyTitle>No students found</EmptyTitle>
            <EmptyDescription>
              Add Appointments or refresh the list.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCcwIcon />
              Refresh
            </Button>
          </EmptyContent>
        </Empty>
      </PageLayout>
    );
  }

  return (
    <PageLayout header={header}>
      <section className="space-y-4 mt-9">
        <Label className="text-sm tracking-tight font-medium">
          List of students
        </Label>
        <DataTable
          data={pendingAppointments}
          columns={columns}
          searchKey="name"
          searchPlaceholder="search student..."
        />
      </section>
    </PageLayout>
  );
}
