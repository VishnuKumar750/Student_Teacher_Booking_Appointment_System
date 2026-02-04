import DataTable from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Clock, MessageSquare, User } from "lucide-react";
import api from "@/axios/axios-api";
import AppointmentChat from "@/components/chat-message";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { isPastDate } from "@/lib/date.utils";

interface Appointment {
  _id: string;
  teacher: {
    name: string;
    department: string;
    subject: string;
  };
  slot: {
    date: string;
    start: string;
    end: string;
  };
  purpose: string;
  status: "pending" | "approved" | "cancelled";
  senderRole: "student" | "teacher" | "system";
}

/* ───────── api ───────── */
const fetchPendingAppointments = async (): Promise<Appointment[]> => {
  const { data } = await api.get(
    "/appointment/student/appointments?status=pending",
  );
  return data?.data ?? [];
};

const studentAppointmentColumns: ColumnDef<Appointment>[] = [
  {
    header: "Teacher",
    cell: ({ row }) => {
      const teacher = row.original.teacher;

      return (
        <div>
          <p className="font-medium">{teacher.name}</p>
          <p className="text-xs text-muted-foreground">
            {teacher.department} · {teacher.subject}
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
    cell: ({ row }) => {
      const role = row.original.senderRole;

      return (
        <div className="flex items-center gap-2 capitalize">
          <User className="h-4 w-4 text-muted-foreground" />
          {role}
        </div>
      );
    },
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      if (status === "approved") {
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      }

      if (status === "cancelled") {
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
      const chatDisabled = isPastDate(appointment.slot.date);
      const cancel = appointment.status === "cancelled";

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={chatDisabled || cancel}
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
            <PopoverContent align="end" className="w-80 p-0">
              <AppointmentChat
                appointmentId={appointment._id}
                currentRole="student" // or "teacher"
              />
            </PopoverContent>
          )}
        </Popover>
      );
    },
  },
];

/* ───────── component ───────── */
export default function PendingAppointments() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pending-appointments"],
    queryFn: fetchPendingAppointments,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Pending Appointments
        </h1>
        <p className="text-sm text-muted-foreground">
          Review and manage appointment requests awaiting approval
        </p>
      </div>

      {/* States */}
      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Loading pending appointments…
        </p>
      )}

      {isError && (
        <p className="text-sm text-red-500">Failed to load appointments</p>
      )}

      {!isLoading && !isError && (
        <DataTable
          columns={studentAppointmentColumns}
          data={data}
          searchKey="purpose"
          searchPlaceholder="Search by purpose…"
        />
      )}
    </div>
  );
}
