import { Router } from "express";
import {
  createAppointmentController,
  getAllAppointmentsController,
  getTeacherAppointmentsController,
  getStudentAppointmentsController,
  updateAppointmentStatusController,
} from "./appoointment.controller";
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from "./appointment.validation";
import { validate } from "@/middleware/validate.middleware";

const router = Router();

router.post(
  "/",
  validate(createAppointmentSchema),
  createAppointmentController,
);

router.get("/", getAllAppointmentsController);

router.get("/teacher/:teacherId", getTeacherAppointmentsController);

router.get("/student/:studentId", getStudentAppointmentsController);

router.patch(
  "/:id/status",
  validate(updateAppointmentStatusSchema),
  updateAppointmentStatusController,
);

export default router;
