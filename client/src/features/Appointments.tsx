import { getMyAppointmentsColumns } from "@/components/user/student/appointments-columns";
import { useMyAppointments } from "@/hooks/use-fetch-appointment";
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

import { useAuth } from "@/hooks/use-auth";
import { useMemo } from "react";
import { getTeacherAppointmentsColumns } from "@/components/user/teacher/teacher-appointment-columns";

export default function Appointments() {
  const { user } = useAuth();
  const {
    data: appointments = [],
    isLoading,
    isError,
    refetch,
  } = useMyAppointments();

  const columns = useMemo(() => {
    if (user?.role === "teacher") {
      return getTeacherAppointmentsColumns();
    }
    if (user?.role === "student") {
      return getMyAppointmentsColumns();
    }

    return [];
  }, [user?.role]);

  const header = (
    <PageHeader
      title="Appointments"
      description={
        user?.role === "teacher" ? "Manage Appointments" : "Manage Appointments"
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

  if (appointments.length === 0) {
    return (
      <PageLayout header={header}>
        <Empty className="bg-muted/30 h-[60vh]">
          <EmptyHeader>
            <EmptyTitle>No Appointment found</EmptyTitle>
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
          List of Appointments
        </Label>
        <DataTable
          data={appointments}
          columns={columns}
          searchKey="name"
          searchPlaceholder="search student..."
        />
      </section>
    </PageLayout>
  );
}
