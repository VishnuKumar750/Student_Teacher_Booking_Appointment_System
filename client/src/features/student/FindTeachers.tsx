import DataTable from "@/components/Table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/axios/axios-api";
import { StudentBookAppointment } from "@/components/book-appointment";

/* ───────── types ───────── */
interface Teacher {
  _id: string;
  name: string;
  department: string;
  subject: string;
}

/* ───────── api ───────── */
const fetchTeachersForStudent = async (): Promise<Teacher[]> => {
  const { data } = await api.get("/student/teachers");
  return data?.data ?? [];
};

/* ───────── columns ───────── */
const columns: ColumnDef<Teacher>[] = [
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
    cell: ({ row }) => {
      const teacher = row.original;

      return <StudentBookAppointment teacherId={teacher._id} />;
    },
  },
];

/* ───────── component ───────── */
export default function FindTeachers() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["student-teachers"],
    queryFn: fetchTeachersForStudent,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Find Teachers</h1>
        <p className="text-sm text-muted-foreground">
          Browse teachers and book appointments
        </p>
      </div>

      {/* States */}
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading teachers…</p>
      )}

      {isError && (
        <p className="text-sm text-red-500">
          Failed to load teachers. Please try again.
        </p>
      )}

      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={data}
          searchKey="name"
          searchPlaceholder="Search teacher name…"
        />
      )}
    </div>
  );
}
