import { HTTP_STATUS } from "@/config/http.config";
import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import * as StudentService from "@/service/student.service";

export const getAllTeachers = asyncHandler(
  async (req: Request, res: Response) => {
    const { search } = req.query;

    const teachers = await StudentService.getAllTeachersForStudent(
      search as string,
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Teachers fetched successfully",
      data: teachers,
    });
  },
);

export const getTeacher = asyncHandler(async (req: Request, res: Response) => {
  const { teacherId } = req.params;

  const teacher = await StudentService.getTeacherByIdForStudent(teacherId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Teacher fetched successfully",
    data: teacher,
  });
});

export const studentAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = req.user?.id;
    const data = await StudentService.getStudentAnalytics(studentId);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  },
);
