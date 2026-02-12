import { Schema, model, Types } from "mongoose";

const messageSchema = new Schema(
  {
    senderRole: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
    },

    senderId: {
      type: Types.ObjectId,
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const appointmentSchema = new Schema(
  {
    // participants
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

    // who initiated appointment
    createdBy: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
    },

    // time slot snapshot
    slot: {
      date: {
        type: Date,
        required: true,
      },
      start: {
        type: String,
        required: true, // "10:00"
      },
      end: {
        type: String,
        required: true, // "12:00"
      },
    },

    purpose: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    // approval metadata
    approvedAt: Date,
    approvedBy: {
      type: Types.ObjectId,
      ref: "User",
    },

    // cancellation metadata
    cancelledAt: Date,
    cancelledBy: {
      type: String,
      enum: ["teacher"],
    },

    cancellationReason: {
      type: String,
      trim: true,
    },

    // appointment chat
    messages: [messageSchema],
  },
  { timestamps: true },
);

/**
 * Prevent double booking for same teacher & slot
 * Only blocks pending & approved appointments
 */
appointmentSchema.index(
  {
    teacherId: 1,
    "slot.date": 1,
    "slot.start": 1,
    "slot.end": 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "approved"] },
    },
  },
);

// fast dashboards
appointmentSchema.index({ studentId: 1, status: 1 });
appointmentSchema.index({ teacherId: 1, status: 1 });

export const Appointment = model("Appointment", appointmentSchema);
