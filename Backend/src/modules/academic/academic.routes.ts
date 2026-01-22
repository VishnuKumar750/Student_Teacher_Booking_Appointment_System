import { Router } from "express";
import {
  createAcademicController,
  getAllAcademicsController,
  getAcademicByIdController,
  updateAcademicController,
  deleteAcademicController,
} from "./academic.controller";
import {
  createAcademicSchema,
  updateAcademicSchema,
} from "./academic.validation";
import { validate } from "@/middleware/validate.middleware";

const router = Router();

router.post("/", validate(createAcademicSchema), createAcademicController);

router.get("/", getAllAcademicsController);

router.get("/:id", getAcademicByIdController);

router.put("/:id", validate(updateAcademicSchema), updateAcademicController);

router.delete("/:id", deleteAcademicController);

export default router;
