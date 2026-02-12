import api from "@/axios/axios-api";
import type { Appointment } from "@/components/user/student/appointments-columns";

export interface StudentAppointment {
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

export const fetchMyAppointments = async (): Promise<Appointment[]> => {
  const { data } = await api.get("/appointment");
  return data?.data;
};

export interface TeacherAppointment {
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
  senderRole?: "student" | "teacher" | "system";
}

export const fetchTeacherAppointments = async (): Promise<
  TeacherAppointment[]
> => {
  const { data } = await api.get("/appointment/teacher/appointments");
  return data?.data ?? [];
};

export const fetchTeacherPendingAppointments = async (): Promise<
  TeacherAppointment[]
> => {
  const { data } = await api.get(
    "/appointment/teacher/appointments?status=pending",
  );

  return data?.data ?? [];
};

// APPROVE APPOINTMENT
export const approveAppointment = async (appointmentId: string) => {
  const { data } = await api.patch(`/appointment/${appointmentId}`, null, {
    params: { status: "approved" },
  });

  return data.data;
};

// CANCEL APPOINTMENT
export const cancelAppointment = async (appointmentId: string) => {
  const { data } = await api.patch(`/appointment/${appointmentId}`, null, {
    params: { status: "rejected" },
  });

  return data.data;
};
