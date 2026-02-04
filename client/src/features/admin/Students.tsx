import DataTable from "@/components/Table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreVertical, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/axios/axios-api";

/* ───────── types ───────── */
interface Student {
  _id: string;
  rollNo: string;
  name: string;
  email: string;
  department: string;
  year: string;
}

/* ───────── api ───────── */
const fetchStudents = async (): Promise<Student[]> => {
  const { data } = await api.get("/admin/students");
  return data.data;
};

/* ───────── columns ───────── */
const columns: ColumnDef<Student>[] = [
  { accessorKey: "rollNo", header: "Roll No" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "year", header: "Year" },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const student = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

/* ───────── page ───────── */
export default function Students() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold">Students</h1>
        <p className="text-sm text-muted-foreground">
          Manage and view all registered students
        </p>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search student..."
        isLoading={isLoading}
        emptyMessage="No students found"
      />
    </div>
  );
}
