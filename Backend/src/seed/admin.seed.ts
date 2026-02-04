import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { User } from "@/model/user.model";
import { config } from "@/config/app.config";
const MONGO_URI = config.MONGO_URI;

const seedAdmin = async () => {
  await mongoose.connect(MONGO_URI);

  const adminEmail = "admin@mentormeet.com";

  const exists = await User.findOne({ email: adminEmail });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }

  await User.create({
    name: "Super Admin",
    email: adminEmail,
    password: "admin@123",
    role: "admin",
  });

  console.log("Admin seeded successfully");
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
