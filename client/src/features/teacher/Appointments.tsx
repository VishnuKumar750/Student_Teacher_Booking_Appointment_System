import DataTable from "@/components/Table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, MoreVertical, X } from "lucide-react";

interface Appointment {
  _id: string;
  name: string;
  rollNo: string;
  department: string;
  course: string;
  year: string;
  message: string;
  date: string;
  time: string;
  sendBy: "TEACHER" | "STUDENT";
  status: "PENDING" | "APPROVED" | "CANCELLED";
}

const data: Appointment[] = [
  {
    _id: "1",
    name: "john",
    rollNo: "cse-19-2010",
    department: "computer science",
    course: "b.tech",
    year: "2019",
    message: "meet me for your grades talk.",
    date: "25-01-2012",
    time: "10:30",
    sendBy: "TEACHER",
    status: "APPROVED",
  },
  {
    _id: "2",
    name: "Ken",
    rollNo: "cse-19-2010",
    department: "computer science",
    course: "b.tech",
    year: "2019",
    message: "meet me for your grades talk.",
    date: "25-01-2012",
    time: "10:30",
    sendBy: "STUDENT",
    status: "PENDING",
  },
];

const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "rollNo",
    header: "RollNo.",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "academicInfo",
    header: "Academic Info",
    accessorFn: (row) => ({
      dept: row.department,
      course: row.course,
      year: row.year,
    }),
    cell: ({ getValue }) => {
      const val = getValue<{ dept: string; course: string; year: string }>();
      return (
        <div>
          <p className="font-semibold">{val.dept}</p>
          <p className="text-xs text-muted-foreground">
            {val.course} • {val.year}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ getValue }) => {
      const message = getValue<string>();

      return (
        <Popover>
          <PopoverTrigger asChild>
            <button className="max-w-md truncate text-left text-sm cursor-pointer">
              {message}
            </button>
          </PopoverTrigger>

          <PopoverContent className="max-w-sm text-sm">
            {message}
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    id: "meetingtime",
    header: "Meeting time",
    accessorFn: (row) => ({
      date: row.date,
      time: row.time,
    }),
    cell: ({ getValue }) => {
      const val = getValue<{ date: string; time: string }>();
      return (
        <div className="">
          <p className="font-semibold">
            {val.date} | {val.time} AM
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "sendBy",
    header: "Send By",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <>
          {appointment.status === "PENDING" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"}>
                  <MoreVertical className="w-4 h-4 shringk-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Action</DropdownMenuItem>
                <DropdownMenuSeparator />
                {appointment.sendBy !== "TEACHER" && (
                  <DropdownMenuItem className="flex items-center justify-between">
                    Approve
                    <Check className="w-4 h-4" />
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="flex items-center justify-between">
                  cancel
                  <X className="w-4 h-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="w-full flex items-center r">
              {appointment.status === "APPROVED" ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </div>
          )}
        </>
      );
    },
  },
];

export default function TeacherAppointments() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/*search, select*/}
      <div>
        <h1 className="text-lg font-bold tracking-tight">View Appointments</h1>
      </div>
      {/* table of students*/}
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
