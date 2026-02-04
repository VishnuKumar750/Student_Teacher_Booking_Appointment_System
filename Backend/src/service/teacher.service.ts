import { HTTP_STATUS } from "@/config/http.config";
import { Appointment } from "@/model/appointment.model";
import { User } from "@/model/user.model";
import ApiError from "@/utils/ApiError.utils";
import { Types } from "mongoose";

export const getAllStudentsForTeacher = async (search?: string) => {
  const query: any = {
    role: "student",
    isDeleted: false,
    isApproved: true,
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { rollNo: { $regex: search, $options: "i" } },
    ];
  }

  const students = await User.find(query)
    .select("name email rollNo department profileImage")
    .sort({ name: 1 })
    .lean();

  return students;
};

export const getStudentByIdForTeacher = async (studentId: string) => {
  if (!Types.ObjectId.isValid(studentId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid student id");
  }

  const student = await User.findOne({
    _id: studentId,
    role: "student",
    isDeleted: false,
    isApproved: true,
  })
    .select("name email rollNo department profileImage")
    .lean();

  if (!student) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Student not found");
  }

  return student;
};

export const getTeacherAnalytics = async (teacherId: string) => {
  if (!Types.ObjectId.isValid(teacherId)) {
    throw new Error("Invalid teacher id");
  }

  const now = new Date();

  const stats = await Appointment.aggregate([
    { $match: { teacherId: new Types.ObjectId(teacherId) } },
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
