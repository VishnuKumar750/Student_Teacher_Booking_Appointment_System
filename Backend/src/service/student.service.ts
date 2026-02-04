import { HTTP_STATUS } from "@/config/http.config";
import { Appointment } from "@/model/appointment.model";
import { User } from "@/model/user.model";
import ApiError from "@/utils/ApiError.utils";
import { Types } from "mongoose";

export const getAllTeachersForStudent = async (search?: string) => {
  const query: any = {
    role: "teacher",
    isDeleted: false,
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
    ];
  }

  const teachers = await User.find(query)
    .select("name email department subject profileImage availability")
    .sort({ name: 1 })
    .lean();

  return teachers;
};

/**
 * Student → get single teacher
 */
export const getTeacherByIdForStudent = async (teacherId: string) => {
  if (!Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid teacher id");
  }

  const teacher = await User.findOne({
    _id: teacherId,
    role: "teacher",
    isDeleted: false,
  })
    .select("name email department subject profileImage availability")
    .lean();

  if (!teacher) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Teacher not found");
  }

  return teacher;
};

export const getStudentAnalytics = async (studentId: string) => {
  if (!Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student id");
  }

  const now = new Date();

  const stats = await Appointment.aggregate([
    { $match: { studentId: new Types.ObjectId(studentId) } },
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
              "slot.date": { $gte: now },
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  const data = stats[0];

  return {
    total: data.total[0]?.count || 0,
    pending: data.pending[0]?.count || 0,
    approved: data.approved[0]?.count || 0,
    cancelled: data.cancelled[0]?.count || 0,
    upcoming: data.upcoming[0]?.count || 0,
  };
};
