import { Document, Types } from "mongoose";

export type UserRole = "admin" | "teacher" | "student";

export type availability = {
  start: string;
  end: string;
};

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  rollNo: string;
  isApproved: boolean;
  year: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  department?: string;
  subject?: string;
  profileImage?: string;
  availability?: availability;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
