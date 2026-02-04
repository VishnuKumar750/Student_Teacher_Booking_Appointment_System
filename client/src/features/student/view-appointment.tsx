import DataTable from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Clock } from "lucide-react";
import api from "@/axios/axios-api";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { isPastDate } from "@/lib/date.utils";
import AppointmentChat from "@/components/chat-message";

/* ───────── types ───────── */
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
  status: "approved" | "cancelled";
  senderRole: "student" | "teacher" | "system";
}

/* ───────── utils ───────── */
const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const fetchApprovedAppointments = async (): Promise<Appointment[]> => {
  const { data } = await api.get("/appointment/student/appointments");

  return data?.data ?? [];
};

const columns: ColumnDef<Appointment>[] = [
  {
    header: "Teacher",
    cell: ({ row }) => {
      const t = row.original.teacher;
      return (
        <div>
          <p className="font-medium">{t.name}</p>
          <p className="text-xs text-muted-foreground">
            {t.department} · {t.subject}
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
                currentRole="student" // or "teacher"
              />
            </PopoverContent>
          )}
        </Popover>
      );
    },
  },
];

export default function MyAppointments() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["student-appointments", "approved"],
    queryFn: fetchApprovedAppointments,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          My Appointments
        </h1>
        <p className="text-sm text-muted-foreground">
          View all your approved appointments
        </p>
      </div>

      {/* States */}
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading appointments…</p>
      )}

      {isError && (
        <p className="text-sm text-red-500">Failed to load appointments</p>
      )}

      {!isLoading && !isError && (
        <DataTable
          columns={columns}
          data={data}
          searchKey="purpose"
          searchPlaceholder="Search appointments…"
        />
      )}
    </div>
  );
}
