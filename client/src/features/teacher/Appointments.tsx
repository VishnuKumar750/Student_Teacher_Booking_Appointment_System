import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/Table";
import api from "@/axios/axios-api";
import { Calendar, Clock, Loader2, MessageSquare } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AppointmentChat from "@/components/chat-message";
import { Button } from "@/components/ui/button";
import { formatDate, isPastDate } from "@/lib/date.utils";
import { Badge } from "@/components/ui/badge";

interface Appointment {
  _id: string;
  student: {
    name: string;
    rollNo: string;
    department: string;
  };
  slot: {
    date: string;
    start: string;
    end: string;
  };
  purpose: string;
  status: "approved" | "cancelled";
  senderRole: "student" | "teacher" | "system";
}

const fetchTeacherAppointments = async () => {
  const { data } = await api.get("/appointment/teacher/appointments");
  return data.data;
};

const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "status",
    header: "RollNo.",
    cell: ({ row }) => {
      const t = row.original.student;
      return (
        <div>
          <p className="font-medium">{t.rollNo}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => {
      const t = row.original.student;
      return (
        <div>
          <p className="font-medium">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.department}</p>
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
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={`${status === "cancelled" ? "bg-destructive" : "bg-green-500"} text-white`}
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
      const chatDisabled = isPastDate(appointment.slot.date);
      const status = appointment.status === "cancelled";

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={chatDisabled || status}
              title={
                chatDisabled
                  ? "Chat disabled for past appointments"
                  : "Open chat"
              }
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </PopoverTrigger>

          {!chatDisabled && (
            <PopoverContent align="end" className="w-[320px] p-0">
              <AppointmentChat
                appointmentId={appointment._id}
                currentRole="teacher" // or "teacher"
              />
            </PopoverContent>
          )}
        </Popover>
      );
    },
  },
];
export default function TeacherAppointments() {
  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["teacher-appointments"],
    queryFn: fetchTeacherAppointments,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <p className="text-sm text-muted-foreground">
          Manage all student appointment requests
        </p>
      </div>

      {/* Table section */}
      <div className="rounded-lg border bg-background p-4">
        {isLoading && (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading appointments
          </div>
        )}

        {isError && (
          <div className="text-center py-12 text-red-500">
            {(error as any)?.response?.data?.message ||
              "Failed to load appointments"}
          </div>
        )}

        {!isLoading && !isError && appointments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No appointments found
          </div>
        )}

        {!isLoading && !isError && appointments.length > 0 && (
          <DataTable
            columns={columns}
            data={appointments}
            searchKey="status"
            searchPlaceholder="search appointment status..."
          />
        )}
      </div>
    </div>
  );
}
