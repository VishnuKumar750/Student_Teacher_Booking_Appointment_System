import { Request, Response } from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentsByTeacher,
  getAppointmentsByStudent,
  updateAppointmentStatus,
} from "./appointment.service";

export const createAppointmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const appointment = await createAppointment(req.body);
    res.status(201).json({ success: true, data: appointment });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This slot is already booked",
      });
    }
    res.status(500).json({ message: "Appointment creation failed" });
  }
};

export const getAllAppointmentsController = async (
  _req: Request,
  res: Response,
) => {
  const appointments = await getAllAppointments();
  res.json({ success: true, data: appointments });
};

export const getTeacherAppointmentsController = async (
  req: Request,
  res: Response,
) => {
  const appointments = await getAppointmentsByTeacher(req.params.teacherId);
  res.json({ success: true, data: appointments });
};

export const getStudentAppointmentsController = async (
  req: Request,
  res: Response,
) => {
  const appointments = await getAppointmentsByStudent(req.params.studentId);
  res.json({ success: true, data: appointments });
};

export const updateAppointmentStatusController = async (
  req: Request,
  res: Response,
) => {
  const appointment = await updateAppointmentStatus(
    req.params.id,
    req.body.status,
  );
  res.json({ success: true, data: appointment });
};
