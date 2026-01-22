import { Request, Response } from "express";
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  approveTeacher,
  deleteTeacher,
} from "./teacher.service";

export const createTeacherController = async (req: Request, res: Response) => {
  const teacher = await createTeacher(req.body);
  res.status(201).json({ success: true, data: teacher });
};

export const getAllTeachersController = async (
  _req: Request,
  res: Response,
) => {
  const teachers = await getAllTeachers();
  res.json({ success: true, data: teachers });
};

export const getTeacherByIdController = async (req: Request, res: Response) => {
  const teacher = await getTeacherById(req.params.id);
  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }
  res.json({ success: true, data: teacher });
};

export const updateTeacherController = async (req: Request, res: Response) => {
  const teacher = await updateTeacher(req.params.id, req.body);
  res.json({ success: true, data: teacher });
};

export const approveTeacherController = async (req: Request, res: Response) => {
  const teacher = await approveTeacher(req.params.id);
  res.json({ success: true, data: teacher });
};

export const deleteTeacherController = async (req: Request, res: Response) => {
  const teacher = await deleteTeacher(req.params.id);
  res.json({ success: true, data: teacher });
};
