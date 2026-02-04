import DataTable from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Clock, MessageSquare, MoreHorizontal } from "lucide-react";
import api from "@/axios/axios-api";
import AppointmentChat from "@/components/chat-message";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppointmentRequest from "@/components/appointment-request-dialog";

/* ───────── types ───────── */
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
  status: string;
}

/* ───────── utils ───────── */
const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const isPastDate = (date: string | Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  return d < today;
};

/* ───────── api ───────── */
const fetchTeacherPendingAppointments = async (): Promise<Appointment[]> => {
  const { data } = await api.get(
    "/appointment/teacher/appointments?status=pending",
  );

  return data?.data ?? [];
};

/* ───────── columns ───────── */
const columns: ColumnDef<Appointment>[] = [
  {
    header: "Student",
    cell: ({ row }) => {
      const s = row.original.student;
      return (
        <div>
          <p className="font-medium">{s.name}</p>
          <p className="text-xs text-muted-foreground">
            {s.rollNo} · {s.department}
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
      const disabled = isPastDate(appointment.slot.date);
      const status = appointment.status === "cancelled";

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
                    disabled={disabled && status}
                    title={
                      disabled
                        ? "Chat disabled for past appointments"
                        : "Open chat"
                    }
                    className="w-full"
                  >
                    <MessageSquare className="h-4 w-4" />
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

/* ───────── component ───────── */
export default function TeacherPendingAppointments() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teacher-appointments", "pending"],
    queryFn: fetchTeacherPendingAppointments,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Pending Appointments
        </h1>
        <p className="text-sm text-muted-foreground">
          Review student appointment requests and communicate before approval
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
          columns={columns}
          data={data}
          searchKey="purpose"
          searchPlaceholder="Search by purpose…"
        />
      )}
    </div>
  );
}
