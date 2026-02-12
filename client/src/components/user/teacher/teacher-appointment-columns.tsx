import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AppointmentChat from "@/components/chat-message";
import { formatDate, isPastDate } from "@/lib/date.utils";
import type { Appointment } from "../student/appointments-columns";

export const getTeacherAppointmentsColumns = (): ColumnDef<Appointment>[] => [
  {
    id: "rollNo",
    header: "Roll No.",
    cell: ({ row }) => (
      <p className="font-medium">{row.original.studentRollNo}</p>
    ),
  },
  {
    id: "student",
    header: "Student",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div>
          <p className="font-medium">{s.studentName}</p>
          <p className="text-xs text-muted-foreground">{s.studentDepartment}</p>
        </div>
      );
    },
  },
  {
    id: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        {formatDate(row.original.slot.date)}
      </div>
    ),
  },
  {
    id: "time",
    header: "Time",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        {row.original.slot.start} – {row.original.slot.end}
      </div>
    ),
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          className={
            status === "rejected"
              ? "bg-destructive text-white"
              : "bg-green-500 text-white"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "chat",
    header: "Chat",
    cell: ({ row }) => {
      const appointment = row.original;

      const chatDisabled =
        isPastDate(appointment.slot.date) || appointment.status === "rejected";

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" disabled={chatDisabled}>
              <MessageSquare className="h-4 w-4" />
            </Button>
          </PopoverTrigger>

          {!chatDisabled && (
            <PopoverContent align="end" className="w-[320px] p-0">
              <AppointmentChat
                appointmentId={appointment._id}
                currentRole="teacher"
              />
            </PopoverContent>
          )}
        </Popover>
      );
    },
  },
];
