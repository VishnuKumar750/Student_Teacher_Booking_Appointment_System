import Router from "express";
import * as AppointmentController from "@/controller/appoointment.controller";
import { authenticated } from "@/middleware/auth.middleware";

const router = Router();

// get available slots for teacher
router.get(
  "/teacher/:teacherId/availability",
  authenticated,
  AppointmentController.getTeacherAvailability,
);

router.get(
  "/student/:studentId/availability",
  authenticated,
  AppointmentController.getStudentAvailability,
);

router.post(
  "/book-appointment",
  authenticated,
  AppointmentController.bookAppointmentByStudent,
);
router.patch(
  "/approve/:appointmentId",
  authenticated,
  AppointmentController.approveAppointment,
);

router.patch(
  "/cancel/:appointmentId",
  authenticated,
  AppointmentController.cancelAppointment,
);

router.post(
  "/:appointmentId/message",
  authenticated,
  AppointmentController.sendMessage,
);

router.get(
  "/:appointmentId/messages",
  authenticated,
  AppointmentController.getAppointmentMessage,
);

router.get(
  "/teacher/appointments",
  authenticated,
  AppointmentController.getTeacherAppointments,
);

router.get(
  "/student/pending-appointment",
  authenticated,
  AppointmentController.getStudentAppointments,
);

router.get(
  "/student/appointments",
  authenticated,
  AppointmentController.getStudentAppointments,
);

router.post(
  "/book/teacher",
  authenticated,
  AppointmentController.bookAppointmentByTeacher,
);

export default router;
