import { Document, Types } from "mongoose";

export type UserRole = "admin" | "teacher" | "student";

export type availability = {
  startTime: string;
  endTime: string;
};

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  rollNo: string;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  department?: string;
  subject?: string;
  profileImage?: string;
  availability?: availability;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
