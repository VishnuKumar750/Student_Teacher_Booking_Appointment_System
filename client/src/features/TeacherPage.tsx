import AddTeacher from "@/components/add-teacher-form";
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
import { getTeacherColumns } from "@/components/user/Admin/teacher-columns";
import { useTeachers } from "@/hooks/useTeachers";
import { useMemo } from "react";
import { getFindTeachersColumns } from "@/components/user/student/find-teachers-columns";

export default function TeacherPage() {
  const { user } = useAuth();
  const { data: teachers = [], isLoading, isError, refetch } = useTeachers();

  const columns = useMemo(() => {
    if (user?.role === "admin") {
      return getTeacherColumns();
    }
    if (user?.role === "student") {
      return getFindTeachersColumns();
    }
    return [];
  }, [user?.role]);

  const header = (
    <PageHeader
      title="Teachers"
      description={
        user?.role === "admin"
          ? "Manage teachers, add teachers"
          : "Search teachers, book appointment"
      }
      action={user?.role === "admin" ? <AddTeacher refresh={refetch} /> : null}
    />
  );

  if (isLoading) {
    return (
      <PageLayout header={header}>
        <section className="space-y-4 mt-9">
          <Label className="text-sm tracking-tight font-medium">
            List of teachers
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

  if (teachers.length === 0) {
    return (
      <PageLayout header={header}>
        <Empty className="bg-muted/30 h-[60vh]">
          <EmptyHeader>
            <EmptyTitle>No teachers found</EmptyTitle>
            <EmptyDescription>
              Add teachers or refresh the list.
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
          List of teachers
        </Label>
        <DataTable
          data={teachers}
          columns={columns}
          searchKey="name"
          searchPlaceholder="search teacher..."
        />
      </section>
    </PageLayout>
  );
}
