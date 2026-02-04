import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

messageSchema.index({ appointmentId: 1, createdAt: -1 });
messageSchema.index({ readBy: 1 });

export const Message = model("Message", messageSchema);
