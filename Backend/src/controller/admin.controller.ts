import { Request, Response } from "express";
import * as adminService from "@/service/admin.service";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { HTTP_STATUS } from "@/config/http.config";

/* ───────── Admins ───────── */

export const createAdmin = asyncHandler(async (req: Request, res: Response) => {
  const admin = await adminService.createAdmin(req.body);
  res.status(201).json({ success: true, data: admin });
});

export const getAdmins = asyncHandler(async (_req, res) => {
  const admins = await adminService.getAllAdmins();
  res.json({ success: true, data: admins });
});

export const deleteAdmin = asyncHandler(async (req, res) => {
  await adminService.deleteAdmin(req.params.id);
  res.json({ success: true, message: "Admin deleted successfully" });
});

/* ───────── Students ───────── */

export const approveStudent = asyncHandler(async (req, res) => {
  const student = await adminService.approveStudent(req.params.id);
  res.json({ success: true, data: student });
});

export const unapproveStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const student = await adminService.unapproveStudent(req.params.id);
    res.json({ success: true, data: student });
  },
);

export const getStudents = asyncHandler(async (_req, res) => {
  const students = await adminService.getAllStudents();
  res.json({ success: true, data: students });
});

export const getUnapprovedStudents = asyncHandler(async (_req, res) => {
  const students = await adminService.getUnapprovedStudents();
  res.json({ success: true, data: students });
});

/* ───────── Teachers ───────── */

export const createTeacher = asyncHandler(async (req, res) => {
  const result = await adminService.createTeacher(req.body);
  res.status(201).json({ success: true, data: result });
});

export const updateTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;
  const teacher = await adminService.updateTeacher({ teacherId, ...req.body });
  res.json({ success: true, data: teacher });
});

export const deleteTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;
  await adminService.deleteTeacher(teacherId);
  res.json({ success: true, message: "Teacher deleted successfully" });
});

export const getTeachers = asyncHandler(async (_req, res) => {
  const teachers = await adminService.getAllTeachers();
  res.json({ success: true, data: teachers });
});

export const getTeacher = asyncHandler(async (req: Request, res: Response) => {
  const { teacherId } = req.params;

  const teacher = await adminService.getTeacher(teacherId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: teacher,
  });
});

export const adminAnalytics = asyncHandler(
  async (_req: Request, res: Response) => {
    const data = await adminService.getAdminAnalytics();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  },
);
