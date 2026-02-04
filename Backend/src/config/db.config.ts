import mongoose from "mongoose";
import { config } from "./app.config";

let isConnected: Boolean = false;

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
