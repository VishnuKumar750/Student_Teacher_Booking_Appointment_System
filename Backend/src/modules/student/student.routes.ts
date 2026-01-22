import { Router } from "express";
import {
  createStudentController,
  getAllStudentsController,
  getStudentByIdController,
  updateStudentController,
  deleteStudentController,
} from "./student.controller";
import { createStudentSchema, updateStudentSchema } from "./student.validation";
import { validate } from "@/middleware/validate.middleware";

const router = Router();

router.post("/", validate(createStudentSchema), createStudentController);
router.get("/", getAllStudentsController);
router.get("/:id", getStudentByIdController);
router.put("/:id", validate(updateStudentSchema), updateStudentController);
router.delete("/:id", deleteStudentController);

export default router;
