import Router from "express";
import { authenticated } from "@/middleware/auth.middleware";
import * as studentController from "@/controller/student.controller";

const router = Router();

router.get("/teachers", authenticated, studentController.getAllTeachers);

router.get("/teachers/:teacherId", authenticated, studentController.getTeacher);
router.get("/analytics", authenticated, studentController.studentAnalytics);

export default router;
