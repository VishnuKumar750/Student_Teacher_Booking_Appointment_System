import api from "@/axios/axios-api";
import type { Appointment } from "@/components/user/student/appointments-columns";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  rollNo?: string;
  role?: string;
  department: string;
  subject?: string;
  year?: string;
  profileImage?: string;
  isApproved?: boolean;
  availability?: {
    start: string;
    end: string;
  };
}

export interface Student {
  _id: string;
  rollNo: string;
  name: string;
  email: string;
  department: string;
  year: string;
}

export interface TeacherResponse {
  _id: string;
  name: string;
  email: string;
  department: string;
  subject: string;
  profileImage?: string;
  availability: object;
}

export interface PendingStudent {
  _id: string;
  rollNo: string;
  name: string;
  email: string;
  department: string;
  year: number;
  isApproved: boolean;
}

// ADMIN ANLAYTICS
export const fetchAdminAnalytics = async () => {
  const { data } = await api.get("/user/analytics/admin");
  return data.data;
};

export const deleteTeacher = async (id: string) => {
  await api.delete(`/teacher/${id}`);
};

export interface StudentAnalytics {
  total: number;
  pending: number;
  approved: number;
  cancelled: number;
  upcoming: number;
}

export interface Teacher {
  _id: string;
  name: string;
  department: string;
  subject: string;
}

export const fetchTeachersForStudent = async (): Promise<Teacher[]> => {
  const { data } = await api.get("/student/teachers");
  return data?.data ?? [];
};

export const fetchPendingAppointments = async (): Promise<Appointment[]> => {
  const { data } = await api.get("/appointment?status=pending");
  return data.data;
};

export interface TeacherAnalytics {
  total: number;
  pending: number;
  approved: number;
  cancelled: number;
  upcoming: number;
}

export const fetchTeacherStudents = async (): Promise<Student[]> => {
  const { data } = await api.get("/teacher/students");
  return data?.data ?? [];
};

// teacher routes
export const fetchTeacherAnalytics = async (): Promise<TeacherAnalytics> => {
  const { data } = await api.get("/user/analytics/teacher");
  return data.data;
};

export const fetchTeachers = async (): Promise<IUser[]> => {
  const { data } = await api.get("/user/teachers");
  return data.data;
};

// students routes
export const fetchStudents = async (): Promise<IUser[]> => {
  const { data } = await api.get(
    "/user/students?isApproved=true&isDeleted=false",
  );
  return data.data;
};

export const fetchStudentAnalytics = async (): Promise<StudentAnalytics> => {
  const { data } = await api.get("/user/analytics/student");
  return data.data;
};

export const fetchPendingStudents = async (): Promise<IUser[]> => {
  const { data } = await api.get(
    "/user/students?isApproved=false&isDeleted=false",
  );
  return data?.data ?? [];
};

//  admin -
// owner - admin | student
export const getTeachers = async () => {
  const { data } = await api.get("/user/teachers", {
    withCredentials: true,
  });
  return data.data;
};

// owner - admin | teacher
// only approved students and no deleted student
export const getStudents = async () => {
  const { data } = await api.get(
    "/user/students?isApproved=true&isDeleted=false",
    { withCredentials: true },
  );
  return data.data;
};
