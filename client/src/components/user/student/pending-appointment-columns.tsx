import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MessageSquare, User } from "lucide-react";
import AppointmentChat from "@/components/chat-message";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { isPastDate } from "@/lib/date.utils";
import type { Appointment } from "./appointments-columns";

export const getPendingAppointmentsColumns = (): ColumnDef<Appointment>[] => [
  {
    header: "Teacher",
    cell: ({ row }) => {
      const teacher = row.original;

      return (
        <div>
          <p className="font-medium">{teacher.teacherName}</p>
          <p className="text-xs text-muted-foreground">
            {teacher.teacherDepartment} · {teacher.teacherSubject}
          </p>
        </div>
      );
    },
  },
  {
    header: "Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        {new Date(row.original.slot.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </div>
    ),
  },
  {
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
    header: "Requested By",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 capitalize">
        <User className="h-4 w-4 text-muted-foreground" />
        {row.original.createdBy}
      </div>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      if (status === "approved") {
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      }

      if (status === "rejected") {
        return <Badge className="bg-destructive text-white">Cancelled</Badge>;
      }

      return <Badge className="bg-amber-400 text-white">Pending</Badge>;
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
            <PopoverContent align="end" className="w-80 p-0">
              <AppointmentChat
                appointmentId={appointment._id}
                currentRole="student"
              />
            </PopoverContent>
          )}
        </Popover>
      );
    },
  },
];
