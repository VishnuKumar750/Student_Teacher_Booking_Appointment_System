import type { ColumnDef } from "@tanstack/react-table";
import { StudentBookAppointment } from "@/components/book-appointment";
import type { IUser } from "@/api/user-api";

export const getFindTeachersColumns = (): ColumnDef<IUser>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    id: "action",
    header: "Actions",
    cell: ({ row }) => <StudentBookAppointment teacherId={row.original._id} />,
  },
];
