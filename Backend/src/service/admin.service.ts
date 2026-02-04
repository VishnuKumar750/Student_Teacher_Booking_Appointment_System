import mongoose, { Types } from "mongoose";
import { User } from "@/model/user.model";
import ApiError from "@/utils/ApiError.utils";
import { HTTP_STATUS } from "@/config/http.config";
import { Appointment } from "../model/appointment.model";

/* ───────────────────────── Admin Management ───────────────────────── */

export const createAdmin = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const exists = await User.findOne({ email: payload.email });
  if (exists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "Email already exists");
  }

  return User.create({
    ...payload,
    role: "admin",
    isApproved: true,
  });
};

export const getAllAdmins = async () => {
  return User.find({ role: "admin", isDeleted: false }).sort({ createdAt: -1 });
};

export const deleteAdmin = async (adminId: string) => {
  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid admin id");
  }

  const admin = await User.findOneAndUpdate(
    { _id: adminId, role: "admin" },
    { isDeleted: true },
    { new: true },
  );

  if (!admin) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Admin not found");
  }
};

export const getAllStudents = async () => {
  const students = await User.find(
    {
      role: "student",
      isApproved: true,
      isDeleted: false,
    },
    {
      password: 0,
      refreshToken: 0,
      __v: 0,
    },
  ).lean();

  return students;
};

/* ───────── approve student ───────── */
export const approveStudent = async (id: string) => {
  /* 1️⃣ Validate ObjectId */
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid student id");
  }

  /* 2️⃣ Update approval status */
  const student = await User.findOneAndUpdate(
    {
      _id: id,
      role: "student",
      isDeleted: false,
    },
    { $set: { isApproved: true } },
    {
      new: true,
      runValidators: true,
    },
  ).select("-password -refreshToken");

  /* 3️⃣ Not found handling */
  if (!student) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Student not found");
  }

  return student;
};

export const unapproveStudent = async (id: string) => {
  /* 1️⃣ Validate ObjectId */
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid student id");
  }

  /* 2️⃣ Update approval status */
  const student = await User.findOneAndUpdate(
    {
      _id: id,
      role: "student",
      isDeleted: false,
    },
    { $set: { isApproved: false } },
    {
      new: true,
      runValidators: true,
    },
  ).select("-password -refreshToken");

  /* 3️⃣ Not found handling */
  if (!student) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Student not found");
  }

  return student;
};

export const getUnapprovedStudents = async () => {
  return User.find({
    role: "student",
    isApproved: false,
    isDeleted: false,
  });
};

/* ───────────────────────── Teacher Management ───────────────────────── */

interface CreateTeacherPayload {
  name: string;
  email: string;
  password: string;
  department: string;
  subject: string[]; // ✅ consistent
  availability?: {
    start: string;
    end: string;
  };
  profileImage?: string;
}

export const createTeacher = async ({
  name,
  email,
  password,
  department,
  subject,
  availability,
  profileImage = "",
}: CreateTeacherPayload) => {
  /* ───── 1. normalize email ───── */
  const normalizedEmail = email.toLowerCase().trim();

  /* ───── 2. ensure email is unique ───── */
  const emailExists = await User.exists({
    email: normalizedEmail,
    isDeleted: false,
  });

  if (emailExists) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "Email already exists");
  }

  /* ───── 3. validate availability (if provided) ───── */
  if (availability) {
    if (!availability.start || !availability.end) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Both start and end time are required",
      );
    }

    if (availability.start >= availability.end) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "End time must be after start time",
      );
    }
  }

  /* ───── 4. create teacher ───── */
  const teacher = await User.create({
    name,
    email: normalizedEmail,
    password, // hashed in pre-save hook
    role: "teacher",
    department,
    subject,
    availability,
    profileImage,
    isApproved: true,
    isDeleted: false,
  });

  /* ───── 5. sanitize response ───── */
  const teacherObj = teacher.toObject();
  delete teacherObj.password;
  delete teacherObj.refreshToken;

  return teacherObj;
};

/* ───────────────── helpers ───────────────── */

const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);

/* ───────────────── update teacher ───────────────── */

interface UpdateTeacherPayload {
  teacherId: string;
  name?: string;
  department?: string;
  subject?: string[];
  availability?: {
    start: string;
    end: string;
  };
  profileImage?: string;
}

export const updateTeacher = async ({
  teacherId,
  name,
  department,
  subject,
  availability,
  profileImage,
}: UpdateTeacherPayload) => {
  console.log(teacherId, department);
  /* 1️⃣ Validate ObjectId */
  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid teacher id");
  }

  /* 2️⃣ Build safe update object */
  const update: Partial<UpdateTeacherPayload> = {};

  if (typeof name === "string") update.name = name;
  if (typeof department === "string") update.department = department;
  if (typeof subject === "string") update.subject = subject;
  if (typeof profileImage === "string") update.profileImage = profileImage;

  if (availability) {
    if (availability.start >= availability.end) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "End time must be after start time",
      );
    }

    update.availability = {
      start: availability.start,
      end: availability.end,
    };
  }

  /* 3️⃣ Prevent empty updates */
  if (Object.keys(update).length === 0) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "No valid fields to update");
  }

  /* 4️⃣ Update teacher */
  const teacher = await User.findOneAndUpdate(
    {
      _id: teacherId,
      role: "teacher",
      isDeleted: false,
    },
    { $set: update },
    {
      new: true,
      runValidators: true,
    },
  ).select("-password -refreshToken");

  /* 5️⃣ Not found */
  if (!teacher) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Teacher not found");
  }

  return teacher;
};

/* ───────────────── delete teacher (soft) ───────────────── */

export const deleteTeacher = async (teacherId: string) => {
  const teacher = await User.findOneAndUpdate(
    {
      _id: toObjectId(teacherId),
      role: "teacher",
      isDeleted: false,
    },
    { isDeleted: true },
    { new: true },
  );

  if (!teacher) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Teacher not found");
  return true;
};

/* ───────────────── get single teacher ───────────────── */

export const getTeacher = async (teacherId: string) => {
  // 1️⃣ Validate ObjectId early
  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid teacher id");
  }

  // 2️⃣ Query with strict filters + safe projection
  const teacher = await User.findOne(
    {
      _id: teacherId,
      role: "teacher",
      isDeleted: false,
    },
    {
      password: 0,
      refreshToken: 0,
      __v: 0,
    },
  ).lean();

  // 3️⃣ Not found handling
  if (!teacher) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Teacher not found");
  }

  // 4️⃣ Return clean object
  return teacher;
};

/* ───────────────── get all teachers ───────────────── */

export const getAllTeachers = async () => {
  const query: any = {
    role: "teacher",
    isDeleted: false,
  };

  return User.find(query).sort({ createdAt: -1 }).lean();
};

/* ───────────────── Helpers ───────────────── */

function splitIntoSlots(start: string, end: string, stepMin = 60) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  let current = new Date(2000, 0, 1, sh, sm);
  const target = new Date(2000, 0, 1, eh, em);

  const slots: { startTime: string; endTime: string }[] = [];

  while (current < target) {
    const next = new Date(current.getTime() + stepMin * 60_000);

    if (next > target) break;

    slots.push({
      startTime: current.toTimeString().slice(0, 5),
      endTime: next.toTimeString().slice(0, 5),
    });

    current = next;
  }

  return slots;
}

/* ───────────────── Service ───────────────── */

export const getAvailableSlotsForTeacher = async ({
  teacherId,
  date,
  availabilityStart,
  availabilityEnd,
  stepMin = 60,
}: {
  teacherId: string;
  date: Date;
  availabilityStart: string;
  availabilityEnd: string;
  stepMin?: number;
}) => {
  // normalize date
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  // 1. all possible slots from availability
  const allSlots = splitIntoSlots(availabilityStart, availabilityEnd, stepMin);

  // 2. ONLY approved appointments block slots
  const approved = await Appointment.find(
    {
      teacherId,
      date: day,
      status: "approved",
    },
    { startTime: 1, endTime: 1, _id: 0 },
  ).lean();

  // 3. fast lookup set
  const approvedSet = new Set(
    approved.map((a) => `${a.startTime}-${a.endTime}`),
  );

  // 4. filter available slots
  return allSlots.filter(
    (slot) => !approvedSet.has(`${slot.startTime}-${slot.endTime}`),
  );
};

/* ───────────────── Service ───────────────── */

export const createAppointment = async ({
  studentId,
  teacherId,
  date,
  startTime,
  endTime,
  purpose,
}: {
  studentId: string;
  teacherId: string;
  date: Date;
  startTime: string;
  endTime: string;
  purpose: string;
}) => {
  // normalize date (midnight)
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  // 1. check if slot already APPROVED
  const approvedExists = await Appointment.exists({
    teacherId,
    date: day,
    startTime,
    endTime,
    status: "approved",
  });

  if (approvedExists) {
    throw new Error("Slot already booked");
  }

  // 2. create appointment (default: pending)
  const appointment = await Appointment.create({
    studentId: new mongoose.Types.ObjectId(studentId),
    teacherId: new mongoose.Types.ObjectId(teacherId),
    date: day,
    startTime,
    endTime,
    purpose,
    status: "pending",
  });

  return appointment;
};

/* ───────────────── Service ───────────────── */

export const createAppointmentForTeacher = async ({
  teacherId,
  studentId,
  date,
  startTime,
  endTime,
  purpose,
}: {
  teacherId: string;
  studentId: string;
  date: Date;
  startTime: string;
  endTime: string;
  purpose: string;
}) => {
  // normalize date (important)
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  const teacherObjectId = new mongoose.Types.ObjectId(teacherId);
  const studentObjectId = new mongoose.Types.ObjectId(studentId);

  /* ───── 1. check teacher slot (approved only) ───── */
  const teacherBooked = await Appointment.exists({
    teacherId: teacherObjectId,
    date: day,
    startTime,
    endTime,
    status: "approved",
  });

  if (teacherBooked) {
    throw new Error("Teacher is not available for this slot");
  }

  /* ───── 2. check student slot (approved only) ───── */
  const studentBooked = await Appointment.exists({
    studentId: studentObjectId,
    date: day,
    startTime,
    endTime,
    status: "approved",
  });

  if (studentBooked) {
    throw new Error("Student is not available for this slot");
  }

  /* ───── 3. create appointment (auto-approved) ───── */
  const appointment = await Appointment.create({
    teacherId: teacherObjectId,
    studentId: studentObjectId,
    date: day,
    startTime,
    endTime,
    purpose,
    status: "approved", // teacher booking → directly approved
  });

  return appointment;
};

export const getAdminAnalytics = async () => {
  const [totalUsers, students, teachers, appointments, appointmentStats] =
    await Promise.all([
      User.countDocuments({ isDeleted: false }),
      User.countDocuments({ role: "student", isDeleted: false }),
      User.countDocuments({ role: "teacher", isDeleted: false }),
      Appointment.countDocuments(),
      Appointment.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

  return {
    users: {
      total: totalUsers,
      students,
      teachers,
    },
    appointments: {
      total: appointments,
      breakdown: appointmentStats.reduce((acc: any, cur) => {
        acc[cur._id] = cur.count;
        return acc;
      }, {}),
    },
  };
};
