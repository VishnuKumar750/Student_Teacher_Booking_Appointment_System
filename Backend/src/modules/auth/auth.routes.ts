import { validate } from "@/middleware/validate.middleware";
import { Router } from "express";
import { loginSchema, registerSchema } from "./auth.validators";
import { getMe, login, logout, register } from "@/modules/auth/auth.controller";
import { authenticated } from "@/middleware/auth.middleware";

const authRoutes = Router();

// login Router
authRoutes.post("/signin", validate(loginSchema), login);
// register router
authRoutes.post("/signup", register);

authRoutes.get("/me", authenticated, getMe);
authRoutes.post("/logout", authenticated, logout);

export default authRoutes;
