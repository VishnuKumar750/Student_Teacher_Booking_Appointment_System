import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// lib/api/student.ts
import api from "@/axios/axios-api";
import type { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/Table";
import { TeacherBookAppointment } from "@/components/teacher-book-appointment";

interface Student {
  _id: string;
  name: string;
  email: string;
  rollNo: string;
  department: string;
}

const columns: ColumnDef<Student>[] = [
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
    cell: ({ row }) => <span>{row.original.name}</span>,
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
    cell: ({ row }) => <span>{row.original.department}</span>,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const student = row.original;

      return <TeacherBookAppointment studentId={student._id} />;
    },
  },
];

const fetchStudentsForTeacher = async () => {
  const { data } = await api.get("/teacher/students");
  console.log("data", data.data);
  return data.data;
};

export default function StudentPage() {
  const {
    data: students,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["teacher-students"],
    queryFn: fetchStudentsForTeacher,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold">Students</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all students assigned to you
        </p>
      </div>

      {/* Content */}
      <div className="rounded-lg border bg-background p-4">
        {isLoading && (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading students
          </div>
        )}

        {isError && (
          <div className="text-center py-12 text-red-500">
            {(error as any)?.response?.data?.message ||
              "Failed to load students"}
          </div>
        )}

        {!isLoading && !isError && students?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No students found
          </div>
        )}

        {!isLoading && !isError && students?.length > 0 && (
          <div>
            {/* Replace with DataTable */}
            <DataTable
              columns={columns}
              data={students}
              searchKey="name"
              searchPlaceholder="search student..."
            />
          </div>
        )}
      </div>
    </div>
  );
}
