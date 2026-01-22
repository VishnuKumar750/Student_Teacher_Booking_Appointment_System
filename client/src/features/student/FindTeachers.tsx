import { AutoCompleteSelect } from "@/components/AutoCompleteSelect";
import DataTable from "@/components/Table";
import { AutoCompleteSearch } from "@/components/typeahead-search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, MoreVertical } from "lucide-react";
import { useState } from "react";

interface Teacher {
  _id: string;
  teacherId: string;
  name: string;
  department: string;
  subject: string;
}

const data: Teacher[] = [
  {
    _id: "1",
    teacherId: "teacher-cse",
    name: "gourav",
    department: "ccomputer science",
    subject: "database",
  },
];

const columns: ColumnDef<Teacher>[] = [
  {
    accessorKey: "teacherId",
    header: "Teacher Id",
  },
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
      const val = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Calendar className="h-4 w-4" />
              Book Appointment
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

export default function FindTeachers() {
  const [department, setDepartment] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>("");

  const searchTeacher = async (search: string) => {
    console.log("searched Teacher", search);
    const result = data.filter((d) => d.name === search);
    return result;
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      {/* search teacher, select */}
      <div>
        <h1 className="text-lg font-bold tracking-tight">View Teachers</h1>
        <div className="space-y-4 my-12 flex flex-col gap-4 lg:flex-row ">
          <div className="space-y-2 ">
            <Label className="text-sm tracking-tight font-medium">Search</Label>
            <AutoCompleteSearch
              placeholder="Search students..."
              value={selectedTeacher}
              onValueChange={setSelectedTeacher}
              searchQueryKey="search"
              searchFunction={searchTeacher}
              className="xl:w-md"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2 flex-1">
              <Label className="text-sm tracking-tight font-medium">
                Department
              </Label>
              <AutoCompleteSelect
                options={departments}
                placeholder={"Select departments"}
                value={department}
                onChange={setDepartment}
                searchPlaceholder={"Search departments"}
                className="w-full max-w-md"
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label className="text-sm tracking-tight font-medium">
                Subject
              </Label>
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
      </div>
      {/*table*/}
      <DataTable columns={columns} data={data} />
    </div>
  );
}
