import { Request, Response } from "express";
import * as TeacherService from "@/service/teacher.service";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { HTTP_STATUS } from "@/config/http.config";

export const getAllStudents = asyncHandler(
  async (req: Request, res: Response) => {
    const { search } = req.query;

    const students = await TeacherService.getAllStudentsForTeacher(
      search as string,
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  },
);

/**
 * Teacher → get single student
 */
export const getStudent = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;

  const student = await TeacherService.getStudentByIdForTeacher(studentId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Student fetched successfully",
    data: student,
  });
});

export const teacherAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const teacherId = req.user.id;
    const data = await TeacherService.getTeacherAnalytics(teacherId);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  },
);
