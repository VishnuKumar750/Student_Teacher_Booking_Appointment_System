import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Clock, MessageSquare, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppointmentChat from "@/components/chat-message";
import AppointmentRequest from "@/components/appointment-request-dialog";
import { formatDate, isPastDate } from "@/lib/date.utils";
import type { Appointment } from "../student/appointments-columns";

export const getTeacherPendingColumns = (): ColumnDef<Appointment>[] => [
  {
    header: "Student",
    cell: ({ row }) => {
      const s = row.original;
      return (
        <div>
          <p className="font-medium">{s.studentName}</p>
          <p className="text-xs text-muted-foreground">
            {s.studentRollNo} · {s.studentDepartment}
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
        {formatDate(row.original.slot.date)}
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
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-yellow-600">
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const appointment = row.original;

      const disabled =
        isPastDate(appointment.slot.date) || appointment.status === "rejected";

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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    disabled={disabled}
                    className="w-full"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </PopoverTrigger>

                {!disabled && (
                  <PopoverContent align="end" className="w-[320px] p-0">
                    <AppointmentChat
                      appointmentId={appointment._id}
                      currentRole="teacher"
                    />
                  </PopoverContent>
                )}
              </Popover>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600" asChild>
              <AppointmentRequest appointmentId={appointment._id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
