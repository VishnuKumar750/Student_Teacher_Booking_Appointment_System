import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "@/types/user.types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
    },

    rollNo: {
      type: String,
      unique: true,
    },
    department: {
      type: String,
    },
    subject: {
      type: String,
    },
    year: {
      type: Number,
    },
    profileImage: {
      type: String,
      default: "",
    },

    availability: {
      start: String,
      end: String,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// ───────────────────── Indexes ─────────────────────

// ───────────────────── Password Hashing ─────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ───────────────────── Compare Password ─────────────────────
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>("User", userSchema);
