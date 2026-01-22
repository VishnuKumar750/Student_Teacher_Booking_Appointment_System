import DataTable from "@/components/Table";
import { AutoCompleteSearch } from "@/components/typeahead-search";
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
import { AutoCompleteSelect } from "@/components/AutoCompleteSelect";
import { useState } from "react";

interface Students {
  _id: string;
  rollNo: string;
  name: string;
  email: string;
  course: string;
  department: string;
  year: string;
}

const data: Students[] = [
  {
    _id: "1",
    rollNo: "cse-19-23",
    name: "rahul",
    email: "rahul@gmail.com",
    course: "b.tech",
    department: "computer science",
    year: "2019",
  },
];

const columns: ColumnDef<Students>[] = [
  {
    accessorKey: "rollNo",
    header: "RollNo",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "course",
    header: "course",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const student = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="h-8 w-8 p-0">
              <span className="sr-only">open actions</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-medium">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <span className="sr-only">View details</span>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <span className="sr-only">Delete</span>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface Option {
  title: string;
  value: string;
}

const departments: Option[] = [
  { value: "sales", label: "Sales & Marketing" },
  { value: "finance", label: "Finance & Accounting" },
  { value: "hr", label: "Human Resources" },
  { value: "it", label: "Information Technology" },
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product Management" },
  { value: "design", label: "Design & UX" },
  { value: "operations", label: "Operations & Logistics" },
  { value: "legal", label: "Legal & Compliance" },
  { value: "support", label: "Customer Support" },
  { value: "data", label: "Data Science & Analytics" },
  { value: "security", label: "Information Security" },
];

export default function Students() {
  const [department, setDepartment] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const searchStudents = async (search: string) => {
    console.log("result", search);
    const result = data.filter((student) => student.name === search);
    return result;
  };

  console.log("selected", selectedStudent);

  return (
    <div className="p-6 container mx-auto">
      {/* search field */}
      <div className="flex flex-col lg:flex-row gap-4 py-6">
        <div className="w-full max-w-md space-y-2">
          <h1 className="text-sm font-bold tracking-tight uppercase">Search</h1>
          <AutoCompleteSearch
            placeholder="Search students..."
            value={selectedStudent}
            onValueChange={setSelectedStudent}
            searchQueryKey="student-search"
            searchFunction={searchStudents}
          />
        </div>
        <div className="flex  flex-wrap gap-4">
          <div className="w-full md:w-xs space-y-2">
            <h1 className="text-sm font-bold tracking-tight uppercase">
              Department
            </h1>
            <AutoCompleteSelect
              options={departments}
              placeholder={"Select departments"}
              value={department}
              onChange={setDepartment}
              searchPlaceholder={"Search departments"}
              className="w-full max-w-md"
            />
          </div>
          <div className="w-full md:w-xs space-y-2">
            <h1 className="text-sm font-bold tracking-tight uppercase">
              Course
            </h1>
            <AutoCompleteSelect
              options={departments}
              placeholder={"Select departments"}
              value={department}
              onChange={setDepartment}
              searchPlaceholder={"Search departments"}
              className="w-full max-w-md"
            />
          </div>
        </div>
      </div>

      {/* student list */}
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
