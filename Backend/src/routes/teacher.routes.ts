import Router from "express";
import * as TeacherController from "@/controller/teacher.controller";
import { authenticated } from "@/middleware/auth.middleware";

const router = Router();

router.get("/students", authenticated, TeacherController.getAllStudents);
router.get("/students/:studentId", authenticated, TeacherController.getStudent);
router.get("/analytics", authenticated, TeacherController.teacherAnalytics);

export default router;
