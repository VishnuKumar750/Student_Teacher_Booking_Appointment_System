import { authenticated } from "@/middleware/auth.middleware";
import { Router } from "express";

import * as userController from "@/modules/user/user.controller";

const router = Router();

router.use(authenticated);

router.get("/analytics/student", userController.getStudentAnalytics);
router.get("/analytics/teacher", userController.getTeacherAnalytics);
router.get("/analytics/admin", userController.getAdminAnalytics);

router.get("/students", userController.getStudents);
router.get("/:id/student", userController.getStudent);
router.get("/teachers", userController.getTeachers);
router.get("/:id/teacher", userController.getTeacher);
router.patch("/:id/student", userController.patchStudent);

// router.post("/teacher", userController.postTeacher);

// router.patch("/:id/approve-student", userController.patchStudent);
// router.patch("/:id/update-teacher", userController.patchTeacher);
// router.patch("/:id/update-admin", userController.patchAdmin)

// router.delete("/:id/teacher", userController.deleteTeacher);
// router.delete("/:id/student", userController.deleteStudent);
// router.delete("/:id/admin", userController.deleteAdmin);

// router.post("/:id/book-appointment", userController.bookAppointment)
// router.get("/appointments", userController.getAppointments)

// router.get("/admins", userController.getAdmins);
// router.get("/:id/admin", userController.getAdmin)

export default router;
