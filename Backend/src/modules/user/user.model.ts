import { Schema, model, Types } from "mongoose";
import { USER_ROLES, USER_STATUS } from "@/types/user.types";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, lowercase: true },
    password: { type: String, required: true, select: false },
    roles: { type: String, enum: USER_ROLES, required: true, index: true },
    rollNo: { type: String },
    teacherId: { type: String },
    course: { type: String },
    department: { type: String },
    subject: { type: String },
    year: { type: String },
    isApproved: { type: Boolean, default: false },
    status: { type: String, enum: USER_STATUS, default: "ACTIVE" },
  },
  { timestamps: true },
);

// global unique email for super admin
UserSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { tenantId: null } },
);
UserSchema.index({
  name: 1,
  rollNo: 1,
  course: 1,
  department: 1,
  year: 1,
  subject: 1,
});

// password hash
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;

  next();
});

// compare password
UserSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const UserModel = model("User", UserSchema);
