import { Request, Response } from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "./student.service";

export const createStudentController = async (req: Request, res: Response) => {
  const student = await createStudent(req.body);
  res.status(201).json({ success: true, data: student });
};

export const getAllStudentsController = async (
  _req: Request,
  res: Response,
) => {
  const students = await getAllStudents();
  res.json({ success: true, data: students });
};

export const getStudentByIdController = async (req: Request, res: Response) => {
  const student = await getStudentById(req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json({ success: true, data: student });
};

export const updateStudentController = async (req: Request, res: Response) => {
  const student = await updateStudent(req.params.id, req.body);
  res.json({ success: true, data: student });
};

export const deleteStudentController = async (req: Request, res: Response) => {
  const student = await deleteStudent(req.params.id);
  res.json({ success: true, data: student });
};
