import { Router } from "express";
import {
  createTeacherController,
  getAllTeachersController,
  getTeacherByIdController,
  updateTeacherController,
  approveTeacherController,
  deleteTeacherController,
} from "./teacher.controller";
import { createTeacherSchema, updateTeacherSchema } from "./teacher.validation";
import { validate } from "@/middleware/validate.middleware";

const router = Router();

router.post("/", validate(createTeacherSchema), createTeacherController);
router.get("/", getAllTeachersController);
router.get("/:id", getTeacherByIdController);
router.put("/:id", validate(updateTeacherSchema), updateTeacherController);
router.patch("/:id/approve", approveTeacherController);
router.delete("/:id", deleteTeacherController);

export default router;
