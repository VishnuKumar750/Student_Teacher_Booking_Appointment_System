import { useQuery, useMutation } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import AddTeacher from "@/components/add-teacher-form";
import DataTable from "@/components/Table";
import api from "@/axios/axios-api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UpdateTeacher from "@/components/update-teacher";
import DeleteTeacher from "@/components/delete-teacher";

/* ───────────────── Types ───────────────── */

interface TeacherResponse {
  _id: string;
  name: string;
  email: string;
  department: string;
  subject: string;
  profileImage?: string;
  availability: object;
}

/* ───────────────── API ───────────────── */

const fetchTeachers = async (): Promise<TeacherResponse[]> => {
  const { data } = await api.get("/admin/teachers");
  return data.data;
};

const deleteTeacher = async (id: string) => {
  await api.delete(`/teacher/${id}`);
};

/* ---- Columns ---- */
const columns: ColumnDef<TeacherResponse>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email,
  },
  {
    header: "Department",
    cell: ({ row }) => row.original.department,
  },
  {
    header: "Subjects",
    cell: ({ row }) => row.original.subject,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const teacher = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <UpdateTeacher teacherId={teacher._id} teacher={teacher} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" asChild>
              <DeleteTeacher teacherId={teacher._id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

/* ───────────────── Component ───────────────── */

export default function Teachers() {
  /* ---- Query ---- */
  const {
    data: teachers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  /* ---- Mutation ---- */
  const deleteMutation = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      toast.success("Teacher deleted");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete teacher");
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Teachers</h1>
          <p className="text-sm text-muted-foreground">
            Manage teachers, subjects, and availability
          </p>
        </div>

        <AddTeacher refresh={refetch} />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading teachers...</div>
      ) : (
        <DataTable
          columns={columns}
          data={teachers}
          searchKey="name"
          searchPlaceholder="Search teacher..."
        />
      )}
    </div>
  );
}
