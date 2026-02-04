import { Router } from "express";
import * as adminController from "@/controller/admin.controller";
import { authenticated } from "@/middleware/auth.middleware";
// import protect from "../middlewares/protect.middleware";
// import isAdmin from "../middlewares/isAdmin.middleware";

const router = Router();

// router.use(protect, isAdmin);

/* Admins */
router.post("/", authenticated, adminController.createAdmin);
router.get("/", authenticated, adminController.getAdmins);
router.delete("/:id", authenticated, adminController.deleteAdmin);
router.get("/analytics", authenticated, adminController.adminAnalytics);

/* Students */
router.get("/students", adminController.getStudents);
router.get("/students/unapproved", adminController.getUnapprovedStudents);
router.patch("/students/:id/approve", adminController.approveStudent);
router.patch("/students/:id/cancel", adminController.unapproveStudent);

/* Teachers */
router.post("/teachers", adminController.createTeacher);
router.get("/teachers", adminController.getTeachers);
router.get("/teacher/:teacherId", adminController.getTeacher);
router.put("/teachers/:teacherId", adminController.updateTeacher);
router.delete("/teachers/:teacherId", adminController.deleteTeacher);

export default router;
