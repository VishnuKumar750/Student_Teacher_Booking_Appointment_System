import jwt from "jsonwebtoken";
import { User } from "@/model/user.model";
import { HTTP_STATUS } from "@/config/http.config";
import ApiError from "@/utils/ApiError.utils";
import { IJWTPayload, signToken } from "@/utils/jsonwebtoken.utils";

/* ───────── Register (Student only) ───────── */
interface RegisterStudentPayload {
  name: string;
  email: string;
  password: string;
  department: string;
  year: number;
}

const DEFAULT_AVAILABILITY = {
  start: "09:00",
  end: "16:00", // college time
};

// example roll format: CSE-2026-0007
const generateUniqueRollNo = ({
  departmentCode,
  year,
  studentCount,
}: {
  departmentCode: string;
  year: number;
  studentCount: number;
}) => {
  const padded = String(studentCount + 1).padStart(4, "0");
  return `${departmentCode}-${year}-${padded}`;
};

/* ───────────────── Service ───────────────── */

export const registerStudent = async ({
  name,
  email,
  password,
  department,
  year,
}: RegisterStudentPayload) => {
  /* ───── 1. email uniqueness ───── */
  const emailExists = await User.exists({
    email: email.toLowerCase(),
    isDeleted: false,
  });

  if (emailExists) {
    throw new Error("Email already registered");
  }

  /* ───── 2. count students for roll no ───── */
  const studentCount = await User.countDocuments({
    role: "student",
    department,
    year,
  });

  /* ───── 3. generate roll number ───── */
  const rollNo = generateUniqueRollNo({
    departmentCode: department,
    year,
    studentCount,
  });

  /* ───── 4. create student ───── */
  const student = await User.create({
    name,
    email,
    password, // assume hashed in pre-save
    role: "student",

    department,
    year,
    rollNo,

    availability: DEFAULT_AVAILABILITY,
    isApproved: false, // admin approval required
  });

  return {
    _id: student._id,
    name: student.name,
    email: student.email,
    rollNo,
    availability: student.availability,
  };
};

/* ───────── Login (All roles) ───────── */

export const login = async (payload: { email: string; password: string }) => {
  const user = await User.findOne({
    email: payload.email,
    isDeleted: false,
  }).select("+password");

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invalid credentials");
  }

  if (user.role === "student" && !user.isApproved)
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "admin not approved");

  const isMatch = await user.comparePassword(payload.password);
  if (!isMatch) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid credentials");
  }
  const jwtPayload: IJWTPayload = {
    id: user._id.toString(),
    role: user.role,
  };

  const token = signToken(jwtPayload);

  return { user, token };
};
// me
export const getMeService = async (userId: string) => {
  const user = await User.findById({ _id: userId }).select("-password -__v");

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  return user;
};
