import { AppointmentModel } from "./appointment.model";

export const createAppointment = async (data: any) => {
  return AppointmentModel.create(data);
};

export const getAllAppointments = async () => {
  return AppointmentModel.find()
    .populate("studentId", "name rollNo")
    .populate("teacherId", "name subject");
};

export const getAppointmentsByTeacher = async (teacherId: string) => {
  return AppointmentModel.find({ teacherId })
    .populate("studentId", "name rollNo")
    .sort({ createdAt: -1 });
};

export const getAppointmentsByStudent = async (studentId: string) => {
  return AppointmentModel.find({ studentId })
    .populate("teacherId", "name subject")
    .sort({ createdAt: -1 });
};

export const updateAppointmentStatus = async (
  id: string,
  status: "APPROVED" | "CANCELLED",
) => {
  return AppointmentModel.findByIdAndUpdate(id, { status }, { new: true });
};
