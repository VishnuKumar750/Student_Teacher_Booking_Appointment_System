import { Request, Response } from "express";
import * as AppointmentService from "@/service/appointment.service";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { HTTP_STATUS } from "@/config/http.config";

export const getTeacherAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const { teacherId } = req.params;
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, error: "date query param is required" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "invalid date format",
      });
    }
    const availableSlots = await AppointmentService.getTeacherAvailability(
      parsedDate,
      teacherId,
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "available slots",
      data: availableSlots,
    });
  },
);

export const getStudentAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "date query param is required",
      });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "invalid date format",
      });
    }

    const availableSlots = await AppointmentService.getStudentAvailability(
      parsedDate,
      studentId,
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "available slots",
      data: availableSlots,
    });
  },
);

//  student book controller
export const bookAppointmentByStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = req.user.id; // coming from auth middleware
    const { teacherId, date, start, end, purpose, message } = req.body;

    if (!teacherId || !date || !start || !end || !purpose) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid date format",
      });
    }

    const appointment = await AppointmentService.bookAppointmentByStudent({
      studentId,
      teacherId,
      date: parsedDate,
      start,
      end,
      purpose,
      message,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  },
);

export const approveAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const teacherId = req.user.id; // from auth middleware
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "appointmentId is required",
      });
    }

    const appointment = await AppointmentService.approveAppointmentByTeacher(
      appointmentId,
      teacherId,
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Appointment approved successfully",
      data: appointment,
    });
  },
);

export const cancelAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const teacherId = req.user.id;
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "appointmentId is required",
      });
    }

    const appointment = await AppointmentService.cancelAppointmentByTeacher(
      appointmentId,
      teacherId,
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment,
    });
  },
);

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const senderId = req.user?.id;
  const senderRole = req.user?.role; // "student" | "teacher"
  const { appointmentId } = req.params;
  const { message } = req.body;

  if (!appointmentId || !message) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "appointmentId and message are required",
    });
  }

  const sendedMessage = await AppointmentService.sendAppointmentMessage({
    appointmentId,
    senderId,
    senderRole,
    message,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: "Message sent",
    data: sendedMessage,
  });
});

export const getAppointmentMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const { appointmentId } = req.params;

    const messages =
      await AppointmentService.getAppointmentMessages(appointmentId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Appointment messages fetched",
      data: messages,
    });
  },
);

export const getTeacherAppointments = asyncHandler(
  async (req: Request, res: Response) => {
    const teacherId = req.user.id;
    const { status } = req.query;

    const appointments = await AppointmentService.getAllAppointmentsForTeacher(
      teacherId,
      status as string,
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Teacher appointments fetched",
      data: appointments,
    });
  },
);

/**
 * Student: get all appointments
 */
export const getStudentAppointments = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = req.user.id;
    const { status } = req.query;

    const appointments = await AppointmentService.getAllAppointmentsForStudent(
      studentId,
      status as string,
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Student appointments fetched",
      data: appointments,
    });
  },
);

export const bookAppointmentByTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    const teacherId = req.user.id;
    const { studentId, date, start, end, purpose } = req.body;

    if (!studentId || !date || !start || !end || !purpose) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid date format",
      });
    }

    const appointment = await AppointmentService.bookAppointmentByTeacher({
      teacherId,
      studentId,
      date: parsedDate,
      start,
      end,
      purpose,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  },
);
