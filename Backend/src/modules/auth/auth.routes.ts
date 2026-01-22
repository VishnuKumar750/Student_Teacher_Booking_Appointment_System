import { validate } from "@/middleware/validate.middleware";
import { Router } from "express";
import { loginSchema } from "./auth.validation";
import { loginController } from "./auth.controller";

const authRoutes = Router();

// login Router
authRoutes.post("/signin", validate(loginSchema), loginController);

export default authRoutes;
