import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import StudentRequest from "@/components/student-request-approve";
import type { IUser } from "@/api/user-api";

export const getStudentApprovalColumns = (): ColumnDef<IUser>[] => [
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
    cell: ({ row }) => (
      <Badge variant="outline" className="text-yellow-600">
        {!row.original.isApproved ? "pending" : ""}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <StudentRequest studentId={row.original._id} />,
  },
];
