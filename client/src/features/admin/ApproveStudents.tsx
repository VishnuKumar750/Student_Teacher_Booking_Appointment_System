import DataTable from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, MoreVertical } from "lucide-react";
import api from "@/axios/axios-api";
import StudentRequest from "@/components/student-request-approve";

/* ───────── types ───────── */
interface Student {
  _id: string;
  rollNo: string;
  name: string;
  email: string;
  department: string;
  year: number; // admission year
  isApproved: boolean;
}

/* ───────── columns ───────── */
const columns: ColumnDef<Student>[] = [
  { accessorKey: "rollNo", header: "Roll No" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "department", header: "Department" },
  {
    accessorKey: "year",
    header: "Admission Year",
  },
  {
    accessorKey: "isApproved",
    header: "Status",
    cell: ({ row }) =>
      row.original.isApproved ? (
        <Badge variant="outline" className="text-green-600">
          Approved
        </Badge>
      ) : (
        <Badge variant="outline" className="text-yellow-600">
          Pending
        </Badge>
      ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const student = row.original;

      return <StudentRequest studentId={student._id} />;
    },
  },
];

/* ───────── api ───────── */
const fetchPendingStudents = async (): Promise<Student[]> => {
  const { data } = await api.get("/admin/students/unapproved");

  // backend standardization safety
  return data?.data ?? [];
};

/* ───────── component ───────── */
export default function ApproveStudent() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pending-students"],
    queryFn: fetchPendingStudents,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Student Approvals
        </h1>
        <p className="text-sm text-muted-foreground">
          Review and approve students waiting for platform access
        </p>
      </div>

      {/* States */}
      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Loading pending students…
        </p>
      )}

      {isError && (
        <p className="text-sm text-red-500">
          Failed to load students. Please try again.
        </p>
      )}

      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={data}
          searchKey="name"
          searchPlaceholder="Search student…"
        />
      )}
    </div>
  );
}
