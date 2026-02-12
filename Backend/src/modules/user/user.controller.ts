import { availability } from "@/types/user.types";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { Response, Request } from "express";
import { User } from "./user.model";
import { HTTP_STATUS } from "@/config/http.config";
import { isValidObjectId } from "@/utils/helper.utils";
import { Appointment } from "@/modules/appointments/appointment.model";
import { Types } from "mongoose";

interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  rollNo?: string;
  isApproved?: boolean;
  department?: string;
  subject?: string;
  profileImage?: string;
  isDeleted?: boolean;
  availability?: availability;
}

// GET TEACHERS
export const getTeachers = asyncHandler(async (req: Request, res: Response) => {
  const teachers = await User.find({ role: "teacher", isDeleted: false })
    .sort({ createdAt: -1 })
    .lean();

  const data: IUserResponse[] = teachers.map((teacher) => ({
    _id: teacher._id.toString(),
    name: teacher.name,
    email: teacher.email,
    department: teacher.department,
    subject: teacher.subject,
    profileImage: teacher.profileImage,
    isDeleted: teacher.isDeleted,
    availability: teacher.availability,
  }));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: data.length > 0 ? "teachers found" : "no result found",
    data,
  });
});
// GET TEACHER
export const getTeacher = asyncHandler(async (req: Request, res: Response) => {
  const { id: teacherId } = req.params as { id?: string };

  if (!teacherId) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: "Teacher id is required",
    });
  }

  if (!isValidObjectId(teacherId)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: "valid Teacher id is required",
    });
  }

  const teacher = await User.findOne({
    _id: teacherId,
    role: "teacher",
    isDeleted: false,
  }).lean();

  if (!teacher) {
    return res
      .status(HTTP_STATUS.NOT_FOUND)
      .json({ success: false, error: "no result found" });
  }

  const data: IUserResponse = {
    _id: teacher._id.toString(),
    name: teacher.name,
    email: teacher.email,
    department: teacher.department,
    subject: teacher.subject,
    profileImage: teacher.profileImage,
    isDeleted: teacher.isDeleted,
    availability: teacher.availability,
  };

  res
    .status(HTTP_STATUS.OK)
    .json({ success: true, message: "teacher found", data });
});

// UPDATE STUDENT
export const patchStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: studentId } = req.params as { id?: string };
    if (!studentId || !isValidObjectId(studentId)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, error: "student id is required" });
    }

    const { status } = req.query as { status?: string };
    const filter: Record<string, any> = {};
    if (status === "approved") {
      filter.isApproved = true;
    }

    const patchedStudent = await User.findOneAndUpdate(
      { _id: studentId, isApproved: false, isDeleted: false },
      { isApproved: filter.isApproved },
      { new: true },
    );
    if (!patchedStudent) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ success: false, error: "student not found" });
    }

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "student approved" });
  },
);

// GET STUDENTS
export const getStudents = asyncHandler(async (req: Request, res: Response) => {
  const isApproved = req.query.isApproved === "true";
  const isDeleted = req.query.isDeleted === "true";

  const filter: Record<string, any> = {
    role: "student",
  };

  if (req.query.isApproved !== undefined) {
    filter.isApproved = isApproved;
  }

  if (req.query.isDeleted !== undefined) {
    filter.isDeleted = isDeleted;
  }

  const students = await User.find(filter).sort({ createdAt: -1 }).lean();

  const data: IUserResponse[] = students.map((student) => ({
    _id: student._id.toString(),
    rollNo: student.rollNo,
    name: student.name,
    email: student.email,
    department: student.department,
    profileImage: student.profileImage,
    year: student.year,
  }));

  res
    .status(HTTP_STATUS.OK)
    .json({ success: true, message: "students result found", data });
});
// GET STUDENT
export const getStudent = asyncHandler(async (req: Request, res: Response) => {
  const { id: studentId } = req.params as { id?: string };

  if (!studentId) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ success: false, error: "student id is required" });
  }

  if (!isValidObjectId(studentId)) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ success: false, error: "valid student id is required" });
  }

  const student = await User.findOne({
    _id: studentId,
    role: "student",
    isDeleted: false,
  }).lean();

  if (!student) {
    return res
      .status(HTTP_STATUS.NOT_FOUND)
      .json({ success: false, error: "no result found" });
  }

  const data: IUserResponse = {
    _id: student._id.toString(),
    rollNo: student.rollNo,
    name: student.name,
    email: student.email,
    department: student.department,
    profileImage: student.profileImage,
  };

  res
    .status(HTTP_STATUS.OK)
    .json({ success: true, message: "student details", data });
});

export const getAdminAnalytics = asyncHandler(
  async (_req: Request, res: Response) => {
    const [totalUsers, students, teachers, appointments, appointmentStats] =
      await Promise.all([
        User.countDocuments({ isDeleted: false }),
        User.countDocuments({ role: "student", isDeleted: false }),
        User.countDocuments({ role: "teacher", isDeleted: false }),
        Appointment.countDocuments(),
        Appointment.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
      ]);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        users: { total: totalUsers, students, teachers },
        appointments: {
          total: appointments,
          breakdown: appointmentStats.reduce((acc: any, cur) => {
            acc[cur._id] = cur.count;
            return acc;
          }, {}),
        },
      },
    });
  },
);

export const getStudentAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.user as { id?: string };

    if (!id) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, error: "id is required" });
    }

    if (!isValidObjectId(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Invalid student id",
      });
    }

    const now = new Date();

    const stats = await Appointment.aggregate([
      {
        $match: {
          studentId: new Types.ObjectId(id),
        },
      },
      {
        $facet: {
          total: [{ $count: "count" }],
          pending: [{ $match: { status: "pending" } }, { $count: "count" }],
          approved: [{ $match: { status: "approved" } }, { $count: "count" }],
          cancelled: [{ $match: { status: "cancelled" } }, { $count: "count" }],
          upcoming: [
            {
              $match: {
                status: "approved",
                date: { $gte: now },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const data = stats[0] || {};

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        total: data.total?.[0]?.count || 0,
        pending: data.pending?.[0]?.count || 0,
        approved: data.approved?.[0]?.count || 0,
        cancelled: data.cancelled?.[0]?.count || 0,
        upcoming: data.upcoming?.[0]?.count || 0,
      },
    });
  },
);

export const getTeacherAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.user as { id?: string };

    if (!id) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, error: "id is required" });
    }

    if (!isValidObjectId(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Invalid teacher id",
      });
    }

    const now = new Date();

    const stats = await Appointment.aggregate([
      {
        $match: {
          teacherId: new Types.ObjectId(id),
        },
      },
      {
        $facet: {
          total: [{ $count: "count" }],
          pending: [{ $match: { status: "pending" } }, { $count: "count" }],
          approved: [{ $match: { status: "approved" } }, { $count: "count" }],
          cancelled: [{ $match: { status: "cancelled" } }, { $count: "count" }],
          upcoming: [
            {
              $match: {
                status: "approved",
                date: { $gte: now },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const data = stats[0] || {};

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        total: data.total?.[0]?.count || 0,
        pending: data.pending?.[0]?.count || 0,
        approved: data.approved?.[0]?.count || 0,
        cancelled: data.cancelled?.[0]?.count || 0,
        upcoming: data.upcoming?.[0]?.count || 0,
      },
    });
  },
);
