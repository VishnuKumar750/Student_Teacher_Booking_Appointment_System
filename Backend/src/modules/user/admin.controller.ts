import mongoose from "mongoose";
import { Request, Response } from "express";

import { User } from "@/modules/user/user.model";
import { Appointment } from "@/modules/appointments/appointment.model";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { HTTP_STATUS } from "@/config/http.config";
import { isValidObjectId, toObjectId } from "@/utils/helper.utils";

/* ───────────────── Admins ───────────────── */

export const createAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const exists = await User.exists({ email });
  if (exists) {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      error: "Email already exists",
    });
  }

  const admin = await User.create({
    name,
    email,
    password,
    role: "admin",
    isApproved: true,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: admin,
  });
});

export const getAdmins = asyncHandler(async (_req: Request, res: Response) => {
  const admins = await User.find({
    role: "admin",
    isDeleted: false,
  }).sort({ createdAt: -1 });

  res.json({ success: true, data: admins });
});

export const deleteAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: "Invalid admin id",
    });
  }

  const admin = await User.findOneAndUpdate(
    { _id: id, role: "admin" },
    { isDeleted: true },
    { new: true },
  );

  if (!admin) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      error: "Admin not found",
    });
  }

  res.json({
    success: true,
    message: "Admin deleted successfully",
  });
});

/* ───────────────── Students ───────────────── */

export const getStudents = asyncHandler(
  async (_req: Request, res: Response) => {
    const students = await User.find(
      {
        role: "student",
        isApproved: true,
        isDeleted: false,
      },
      { password: 0, refreshToken: 0, __v: 0 },
    ).lean();

    res.json({ success: true, data: students });
  },
);

export const getUnapprovedStudents = asyncHandler(
  async (_req: Request, res: Response) => {
    const students = await User.find({
      role: "student",
      isApproved: false,
      isDeleted: false,
    });

    res.json({ success: true, data: students });
  },
);

export const approveStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Invalid student id",
      });
    }

    const student = await User.findOneAndUpdate(
      { _id: id, role: "student", isDeleted: false },
      { isApproved: true },
      { new: true, runValidators: true },
    ).select("-password -refreshToken");

    if (!student) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Student not found",
      });
    }

    res.json({ success: true, data: student });
  },
);

export const unapproveStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Invalid student id",
      });
    }

    const student = await User.findOneAndUpdate(
      { _id: id, role: "student", isDeleted: false },
      { isApproved: false },
      { new: true, runValidators: true },
    ).select("-password -refreshToken");

    if (!student) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Student not found",
      });
    }

    res.json({ success: true, data: student });
  },
);

/* ───────────────── Teachers ───────────────── */

export const createTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      email,
      password,
      department,
      subject,
      availability,
      profileImage = "",
    } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const emailExists = await User.exists({
      email: normalizedEmail,
      isDeleted: false,
    });

    if (emailExists) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        error: "Email already exists",
      });
    }

    if (availability && availability.start >= availability.end) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "End time must be after start time",
      });
    }

    const teacher = new User({
      name,
      email: normalizedEmail,
      password,
      role: "teacher",
      department,
      subject,
      availability,
      profileImage,
      isApproved: true,
    });

    const savedTeacher = await teacher.save();

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "teacher added successfully",
      data: savedTeacher,
    });
  },
);

export const updateTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    const { teacherId } = req.params;

    if (!isValidObjectId(teacherId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "Invalid teacher id",
      });
    }

    const update: any = {};
    const { name, department, subject, availability, profileImage } = req.body;

    if (name) update.name = name;
    if (department) update.department = department;
    if (subject) update.subject = subject;
    if (profileImage) update.profileImage = profileImage;

    if (availability) {
      if (availability.start >= availability.end) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: "End time must be after start time",
        });
      }
      update.availability = availability;
    }

    if (!Object.keys(update).length) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "No valid fields to update",
      });
    }

    const teacher = await User.findOneAndUpdate(
      { _id: teacherId, role: "teacher", isDeleted: false },
      { $set: update },
      { new: true, runValidators: true },
    ).select("-password -refreshToken");

    if (!teacher) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Teacher not found",
      });
    }

    res.json({ success: true, data: teacher });
  },
);

export const deleteTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    const { teacherId } = req.params;

    const teacher = await User.findOneAndUpdate(
      {
        _id: toObjectId(teacherId),
        role: "teacher",
        isDeleted: false,
      },
      { isDeleted: true },
      { new: true },
    );

    if (!teacher) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "Teacher not found",
      });
    }

    res.json({
      success: true,
      message: "Teacher deleted successfully",
    });
  },
);

/* ───────────────── Analytics ───────────────── */

export const adminAnalytics = asyncHandler(
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
