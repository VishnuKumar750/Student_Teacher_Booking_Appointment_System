import mongoose from "mongoose";
import { config } from "./app.config";
import { User } from "@/modules/user/user.model";

let isConnected: Boolean = false;

// super admin
const createSuperAdmin = async (): Promise<void> => {
  try {
    const existingAdmin = await User.findOne({
      email: config.SUPERADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("super admin existing already");
      return;
    }

    const superAdmin = new User({
      name: "super admin",
      email: config.SUPERADMIN_EMAIL,
      password: config.SUPERADMIN_PASSWORD,
      role: "admin",
      isApproved: true,
    });

    await superAdmin.save();

    console.log("superadmin is created");
  } catch (err) {
    console.log("super admin creation error", err);
  }
};

export const connectDB = async (): Promise<void> => {
  // resolve the problem of mongodb connection when it already connected
  if (mongoose.connection.readyState === 1) return;

  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(config.MONGO_URI, {
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("mongoDB connected");

    await createSuperAdmin();

    mongoose.connection.on("disconeected", () => {
      console.warn("mongodb disconnected");
    });

    mongoose.connection.on("error", (err) => {
      console.warn("mongodb error", err);
    });
  } catch (err) {
    console.error("mongodb connection failed", err);
    throw err;
  }
};

export const disconnectedDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connection.close();
    console.log("mongodb disconnected");
  }
};
