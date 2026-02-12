import type { ColumnDef } from "@tanstack/react-table";
import { TeacherBookAppointment } from "@/components/teacher-book-appointment";
import type { IUser } from "@/api/user-api";

export const getTeacherStudentsColumns = (): ColumnDef<IUser>[] => [
  {
    accessorKey: "rollNo",
    header: "Roll No",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.rollNo}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <TeacherBookAppointment studentId={row.original._id} />,
  },
];
