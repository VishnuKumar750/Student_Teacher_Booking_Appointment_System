import { Document, Types } from "mongoose";

export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

export interface IAvailability {
  _id: Types.ObjectId;
  day: WeekDay;
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  isBooked: boolean;
}

export interface ITeacher extends Document {
  userId: Types.ObjectId;
  department: Types.ObjectId;
  subjects: string[];
  profileImage: string;
  availability: IAvailability[];
  createdAt: Date;
  updatedAt: Date;
}
