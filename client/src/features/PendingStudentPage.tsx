import { getStudentApprovalColumns } from "@/components/user/Admin/student-approval-columns";
import { usePendingStudents } from "@/hooks/usePendingStudents";
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

export default function PendingStudentPage() {
  const {
    data: students = [],
    isLoading,
    isError,
    refetch,
  } = usePendingStudents();
  const columns = getStudentApprovalColumns();
  const { user } = useAuth();

  const header = (
    <PageHeader
      title="Students"
      description={
        user?.role === "admin"
          ? "Manage teachers, add teachers"
          : "Search teachers, book appointment"
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
