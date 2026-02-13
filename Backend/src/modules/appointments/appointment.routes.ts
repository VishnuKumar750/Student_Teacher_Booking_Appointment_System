import Router from "express";
import * as AppointmentController from "@/modules/appointments/appoointment.controller";
import { authenticated } from "@/middleware/auth.middleware";

const router = Router();

router.use(authenticated);

router.get("/available-slot", AppointmentController.getAvailableSlots);
router.post("/book-appointment", AppointmentController.bookAppointment);
router.get("/", AppointmentController.getAppointments);
router.patch("/:id", AppointmentController.patchAppointment);

// router.get(
//   "/student/:studentId/availability",
//   authenticated,
//   AppointmentController.getStudentAvailability,
// );

// router.post(
//   "/book-appointment",
//   authenticated,
//   AppointmentController.bookAppointmentByStudent,
// );
// router.patch(
//   "/approve/:appointmentId",
//   authenticated,
//   AppointmentController.approveAppointment,
// );

// router.patch(
//   "/cancel/:appointmentId",
//   authenticated,
//   AppointmentController.cancelAppointment,
// );

router.post("/:appointmentId/message", AppointmentController.sendMessage);

router.get(
  "/:appointmentId/messages",
  AppointmentController.getAppointmentMessages,
);

// router.get(
//   "/teacher/appointments",
//   authenticated,
//   AppointmentController.getTeacherAppointments,
// );

// router.get(
//   "/student/pending-appointment",
//   authenticated,
//   AppointmentController.getStudentAppointments,
// );

// router.get(
//   "/student/appointments",
//   authenticated,
//   AppointmentController.getStudentAppointments,
// );

// router.post(
//   "/book/teacher",
//   authenticated,
//   AppointmentController.bookAppointmentByTeacher,
// );

export default router;
