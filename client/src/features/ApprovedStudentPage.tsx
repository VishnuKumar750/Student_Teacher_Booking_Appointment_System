import { getStudentColumns } from "@/components/user/Admin/admin-student-columns";
import { useStudents } from "@/hooks/useStudents";
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
import { getTeacherStudentsColumns } from "@/components/user/teacher/teacher-student-columns";

export default function ApprovedStudentPage() {
  const { user } = useAuth();

  const { data: students = [], isLoading, isError, refetch } = useStudents();

  const columns = useMemo(() => {
    if (user?.role === "admin") {
      return getStudentColumns();
    }
    if (user?.role === "teacher") {
      return getTeacherStudentsColumns();
    }

    return [];
  }, [user?.role]);

  const header = (
    <PageHeader
      title="Students"
      description={
        user?.role === "admin"
          ? "Manage students, add teachers"
          : "Search students, book appointment"
      }
    />
  );

  if (isLoading) {
    return (
      <PageLayout header={header}>
        <section className="space-y-4 mt-9">
          <Label className="text-sm tracking-tight font-medium">
            List of students
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

  if (students.length === 0) {
    return (
      <PageLayout header={header}>
        <Empty className="bg-muted/30 h-[60vh]">
          <EmptyHeader>
            <EmptyTitle>No students found</EmptyTitle>
            <EmptyDescription>
              Add students or refresh the list.
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
          data={students}
          columns={columns}
          searchKey="name"
          searchPlaceholder="search student..."
        />
      </section>
    </PageLayout>
  );
}
