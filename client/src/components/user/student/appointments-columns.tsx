import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { isPastDate } from "@/lib/date.utils";
import AppointmentChat from "@/components/chat-message";

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export interface Appointment {
  _id: string;

  studentId: string;
  studentName: string;
  studentRollNo: string;
  studentDepartment: string;

  teacherId: string;
  teacherName: string;
  teacherDepartment: string;
  teacherSubject: string;

  slot: {
    date: string; // ISO string
    start: string; // "10:00"
    end?: string; // optional if you use it
  };

  purpose: string;
  status: "pending" | "approved" | "rejected";
  createdBy: "student" | "teacher";
}

export const getMyAppointmentsColumns = (): ColumnDef<Appointment>[] => [
  {
    id: "teacher",
    header: "Teacher",
    cell: ({ row }) => {
      const t = row.original;
      return (
        <div>
          <p className="font-medium">{t.teacherName}</p>
          <p className="text-xs text-muted-foreground">
            {t.teacherDepartment} · {t.teacherSubject}
          </p>
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
                currentRole="student"
              />
            </PopoverContent>
          )}
        </Popover>
      );
    },
  },
];
