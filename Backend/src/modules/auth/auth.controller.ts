import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { HTTP_STATUS } from "@/config/http.config";
import {
  DEFAULT_AVAILABILITY,
  LoginStructure,
  RegisterStudentPayload,
} from "./auth.types";
import { User } from "../user/user.model";
import { generateUniqueRollNo } from "@/utils/helper.utils";
import { IJWTPayload, signToken } from "@/utils/jsonwebtoken.utils";

/* ───────── Register ───────── */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const formData: RegisterStudentPayload = req.body;
  if (
    !formData.email ||
    !formData.department ||
    !formData.name ||
    !formData.password ||
    !formData.year
  ) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ success: false, error: "all fields required" });
  }

  const exists = await User.findOne({
    email: formData.email.toLowerCase(),
    isDeleted: false,
  });
  if (exists) {
    return res
      .status(HTTP_STATUS.CONFLICT)
      .json({ success: false, error: "email already exists" });
  }

  const studentCount = await User.countDocuments({
    role: "student",
    department: formData.department,
    year: formData.year,
  });

  const rollNo = generateUniqueRollNo({
    departmentCode: formData.department,
    year: formData.year,
    studentCount,
  });

  const user = new User({
    name: formData.name,
    email: formData.email.toLowerCase(),
    department: formData.department,
    password: formData.password,
    year: Number(formData.year),
    role: "student",
    rollNo,
    availability: DEFAULT_AVAILABILITY,
    isApproved: false,
  });

  await user.save();
  res
    .status(HTTP_STATUS.CREATED)
    .json({ success: true, message: "waiting for admin approval" });
});

/* ───────── Login ───────── */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const formData: LoginStructure = req.body;
  if (!formData.email || !formData.email.trim()) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ success: false, error: "invalid email" });
  }

  if (!formData.password || !formData.password.trim()) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ success: false, error: "invalid password" });
  }

  const exists = await User.findOne({
    email: formData.email,
    isDelete: false,
    isApproved: true,
  }).select("+password");
  if (!exists) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ success: false, error: "invalid email or password" });
  }

  const isMatched = await exists.comparePassword(formData.password);
  if (!isMatched) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ success: false, error: "invalid email or password" });
  }

  const jwtPayload: IJWTPayload = {
    id: exists._id.toString(),
    role: exists.role,
  };

  const token = signToken(jwtPayload);

  const user = {
    id: exists._id,
    name: exists.name,
    email: exists.email,
    role: exists.role,
  };

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "login success",
    data: user,
  });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const _id = req.user?.id;
  // validateObjectId(_id);

  const exists = await User.findById({
    _id: _id,
    isApproved: true,
    isDeleted: false,
  });

  if (!exists) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ success: false, error: "invalid session token" });
  }
  const data = {
    id: exists._id,
    name: exists.name,
    email: exists.email,
  };

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "session refreshed",
    data,
  });
});

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
