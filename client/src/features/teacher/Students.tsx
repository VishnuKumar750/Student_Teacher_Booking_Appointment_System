import { DateTimePicker } from "@/components/date-time-picker";
import DataTable from "@/components/Table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarCheck, MoreVertical } from "lucide-react";

interface Student {
  _id: string;
  name: string;
  rollNo: string;
  department: string;
  course: string;
  year: string;
}

const data: Student[] = [
  {
    _id: "1",
    name: "john",
    rollNo: "cse-19-2020",
    department: "computer science",
    course: "b.tech",
    year: "2020",
  },
];

const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "rollNo",
    header: "RollNo.",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "course",
    header: "Course",
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
    id: "action",
    header: "Actions",
    cell: ({ row }) => {
      const student = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <Dialog>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex items-center gap-2 text-sm"
              >
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 w-full">
                    <CalendarCheck className="w-4 h-4" />
                    <span>Schedule Appointment</span>
                  </button>
                </DialogTrigger>
              </DropdownMenuItem>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Appointment</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    className="min-h-32 max-h-36"
                    placeholder="Type your message"
                    aria-label="Textarea for message"
                  />
                </div>
                <DateTimePicker />
                <DialogFooter className="my-4">
                  <DialogClose asChild>
                    <Button variant={"outline"}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create Meeting</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function StudentPage() {
  return (
    <div className="container mx-auto p-6">
      {/*student - search, select */}
      <div></div>
      {/* table - student */}
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
