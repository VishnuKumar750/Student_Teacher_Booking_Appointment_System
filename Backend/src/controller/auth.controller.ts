import { Request, Response } from "express";
import * as authService from "@/service/auth.service";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { registerSchema, loginSchema } from "../validatior/auth.validators";
import { HTTP_STATUS } from "@/config/http.config";

/* ───────── Register ───────── */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const result = await authService.registerStudent(data);

  res.status(HTTP_STATUS.CREATED).json({ success: true, ...result });
});

/* ───────── Login ───────── */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const { user, token } = await authService.login(data);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    },
  });
});
// GET /api/auth/me
export const getMe = async (req: Request, res: Response) => {
  const user = await authService.getMeService(req.user?.id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    user,
  });
};

// POST /api/auth/logout
export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Logged out successfully",
  });
};
