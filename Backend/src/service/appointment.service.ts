import { HTTP_STATUS } from "@/config/http.config";
import { Appointment } from "@/model/appointment.model";
import { User } from "@/model/user.model";
import ApiError from "@/utils/ApiError.utils";
import { Types } from "mongoose";

// generate slot
interface GenerateSlotParams {
  start: string; // "10:00"
  end: string; // "12:00"
  duration?: number; // minutes (default 30)
}

export function generateSlot({
  start,
  end,
  duration = 60,
}: GenerateSlotParams) {
  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const toTime = (mins: number) => {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  const startMin = toMinutes(start);
  const endMin = toMinutes(end);

  if (startMin >= endMin) {
    return [];
  }

  const slots: { start: string; end: string }[] = [];
  let cursor = startMin;

  while (cursor + duration <= endMin) {
    slots.push({
      start: toTime(cursor),
      end: toTime(cursor + duration),
    });
    cursor += duration;
  }

  return slots;
}

export const getTeacherAvailability = async (date: Date, teacherId: string) => {
  if (!Types.ObjectId.isValid(teacherId)) {
    throw new Error("Invalid teacher id");
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  // normalize date range
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  /**
   * 1. Fetch teacher with availability
   */
  const teacher = await User.findOne({
    _id: teacherId,
    role: "teacher",
    isDeleted: false,
  })
    .select("availability")
    .lean();

  if (!teacher || !teacher.availability?.start || !teacher.availability?.end) {
    return [];
  }

  /**
   * 2. Generate all possible slots
   */
  const allSlots = generateSlot({
    start: teacher.availability?.start,
    end: teacher.availability?.end,
  });

  if (allSlots.length === 0) {
    return [];
  }

  /**
   * 3. Fetch ONLY approved appointments
   *    pending & cancelled should NOT block slots
   */
  const approvedAppointments = await Appointment.find({
    teacherId,
    "slot.date": { $gte: startOfDay, $lte: endOfDay },
    status: "approved",
  })
    .select("slot.start slot.end")
    .lean();

  if (approvedAppointments.length === 0) {
    return allSlots;
  }

  /**
   * 4. Remove blocked slots
   */
  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const blockedSlots = approvedAppointments.map((a) => ({
    start: toMinutes(a.slot.start),
    end: toMinutes(a.slot.end),
  }));

  const availableSlots = allSlots.filter((slot) => {
    const slotStart = toMinutes(slot.start);
    const slotEnd = toMinutes(slot.end);

    return !blockedSlots.some((b) => slotStart < b.end && slotEnd > b.start);
  });

  return availableSlots;
};

export const getStudentAvailability = async (date: Date, studentId: string) => {
  if (!Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student id");
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  // normalize date range
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const student = await User.findOne({
    _id: studentId,
    role: "student",
    isDeleted: false,
    isAopproved: true,
  })
    .select("availability")
    .lean();

  console.log("user", student);
  if (!student || !student.availability?.start || !student.availability?.end) {
    return [];
  }
  console.log("hello");

  const allSlots = generateSlot({
    start: student.availability.start,
    end: student.availability.end,
  });

  if (allSlots.length === 0) {
    return [];
  }

  const blockingAppointments = await Appointment.find({
    studentId,
    "slot.date": { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ["approved", "pending"] },
  })
    .select("slot.start slot.end")
    .lean();

  if (blockingAppointments.length === 0) {
    return allSlots;
  }

  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const blockedSlots = blockingAppointments.map((a) => ({
    start: toMinutes(a.slot.start),
    end: toMinutes(a.slot.end),
  }));

  const availableSlots = allSlots.filter((slot) => {
    const slotStart = toMinutes(slot.start);
    const slotEnd = toMinutes(slot.end);

    return !blockedSlots.some((b) => slotStart < b.end && slotEnd > b.start);
  });

  return availableSlots;
};

/**
 * Auto-cancel past pending appointments
 */
const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const autoCancelPastPendingAppointments = async () => {
  const today = getStartOfToday();

  const result = await Appointment.updateMany(
    {
      status: "pending",
      "slot.date": { $lt: today },
    },
    {
      $set: {
        status: "cancelled",
        cancellationReason: "Appointment expired",
        cancelledAt: new Date(),
        cancelledBy: "system",
      },
    },
  );

  return result.modifiedCount;
};

// student book appointment
interface BookAppointmentInput {
  studentId: string;
  teacherId: string;
  date: Date;
  start: string;
  end: string;
  purpose: string;
  message?: string;
}

export const bookAppointmentByStudent = async ({
  studentId,
  teacherId,
  date,
  start,
  end,
  purpose,
  message,
}: BookAppointmentInput) => {
  // -------------------- validations --------------------
  if (
    !Types.ObjectId.isValid(studentId) ||
    !Types.ObjectId.isValid(teacherId)
  ) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid user id");
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid date");
  }

  // -------------------- fetch users --------------------
  const [student, teacher] = await Promise.all([
    User.findOne({
      _id: studentId,
      role: "student",
      isDeleted: false,
      isApproved: true,
    }),
    User.findOne({ _id: teacherId, role: "teacher", isDeleted: false }),
  ]);

  if (!student) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Student not found");
  }

  if (!teacher) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Teacher not found");
  }

  if (!teacher.availability?.start || !teacher.availability?.end) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Teacher has no availability set",
    );
  }

  // -------------------- normalize date --------------------
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // -------------------- check approved conflicts --------------------
  const conflict = await Appointment.findOne({
    teacherId,
    "slot.date": { $gte: startOfDay, $lte: endOfDay },
    "slot.start": start,
    "slot.end": end,
    status: "approved", // ONLY approved blocks
  });

  if (conflict) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "This slot is already booked");
  }

  // -------------------- create appointment --------------------
  const appointment = await Appointment.create({
    studentId,
    teacherId,
    createdBy: "student",

    slot: {
      date: startOfDay,
      start,
      end,
    },

    purpose,
    status: "pending",

    messages: message
      ? [
          {
            senderRole: "student",
            senderId: studentId,
            text: message,
          },
        ]
      : [],
  });

  return appointment;
};

// teacher approve appointment
export const approveAppointmentByTeacher = async (
  appointmentId: string,
  teacherId: string,
) => {
  if (
    !Types.ObjectId.isValid(appointmentId) ||
    !Types.ObjectId.isValid(teacherId)
  ) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid id");
  }

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    teacherId,
    status: "pending",
  });

  if (!appointment) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Pending appointment not found");
  }

  const { date, start, end } = appointment.slot;

  // approve selected appointment
  appointment.status = "approved";
  appointment.approvedAt = new Date();
  appointment.approvedBy = teacherId;

  await appointment.save();

  // auto-cancel other pending appointments for same slot
  await Appointment.updateMany(
    {
      _id: { $ne: appointment._id },
      teacherId,
      "slot.date": date,
      "slot.start": start,
      "slot.end": end,
      status: "pending",
    },
    {
      $set: {
        status: "cancelled",
        cancelledAt: new Date(),
        cancelledBy: "teacher",
        cancellationReason: "Slot already approved for another student",
      },
    },
  );

  return appointment;
};

// cancel appointment teacher
export const cancelAppointmentByTeacher = async (
  appointmentId: string,
  teacherId: string,
) => {
  if (
    !Types.ObjectId.isValid(appointmentId) ||
    !Types.ObjectId.isValid(teacherId)
  ) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid id");
  }

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    teacherId,
    status: { $in: ["pending"] },
  });

  if (!appointment) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Appointment not found or already cancelled",
    );
  }

  appointment.status = "cancelled";
  appointment.cancelledAt = new Date();
  appointment.cancelledBy = "teacher";

  await appointment.save();

  return appointment;
};

interface SendMessageInput {
  appointmentId: string;
  senderId: string;
  senderRole: "student" | "teacher";
  message: string;
}

export const sendAppointmentMessage = async ({
  appointmentId,
  senderId,
  senderRole,
  message,
}: SendMessageInput) => {
  if (
    !Types.ObjectId.isValid(appointmentId) ||
    !Types.ObjectId.isValid(senderId)
  ) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid id");
  }

  if (!message?.trim()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Message cannot be empty");
  }

  const appointment = await Appointment.findById({ _id: appointmentId });

  if (!appointment) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Appointment not found");
  }

  // authorization: must belong to appointment
  if (
    (senderRole === "student" &&
      appointment.studentId.toString() !== senderId) ||
    (senderRole === "teacher" && appointment.teacherId.toString() !== senderId)
  ) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Not allowed to message this appointment",
    );
  }

  appointment.messages.push({
    senderRole,
    senderId,
    message,
    isRead: false,
  });

  await appointment.save();

  return appointment.messages.at(-1); // return last message
};

export const getAppointmentMessages = async (appointmentId: string) => {
  if (!Types.ObjectId.isValid(appointmentId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid appointment id");
  }

  const appointment = await Appointment.findById({ _id: appointmentId })
    .select("messages")
    .lean();

  if (!appointment) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Appointment not found");
  }

  return appointment.messages ?? [];
};

export const getAllAppointmentsForTeacher = async (
  teacherId: string,
  status?: string,
) => {
  if (!Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid teacher id");
  }

  const query: any = { teacherId };

  if (status) {
    query.status = status;
  } else {
    query.status = { $ne: "pending" };
  }

  const appointments = await Appointment.find(query)
    .populate("studentId", "name rollNo department")
    .sort({ "slot.date": 1, "slot.start": 1 })
    .lean();

  // 🔹 normalize response for frontend
  return appointments.map((appointment) => ({
    _id: appointment._id,

    student: {
      name: appointment.studentId?.name,
      rollNo: appointment.studentId?.rollNo,
      department: appointment.studentId?.department,
    },

    slot: {
      date: appointment.slot.date,
      start: appointment.slot.start,
      end: appointment.slot.end,
    },

    purpose: appointment.purpose,
    status: appointment.status,
  }));
};

export const getAllAppointmentsForStudent = async (
  studentId: string,
  status?: string,
) => {
  if (!Types.ObjectId.isValid(studentId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid student id");
  }

  // 🔥 auto-cancel expired pending appointments
  await autoCancelPastPendingAppointments();

  const query: any = { studentId };
  if (status) {
    query.status = status;
  } else {
    query.status = { $ne: "pending" };
  }

  const appointments = await Appointment.find(query)
    .populate("teacherId", "name email department subject")
    .sort({ "slot.date": 1, "slot.start": 1 })
    .lean();

  return appointments.map((a) => ({
    _id: a._id,
    teacher: a.teacherId,
    slot: {
      date: a.slot.date,
      start: a.slot.start,
      end: a.slot.end,
    },
    purpose: a.purpose,
    status: a.status,
    senderRole: a.createdBy ?? "student",
    createdAt: a.createdAt,
  }));
};

interface BookAppointmentByTeacherInput {
  teacherId: string;
  studentId: string;
  date: Date;
  start: string;
  end: string;
  purpose: string;
}

export const bookAppointmentByTeacher = async ({
  teacherId,
  studentId,
  date,
  start,
  end,
  purpose,
}: BookAppointmentByTeacherInput) => {
  if (
    !Types.ObjectId.isValid(teacherId) ||
    !Types.ObjectId.isValid(studentId)
  ) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid user id");
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid date");
  }

  const [teacher, student] = await Promise.all([
    User.findOne({ _id: teacherId, role: "teacher", isDeleted: false }),
    User.findOne({
      _id: studentId,
      role: "student",
      isDeleted: false,
      isApproved: true,
    }),
  ]);

  if (!teacher) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Teacher not found");
  }

  if (!student) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Student not found");
  }

  if (!teacher.availability?.start || !teacher.availability?.end) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Teacher has no availability set",
    );
  }

  // normalize date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // check approved conflicts
  const conflict = await Appointment.findOne({
    teacherId,
    "slot.date": { $gte: startOfDay, $lte: endOfDay },
    "slot.start": start,
    "slot.end": end,
    status: "approved",
  });

  if (conflict) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "This slot is already approved");
  }

  // create appointment (approved immediately)
  const appointment = await Appointment.create({
    teacherId,
    studentId,
    createdBy: "teacher",
    status: "approved",

    approvedAt: new Date(),
    approvedBy: teacherId,

    slot: {
      date: startOfDay,
      start,
      end,
    },

    purpose,
  });

  // auto-cancel other pending appointments for same slot
  await Appointment.updateMany(
    {
      _id: { $ne: appointment._id },
      teacherId,
      "slot.date": startOfDay,
      "slot.start": start,
      "slot.end": end,
      status: "pending",
    },
    {
      $set: {
        status: "cancelled",
        cancelledAt: new Date(),
        cancelledBy: "teacher",
        cancellationReason: "Slot booked by teacher",
      },
    },
  );

  return appointment;
};
