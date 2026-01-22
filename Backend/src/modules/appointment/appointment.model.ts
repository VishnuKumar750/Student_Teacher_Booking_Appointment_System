import { Schema, model, Types } from "mongoose";

const AppointmentSchema = new Schema(
  {
    studentId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    teacherId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    slot: {
      type: String, // "10:00-10:30"
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
  },
  { timestamps: true },
);

/**
 * Prevents slot collision
 */
AppointmentSchema.index({ teacherId: 1, date: 1, slot: 1 }, { unique: true });

export const AppointmentModel = model("Appointment", AppointmentSchema);
