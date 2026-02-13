import { Request, Response } from "express";
import { Types } from "mongoose";

import { HTTP_STATUS } from "@/config/http.config";
import { asyncHandler } from "@/utils/asyncHandler.utils";
import { Appointment } from "@/modules/appointments/appointment.model";
import { User } from "@/modules/user/user.model";
import { toObjectId } from "@/utils/helper.utils";

/* ───────────────── helpers ───────────────── */

const isValidObjectId = (id?: string) => !!id && Types.ObjectId.isValid(id);

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const normalizeDate = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/* ───────────────── slot generator ───────────────── */

export const generateSlot = ({
  start,
  end,
  duration = 60,
}: {
  start: string;
  end: string;
  duration?: number;
}) => {
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);

  if (startMin >= endMin) return [];

  const slots: { start: string; end: string }[] = [];
  let cursor = startMin;

  while (cursor + duration <= endMin) {
    slots.push({
      start: `${String(Math.floor(cursor / 60)).padStart(2, "0")}:${String(
        cursor % 60,
      ).padStart(2, "0")}`,
      end: `${String(Math.floor((cursor + duration) / 60)).padStart(
        2,
        "0",
      )}:${String((cursor + duration) % 60).padStart(2, "0")}`,
    });
    cursor += duration;
  }

  return slots;
};

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id: senderId } = req.user as { id?: string };
  const senderRole = req.user?.role;
  const { appointmentId } = req.params;
  const { message } = req.body;

  if (
    !isValidObjectId(appointmentId) ||
    !isValidObjectId(senderId) ||
    !message?.trim()
  ) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: "Invalid input",
    });
  }

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      error: "Appointment not found",
    });
  }

  if (
    (senderRole === "student" &&
      appointment.studentId.toString() !== senderId) ||
    (senderRole === "teacher" && appointment.teacherId.toString() !== senderId)
  ) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      error: "Not allowed",
    });
  }

  appointment.messages.push({
    senderRole,
    senderId,
    message,
    isRead: false,
  });

  await appointment.save();

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: "message sended, wait for reply",
  });
});

export const getAppointmentMessages = asyncHandler(
  async (req: Request, res: Response) => {
    const { appointmentId } = req.params as { appointmentId?: string };
    if (!appointmentId || !isValidObjectId(appointmentId)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, error: "appointment id is required" });
    }

    const appointment = await Appointment.findById(appointmentId).lean();
    if (!appointment) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ success: false, error: "no message found" });
    }
    const messages = appointment.messages.map((m) => ({
      _id: m._id,
      senderRole: m.senderRole,
      message: m.message,
      isRead: m.isRead,
      createdAt: m.createdAt,
    }));

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "message fetched", data: messages });
  },
);

export const getAvailableSlots = asyncHandler(
  async (req: Request, res: Response) => {
    const { teacherId, studentId, date } = req.query as {
      teacherId?: string;
      studentId?: string;
      date?: string;
    };

    if (!teacherId || !studentId) {
      return res.status(400).json({
        error: "teacherId, studentId  are required",
      });
    }

    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "date is invalid",
      });
    }

    const student = await User.findOne({
      _id: studentId,
      role: "student",
      isDeleted: false,
      isApproved: true,
    }).lean();

    if (!student) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "No student found",
      });
    }

    const teacher = await User.findOne({
      _id: teacherId,
      role: "teacher",
      isDeleted: false,
    }).lean();

    if (!teacher) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "No teacher found",
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    if (!teacher.availability || !student.availability) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, error: "available slot are not matched" });
    }

    const teacherSlots = generateSlot({
      start: teacher.availability?.start,
      end: teacher.availability?.end,
    });

    const studentSlots = generateSlot({
      start: student.availability?.start,
      end: student.availability?.end,
    });

    if (!teacherSlots.length || !studentSlots.length) {
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "No slots available",
        data: [],
      });
    }

    const teacherAppointments = await Appointment.find({
      teacherId: teacher._id,
      "slot.date": { $gte: startOfDay, $lte: endOfDay },
      status: "approved",
    })
      .select("slot.start slot.end")
      .lean();

    const studentAppointments = await Appointment.find({
      studentId: student._id,
      "slot.date": { $gte: startOfDay, $lte: endOfDay },
      status: "approved",
    })
      .select("slot.start slot.end")
      .lean();

    const teacherBooked = new Set(
      teacherAppointments.map((a) => `${a?.slot?.start}-${a?.slot?.end}`),
    );

    const studentBooked = new Set(
      studentAppointments.map((a) => `${a?.slot?.start}-${a?.slot?.end}`),
    );

    const teacherFree = teacherSlots.filter(
      (slot) => !teacherBooked.has(`${slot.start}-${slot.end}`),
    );

    const studentFree = studentSlots.filter(
      (slot) => !studentBooked.has(`${slot.start}-${slot.end}`),
    );

    const studentFreeSet = new Set(
      studentFree.map((slot) => `${slot.start}-${slot.end}`),
    );

    const availableSlots = teacherFree.filter((slot) =>
      studentFreeSet.has(`${slot.start}-${slot.end}`),
    );

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message:
        availableSlots.length > 0
          ? "Available slots found"
          : "No slots available",
      data: availableSlots,
    });
  },
);

export const bookAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: requesterId } = req.user as { id?: string };

    const { studentId, teacherId } = req.query as {
      studentId?: string;
      teacherId?: string;
    };

    const { date, start, end, purpose } = req.body;

    if (!requesterId || !isValidObjectId(requesterId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "requester id is required",
      });
    }

    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "invalid date",
      });
    }

    if (!start || !end || !purpose) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "all fields are required",
      });
    }

    /* ───────── Fetch Users ───────── */

    const [student, teacher, sender] = await Promise.all([
      User.findOne({
        _id: studentId,
        role: "student",
        isDeleted: false,
        isApproved: true,
      }).lean(),

      User.findOne({
        _id: teacherId,
        role: "teacher",
        isDeleted: false,
      }).lean(),

      User.findById(requesterId),
    ]);

    if (!student)
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "student not found",
      });

    if (!teacher)
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "teacher not found",
      });

    if (!sender)
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: "sender not found",
      });

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    /* ───────── Transaction Start ───────── */

    const session = await Appointment.startSession();
    session.startTransaction();

    try {
      /* Check Conflict */
      const conflict = await Appointment.findOne(
        {
          teacherId,
          "slot.date": { $gte: startOfDay, $lte: endOfDay },
          "slot.start": start,
          "slot.end": end,
          status: "approved",
        },
        null,
        { session },
      );

      if (conflict) {
        await session.abortTransaction();
        session.endSession();

        return res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          error: "slot is already booked",
        });
      }

      /* Create Appointment */
      const appointment = await Appointment.create(
        [
          {
            studentId,
            teacherId,
            createdBy: sender.role,
            slot: {
              date: startOfDay,
              start,
              end,
            },
            purpose,
            status: sender.role === "teacher" ? "approved" : "pending",
          },
        ],
        { session },
      );

      /* If Teacher Directly Books → Cancel Others */
      if (sender.role === "teacher") {
        await Appointment.updateMany(
          {
            _id: { $ne: appointment[0]._id },
            teacherId,
            "slot.date": { $gte: startOfDay, $lte: endOfDay },
            "slot.start": start,
            "slot.end": end,
            status: "pending",
          },
          { $set: { status: "rejected" } },
          { session },
        );
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "appointment created",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },
);

export const updateAppointmentStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: appointmentId } = req.params as {
      id?: string;
    };

    const { status } = req.query as {
      status?: "approved" | "rejected";
    };

    if (!appointmentId || !isValidObjectId(appointmentId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "appointment id is required",
      });
    }

    if (status !== "approved" && status !== "rejected") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "invalid status",
      });
    }

    const { id: teacherId } = req.user as {
      id?: string;
    };

    if (!teacherId || !isValidObjectId(teacherId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "teacher id is required",
      });
    }

    const session = await Appointment.startSession();
    session.startTransaction();

    try {
      const appointment = await Appointment.findOne(
        {
          _id: appointmentId,
          teacherId,
        },
        null,
        { session },
      );

      if (!appointment) {
        await session.abortTransaction();
        session.endSession();

        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: "appointment not found",
        });
      }

      if (appointment.status === "rejected") {
        await session.abortTransaction();
        session.endSession();

        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: "appointment already cancelled",
        });
      }

      /* ───────── If Approving ───────── */

      if (status === "approved") {
        // check conflict
        const conflict = await Appointment.findOne(
          {
            _id: { $ne: appointment._id },
            teacherId,
            "slot.date": appointment?.slot?.date,
            "slot.start": appointment?.slot?.start,
            "slot.end": appointment?.slot?.end,
            status: "approved",
          },
          null,
          { session },
        );

        if (conflict) {
          await session.abortTransaction();
          session.endSession();

          return res.status(HTTP_STATUS.CONFLICT).json({
            success: false,
            error: "slot already approved for another appointment",
          });
        }

        // approve this one
        appointment.status = "approved";
        await appointment.save({ session });

        // cancel other pending requests for same slot
        await Appointment.updateMany(
          {
            _id: { $ne: appointment._id },
            teacherId,
            "slot.date": appointment?.slot?.date,
            "slot.start": appointment?.slot?.start,
            "slot.end": appointment?.slot?.end,
            status: "pending",
          },
          { $set: { status: "rejected" } },
          { session },
        );
      }

      /* ───────── If Cancelling ───────── */

      if (status === "rejected") {
        appointment.status = "rejected";
        await appointment.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message:
          status === "approved"
            ? "appointment approved"
            : "appointment cancelled",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },
);

interface PopulatedAppointment {
  _id: any;
  studentId: {
    _id: any;
    name: string;
    rollNo: string;
    department: string;
  };
  teacherId: {
    _id: any;
    name: string;
    department: string;
    subject: string;
  };
  slot: {
    date: Date;
    start: string;
    end: string;
  };
  purpose: string;
  status: string;
  createdBy: string;
}

export const getAppointments = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.query as {
      status?: "pending";
    };

    const { id: userId, role } = req.user as {
      id?: string;
      role?: string;
    };

    if (!userId || !isValidObjectId(userId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "user id is required",
      });
    }

    const filter: any = {};

    if (role === "student") {
      filter.studentId = userId;
    }

    if (role === "teacher") {
      filter.teacherId = userId;
    }

    if (status === "pending") {
      filter.status = status;
    } else {
      filter.status = { $ne: "pending" };
    }

    const appointments = await Appointment.find(filter)
      .populate("studentId", "_id name rollNo department")
      .populate("teacherId", "_id name department subject")
      .sort({ "slot.date": -1, "slot.start": -1 })
      .lean<PopulatedAppointment[]>();

    const data = appointments.map((a) => ({
      _id: a._id.toString(),
      studentId: a.studentId._id.toString(),
      studentName: a.studentId.name,
      studentRollNo: a.studentId.rollNo,
      studentDepartment: a.studentId.department,
      teacherId: a.teacherId._id.toString(),
      teacherName: a.teacherId.name,
      teacherDepartment: a.teacherId.department,
      teacherSubject: a.teacherId.subject,
      slot: a.slot,
      purpose: a.purpose,
      status: a.status,
      createdBy: a.createdBy,
    }));

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: data.length > 0 ? "appointments found" : "no appointments found",
      data,
    });
  },
);

// PATCH APPOINTMENT - APPROVE | REJECT
export const patchAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: appointmentId } = req.params as { id?: string };
    const { status } = req.query as { status?: "approved" | "rejected" };

    console.log(status);
    if (!appointmentId || !isValidObjectId(appointmentId)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, error: "appointment id is required" });
    }

    const appointment_exists = await Appointment.findOne({
      _id: appointmentId,
      status: "pending",
    });
    if (!appointment_exists) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ success: false, error: "appointment not found" });
    }

    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: "appointment must be approved or reject",
      });
    }

    appointment_exists.status = status;
    await appointment_exists.save();

    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "appointment status updated" });
  },
);
